import _ from "lodash";
import moment from "moment";
import { Meteor } from "meteor/meteor";
import opensearch from "@opensearch-project/opensearch";
import BPromise from "bluebird";
import request from "request";

const esClient = new opensearch.Client({
  //log: "trace",
  node: (Meteor.settings.opensearch && Meteor.settings.opensearch.node) || "",
  keepAlive: false,
  apiVersion: "6.8",
  requestTimeout: 60 * 60 * 1000, // 1 hour
});

const matchZeros = /00000+\d+?$/;
const matchNines = /([0-8])99999+\d+?$/;
const floatFix = (x) =>
  `${x}`
    .replace(matchZeros, "")
    .replace(matchNines, (y) => parseInt(`${y}`.substr(0, 1)) + 1);
const normalizeLon = (x) =>
  x < -180 ? normalizeLon(x + 360) : x > 180 ? normalizeLon(x - 360) : x;
const htmlEncode = (x) =>
  x && x.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

let index = "karar";

describe("karar.data_doi", () => {
  it("should update data dois", function (done) {
    setTimeout(() => {
      this.timeout(0);

      esClient
        .search({
          index: index,
          size: 1e4,
          _source: [
            "summary.contribution",
            "summary._all.geologic_classes",
            "summary._all.geologic_types",
            "summary._all.lithologies",
            "summary._all._age_range_ybp",
            "contribution.locations.location",
            "contribution.locations.lat_n",
            "contribution.locations.lat_s",
            "contribution.locations.lon_w",
            "contribution.locations.lon_e",
            "contribution.sites.location",
            "contribution.sites.site",
            "contribution.sites.lat",
            "contribution.sites.lon",
          ],
          body: {
            query: {
              bool: {
                must: [
                  { term: { type: "contribution" } },
                  {
                    exists: {
                      field: "summary.contribution._reference.long_authors",
                    },
                  },
                  {
                    exists: { field: "summary.contribution._reference.title" },
                  },
                  { exists: { field: "summary.contribution._reference.year" } },
                  { exists: { field: "summary.contribution.version" } },
                  { term: { "summary.contribution._is_activated": "true" } },
                ],
                must_not: [
                  { term: { "summary.contribution._has_data_doi": "true" } },
                ],
                // or, to force specific ones:
                // filter: { terms: { "summary.contribution.id": [24, 25] } },
              },
            },
          },
        })
        .then((resp) => {
          console.log(
            "Contributions without a data DOI:",
            resp.body.hits.total,
          );
          if (resp.body.hits.total.value === 0) {
            console.log("No DOIs to be minted. Exiting.");
            done();
          } else {
            BPromise.each(
              resp.body.hits.hits,
              (hit) => {
                return new Promise(async (resolve) => {
                  let previous_version_doi;
                  if (
                    hit._source.summary.contribution._history &&
                    hit._source.summary.contribution._history.length > 1
                  )
                    previous_version_doi = `10.7288/V4/KARAR/${hit._source.summary.contribution._history[1].id}`;
                  let latest_version_doi;
                  if (hit._source.summary.contribution._is_latest != "true") {
                    let latest_version_id;
                    try {
                      const latest_version_resp = await esClient.search({
                        index: index,
                        size: 1,
                        _source: ["summary.contribution.id"],
                        body: {
                          query: {
                            bool: {
                              must: [
                                { term: { type: "contribution" } },
                                {
                                  exists: {
                                    field: "summary.contribution.version",
                                  },
                                },
                                {
                                  term: {
                                    "summary.contribution._is_activated":
                                      "true",
                                  },
                                },
                                {
                                  term: {
                                    "summary.contribution._is_latest": "true",
                                  },
                                },
                              ],
                              filter: {
                                term: {
                                  "summary.contribution._history.id":
                                    hit._source.summary.contribution.id,
                                },
                              },
                            },
                          },
                        },
                      });
                      if (latest_version_resp.body.hits.hits.length > 0)
                        latest_version_id =
                          latest_version_resp.body.hits.hits[0]._source.summary
                            .contribution.id;
                    } catch (error) {
                      console.error("Error fetching latest version ID:", error);
                      return resolve();
                    }
                    latest_version_doi = `10.7288/V4/KARAR/${latest_version_id}`;
                  }

                  let related =
                    (hit._source.summary.contribution._reference &&
                      hit._source.summary.contribution._reference.doi &&
                      `<relatedIdentifiers>` +
                        `<relatedIdentifier relatedIdentifierType="DOI" relationType="IsCitedBy">` +
                        `${htmlEncode(
                          hit._source.summary.contribution._reference.doi,
                        )}` +
                        `</relatedIdentifier>` +
                        (previous_version_doi
                          ? `<relatedIdentifier relatedIdentifierType="DOI" relationType="IsNewVersionOf">${previous_version_doi}</relatedIdentifier>`
                          : "") +
                        (latest_version_doi
                          ? `<relatedIdentifier relatedIdentifierType="DOI" relationType="IsPreviousVersionOf">${latest_version_doi}</relatedIdentifier>`
                          : "") +
                        `</relatedIdentifiers>`) ||
                    "";

                  let subjects = [];
                  hit._source.summary._all &&
                    hit._source.summary._all.geologic_classes &&
                    hit._source.summary._all.geologic_classes.forEach(
                      (geologic_class) => {
                        subjects.push(
                          `<subject 
                            subjectScheme="earthref.karar.geologic_classes"
                            schemeURI="https://earthref.org/KArAr/data-models/1.0?q=geologic_classes"
                            valueURI="https://earthref.org/vocabularies/controlled?q=${geologic_class}"
                          >${geologic_class}</subject>`,
                        );
                      },
                    );
                  hit._source.summary._all &&
                    hit._source.summary._all.geologic_types &&
                    hit._source.summary._all.geologic_types.forEach(
                      (geologic_type) => {
                        subjects.push(
                          `<subject
                            subjectScheme="earthref.karar.geologic_types"
                            schemeURI="https://earthref.org/KArAr/data-models/1.0?q=geologic_types"
                            valueURI="https://earthref.org/vocabularies/controlled?q=${geologic_type}"
                          >${geologic_type}</subject>`,
                        );
                      },
                    );
                  hit._source.summary._all &&
                    hit._source.summary._all.lithologies &&
                    hit._source.summary._all.lithologies.forEach(
                      (lithology) => {
                        subjects.push(
                          `<subject
                            subjectScheme="earthref.karar.lithologies"
                            schemeURI="https://earthref.org/KArAr/data-models/1.0?q=lithologies"
                            valueURI="https://earthref.org/vocabularies/controlled?q=${lithology}"
                          >${lithology}</subject>`,
                        );
                      },
                    );
                  hit._source.summary._all &&
                    hit._source.summary._all._age_range_ybp &&
                    hit._source.summary._all._age_range_ybp.range &&
                    hit._source.summary._all._age_range_ybp.range.gte !==
                      undefined &&
                    subjects.push(
                      `<subject
                        schemeURI="https://earthref.org/KArAr/data-models/1.0?q=age_low"
                        subjectScheme="earthref.karar.age_low"
                      >${hit._source.summary._all._age_range_ybp.range.gte}</subject>`,
                    );
                  hit._source.summary._all &&
                    hit._source.summary._all._age_range_ybp &&
                    hit._source.summary._all._age_range_ybp.range &&
                    hit._source.summary._all._age_range_ybp.range.lte !==
                      undefined &&
                    subjects.push(
                      `<subject
                        schemeURI="https://earthref.org/KArAr/data-models/1.0?q=age_high"
                        subjectScheme="earthref.karar.age_high"
                      >${hit._source.summary._all._age_range_ybp.range.lte}</subject>`,
                    );
                  hit._source.summary._all &&
                    hit._source.summary._all._age_range_ybp &&
                    hit._source.summary._all._age_range_ybp.range &&
                    (hit._source.summary._all._age_range_ybp.range.lte !==
                      undefined ||
                      hit._source.summary._all._age_range_ybp.range.gte !==
                        undefined) &&
                    subjects.push(
                      `<subject 
                        subjectScheme="earthref.karar.age_unit"
                        schemeURI="https://earthref.org/KArAr/data-models/1.0?q=age_unit"
                        valueURI="https://earthref.org/vocabularies/controlled?q=Years BP"
                      >Years BP</subject>`,
                    );
                  subjects =
                    (subjects.length &&
                      `<subjects>${subjects.join("")}</subjects>`) ||
                    "";

                  let geos = [];
                  hit._source.contribution &&
                    hit._source.contribution.locations &&
                    _.sortedUniqBy(
                      _.sortBy(
                        hit._source.contribution.locations,
                        (x) => `${x.lat_n}_${x.lat_s}_${x.lon_w}_${x.lon_e}`,
                      ),
                      (x) => `${x.lat_n}_${x.lat_s}_${x.lon_w}_${x.lon_e}`,
                    ).forEach((location, i) => {
                      let n = geos.push("") - 1;
                      geos[n] += "<geoLocation>";
                      if (location.location)
                        geos[n] +=
                          `<geoLocationPlace>${location.location}</geoLocationPlace>`;
                      if (
                        location.lat_n !== undefined &&
                        location.lon_w !== undefined &&
                        location.lat_n !== "" &&
                        location.lon_w !== "" &&
                        location.lat_n === location.lat_s &&
                        location.lon_w === location.lon_e
                      ) {
                        geos[n] += `<geoLocationPoint>
                          <pointLongitude>${floatFix(
                            normalizeLon(location.lon_w),
                          )}</pointLongitude>
                          <pointLatitude>${floatFix(
                            location.lat_n,
                          )}</pointLatitude>
                        </geoLocationPoint>`;
                      } else if (
                        location.lat_n !== undefined &&
                        location.lat_s !== undefined &&
                        location.lon_w !== undefined &&
                        location.lon_e !== undefined &&
                        location.lat_n !== "" &&
                        location.lat_s !== "" &&
                        location.lon_w !== "" &&
                        location.lon_e !== ""
                      ) {
                        geos[n] += `<geoLocationBox>
                          <westBoundLongitude>${floatFix(
                            normalizeLon(location.lon_w),
                          )}</westBoundLongitude>
                          <eastBoundLongitude>${floatFix(
                            normalizeLon(location.lon_e),
                          )}</eastBoundLongitude>
                          <southBoundLatitude>${floatFix(
                            location.lat_s,
                          )}</southBoundLatitude>
                          <northBoundLatitude>${floatFix(
                            location.lat_n,
                          )}</northBoundLatitude>
                        </geoLocationBox>`;
                      }
                      if (geos[n] !== "<geoLocation>")
                        geos[n] += "</geoLocation>";
                      else geos.pop();
                    });
                  hit._source.contribution &&
                    hit._source.contribution.sites &&
                    _.sortedUniqBy(
                      _.sortBy(
                        hit._source.contribution.sites,
                        (x) => `${x.lat}_${x.lon}_${x.location}_${x.site}`,
                      ),
                      (x) => `${x.lat}_${x.lon}_${x.location}_${x.site}`,
                    ).forEach((site, i) => {
                      let n = geos.push("") - 1;
                      geos[n] += "<geoLocation>";
                      if (site.location && site.site)
                        geos[n] +=
                          `<geoLocationPlace>${site.location}: ${site.site}</geoLocationPlace>`;
                      if (
                        site.lat !== undefined &&
                        site.lon !== undefined &&
                        site.lat !== "" &&
                        site.lon !== ""
                      )
                        geos[n] += `<geoLocationPoint>
                          <pointLongitude>${floatFix(
                            normalizeLon(site.lon),
                          )}</pointLongitude>
                          <pointLatitude>${floatFix(site.lat)}</pointLatitude>
                        </geoLocationPoint>`;
                      if (geos[n] !== "<geoLocation>")
                        geos[n] += "</geoLocation>";
                      else geos.pop();
                    });
                  geos =
                    (geos.length &&
                      `<geoLocations>${geos.join("")}</geoLocations>`) ||
                    "";

                  let labNames = [];
                  if (_.isArray(hit._source.summary.contribution.lab_names))
                    labNames = hit._source.summary.contribution.lab_names;
                  if (_.isString(hit._source.summary.contribution.lab_names))
                    labNames =
                      hit._source.summary.contribution.lab_names.split(":");
                  let contributors = labNames.map(
                    (labName) =>
                      `<contributor contributorType="HostingInstitution">
                      <contributorName>${htmlEncode(labName)}</contributorName>
                    </contributor>`,
                  );
                  if (hit._source.summary.contribution.id == 16834)
                    contributors.push(
                      '<contributor contributorType="ContactPerson"><contributorName>Joseph M Grappone (jmgrappone@gmail.com)</contributorName></contributor>',
                    );
                  contributors =
                    contributors.length &&
                    `<contributors>${contributors.join("")}</contributors>`;

                  let fundings = [];
                  if (_.isArray(hit._source.summary.contribution.funding))
                    fundings = hit._source.summary.contribution.funding;
                  if (_.isString(hit._source.summary.contribution.funding)) {
                    let funding = hit._source.summary.contribution.funding;
                    if (funding.includes(";")) {
                      // older records: entries separated by semicolons
                      fundings = funding.split(";");
                    } else {
                      // data model format: colon-separated, ignoring colons in quotes or [urls]
                      let entry = "", inQuotes = false, depth = 0;
                      for (let c of funding) {
                        if (c === '"') inQuotes = !inQuotes;
                        else if (c === "[" && !inQuotes) depth++;
                        else if (c === "]" && !inQuotes && depth > 0) depth--;
                        if (c === ":" && !inQuotes && depth === 0) {
                          fundings.push(entry);
                          entry = "";
                        } else entry += c;
                      }
                      fundings.push(entry);
                    }
                  }
                  fundings = _.compact(
                    fundings.map((x) => _.trim(_.trim(`${x}`), '"').trim()),
                  );
                  fundings = fundings.map((funding) => {
                    let funderName = htmlEncode(_.trim(funding.split("[")[0]));
                    let awardURI =
                      funding.includes("[") &&
                      htmlEncode(
                        _.trim(funding.slice(funding.indexOf("[") + 1).replace(/\]\s*$/, "")),
                      );
                    return (
                      ((funderName || awardURI) &&
                        `<fundingReference>
                        <funderName>${funderName || awardURI}</funderName>` +
                          ((awardURI &&
                            `<awardNumber awardURI="${awardURI}"></awardNumber>`) ||
                            "") +
                          `</fundingReference>`) ||
                      ""
                    );
                  });
                  fundings = fundings.join("");
                  if (fundings)
                    fundings = `<fundingReferences>${fundings}</fundingReferences>`;

                  let creators = [];
                  hit._source.summary.contribution._reference &&
                    hit._source.summary.contribution._reference.authors &&
                    hit._source.summary.contribution._reference.authors.forEach(
                      (author) => {
                        if (author.given || author.family)
                          creators.push(
                            `<creator>
                              <creatorName>` +
                              `${author.given}${
                                author.given && author.family && " "
                              }${author.family}` +
                              `</creatorName>
                              ${
                                (author._orcid &&
                                  `<nameIdentifier schemeURI="https://orcid.org" nameIdentifierScheme="ORCID">` +
                                    `${author._orcid}` +
                                    `</nameIdentifier>`) ||
                                ""
                              }
                              ${
                                (author.affiliation &&
                                  author.affiliation
                                    .map(
                                      (affiliation) =>
                                        `<affiliation>${affiliation}</affiliation>`,
                                    )
                                    .join("")) ||
                                ""
                              }
                            </creator>`,
                          );
                      },
                    );
                  creators =
                    (creators.length &&
                      `<creators>${creators.join("")}</creators>`) ||
                    (hit._source.summary.contribution._reference &&
                      hit._source.summary.contribution._reference
                        .long_authors &&
                      `<creators><creator><creatorName>` +
                        `${hit._source.summary.contribution._reference.long_authors}` +
                        `</creatorName></creator></creators>`) ||
                    `<creators><creator><creatorName>` +
                      `${hit._source.summary._contributor}` +
                      `</creatorName></creator></creators>`;

                  let datacite = `<?xml version="1.0"?>
                <resource 
                  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                  xmlns="http://datacite.org/schema/kernel-4"
                  xsi:schemaLocation="http://datacite.org/schema/kernel-4 http://schema.datacite.org/meta/kernel-4.3/metadata.xsd"
                >
                  <identifier identifierType="DOI">10.7288/V4/KARAR/${
                    hit._source.summary.contribution.id
                  }</identifier>
                  ${creators}
                  <titles>
                    <title>${
                      (hit._source.summary.contribution._reference &&
                        htmlEncode(
                          hit._source.summary.contribution._reference.title,
                        )) ||
                      "In Preparation"
                    } (Dataset)</title>
                  </titles>
                  <publisher publisherIdentifier="https://ror.org/00f89wy98" publisherIdentifierScheme="ROR" schemeURI="https://ror.org/">Earthref.org (KArAr)</publisher>
                  <publicationYear>${
                    (hit._source.summary.contribution.timestamp &&
                      moment
                        .utc(hit._source.summary.contribution.timestamp)
                        .local()
                        .format("YYYY")) ||
                    new Date().getFullYear()
                  }</publicationYear>
                  ${subjects || ""}
                  ${contributors || ""}
                  <dates>
                    <date dateType="Available">${hit._source.summary.contribution.timestamp.substr(
                      0,
                      10,
                    )}</date>
                  </dates>
                  <language>en-US</language>
                  <resourceType resourceTypeGeneral="Dataset"/>
                  ${related || ""}
                  <version>${hit._source.summary.contribution.version}</version>
                  <rightsList>
                    <rights rightsURI="https://creativecommons.org/licenses/by/4.0/"/>
                  </rightsList>
                  <descriptions>
                    <description descriptionType="Other">K/AR or 40Ar/39Ar rock dating data found in the KArAr data repository${
                      hit._source.summary.contribution._reference.title
                        ? ` from a paper titled: ${htmlEncode(
                            hit._source.summary.contribution._reference.title,
                          )}`
                        : "."
                    }</description>
                  </descriptions>
                  ${geos || ""}
                  ${fundings || ""}
                </resource>`;
                  // console.log("datacite", datacite);
                  datacite = datacite
                    .replace(/%/g, "%25")
                    .replace(/\s*\n\s*/g, "%0A")
                    .replace(/\r/g, "%0D")
                    .replace(/:/g, "%3A")
                    .replace(/\s&\s/g, " and ");
                  let payload =
                    `_profile: datacite\n` +
                    `_status: public\n` +
                    `_target: https://earthref.org/KArAr/${hit._source.summary.contribution.id}\n` +
                    `datacite: ${datacite}`;

                  // console.log("datacite", datacite);
                  // return done();
                  request(
                    {
                      method: "PUT",
                      uri:
                        "https://ezid.cdlib.org/id/doi:10.7288/V4/KARAR/" +
                        hit._source.summary.contribution.id +
                        "?update_if_exists=yes",
                      auth: Meteor.settings.ezid,
                      headers: { "content-type": "text/plain; charset=UTF-8" },
                      body: payload,
                    },
                    function (error, response, body) {
                      const id = hit._source.summary.contribution.id;
                      if (error) {
                        console.error(hit._id, "request error:", error);
                        return resolve();
                      }
                      console.log(
                        hit._id,
                        "EZID",
                        response.statusCode,
                        JSON.stringify(body).slice(0, 300),
                      );
                      if (
                        response.statusCode >= 200 &&
                        response.statusCode < 300 &&
                        /^success: /.test(body)
                      ) {
                        esClient
                          .update({
                            index: hit._index,
                            id: hit._id,
                            refresh: true,
                            body: {
                              doc: {
                                summary: {
                                  contribution: { _has_data_doi: "true" },
                                },
                              },
                            },
                          })
                          .then(() => {
                            console.log(
                              hit._id,
                              `minted/updated https://doi.org/10.7288/V4/KARAR/${id}`,
                            );
                            resolve();
                          })
                          .catch((e) => {
                            console.error(
                              hit._id,
                              "OpenSearch update failed:",
                              e.message,
                            );
                            resolve();
                          });
                      } else {
                        console.error(hit._id, "NOT minted");
                        resolve();
                      }
                    },
                  );
                });
              },
              { concurrency: 5 },
            ).then((results) => {
              done();
            });
          }
        });
    }, 0);
  });
});
