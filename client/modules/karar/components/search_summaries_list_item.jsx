import _ from "lodash";
import numeral from "numeral";
import moment from "moment";
import React from "react";
import PropTypes from "prop-types";
import saveAs from "save-as";
import { HotTable, HotColumn } from "@handsontable/react";
import "handsontable/dist/handsontable.min.css";

import Clamp from "/client/modules/common/components/clamp";
import ExportContribution from "/lib/modules/karar/export_contribution.js";
import GoogleStaticMap from "/client/modules/common/components/google_static_map";
import GoogleMap from "/client/modules/common/components/google_map";
import Count from "/client/modules/common/components/count";
import { Button, Modal } from "semantic-ui-react";
import { versions, models } from "/lib/configs/karar/data_models.js";
import { index } from "/lib/configs/karar/search_levels.js";
import PlateauCalculations from "/lib/modules/karar/plateau_calculations.js";

class SearchSummariesListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      loadMap: false,
      showDataModal: false,
      showConfirmCloseEditedDataModal: false,
      showConfirmChangeTabsEditedDataModal: false,
      confirmChangeTabsDataLevel: undefined,
      dataLoading: false,
      dataEdited: false,
      plateauData: {},
      plateauLoading: {},
      loadingRequests: new Set(),
      plateauModalData: null,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      dataSaving: false,
      dataLevel: undefined,
      contributionData: undefined,
      contributionDataError: undefined,
    };
    this.styles = {
      a: { cursor: "pointer", color: "#3030bb" },
    };
  }

  componentDidMount() {
    $(this.refs["accordion"]).accordion({
      exclusive: false,
      selector: { trigger: ".accordion-trigger" },
    });
    
    // Add resize listener for responsive plateau plots
    this.resizeTimeout = null;
    this.handleResize = () => {
      // Throttle resize events to prevent excessive re-renders
      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
      }
      this.resizeTimeout = setTimeout(() => {
        this.setState({
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight
        });
      }, 100); // 100ms throttle
    };
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    // Clean up resize listener
    if (this.handleResize) {
      window.removeEventListener('resize', this.handleResize);
    }
  }

  showData() {
    /*$(this.refs['data modal']).modal('show');
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();*/
  }

  showMap(e) {
    this.setState({ loadMap: true }, () =>
      $(this.refs["map modal"]).modal("show")
    );
  }

  renderTitle(item) {
    let title = "";
    if (
      this.props.table === "contribution" &&
      item.summary &&
      item.summary.contribution &&
      item.summary.contribution._reference
    ) {
      title = item.summary.contribution._reference.title;
    }
    if (this.props.table === "samples" && item.summary && item.summary._all) {
      if (item.summary._all.site) title += " ⇒ " + item.summary._all.site[0];
      if (item.summary._all.sample)
        title += " ⇒ <b>" + item.summary._all.sample[0] + "</b>";
    }
    if (this.props.table === "specimens" && item.summary && item.summary._all) {
      if (item.summary._all.site) title += " ⇒ " + item.summary._all.site[0];
      if (item.summary._all.sample)
        title += " ⇒ " + item.summary._all.sample[0];
      if (item.summary._all.specimen)
        title += " ⇒ <b>" + item.summary._all.specimen[0] + "</b>";
    }
    if (
      this.props.table === "experiments" &&
      item.summary &&
      item.summary._all
    ) {
      if (item.summary._all.site) title += " ⇒ " + item.summary._all.site[0];
      if (item.summary._all.sample)
        title += " ⇒ " + item.summary._all.sample[0];
      if (item.summary._all.specimen)
        title += " ⇒ " + item.summary._all.specimen[0];
      if (item.summary._all.experiment)
        title += " ⇒ <b>" + item.summary._all.experiment[0] + "</b>";
    }
    if (
      this.props.table === "measurements" &&
      item.summary &&
      item.summary._all
    ) {
      if (item.summary._all.site) title += " ⇒ " + item.summary._all.site[0];
      if (item.summary._all.sample)
        title += " ⇒ " + item.summary._all.sample[0];
      if (item.summary._all.specimen)
        title += " ⇒ " + item.summary._all.specimen[0];
      if (item.summary._all.experiment)
        title += " ⇒ " + item.summary._all.experiment[0];
      if (item.summary._all.measurement)
        title += " ⇒ <b>" + item.summary._all.measurement[0] + "</b>";
    }
    return (
      <div
        style={{
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
        }}
        dangerouslySetInnerHTML={{ __html: title }}
      />
    );
  }

  renderDownloadButton(item) {
    if (this.props.table !== "contribution") return undefined;
    let id =
      item.summary && item.summary.contribution && item.summary.contribution.id;
    let _is_activated =
      item.summary &&
      item.summary.contribution &&
      item.summary.contribution._is_activated === "true";
    return (
      <div
        style={{
          minWidth: 100,
          maxWidth: 100,
          marginRight: "1em",
          marginBottom: 5,
        }}
      >
        {id && (
          <button
            type="submit"
            className="ui basic tiny fluid compact icon header blue button"
            style={{ padding: "20px 0", height: "100px" }}
            onClick={function (id, e) {
              document.getElementById("downloadButton" + id).className =
                "ui spinner loading icon";
              Meteor.call(
                "esGetContribution",
                { index, id },
                function (id, error, c) {
                  // console.log("esGetContribution", index, id, error, c);
                  if (!error && c) {
                    const exporter = new ExportContribution({});
                    // console.log("esGetContribution", index, id, c, exporter.toText(c));
                    let blob = new Blob([exporter.toText(c)], {
                      type: "text/plain;charset=utf-8",
                    });
                    saveAs(blob, "karar_contribution_" + id + ".txt");
                    document.getElementById("downloadButton" + id).className =
                      "ui file text outline icon";
                  } else {
                    console.error(error);
                    alert(
                      "Failed to find the contribution for download. Please try again soon or email KArAr using the link at the bottom of this page."
                    );
                    document.getElementById("downloadButton" + id).className =
                      "ui file text outline icon";
                  }
                }.bind(this, id)
              );
            }.bind(this, id)}
          >
            <i
              id={"downloadButton" + id}
              className="ui file text outline icon"
            />{" "}
            Download
          </button>
        )}
        {!id && (
          <button
            className="ui basic tiny fluid compact icon header blue disabled button"
            style={{ padding: "20px 0", height: "100px" }}
          >
            <i className="ui file text outline icon" /> Download
          </button>
        )}
      </div>
    );
  }

  renderLinks(item) {
    if (this.props.table !== "contribution") return undefined;
    let _is_activated =
      item.summary &&
      item.summary.contribution &&
      item.summary.contribution._is_activated === "true";
    let _has_data_doi =
      item.summary &&
      item.summary.contribution &&
      item.summary.contribution._has_data_doi === "true";
    let id =
      item.summary && item.summary.contribution && item.summary.contribution.id;
    let doi =
      item.summary &&
      item.summary.contribution &&
      item.summary.contribution._reference &&
      item.summary.contribution._reference.doi;
    return (
      <div
        style={{
          minWidth: 200,
          maxWidth: 200,
          marginRight: "1em",
          marginBottom: 5,
          fontSize: "small",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {id && (
          <span>
            <b>
              {_is_activated
                ? "KArAr Contribution Link:"
                : "Future Contribution Link:"}
            </b>
            <p>
              {_is_activated ? (
                <a
                  style={this.styles.a}
                  href={"https://karar.earthref.org/KArAr/" + id}
                  target="_blank"
                >
                  {"karar.earthref.org/KArAr/" + id}
                </a>
              ) : (
                <span>{"karar.earthref.org/KArAr/" + id}</span>
              )}
            </p>
          </span>
        )}
        {id && (
          <span>
            <b>{_is_activated ? "EarthRef Data DOI:" : "Future Data DOI:"}</b>
            <p>
              {_is_activated ? (
                _has_data_doi ? (
                  <a
                    style={this.styles.a}
                    href={"http://dx.doi.org/10.7288/V4/KArAr/" + id}
                    target="_blank"
                  >
                    {"10.7288/V4/KArAr/" + id}
                  </a>
                ) : (
                  <span>Queued For Creation</span>
                )
              ) : (
                <span>{"10.7288/V4/KArAr/" + id}</span>
              )}
            </p>
          </span>
        )}
        {doi && (
          <span>
            <b>Publication DOI: </b>
            <Clamp lines={1}>
              <a
                style={this.styles.a}
                href={"https://dx.doi.org/" + doi}
                target="_blank"
              >
                {doi}
              </a>
            </Clamp>
          </span>
        )}
      </div>
    );
  }

  renderCounts(item) {
    let counts = [];
    let labels = [];
    let levels = [];
    ["Site", "Sample", "Specimen", "Experiment", "Measurement"].forEach(
      (label) => {
        let level = label.toLowerCase() + "s";
        let name = label.toLowerCase();
        if (
          item.summary &&
          item.summary._all &&
          item.summary._all["_n_" + level]
        ) {
          let count = item.summary._all["_n_" + level];
          counts.push(count);
          labels.push(label + (count !== 1 ? "s" : ""));
          levels.push(level);
        } else if (
          item.summary &&
          item.summary._all &&
          item.summary._all[name] &&
          item.summary._all[name].length
        ) {
          let count = item.summary._all[name].length;
          counts.push(count);
          labels.push(label + (count !== 1 ? "s" : ""));
          levels.push(level);
        }
      }
    );
    return (
      <div
        style={{
          minWidth: 135,
          maxWidth: 135,
          marginRight: "1em",
          marginBottom: 5,
          fontSize: "small",
          lineHeight: 1,
        }}
      >
        <table>
          <tbody>
            {counts.map((count, i) => {
              return (
                <tr key={i}>
                  <td style={{ textAlign: "right" }}>
                    {this.props.table === "contribution" ? (
                      <a
                        onClick={() => {
                          this.setState({
                            dataLevel: levels[i],
                            showDataModal: true,
                          });
                        }}
                      >
                        {numeral(count).format("0 a")}
                      </a>
                    ) : (
                      numeral(count).format("0 a")
                    )}
                  </td>
                  <td>
                    {this.props.table === "contribution" ? (
                      <a
                        onClick={() => {
                          this.setState({
                            dataLevel: levels[i],
                            showDataModal: true,
                          });
                        }}
                      >
                        &nbsp;{labels[i]}
                      </a>
                    ) : (
                      <span>&nbsp;{labels[i]}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  renderQueuedForIndex(item) {
    return (
      <div
        style={{
          minWidth: 200,
          maxWidth: 200,
          marginRight: "1em",
          marginBottom: 5,
          fontSize: "small",
          color: "#AAAAAA",
          textAlign: "left",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <br />
        <b>Queued for Indexing</b>
        <br />
        Data are available for
        <br />
        downloading and in
        <br />
        the "Rows" sub-tabs.
      </div>
    );
  }

  renderMapThumbnail(item) {
    let paths = [];

    let tableSummary = item.summary && item.summary[this.props.table];
    let allSummary = item.summary && item.summary._all;

    if (
      tableSummary &&
      (tableSummary._geo_envelope || tableSummary._geo_point)
    ) {
      //if (tableSummary._geo_envelope)
      //  _.sortedUniqBy(
      //    _.sortBy(tableSummary._geo_envelope,
      //      x => _.flatten(x.coordinates).join('_')),
      //    x => _.flatten(x.coordinates).join('_'))
      //  .forEach(envelope => {
      //    paths.push({
      //      lat_s: envelope.coordinates[0][1],
      //      lat_n: envelope.coordinates[1][1],
      //      lon_w: envelope.coordinates[0][0],
      //      lon_e: envelope.coordinates[1][0]
      //    });
      //  });

      if (tableSummary._geo_point)
        _.sortedUniqBy(
          _.sortBy(tableSummary._geo_point, (x) =>
            _.flatten(x.coordinates).join("_")
          ),
          (x) => _.flatten(x.coordinates).join("_")
        ).forEach((point) => {
          paths.push({
            lat_s: point.coordinates[1],
            lat_n: point.coordinates[1],
            lon_w: point.coordinates[0],
            lon_e: point.coordinates[0],
          });
        });
    } else if (allSummary) {
      if (allSummary._geo_envelope)
        _.sortedUniqBy(
          _.sortBy(allSummary._geo_envelope, (x) =>
            _.flatten(x.coordinates).join("_")
          ),
          (x) => _.flatten(x.coordinates).join("_")
        ).forEach((envelope) => {
          paths.push({
            lat_s: envelope.coordinates[0][1],
            lat_n: envelope.coordinates[1][1],
            lon_w: envelope.coordinates[0][0],
            lon_e: envelope.coordinates[1][0],
          });
        });

      if (allSummary._geo_point)
        _.sortedUniqBy(
          _.sortBy(allSummary._geo_point, (x) =>
            _.flatten(x.coordinates).join("_")
          ),
          (x) => _.flatten(x.coordinates).join("_")
        ).forEach((point) => {
          paths.push({
            lat_s: point.coordinates[1],
            lat_n: point.coordinates[1],
            lon_w: point.coordinates[0],
            lon_e: point.coordinates[0],
          });
        });
    }

    return paths.length > 0 ? (
      <div
        style={{
          minWidth: 100,
          maxWidth: 100,
          marginRight: "1em",
          marginBottom: 5,
        }}
      >
        {paths.length > 0 && (
          <a
            className="ui tiny image"
            style={{ cursor: "pointer" }}
            onClick={this.showMap.bind(this)}
          >
            <GoogleStaticMap width={100} height={100} paths={paths} />
          </a>
        )}
      </div>
    ) : (
      <div
        style={{
          minWidth: 100,
          maxWidth: 100,
          marginRight: "1em",
          marginBottom: 5,
          fontSize: "small",
          color: "#AAAAAA",
          textAlign: "center",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <br />
        No
        <br />
        <b>Geospatial</b>
        <br />
        Data
        <br />
        <br />
      </div>
    );
  }

  renderAge(item) {
    let tableSummary = item.summary && item.summary[this.props.table];
    let allSummary = item.summary && item.summary._all;

    if (
      !(tableSummary && tableSummary._age_range_ybp) &&
      !(allSummary && allSummary._age_range_ybp)
    )
      return (
        <div
          style={{
            minWidth: 120,
            maxWidth: 120,
            marginRight: "1em",
            marginBottom: 5,
            fontSize: "small",
            color: "#AAAAAA",
            textAlign: "center",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <br />
          No
          <br />
          <b>Age</b>
          <br />
          Data
          <br />
          <br />
        </div>
      );

    let min_ages =
        (tableSummary &&
          tableSummary._age_range_ybp &&
          tableSummary._age_range_ybp.range.gte) ||
        (allSummary._age_range_ybp && allSummary._age_range_ybp.range.gte),
      max_ages =
        (tableSummary &&
          tableSummary._age_range_ybp &&
          tableSummary._age_range_ybp.range.lte) ||
        (allSummary._age_range_ybp && allSummary._age_range_ybp.range.lte),
      n_ages =
        (tableSummary &&
          tableSummary._age_range_ybp &&
          tableSummary._age_range_ybp.n) ||
        (allSummary._age_range_ybp && allSummary._age_range_ybp.n),
      age_range;

    if (max_ages >= 1e9) {
      max_ages = numeral(max_ages / 1e9).format("0[.]0[00]");
      min_ages =
        min_ages < 1e5 ? "0" : numeral(min_ages / 1e9).format("0[.]0[00]");
      age_range =
        max_ages === min_ages
          ? `${max_ages} Ga`
          : `${min_ages} - ${max_ages} Ga`;
    } else if (max_ages >= 1e6) {
      max_ages = numeral(max_ages / 1e6).format("0[.]0[00]");
      min_ages =
        min_ages < 1e3 ? "0" : numeral(min_ages / 1e6).format("0[.]0[00]");
      age_range =
        max_ages === min_ages
          ? `${max_ages} Ma`
          : `${min_ages} - ${max_ages} Ma`;
    } else if (max_ages >= 1e3) {
      max_ages = numeral(max_ages / 1e3).format("0[.]0[00]");
      min_ages =
        min_ages < 1e1 ? "0" : numeral(min_ages / 1e3).format("0[.]0[00]");
      age_range =
        max_ages === min_ages
          ? `${max_ages} ka`
          : `${min_ages} - ${max_ages} ka`;
    } else {
      let max_ages_unit = max_ages >= 1949.5 ? "BC" : "AD";
      let min_ages_unit = min_ages >= 1949.5 ? "BC" : "AD";
      max_ages =
        max_ages >= 1949.5
          ? numeral(max_ages - 1949).format("0[.]0[00]")
          : numeral(1950 - max_ages).format("0[.]0[00]");
      min_ages =
        min_ages >= 1949.5
          ? numeral(min_ages - 1949).format("0[.]0[00]")
          : numeral(1950 - min_ages).format("0[.]0[00]");
      age_range =
        age_range ||
        (max_ages_unit === min_ages_unit &&
          max_ages === min_ages &&
          `${max_ages} ${max_ages_unit}`);
      age_range =
        age_range ||
        (max_ages_unit === min_ages_unit &&
          max_ages !== min_ages &&
          `${max_ages} - ${min_ages} ${max_ages_unit}`);
      age_range =
        age_range ||
        (max_ages_unit !== min_ages_unit &&
          `${max_ages} ${max_ages_unit} - ${min_ages} ${min_ages_unit}`);
    }

    return (
      <div
        style={{
          minWidth: 120,
          maxWidth: 120,
          marginRight: "1em",
          marginBottom: 5,
          fontSize: "small",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <b>Age:</b>
        <br />
        {age_range}
      </div>
    );
  }

  renderGeo(item) {
    let geologic = [
      "plate_blocks",
      "terranes",
      "geological_province_sections",
      "tectonic_settings",
    ];
    geologic = _.reduce(
      geologic,
      (list, column) => {
        if (item.summary && item.summary._all && item.summary._all[column])
          list.push(...item.summary._all[column]);
        return list;
      },
      []
    );
    let geographic = [
      "continent_ocean",
      "country",
      "ocean_sea",
      "region",
      "village_city",
      "location",
      "location_type",
      "location_alternatives",
    ];
    geographic = _.reduce(
      geographic,
      (list, column) => {
        if (item.summary && item.summary._all && item.summary._all[column])
          list.push(...item.summary._all[column]);
        return list;
      },
      []
    );
    return geologic.length > 0 || geographic.length > 0 ? (
      <div
        style={{
          minWidth: 125,
          maxWidth: 125,
          marginRight: "1em",
          marginBottom: 5,
          fontSize: "small",
          whiteSpace: "normal",
        }}
      >
        {geologic.length > 0 ? (
          <span>
            <b>Geologic:</b>
            <Clamp lines={geographic.length > 0 ? 2 : 5}>
              <span>{geologic.join(", ")}</span>
            </Clamp>
          </span>
        ) : undefined}
        {geographic.length > 0 ? (
          <span>
            <b>Geographic:</b>
            <Clamp lines={geologic.length > 0 ? 2 : 5}>
              <span>{geographic.join(", ")}</span>
            </Clamp>
          </span>
        ) : undefined}
      </div>
    ) : (
      <div
        style={{
          minWidth: 125,
          maxWidth: 125,
          marginRight: "1em",
          marginBottom: 5,
          fontSize: "small",
          color: "#AAAAAA",
          textAlign: "center",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <br />
        No
        <br />
        <b>Geographic</b>
        <br />
        Data
        <br />
        <br />
      </div>
    );
  }

  renderGeology(item) {
    let geologic_classes =
      item.summary && item.summary._all && item.summary._all.geologic_classes;
    let geologic_types =
      item.summary && item.summary._all && item.summary._all.geologic_types;
    let lithologies =
      item.summary && item.summary._all && item.summary._all.lithologies;
    let nDefined = _.without(
      [geologic_classes, geologic_types, lithologies],
      undefined
    ).length;
    let clampLines = nDefined === 3 ? 1 : nDefined === 2 ? 2 : 5;
    return (geologic_classes && geologic_classes.length > 0) ||
      (geologic_types && geologic_types.length > 0) ||
      (lithologies && lithologies.length > 0) ? (
      <div
        style={{
          minWidth: 125,
          maxWidth: 125,
          marginRight: "1em",
          marginBottom: 5,
          fontSize: "small",
          whiteSpace: "normal",
        }}
      >
        {geologic_classes && geologic_classes.length > 0 ? (
          <span>
            <b>Class:</b>
            <Clamp lines={clampLines}>
              <span>{geologic_classes.join(", ")}</span>
            </Clamp>
          </span>
        ) : undefined}
        {geologic_types && geologic_types.length > 0 ? (
          <span>
            <b>Type:</b>
            <Clamp lines={clampLines}>
              <span>{geologic_types.join(", ")}</span>
            </Clamp>
          </span>
        ) : undefined}
        {lithologies && lithologies.length > 0 ? (
          <span>
            <b>Lithology:</b>
            <Clamp lines={clampLines}>
              <span>{lithologies.join(", ")}</span>
            </Clamp>
          </span>
        ) : undefined}
      </div>
    ) : (
      <div
        style={{
          minWidth: 125,
          maxWidth: 125,
          marginRight: "1em",
          marginBottom: 5,
          fontSize: "small",
          color: "#AAAAAA",
          textAlign: "center",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <br />
        No
        <br />
        <b>Geologic</b>
        <br />
        Data
        <br />
        <br />
      </div>
    );
  }

  renderMethodCodes(item) {
    return item.summary._all &&
      item.summary._all.method_codes &&
      item.summary._all.method_codes.length > 0 ? (
      <div
        style={{
          minWidth: 125,
          maxWidth: 125,
          marginRight: "1em",
          marginBottom: 5,
          fontSize: "small",
          whiteSpace: "normal",
        }}
      >
        <span>
          <b>Method Codes:</b>
          <Clamp lines={5}>
            <span>{item.summary._all.method_codes.join(", ")}</span>
          </Clamp>
        </span>
      </div>
    ) : (
      <div
        style={{
          minWidth: 125,
          maxWidth: 125,
          marginRight: "1em",
          marginBottom: 5,
          fontSize: "small",
          color: "#AAAAAA",
          textAlign: "center",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <br />
        No
        <br />
        <b>
          Method
          <br />
          Codes
        </b>
        <br />
        <br />
      </div>
    );
  }

  renderCitations(item) {
    let citations;
    if (item.summary._all && item.summary._all.citations)
      citations = _.without(
        item.summary._all.citations,
        "this study",
        "This study",
        "This Study",
        "This study",
        "this_study",
        "This_study",
        "This_Study",
        "This_study"
      );
    return citations && citations.length > 0 ? (
      <div
        style={{
          minWidth: 125,
          maxWidth: 125,
          marginRight: "1em",
          marginBottom: 5,
          fontSize: "small",
          whiteSpace: "normal",
        }}
      >
        <span>
          <b>Citations:</b>
          <Clamp lines={5}>
            <span>{citations.join(", ")}</span>
          </Clamp>
        </span>
      </div>
    ) : (
      <div
        style={{
          minWidth: 125,
          maxWidth: 125,
          marginRight: "1em",
          marginBottom: 5,
          fontSize: "small",
          color: "#AAAAAA",
          textAlign: "center",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <br />
        No
        <br />
        <b>
          Additional
          <br />
          Citations
        </b>
        <br />
        <br />
      </div>
    );
  }

  loadPlateauData(experimentName, highPriority = false) {
    if (!experimentName) return;
    
    // Check if we already have data or are currently loading
    if (this.state.plateauData[experimentName] !== undefined || 
        this.state.loadingRequests.has(experimentName)) {
      return;
    }

    // Add to loading requests set to prevent duplicates
    const newLoadingRequests = new Set(this.state.loadingRequests);
    newLoadingRequests.add(experimentName);
    
    this.setState({
      loadingRequests: newLoadingRequests,
      plateauLoading: { ...this.state.plateauLoading, [experimentName]: true }
    }, () => {
      // Make the Meteor call after state is set
      Meteor.call('esGetMeasurementsForExperiment', { index, experimentName }, (error, measurements) => {
        // Remove from loading requests set
        const updatedLoadingRequests = new Set(this.state.loadingRequests);
        updatedLoadingRequests.delete(experimentName);
        
        if (error) {
          console.error('Error loading measurements for experiment', experimentName, error);
          this.setState({
            loadingRequests: updatedLoadingRequests,
            plateauLoading: { ...this.state.plateauLoading, [experimentName]: false },
            plateauData: { ...this.state.plateauData, [experimentName]: null }
          });
          return;
        }

        // Process measurements to calculate plateau data
        try {
          const plateauResult = PlateauCalculations.processPlateauData(measurements);
          const newState = {
            loadingRequests: updatedLoadingRequests,
            plateauData: { ...this.state.plateauData, [experimentName]: plateauResult },
            plateauLoading: { ...this.state.plateauLoading, [experimentName]: false }
          };
          
          // If modal is waiting for this data, update it
          if (this.state.plateauModalData && 
              this.state.plateauModalData.loading && 
              this.state.plateauModalData.experimentName === experimentName) {
            newState.plateauModalData = plateauResult;
          }
          
          this.setState(newState);
        } catch (processingError) {
          console.error('Error processing plateau data for experiment', experimentName, processingError);
          const newState = {
            loadingRequests: updatedLoadingRequests,
            plateauData: { ...this.state.plateauData, [experimentName]: null },
            plateauLoading: { ...this.state.plateauLoading, [experimentName]: false }
          };
          
          // If modal is waiting for this data, show error
          if (this.state.plateauModalData && 
              this.state.plateauModalData.loading && 
              this.state.plateauModalData.experimentName === experimentName) {
            newState.plateauModalData = { error: true, experimentName: experimentName };
          }
          
          this.setState(newState);
        }
      });
    });
  }

  renderAgePlateau(item) {
    // Only show plateau for Experiments level
    if (this.props.table !== "experiments") {
      return null;
    }

    // Check if we have experiment data that could contain measurements
    const hasExperiments = item.summary && item.summary._all && item.summary._all.experiment;
    
    if (!hasExperiments) {
      return this.renderNoPlateauMessage();
    }

    const experimentName = item.summary._all.experiment[0];
    const isLoading = this.state.plateauLoading[experimentName];
    const plateauResult = this.state.plateauData[experimentName];

    // Load data if not already loaded or loading (check for undefined specifically)
    if (!isLoading && plateauResult === undefined) {
      this.loadPlateauData(experimentName);
      return this.renderLoadingPlateau(experimentName);
    }

    // Show loading state
    if (isLoading) {
      return this.renderLoadingPlateau(experimentName);
    }

    // Show plateau plot if data is available
    if (plateauResult && plateauResult.ageData && plateauResult.ageData.length > 0) {
      // Check if all cumulative 39Ar values are 0
      const allCumArZero = plateauResult.ageData.every(d => d.cumAr39 === 0);
      if (allCumArZero) {
        return this.renderNoPlateauMessage(); // Show placeholder if all cumulative values are 0
      }
      return this.renderPlateauPlot(plateauResult);
    }

    // plateauResult is null (error occurred) or empty data
    return this.renderNoPlateauMessage();
  }

  renderLoadingPlateau(experimentName = null) {
    const isClickable = experimentName !== null;
    return (
      <div
        style={{
          minWidth: 125,
          maxWidth: 125,
          marginRight: "1em",
          marginBottom: 5,
          fontSize: "small",
          color: "#666",
          textAlign: "center",
          overflow: "hidden",
          cursor: isClickable ? "pointer" : "default",
          opacity: isClickable ? 1 : 0.7
        }}
        onClick={isClickable ? () => this.openModalAndWaitForData(experimentName) : undefined}
        title={isClickable ? "Click to open modal and wait for data" : "Loading data..."}
      >
        <br />
        Loading
        <br />
        <b>
          Age
          <br />
          Plateau
        </b>
        <br />
        <br />
      </div>
    );
  }

  renderPlateauPlot(plateauResult) {
    const { ageData } = plateauResult;
    if (!ageData || ageData.length === 0) {
      return this.renderNoPlateauMessage();
    }

    return (
      <div
        style={{
          minWidth: 125,
          maxWidth: 125,
          marginRight: "1em",
          marginBottom: 5,
          cursor: "pointer"
        }}
        onClick={() => this.showPlateauModal(plateauResult)}
        title="Click to view full plateau plot"
      >
        {this.renderPlateauThumbnail(plateauResult)}
      </div>
    );
  }

  renderPlateauThumbnail(plateauResult) {
    const { ageData, plateau } = plateauResult;
    
    const width = 125;
    const height = 80;
    const padding = { top: 3, right: 3, bottom: 3, left: 3 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    // Calculate scales
    const maxAge = Math.max(...ageData.map(d => d.age + d.age_sigma));
    const minAge = Math.min(...ageData.map(d => d.age - d.age_sigma));
    const ageRange = maxAge - minAge || 1;
    const maxCumAr = Math.max(...ageData.map(d => d.cumAr39));

    const xScale = (cumAr) => (cumAr / maxCumAr) * plotWidth;
    const yScale = (age) => plotHeight - ((age - minAge) / ageRange) * plotHeight;

    // Get plateau information
    const plateauSteps = plateau.plateauSteps || [];
    const plateauAge = plateau.plateauAge || 0;

    return (
      <svg width={width} height={height} style={{ display: "block" }}>
        {/* Background */}
        <rect width={width} height={height} fill="#fafafa" stroke="#ddd" strokeWidth={0.5} />
        
        {/* Plateau region highlight */}
        {plateauSteps.length > 0 && (
          <rect 
            x={padding.left + xScale(plateauSteps[0] > 0 ? ageData[plateauSteps[0]-1].cumAr39 : 0)} 
            y={padding.top}
            width={xScale(ageData[plateauSteps[plateauSteps.length-1]].cumAr39) - xScale(plateauSteps[0] > 0 ? ageData[plateauSteps[0]-1].cumAr39 : 0)}
            height={plotHeight}
            fill="rgba(100, 150, 200, 0.1)"
          />
        )}
        
        {/* Data points with error boxes */}
        {ageData.map((d, i) => {
          const y = padding.top + yScale(d.age);
          const errorTop = padding.top + yScale(d.age + d.age_sigma);
          const errorBottom = padding.top + yScale(d.age - d.age_sigma);
          const isPlateauStep = plateauSteps.includes(i);
          
          // Calculate variable box width based on cumulative 39Ar range
          const prevCumAr39 = i > 0 ? ageData[i-1].cumAr39 : 0;
          const currCumAr39 = d.cumAr39;
          const ar39Range = currCumAr39 - prevCumAr39;
          
          // Convert cumulative percentages to x coordinates
          const xStart = padding.left + xScale(prevCumAr39);
          const xEnd = padding.left + xScale(currCumAr39);
          const boxWidth = xEnd - xStart;
          const boxHeight = Math.abs(errorBottom - errorTop);
          
          return (
            <g key={i}>
              {/* Error box - spans from previous to current cumulative 39Ar */}
              <rect 
                x={xStart} 
                y={errorTop} 
                width={boxWidth} 
                height={boxHeight}
                fill={isPlateauStep ? "#e6f2ff" : "#f5f5f5"} 
                stroke={isPlateauStep ? "#0066cc" : "#999"} 
                strokeWidth={0.8}
              />
            </g>
          );
        })}
        
        {/* Plateau age line */}
        {plateauSteps.length > 0 && plateauAge > 0 && (
          <line 
            x1={padding.left + xScale(plateauSteps[0] > 0 ? ageData[plateauSteps[0]-1].cumAr39 : 0)} 
            y1={padding.top + yScale(plateauAge)}
            x2={padding.left + xScale(ageData[plateauSteps[plateauSteps.length-1]].cumAr39)} 
            y2={padding.top + yScale(plateauAge)}
            stroke="#cc3300" 
            strokeWidth={1.2}
          />
        )}
      </svg>
    );
  }

  renderNoPlateauMessage() {
    return (
      <div
        style={{
          minWidth: 125,
          maxWidth: 125,
          marginRight: "1em",
          marginBottom: 5,
          fontSize: "small",
          color: "#AAAAAA",
          textAlign: "center",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <br />
        No
        <br />
        <b>
          Age
          <br />
          Plateau
        </b>
        <br />
        <br />
      </div>
    );
  }

  showPlateauModal(plateauResult) {
    this.setState({
      plateauModalData: plateauResult
    }, () => {
      $(this.refs["plateau modal"]).modal("show");
    });
  }

  hidePlateauModal() {
    $(this.refs["plateau modal"]).modal("hide");
    this.setState({
      plateauModalData: null
    });
  }

  openModalAndWaitForData(experimentName) {
    // Set modal data with loading state and higher priority
    this.setState({
      plateauModalData: { loading: true, experimentName: experimentName }
    }, () => {
      $(this.refs["plateau modal"]).modal("show");
      // Set higher priority for this experiment's data loading
      this.loadPlateauData(experimentName, true); // true = high priority
    });
  }

  renderFullPlateauPlot(plateauResult) {
    const { ageData, plateau, totalSteps, uniqueSteps, duplicatesRemoved } = plateauResult;
    
    // Calculate responsive dimensions with constraints
    // Account for modal padding (20px each side = 40px total) and some margin
    const availableWidth = this.state.windowWidth - 80; // Leave 80px total margin
    const maxHeight = this.state.windowHeight * 0.5; // Maximum height is 50% of viewport
    
    let width = Math.min(availableWidth, 1200); // Cap at 1200px but use available width
    let height = width / 2; // 2:1 aspect ratio
    
    // Apply maximum height constraint
    if (height > maxHeight) {
      height = maxHeight;
      width = height * 2; // Maintain 2:1 aspect ratio
    }
    
    // Ensure minimum width
    width = Math.max(width, 400);
    
    const padding = { top: 40, right: 60, bottom: 80, left: 80 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    // Calculate scales
    const maxAge = Math.max(...ageData.map(d => d.age + d.age_sigma));
    const minAge = Math.min(...ageData.map(d => d.age - d.age_sigma));
    const ageRange = maxAge - minAge || 1;
    const maxCumAr = Math.max(...ageData.map(d => d.cumAr39));

    const xScale = (cumAr) => (cumAr / maxCumAr) * plotWidth;
    const yScale = (age) => plotHeight - ((age - minAge) / ageRange) * plotHeight;

    // Get plateau information
    const plateauSteps = plateau.plateauSteps || [];
    const plateauAge = plateau.plateauAge || 0;
    const plateauAge_sigma = plateau.plateauAge_sigma || 0;
    const mswd = plateau.mswd || 0;

    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", maxWidth: "100%", overflow: "hidden" }}>
        <div style={{ textAlign: "center", marginBottom: "20px", flexShrink: 0 }}>
          <h3>Age Plateau Analysis</h3>
          {plateauAge > 0 && (
            <div style={{ fontSize: "16px", color: "#333" }}>
              <strong>Plateau Age: {plateauAge.toFixed(2)} ± {plateauAge_sigma.toFixed(2)} Ma</strong>
              <br />
              <span style={{ fontSize: "14px", color: "#666" }}>
                MSWD: {mswd.toFixed(2)} | {plateauSteps.length} steps | 
                {plateau.ar39Percent ? ` ${plateau.ar39Percent.toFixed(1)}% ³⁹Ar` : ''}
                {duplicatesRemoved > 0 && ` | ${uniqueSteps}/${totalSteps} unique steps`}
              </span>
            </div>
          )}
        </div>
        
        <div style={{ flexShrink: 0, textAlign: "center", maxWidth: "100%", overflow: "hidden" }}>
          <svg viewBox={`0 0 ${width} ${height}`} style={{ display: "block", margin: "0 auto", width: "100%", height: "auto", maxWidth: `${width}px` }}>
          {/* Background */}
          <rect width={width} height={height} fill="white" stroke="#ddd" strokeWidth={1} />
          
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(tick => (
            <line 
              key={`xgrid-${tick}`}
              x1={padding.left + (tick/100) * plotWidth} 
              y1={padding.top} 
              x2={padding.left + (tick/100) * plotWidth} 
              y2={padding.top + plotHeight} 
              stroke="#f0f0f0" 
              strokeWidth={1}
            />
          ))}
          
          {/* Plateau region highlight */}
          {plateauSteps.length > 0 && (
            <rect 
              x={padding.left + xScale(plateauSteps[0] > 0 ? ageData[plateauSteps[0]-1].cumAr39 : 0)} 
              y={padding.top}
              width={xScale(ageData[plateauSteps[plateauSteps.length-1]].cumAr39) - xScale(plateauSteps[0] > 0 ? ageData[plateauSteps[0]-1].cumAr39 : 0)}
              height={plotHeight}
              fill="rgba(100, 150, 200, 0.15)"
            />
          )}
          
          {/* Data points with error boxes */}
          {ageData.map((d, i) => {
            const y = padding.top + yScale(d.age);
            const errorTop = padding.top + yScale(d.age + d.age_sigma);
            const errorBottom = padding.top + yScale(d.age - d.age_sigma);
            const isPlateauStep = plateauSteps.includes(i);
            
            // Calculate variable box width based on cumulative 39Ar range
            const prevCumAr39 = i > 0 ? ageData[i-1].cumAr39 : 0;
            const currCumAr39 = d.cumAr39;
            
            // Convert cumulative percentages to x coordinates
            const xStart = padding.left + xScale(prevCumAr39);
            const xEnd = padding.left + xScale(currCumAr39);
            const boxWidth = xEnd - xStart;
            const boxHeight = Math.abs(errorBottom - errorTop);
            const xCenter = xStart + boxWidth / 2;
            
            return (
              <g key={i}>
                {/* Error box - spans from previous to current cumulative 39Ar */}
                <rect 
                  x={xStart} 
                  y={errorTop} 
                  width={boxWidth} 
                  height={boxHeight}
                  fill={isPlateauStep ? "#e6f2ff" : "#f5f5f5"} 
                  stroke={isPlateauStep ? "#0066cc" : "#999"} 
                  strokeWidth={1.5}
                />
                {/* Step label */}
                <text
                  x={xCenter}
                  y={errorTop - 8}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#333"
                  fontWeight={isPlateauStep ? "bold" : "normal"}
                >
                  {d.step}
                </text>
              </g>
            );
          })}
          
          {/* Plateau age line */}
          {plateauSteps.length > 0 && plateauAge > 0 && (
            <line 
              x1={padding.left + xScale(plateauSteps[0] > 0 ? ageData[plateauSteps[0]-1].cumAr39 : 0)} 
              y1={padding.top + yScale(plateauAge)}
              x2={padding.left + xScale(ageData[plateauSteps[plateauSteps.length-1]].cumAr39)} 
              y2={padding.top + yScale(plateauAge)}
              stroke="#cc3300" 
              strokeWidth={3}
            />
          )}
          
          {/* Axes */}
          <line x1={padding.left} y1={padding.top + plotHeight} x2={padding.left + plotWidth} y2={padding.top + plotHeight} stroke="#333" strokeWidth={2} />
          <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + plotHeight} stroke="#333" strokeWidth={2} />
          
          {/* X-axis labels */}
          {[0, 25, 50, 75, 100].map(tick => (
            <text 
              key={`xlabel-${tick}`}
              x={padding.left + (tick/100) * plotWidth} 
              y={height - 45} 
              textAnchor="middle" 
              fontSize="14" 
              fill="#333"
            >
              {tick}
            </text>
          ))}
          
          {/* Y-axis labels */}
          {Array.from({length: 5}, (_, i) => {
            const age = minAge + (i * ageRange / 4);
            const y = padding.top + plotHeight - (i * plotHeight / 4);
            return (
              <text 
                key={`ylabel-${i}`}
                x={padding.left - 10} 
                y={y + 4} 
                textAnchor="end" 
                fontSize="12" 
                fill="#333"
              >
                {age.toFixed(1)}
              </text>
            );
          })}
          
          {/* Axis titles */}
          <text x={width/2} y={height-25} textAnchor="middle" fontSize="16" fill="#333">
            Cumulative ³⁹Ar Release (%)
          </text>
          <text x={25} y={height/2} textAnchor="middle" fontSize="16" fill="#333" transform={`rotate(-90 25 ${height/2})`}>
            Age (Ma)
          </text>
        </svg>
        </div>
        
        {/* Data table */}
        <div style={{ marginTop: "20px", flex: "1", overflowY: "auto", minHeight: "150px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
              <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th style={{ border: "1px solid #ddd", padding: "5px", backgroundColor: "#f5f5f5", position: "sticky", top: 0, textAlign: "center" }}>Step</th>
                <th style={{ border: "1px solid #ddd", padding: "5px", backgroundColor: "#f5f5f5", position: "sticky", top: 0, textAlign: "center" }}>Temp (°C)</th>
                <th style={{ border: "1px solid #ddd", padding: "5px", backgroundColor: "#f5f5f5", position: "sticky", top: 0, textAlign: "center" }}>Age (Ma)</th>
                <th style={{ border: "1px solid #ddd", padding: "5px", backgroundColor: "#f5f5f5", position: "sticky", top: 0, textAlign: "center" }}>±1σ</th>
                <th style={{ border: "1px solid #ddd", padding: "5px", backgroundColor: "#f5f5f5", position: "sticky", top: 0, textAlign: "center" }}>Cum. ³⁹Ar (%)</th>
                <th style={{ border: "1px solid #ddd", padding: "5px", backgroundColor: "#f5f5f5", position: "sticky", top: 0, textAlign: "center" }}>Plateau</th>
              </tr>
            </thead>
            <tbody>
              {ageData.map((d, i) => {
                const isPlateauStep = plateauSteps.includes(i);
                return (
                  <tr key={i} style={{ backgroundColor: isPlateauStep ? "#e6f2ff" : "white" }}>
                    <td style={{ border: "1px solid #ddd", padding: "5px", textAlign: "center" }}>{i + 1}</td>
                    <td style={{ border: "1px solid #ddd", padding: "5px", textAlign: "center" }}>{d.temperature}</td>
                    <td style={{ border: "1px solid #ddd", padding: "5px", textAlign: "center" }}>{d.age.toFixed(2)}</td>
                    <td style={{ border: "1px solid #ddd", padding: "5px", textAlign: "center" }}>{d.age_sigma.toFixed(2)}</td>
                    <td style={{ border: "1px solid #ddd", padding: "5px", textAlign: "center" }}>{d.cumAr39.toFixed(1)}</td>
                    <td style={{ border: "1px solid #ddd", padding: "5px", textAlign: "center" }}>{isPlateauStep ? "✓" : ""}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  render() {
    const item = this.props.item;
    let _is_activated =
      item.summary &&
      item.summary.contribution &&
      item.summary.contribution._is_activated === "true";
    try {
      return (
        <div>
          <div
            ref="accordion"
            className={
              "ui accordion search-summaries-list-item" +
              (this.props.active && !this.props.collapsed ? " active" : "")
            }
            onMouseOver={(e) => {
              clearTimeout(this.hideAccordionButtonTimeout);
              this.showAccordionButtonTimeout = setTimeout(() => {
                if ($(this.refs["accordion title"]).hasClass("active")) {
                  $(this.refs["close accordion button"]).show();
                  $(this.refs["open accordion button"]).hide();
                } else {
                  $(this.refs["open accordion button"]).show();
                  $(this.refs["close accordion button"]).hide();
                }
              }, 500);
            }}
            onMouseLeave={(e) => {
              clearTimeout(this.showAccordionButtonTimeout);
              this.hideAccordionButtonTimeout = setTimeout(() => {
                $(this.refs["open accordion button"]).hide();
                $(this.refs["close accordion button"]).hide();
              }, 500);
            }}
          >
            <div
              ref="accordion title"
              className={
                "title" +
                (this.props.active && !this.props.collapsed ? " active" : "")
              }
              style={{ padding: "0 0 0 1em" }}
            >
              <i
                className="dropdown icon"
                style={{ position: "relative", left: "-1.3rem", top: "-.2rem" }}
              />
              <div
                className="ui grid"
                style={{ marginTop: "-1.5rem", marginBottom: "-.5em" }}
              >
                <div
                  className="row accordion-trigger"
                  style={{ display: "flex", padding: "0 1em 0.5em" }}
                >
                  <span
                    style={{
                      fontSize: "small",
                      fontWeight: "bold",
                      color:
                        !_is_activated && Meteor.isDevelopment
                          ? "#3030BB"
                          : "default",
                    }}
                  >
                    {(item.summary.contribution &&
                      item.summary.contribution._reference &&
                      item.summary.contribution._reference.citation) ||
                      "Unknown"}
                    {item.summary.contribution &&
                      item.summary.contribution.version && (
                        <span>
                          &nbsp;v.&nbsp;{item.summary.contribution.version}
                        </span>
                      )}
                  </span>
                  <span
                    style={{
                      fontSize: "small",
                      flex: "1",
                      height: "1.25em",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      margin: "0 0.5em",
                      color:
                        !_is_activated && Meteor.isDevelopment
                          ? "#3030BB"
                          : "default",
                    }}
                  >
                    {this.renderTitle(item)}
                  </span>
                  <span
                    className="description"
                    style={{
                      fontSize: "small",
                      float: "right",
                      textAlign: "right",
                    }}
                  >
                    {item.summary.contribution &&
                      moment
                        .utc(item.summary.contribution.timestamp)
                        .local()
                        .format("LL")}
                    &nbsp;by&nbsp;
                    <b>
                      {item.summary.contribution &&
                        item.summary.contribution._contributor}
                    </b>
                  </span>
                </div>
                {item.summary && item.summary._incomplete_summary !== "true" ? (
                  <div
                    className="row flex_row"
                    style={{
                      padding: "0",
                      fontWeight: "normal",
                      whiteSpace: "nowrap",
                      display: "flex",
                    }}
                  >
                    {this.renderDownloadButton(item)}
                    {this.renderLinks(item)}
                    {this.renderCounts(item)}
                    {this.renderMapThumbnail(item)}
                    {this.renderGeo(item)}
                    {this.renderGeology(item)}
                    {this.renderAge(item)}
                    {this.renderAgePlateau(item)}
                    {this.renderMethodCodes(item)}
                    {this.renderCitations(item)}
                  </div>
                ) : (
                  <div
                    className="row flex_row"
                    style={{
                      padding: "0",
                      fontWeight: "normal",
                      whiteSpace: "nowrap",
                      display: "flex",
                    }}
                  >
                    {this.renderDownloadButton(item)}
                    {this.renderLinks(item)}
                    {this.renderCounts(item)}
                    {this.renderQueuedForIndex(item)}
                  </div>
                )}
              </div>
            </div>
            <div
              className={
                "content" +
                (this.props.active && !this.props.collapsed ? " active" : "")
              }
              style={{ fontSize: "small", paddingBottom: 0 }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    item.summary.contribution &&
                    item.summary.contribution._reference &&
                    item.summary.contribution._reference.html,
                }}
              />
              <div
                style={{ marginTop: "0.5em" }}
                dangerouslySetInnerHTML={{
                  __html:
                    item.summary.contribution &&
                    item.summary.contribution._reference &&
                    item.summary.contribution._reference.abstract_html,
                }}
              />
              {item.summary.contribution &&
                item.summary.contribution._reference &&
                item.summary.contribution._reference.keywords &&
                item.summary.contribution._reference.keywords.join && (
                  <div
                    style={{ marginTop: "0.5em" }}
                    dangerouslySetInnerHTML={{
                      __html:
                        "<b>Keywords: </b>" +
                        item.summary.contribution._reference.keywords.join(
                          ", "
                        ),
                    }}
                  />
                )}
              {item.summary.contribution &&
                item.summary.contribution._reference &&
                item.summary.contribution._reference.keywords &&
                !item.summary.contribution._reference.keywords.join && (
                  <div
                    style={{ marginTop: "0.5em" }}
                    dangerouslySetInnerHTML={{
                      __html:
                        "<b>Keywords: </b>" +
                        item.summary.contribution._reference.keywords,
                    }}
                  />
                )}
              {item.summary.contribution &&
                item.summary.contribution._reference &&
                item.summary.contribution._reference.tags &&
                item.summary.contribution._reference.tags.join && (
                  <div
                    style={{ marginTop: "0.5em" }}
                    dangerouslySetInnerHTML={{
                      __html:
                        "<b>Tags: </b>" +
                        item.summary.contribution._reference.tags.join(", "),
                    }}
                  />
                )}
              {item.summary.contribution &&
                item.summary.contribution._reference &&
                item.summary.contribution._reference.tags &&
                !item.summary.contribution._reference.tags.join && (
                  <div
                    style={{ marginTop: "0.5em" }}
                    dangerouslySetInnerHTML={{
                      __html:
                        "<b>Tags: </b>" +
                        item.summary.contribution._reference.tags,
                    }}
                  />
                )}
              {item.summary.contribution &&
                item.summary.contribution._reference &&
                item.summary.contribution._reference.n_citations && (
                  <div
                    style={{ marginTop: "0.5em" }}
                    dangerouslySetInnerHTML={{
                      __html:
                        '<b><a target="_blank" href="https://www.crossref.org" style="color: #792f91">Crossref</a> Citation Count: </b>' +
                        item.summary.contribution._reference.n_citations,
                    }}
                  />
                )}

              {this.props.table === "contribution" &&
                item.summary.contribution &&
                item.summary.contribution._history && (
                  <table className="ui very basic compact collapsing table">
                    <thead>
                      <tr>
                        <th style={{ whiteSpace: "nowrap" }}>Download</th>
                        <th style={{ whiteSpace: "nowrap" }}>
                          KArAr Contribution Link
                        </th>
                        <th style={{ whiteSpace: "nowrap" }}>
                          EarthRef Data DOI Link
                        </th>
                        <th style={{ whiteSpace: "nowrap" }}>Version</th>
                        <th style={{ whiteSpace: "nowrap" }}>Data Model</th>
                        <th style={{ whiteSpace: "nowrap" }}>Date</th>
                        <th style={{ whiteSpace: "nowrap" }}>Contributor</th>
                        {_.find(
                          item.summary.contribution._history,
                          "description"
                        ) && (
                          <th style={{ whiteSpace: "nowrap" }}>Description</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {item.summary.contribution &&
                        item.summary.contribution._history.map((v, i) => {
                          let _is_activated =
                            item.summary &&
                            item.summary.contribution &&
                            item.summary.contribution._is_activated === "true";
                          let _has_data_doi =
                            item.summary &&
                            item.summary.contribution &&
                            item.summary.contribution._has_data_doi === "true";
                          return (
                            <tr key={i}>
                              <td style={{ whiteSpace: "nowrap" }}>
                                {v.id && (
                                  <a
                                    href={`//earthref.org/KArAr/download/${v.id}/karar_contribution_${v.id}.txt`}
                                    download
                                  >
                                    <button
                                      className="ui basic tiny fluid compact icon blue button"
                                      style={{ marginTop: "0" }}
                                    >
                                      <i className="ui file text outline icon" />{" "}
                                      Download
                                    </button>
                                  </a>
                                )}
                                {!v.id && (
                                  <button
                                    className="ui basic tiny fluid compact icon blue disabled button"
                                    style={{ marginTop: "0" }}
                                  >
                                    <i className="ui file text outline icon" />{" "}
                                    Download
                                  </button>
                                )}
                              </td>
                              <td>
                                {(_is_activated || i > 0) && (
                                  <a
                                    style={this.styles.a}
                                    href={
                                      "https://karar.earthref.org/KArAr/" + v.id
                                    }
                                  >
                                    {"karar.earthref.org/KArAr/" + v.id}
                                  </a>
                                )}
                                {!_is_activated && i == 0 && (
                                  <span>{"earthref.org/KArAr/" + v.id}</span>
                                )}
                              </td>
                              <td>
                                {_is_activated && _has_data_doi && (
                                  <a
                                    style={this.styles.a}
                                    href={
                                      "http://dx.doi.org/10.7288/V4/KArAr/" +
                                      v.id
                                    }
                                    target="_blank"
                                  >
                                    {"10.7288/V4/KArAr/" + v.id}
                                  </a>
                                )}
                                {_is_activated && !_has_data_doi && (
                                  <span>Queued For Creation</span>
                                )}
                                {!_is_activated && (
                                  <span>{"10.7288/V4/KArAr/" + v.id}</span>
                                )}
                              </td>
                              <td>{v.version}</td>
                              <td>
                                {parseFloat(v.data_model_version).toFixed(1)}
                              </td>
                              <td>
                                {moment(v.timestamp).local().format("LL")}
                              </td>
                              <td>{v.contributor}</td>
                              {_.find(
                                item.summary.contribution._history,
                                "description"
                              ) && <td>{v.description}</td>}
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                )}
              {Meteor.isDevelopment &&
                this.props.table === "contribution" &&
                item.summary.contribution && (
                  <table className="ui compact red table">
                    <thead>
                      <tr>
                        <th style={{ whiteSpace: "nowrap" }}>
                          Developer Tasks
                        </th>
                        <th style={{ whiteSpace: "nowrap" }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.summary.contribution._is_activated === "true" && (
                        <tr>
                          <td style={{ whiteSpace: "nowrap" }}>
                            <button
                              className="ui basic tiny fluid compact red button"
                              style={{ marginTop: "0" }}
                              onClick={function (id, e) {
                                console.log("esDeactivateContribution");
                                Meteor.call(
                                  "esDeactivateContribution",
                                  { index: index, id: id },
                                  (error) => {
                                    console.log(
                                      "esDeactivateContribution done"
                                    );
                                  }
                                );
                              }.bind(this, item.summary.contribution.id)}
                            >
                              Deactivate
                            </button>
                          </td>
                          <td>
                            Deactivate the contribution (contribution and Data
                            DOI links will be broken until activated again).
                          </td>
                        </tr>
                      )}
                      {item.summary.contribution._is_activated !== "true" && (
                        <tr>
                          <td style={{ whiteSpace: "nowrap" }}>
                            <button
                              className="ui basic tiny fluid compact red button"
                              style={{ marginTop: "0" }}
                              onClick={function (id, e) {
                                console.log("esActivateContribution");
                                Meteor.call(
                                  "esActivateContribution",
                                  { index: index, id: id },
                                  (error) => {
                                    console.log("esActivateContribution done");
                                  }
                                );
                              }.bind(this, item.summary.contribution.id)}
                            >
                              Force Activate
                            </button>
                          </td>
                          <td>
                            Activate the contribution even if not validated.
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td style={{ whiteSpace: "nowrap" }}>
                          <button
                            className="ui basic tiny fluid compact red button"
                            style={{ marginTop: "0" }}
                            onClick={function (id, contributor, e) {
                              console.log("esUpdatePrivatePreSummaries");
                              Meteor.call(
                                "esUpdatePrivatePreSummaries",
                                { index, id, contributor },
                                (error) => {
                                  console.log(
                                    "esUpdatePrivatePreSummaries done"
                                  );
                                }
                              );
                            }.bind(
                              this,
                              item.summary.contribution.id,
                              item.summary.contribution.contributor
                            )}
                          >
                            Pre Summary
                          </button>
                        </td>
                        <td>
                          Calculate the contribution pre summary and submit it
                          to Elasticsearch for indexing.
                        </td>
                      </tr>
                      <tr>
                        <td style={{ whiteSpace: "nowrap" }}>
                          <button
                            className="ui basic tiny fluid compact red button"
                            style={{ marginTop: "0" }}
                            onClick={function (id, contributor, e) {
                              console.log("esUpdatePrivateSummaries");
                              Meteor.call(
                                "esUpdatePrivateSummaries",
                                { index, id, contributor },
                                (error) => {
                                  console.log("esUpdatePrivateSummaries done");
                                }
                              );
                            }.bind(
                              this,
                              item.summary.contribution.id,
                              item.summary.contribution.contributor
                            )}
                          >
                            Full Summary
                          </button>
                        </td>
                        <td>
                          Calculate the full contribution summary and submit it
                          to Elasticsearch for indexing.
                        </td>
                      </tr>
                      {item.summary.contribution &&
                        item.summary.contribution._history &&
                        item.summary.contribution._history.map((v, i) => (
                          <tr key={i}>
                            <td style={{ whiteSpace: "nowrap" }}>
                              <button
                                className="ui basic tiny fluid compact red button"
                                style={{ marginTop: "0" }}
                                onClick={function (id, e) {
                                  console.log(
                                    "esUploadActivatedContributionToS3"
                                  );
                                  Meteor.call(
                                    "esUploadActivatedContributionToS3",
                                    { index, id },
                                    (error) => {
                                      console.log(
                                        "esUploadActivatedContributionToS3 done"
                                      );
                                    }
                                  );
                                }.bind(this, v.id)}
                              >
                                Upload {v.id} to S3
                              </button>
                            </td>
                            <td>
                              Upload the contribution text file to
                              karar-contributions and/or
                              karar-activated-contributions.
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
            </div>
            <div
              ref="open accordion button"
              className="ui grey icon button accordion-button"
              onClick={(e) => {
                $(this.refs["accordion"]).accordion("open", 0);
                $(this.refs["close accordion button"]).show();
                $(this.refs["open accordion button"]).hide();
              }}
            >
              <i className="caret down icon"></i>
            </div>
            <div
              ref="close accordion button"
              className="ui grey icon button accordion-button"
              onClick={(e) => {
                $(this.refs["accordion"]).accordion("close", 0);
                $(this.refs["open accordion button"]).show();
                $(this.refs["close accordion button"]).hide();
              }}
            >
              <i className="caret up icon"></i>
            </div>
            {this.state.loadMap && this.renderMapModal(item)}
            {this.state.showDataModal && this.renderDataModal(item)}
            {this.renderPlateauModal()}
          </div>
        </div>
      );
    } catch (e) {
      console.error(e);
    }
  }

  renderMapModal(item) {
    let citation =
      item.summary &&
      item.summary.contribution &&
      item.summary.contribution._reference &&
      item.summary.contribution._reference.citation;
    let name =
      item.summary &&
      item.summary.contribution &&
      item.summary.contribution._name;
    return (
      <div ref="map modal" className="ui fullscreen modal">
        <i className="close icon"></i>
        <div className="header">{citation || name || "Unnamed"} Map</div>
        <GoogleMap
          style={{ width: "100%", height: "calc(100vh - 10em)" }}
          docs={[item]}
        />
      </div>
    );
  }

  renderDataModal(item) {
    const citation =
      item.summary &&
      item.summary.contribution &&
      item.summary.contribution._reference &&
      item.summary.contribution._reference.citation;
    const name =
      item.summary &&
      item.summary.contribution &&
      item.summary.contribution._name;
    const isPrivate =
      item.summary &&
      item.summary.contribution &&
      item.summary.contribution._is_activated !== "true";
    return (
      <Modal
        onClose={() =>
          this.setState(
            this.state.dataEdited
              ? { showConfirmCloseEditedDataModal: true }
              : { showDataModal: false }
          )
        }
        open={true}
        style={{ width: "calc(100vw - 4em)" }}
      >
        <Modal.Header>
          <i
            className="close icon"
            onClick={() =>
              this.setState(
                this.state.dataEdited
                  ? { showConfirmCloseEditedDataModal: true }
                  : { showDataModal: false }
              )
            }
            style={{ cursor: "pointer", float: "right" }}
          />
          {citation || name || "Unnamed"} - Contribution Data
        </Modal.Header>
        <Modal.Content>
          <div className="ui top attached tabular small menu search-tab-menu">
            {this.state.contributionData &&
            this.state.contributionData.samples ? (
              <a
                className={`${
                  this.state.dataLevel === "samples" ? "active " : ""
                }item`}
                style={
                  this.state.dataLevel === "samples"
                    ? { backgroundColor: "#F0F0F0" }
                    : {}
                }
                onClick={() =>
                  this.setState(
                    this.state.dataEdited
                      ? {
                          showConfirmChangeTabsEditedDataModal: true,
                          confirmChangeTabsDataLevel: "samples",
                        }
                      : { dataLoading: true, dataLevel: "samples" }
                  )
                }
              >
                Samples
                <div
                  className="ui circular small basic label"
                  style={{
                    color: "#0C0C0C",
                    margin: "-1em -1em -1em 0.5em",
                    minWidth: "4em",
                  }}
                >
                  <Count count={this.state.contributionData.samples.length} />
                </div>
              </a>
            ) : (
              <div
                className={`${
                  this.state.dataLevel === "samples" ? "active " : ""
                }disabled item`}
                style={
                  this.state.dataLevel === "samples"
                    ? { backgroundColor: "#F0F0F0" }
                    : {}
                }
              >
                Samples
                <div
                  className="ui circular small basic label"
                  style={{
                    color: "#0C0C0C",
                    margin: "-1em -1em -1em 0.5em",
                    minWidth: "4em",
                  }}
                >
                  {this.state.contributionData ? "0" : "?"}
                </div>
              </div>
            )}
            {this.state.contributionData &&
            this.state.contributionData.specimens ? (
              <a
                className={`${
                  this.state.dataLevel === "specimens" ? "active " : ""
                }item`}
                style={
                  this.state.dataLevel === "specimens"
                    ? { backgroundColor: "#F0F0F0" }
                    : {}
                }
                onClick={() =>
                  this.setState(
                    this.state.dataEdited
                      ? { showConfirmChangeTabsEditedDataModal: true }
                      : {
                          dataLoading: true,
                          dataLevel: "specimens",
                          confirmChangeTabsDataLevel: "specimens",
                        }
                  )
                }
              >
                Specimens
                <div
                  className="ui circular small basic label"
                  style={{
                    color: "#0C0C0C",
                    margin: "-1em -1em -1em 0.5em",
                    minWidth: "4em",
                  }}
                >
                  <Count count={this.state.contributionData.specimens.length} />
                </div>
              </a>
            ) : (
              <div
                className={`${
                  this.state.dataLevel === "specimens" ? "active " : ""
                }disabled item`}
                style={
                  this.state.dataLevel === "specimens"
                    ? { backgroundColor: "#F0F0F0" }
                    : {}
                }
              >
                Specimens
                <div
                  className="ui circular small basic label"
                  style={{
                    color: "#0C0C0C",
                    margin: "-1em -1em -1em 0.5em",
                    minWidth: "4em",
                  }}
                >
                  {this.state.contributionData ? "0" : "?"}
                </div>
              </div>
            )}
            {this.state.contributionData &&
            this.state.contributionData.experiments ? (
              <a
                className={`${
                  this.state.dataLevel === "experiments" ? "active " : ""
                }item`}
                style={
                  this.state.dataLevel === "experiments"
                    ? { backgroundColor: "#F0F0F0" }
                    : {}
                }
                onClick={() =>
                  this.setState(
                    this.state.dataEdited
                      ? { showConfirmChangeTabsEditedDataModal: true }
                      : {
                          dataLoading: true,
                          dataLevel: "experiments",
                          confirmChangeTabsDataLevel: "experiments",
                        }
                  )
                }
              >
                Experiments
                <div
                  className="ui circular small basic label"
                  style={{
                    color: "#0C0C0C",
                    margin: "-1em -1em -1em 0.5em",
                    minWidth: "4em",
                  }}
                >
                  <Count
                    count={this.state.contributionData.experiments.length}
                  />
                </div>
              </a>
            ) : (
              <div
                className={`${
                  this.state.dataLevel === "experiments" ? "active " : ""
                }disabled item`}
                style={
                  this.state.dataLevel === "experiments"
                    ? { backgroundColor: "#F0F0F0" }
                    : {}
                }
              >
                Experiments
                <div
                  className="ui circular small basic label"
                  style={{
                    color: "#0C0C0C",
                    margin: "-1em -1em -1em 0.5em",
                    minWidth: "4em",
                  }}
                >
                  {this.state.contributionData ? "0" : "?"}
                </div>
              </div>
            )}
            {this.state.contributionData &&
            this.state.contributionData.measurements ? (
              <a
                className={`${
                  this.state.dataLevel === "measurements" ? "active " : ""
                }item`}
                style={
                  this.state.dataLevel === "measurements"
                    ? { backgroundColor: "#F0F0F0" }
                    : {}
                }
                onClick={() =>
                  this.setState(
                    this.state.dataEdited
                      ? { showConfirmChangeTabsEditedDataModal: true }
                      : {
                          dataLoading: true,
                          dataLevel: "measurements",
                          confirmChangeTabsDataLevel: "measurements",
                        }
                  )
                }
              >
                Measurments
                <div
                  className="ui circular small basic label"
                  style={{
                    color: "#0C0C0C",
                    margin: "-1em -1em -1em 0.5em",
                    minWidth: "4em",
                  }}
                >
                  <Count
                    count={this.state.contributionData.measurements.length}
                  />
                </div>
              </a>
            ) : (
              <div
                className={`${
                  this.state.dataLevel === "measurements" ? "active " : ""
                }disabled item`}
                style={
                  this.state.dataLevel === "measurements"
                    ? { backgroundColor: "#F0F0F0" }
                    : {}
                }
              >
                Measurements
                <div
                  className="ui circular small basic label"
                  style={{
                    color: "#0C0C0C",
                    margin: "-1em -1em -1em 0.5em",
                    minWidth: "4em",
                  }}
                >
                  {this.state.contributionData ? "0" : "?"}
                </div>
              </div>
            )}
          </div>
          {this.renderData(item)}
          <Modal
            size="small"
            onClose={() =>
              this.setState({ showConfirmCloseEditedDataModal: false })
            }
            open={this.state.showConfirmCloseEditedDataModal}
            content="Closing the Contribution Data tables will cancel edits made to this table."
            actions={[
              {
                content: "Cancel Edits and Close",
                key: "cancel",
                negative: true,
                onClick: () =>
                  this.setState({
                    dataEdited: false,
                    contributionData: undefined,
                    contributionDataError: undefined,
                    showDataModal: false,
                    showConfirmCloseEditedDataModal: false,
                    confirmChangeTabsDataLevel: undefined,
                  }),
              },
              "Continue Editing",
            ]}
          />
          <Modal
            size="small"
            onClose={() =>
              this.setState({
                showConfirmChangeTabsEditedDataModal: false,
                confirmChangeTabsDataLevel: undefined,
              })
            }
            open={this.state.showConfirmChangeTabsEditedDataModal}
            content="Changing table tabs will cancel edits made to this table."
            actions={[
              {
                content: "Cancel Edits and Change Tabs",
                key: "cancel",
                negative: true,
                onClick: () =>
                  this.setState({
                    dataEdited: false,
                    contributionData: undefined,
                    contributionDataError: undefined,
                    showConfirmChangeTabsEditedDataModal: false,
                    confirmChangeTabsDataLevel: undefined,
                    dataLevel: this.state.confirmChangeTabsDataLevel,
                  }),
              },
              "Continue Editing",
            ]}
          />
        </Modal.Content>
        {isPrivate && (
          <Modal.Actions>
            <Button
              color="purple"
              floated="left"
              disabled={!this.state.dataEdited || this.state.dataSaving}
              onClick={() => {
                const data =
                  (this.refs["hotTableComponent"] &&
                    this.refs["hotTableComponent"].hotInstance.getData()) ||
                  undefined;
                if (this.state.dataEdited && data) {
                  const rowData =
                    this.state.contributionData[this.state.dataLevel];
                  const model = models[_.last(versions)];
                  const table = model.tables[this.state.dataLevel];
                  const modelColumns = _.sortBy(
                    _.keys(table.columns),
                    (columnName) => table.columns[columnName].position
                  );
                  const tableData =
                    this.state.contributionData[this.state.dataLevel];
                  const usedColumns = {};
                  tableData.forEach((row) => {
                    _.keys(row).forEach((column) => {
                      usedColumns[column] = true;
                    });
                  });
                  const columns = modelColumns.filter((x) => usedColumns[x]);
                  const contributionData = {
                    ...this.state.contributionData,
                    [this.state.dataLevel]: data.map((row) => {
                      const editedRow = {};
                      row.forEach((col, colIdx) => {
                        editedRow[columns[colIdx]] = col;
                      });
                      return editedRow;
                    }),
                  };
                  console.log("updating contribution", item);
                  const contributor = item.summary.contribution.contributor;
                  const _contributor = item.summary.contribution._contributor;
                  const id = item.summary.contribution.id;
                  const contribution = contributionData;
                  const summary = item.summary;
                  Meteor.call(
                    "esUpdatePrivateContribution",
                    {
                      index,
                      contributor,
                      _contributor,
                      id,
                      contribution,
                      summary,
                    },
                    (error) => {
                      console.log("updated contribution", id, error);
                      if (error) {
                        this.setState({
                          contributionDataError: error,
                          dataSaving: false,
                        });
                      } else {
                        this.setState({ dataSaving: false });
                        Meteor.call(
                          "esUpdatePrivatePreSummaries",
                          {
                            index,
                            contributor,
                            _contributor,
                            id,
                            contribution,
                            summary,
                          },
                          (error) => {
                            console.log(
                              "updated contribution pre-summaries",
                              id,
                              error
                            );
                            if (error) {
                              this.setState({ contributionDataError: error });
                            } else {
                              Meteor.call("esUpdatePrivateSummaries", {
                                index,
                                contributor,
                                _contributor,
                                id,
                                contribution,
                                summary,
                              });
                            }
                          }
                        );
                      }
                    }
                  );
                  this.setState({
                    dataEdited: false,
                    dataSaving: true,
                    contributionData,
                  });
                  this.contributionDataEdited = undefined;
                }
              }}
            >
              {this.state.dataSaving ? "Saving" : "Save"} Edits
            </Button>
            <Button
              color="red"
              disabled={!this.state.dataEdited || this.state.dataSaving}
              onClick={() => {
                this.contributionDataEdited = undefined;
                this.setState({
                  dataEdited: false,
                  contributionData: undefined,
                  contributionDataError: undefined,
                });
              }}
            >
              Cancel Edits
            </Button>
            <Button
              onClick={() =>
                this.setState(
                  this.state.dataEdited
                    ? { showConfirmCloseEditedDataModal: true }
                    : { showDataModal: false }
                )
              }
            >
              Close
            </Button>
          </Modal.Actions>
        )}
      </Modal>
    );
  }

  renderPlateauModal() {
    if (!this.state.plateauModalData) return null;
    
    // Handle loading state in modal
    if (this.state.plateauModalData.loading) {
      const experimentName = this.state.plateauModalData.experimentName;
      const plateauResult = this.state.plateauData[experimentName];
      
      return (
        <div ref="plateau modal" className="ui fullscreen modal">
          <i className="close icon"></i>
          <div className="header">Age Plateau Analysis - {experimentName}</div>
          <div className="content" style={{ padding: "20px", height: "calc(100vh - 10em)", overflowY: "auto", overflowX: "hidden" }}>
            {plateauResult ? 
              this.renderFullPlateauPlot(plateauResult) :
              <div style={{ textAlign: "center", marginTop: "100px", fontSize: "18px", color: "#666" }}>
                Loading
                <br />
                <b>
                  Age
                  <br />
                  Plateau
                </b>
                <br />
                for experiment {experimentName}...
              </div>
            }
          </div>
        </div>
      );
    }
    
    // Handle error state in modal
    if (this.state.plateauModalData.error) {
      const experimentName = this.state.plateauModalData.experimentName;
      
      return (
        <div ref="plateau modal" className="ui fullscreen modal">
          <i className="close icon"></i>
          <div className="header">Age Plateau Analysis - {experimentName}</div>
          <div className="content" style={{ padding: "20px", height: "calc(100vh - 10em)", overflowY: "auto", overflowX: "hidden" }}>
            <div style={{ textAlign: "center", marginTop: "100px", fontSize: "18px", color: "#cc3300" }}>
              <i className="exclamation triangle icon" style={{ fontSize: "48px" }}></i>
              <br /><br />
              Error loading plateau data for experiment {experimentName}
              <br />
              <span style={{ fontSize: "14px", color: "#666" }}>
                Please check that the experiment has valid measurement data.
              </span>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div ref="plateau modal" className="ui fullscreen modal">
        <i className="close icon"></i>
        <div className="header">Age Plateau Analysis</div>
        <div className="content" style={{ padding: "20px", height: "calc(100vh - 10em)", overflowY: "auto" }}>
          {this.renderFullPlateauPlot(this.state.plateauModalData)}
        </div>
      </div>
    );
  }

  renderData(item) {
    const isPrivate =
      item.summary &&
      item.summary.contribution &&
      item.summary.contribution._is_activated !== "true";
    if (
      !this.state.contributionData &&
      item &&
      item.summary &&
      item.summary.contribution
    )
      Meteor.call(
        "esGetContribution",
        {
          index,
          id: item.summary.contribution.id,
          tables: ["samples", "specimens", "experiments", "measurements"],
        },
        (error, c) => {
          console.log("esGetContribution", error, c);
          if (!error && c) this.setState({ contributionData: c });
          else
            this.setState({
              contributionData: {},
              contributionDataError: error,
            });
        }
      );
    if (!this.state.contributionData)
      return (
        <div
          className="ui bottom attached segment"
          style={{
            overflow: "auto",
            height: `calc(100vh - ${isPrivate ? 19 : 14}em)`,
          }}
        >
          <div className="ui inverted active dimmer">
            <div className="ui text loader">Loading Contribution Data</div>
          </div>
        </div>
      );
    if (this.state.dataLoading) {
      _.delay(() => this.setState({ dataLoading: false }));
      return (
        <div
          className="ui bottom attached segment"
          style={{
            overflow: "auto",
            height: `calc(100vh - ${isPrivate ? 19 : 14}em)`,
          }}
        >
          <div className="ui inverted active dimmer">
            <div className="ui text loader">Loading Contribution Data</div>
          </div>
        </div>
      );
    }
    if (this.state.contributionDataError)
      return (
        <div
          className="ui bottom attached segment"
          style={{
            overflow: "auto",
            height: `calc(100vh - ${isPrivate ? 19 : 14}em)`,
          }}
        >
          <div className="ui error message">
            <div className="header">Contribution Data Error</div>
            <p>{this.state.contributionDataError}</p>
          </div>
        </div>
      );
    if (!this.state.contributionData[this.state.dataLevel])
      return (
        <div
          className="ui bottom attached segment"
          style={{
            overflow: "auto",
            height: `calc(100vh - ${isPrivate ? 19 : 14}em)`,
          }}
        >
          <div className="ui fluid warning message">
            <div className="ui center aligned huge basic segment">
              No Rows to Display
            </div>
          </div>
        </div>
      );
    const model = models[_.last(versions)];
    const table = model.tables[this.state.dataLevel];
    const modelColumns = _.sortBy(
      _.keys(table.columns),
      (columnName) => table.columns[columnName].position
    );
    const rowData = this.state.contributionData[this.state.dataLevel];
    const usedColumns = {};
    rowData.forEach((row) => {
      _.keys(row).forEach((column) => {
        usedColumns[column] = true;
      });
    });
    const columns = modelColumns.filter((x) => usedColumns[x]);
    return (
      <HotTable
        ref="hotTableComponent"
        className={!isPrivate ? "handsontable-readonly" : ""}
        style={{
          marginTop: -1,
          height: `calc(100vh - ${isPrivate ? 20 : 15}em)`,
          overflow: "hidden",
          backgroundColor: "#EEE",
        }}
        settings={{
          licenseKey: "non-commercial-and-evaluation",
          data: rowData,
          readOnly: !isPrivate,
          contextMenu: isPrivate,
          rowHeaders: true,
          colHeaders: columns,
          outsideClickDeselects: false,
          afterChange: (changes) => {
            if (changes) {
              const data =
                (this.refs["hotTableComponent"] &&
                  this.refs["hotTableComponent"].hotInstance.getData()) ||
                undefined;
              if (data && !this.state.dataEdited)
                this.setState({ dataEdited: true });
              this.contributionDataEdited = data;
            }
          },
        }}
      >
        {columns.map((columnName, i) => (
          <HotColumn key={i} data={columnName}></HotColumn>
        ))}
      </HotTable>
    );
  }
}

SearchSummariesListItem.propTypes = {
  table: PropTypes.oneOf([
    "contribution",
    "samples",
    "specimens",
    "experiments",
    "measurements",
  ]).isRequired,
  item: PropTypes.object,
};

export default SearchSummariesListItem;
