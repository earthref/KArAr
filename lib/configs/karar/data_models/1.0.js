/* Instructions for updating:

    1) Go to https://docs.google.com/spreadsheets/d/1l6zLUyqeJ5eC6Qc2L0rJ7kLn7YVbijkU2R0p7JUvU74 and 
      copy the JSON cells (column P row 2 to the last entry in column R).
    2) Go to https://jsonlint.com/, paste the JSON into the text area, click "Validate JSON", and 
      copy the formatted JSON.
    3) Replace the JSON starting after "'tables': " roughly on line 17 and before the "};" at the end.
    4) Update the 'updated_day' field at the beginning.

*/

export const model = {
	'updated_day': '2021:06:08',
	'published_day': '2021:03:18',
	'data_model_version': '1.0',
	'tables':{
	'contribution': {
		'label': 'Contribution',
		'position': 1,
		'description': 'Contribution metadata',
		'notes': 'DOI of the associated paper, lab names, other contribution metadata',
		'columns': {
			'id': {
				'label': 'Contribution ID',
				'group': 'Contribution',
				'position': 1,
				'type': 'Integer',
				'description': 'Unique contribution id',
				'notes': 'Written during contribution publication.',
				'examples': ['5412'],
				'validations': ['downloadOnly()']
			},
			'version': {
				'label': 'Version',
				'group': 'Contribution',
				'position': 2,
				'type': 'Integer',
				'description': 'Contribution version number',
				'notes': '1 for original contribution, 6 for latest contribution if there are 6 versions, empty if the contribution has not been published. Written during contribution publication.',
				'examples': ['1', '2', '6'],
				'validations': ['downloadOnly()']
			},
			'timestamp': {
				'label': 'Publication Timestamp',
				'group': 'Contribution',
				'position': 3,
				'type': 'Timestamp',
				'description': 'Date and time of contribution publication',
				'notes': 'ISO 8601 date and time (e.g. "yyyy-mm-ddThh:mm:ss.sssZ"). See wikipedia.org/wiki/ISO_8601 for detailed explanation.',
				'examples': ['2021-01-01T10:02:34.87', '2020-07-20T22:56:15-04:00'],
				'validations': ['downloadOnly()']
			},
			'contributor': {
				'label': 'Contributor',
				'group': 'Contribution',
				'position': 4,
				'type': 'String',
				'description': 'Contributor EarthRef handle',
				'notes': 'Written during contribution publication',
				'examples': ['@njarboe'],
				'validations': ['downloadOnly()']
			},
			'is_validated': {
				'label': 'Is Validated',
				'group': 'Contribution',
				'position': 5,
				'type': 'String',
				'unit': 'Flag',
				'description': 'Contribution has passed the data model validation',
				'examples': ['True', 'False'],
				'validations': ['cv("boolean")', 'downloadOnly()']
			},
			'is_reviewed': {
				'label': 'Is Reviewed',
				'group': 'Contribution',
				'position': 6,
				'type': 'String',
				'unit': 'Flag',
				'description': 'Contribution has been data has been reviewed',
				'examples': ['True', 'False'],
				'validations': ['cv("boolean")', 'downloadOnly()']
			},
			'data_model_version': {
				'label': 'Data Model Version',
				'group': 'Contribution',
				'position': 7,
				'type': 'String',
				'description': 'Data model version',
				'notes': 'Written during contribution publication',
				'examples': ['1.0', '1.2'],
				'validations': ['cv("KArAr_version")', 'downloadOnly()']
			},
			'reference': {
				'label': 'Contribution Reference',
				'group': 'Contribution',
				'position': 8,
				'type': 'String',
				'description': 'DOI or URL for the document describing this dataset',
				'notes': 'The DOI must resolve to a publisher or the URL to a web page',
				'examples': ['10.1029/92JB01202', '10.1023/A:1015035228810', 'https://my-university.edu/my_phd_thesis.pdf'],
				'validations': ['type("references")', 'required()']
			},
			'lab_names': {
				'label': 'Laboratory Names',
				'group': 'Contribution',
				'position': 9,
				'type': 'List',
				'description': 'List of labs (with institution and country) where the measurements in the contribution were made',
				'notes': 'Please contact KArAr if a lab needs to be added to the lab list',
				'validations': ['cv("lab_names")', 'required()']
			},
			'supplemental_links': {
				'label': 'Supplemental Data Links',
				'group': 'Contribution',
				'position': 10,
				'type': 'Dictionary',
				'description': 'Display name for the link and the DOI or permanent URL to the supplemental data',
				'examples': ['Paleointensity Data[10.7288/V4/MAGIC/19461]', 'Geochemistry Data[https://earthref.org/ERDA/192/]:PADM2M Field Model[https://earthref.org/ERDA/1138/]']
			},
			'description': {
				'label': 'Description',
				'group': 'Contribution',
				'position': 11,
				'type': 'String',
				'description': 'Contribution description and update comments',
				'examples': ['Fixes errors in latitudes and adds measurement data'],
				'validations': ['recommended()']
			}
		}
	},
	'sites': {
		'label': 'Sites',
		'position': 2,
		'description': 'Units with a common age',
		'notes': 'Age with uncertainty, location, description',
		'columns': {
			'contribution_id': {
				'label': 'Contribution ID',
				'group': 'Contribution',
				'position': 1,
				'type': 'Integer',
				'description': 'Unique KArAr contribution id',
				'notes': 'Written during contribution publication',
				'examples': ['5412'],
				'validations': ['downloadOnly()']
			},
			'site': {
				'label': 'Site Name',
				'group': 'Names',
				'position': 2,
				'type': 'String',
				'description': 'Site name or id',
				'notes': 'Site where the samples were collected that have the same age with one latitude and longitude value. Use locations to group sites with samples that have different recorded locations.',
				'examples': ['SFVP01'],
				'validations': ['key()', 'required()']
			},
			'site_alternatives': {
				'label': 'Site Name Alternatives',
				'group': 'Names',
				'position': 3,
				'type': 'List',
				'description': 'Colon-delimited list of alternative names and abbreviations',
				'notes': 'Other names this site may have. Can be useful for cross referencing other data associated with the site.'
			},
			'igsn': {
				'label': 'Site IGSN',
				'group': 'Names',
				'position': 4,
				'type': 'String',
				'description': 'International Geo Sample Number (IGSN) id for the site',
				'examples': ['SIO0A0987', 'SIO001317'],
				'validations': ['type("igsn")']
			},
			'location': {
				'label': 'Location Name',
				'group': 'Names',
				'position': 5,
				'type': 'String',
				'description': 'Name for location, dredge, or drill site',
				'notes': 'The location label for a site can be used to group sites. Use location_type to specify the type of location',
				'examples': ['San Francisco Volcanic Province', 'Dredge AMAT02-D12', 'Site 801'],
				'validations': ['required()']
			},
			'location_alternatives': {
				'label': 'Location Name Alternatives',
				'group': 'Names',
				'position': 6,
				'type': 'List',
				'description': 'Colon-delimited list of alternative names and/or abbreviations'
			},
			'location_type': {
				'label': 'Location Type',
				'group': 'Names',
				'position': 7,
				'type': 'String',
				'description': 'The group of sites location type',
				'notes': 'The location label for a site can be used to group sites. Use location_type to specify the type of location',
				'validations': ['cv("location_type")', 'required()']
			},
			'age': {
				'label': 'Age',
				'group': 'Age',
				'position': 8,
				'type': 'Number',
				'unit': 'Custom',
				'description': 'The author\'s determination of the site age',
				'notes': 'The is the "best age" for the site as determined by the author(s) with the methods and reasoning described in the paper associated with the dataset',
				'examples': ['12.43', '124.54', '23400'],
				'validations': ['required()']
			},
			'age_one_sigma_stderr': {
				'label': 'Age One Sigma Standard Error',
				'group': 'Age',
				'position': 9,
				'type': 'Number',
				'unit': 'Custom',
				'description': 'Site age uncertainty, one sigma standard error',
				'examples': ['0.23', '850'],
				'validations': ['required()']
			},
			'age_internal_one_sigma_stderr': {
				'label': 'Age Internal One Sigma Standard Error',
				'group': 'Age',
				'position': 10,
				'type': 'Number',
				'unit': 'Custom',
				'description': 'Site age uncertainty, one sigma standard error of the internal age',
				'notes': 'Uncertianties in measurements and flux monitor values, but not external uncertainties, are included.',
				'examples': ['0.23', '850']
			},
			'age_external_one_sigma_stderr': {
				'label': 'Age External One Sigma Standard Error',
				'group': 'Age',
				'position': 11,
				'type': 'Number',
				'unit': 'Custom',
				'description': 'Site age uncertainty, one sigma standard error of the external age',
				'notes': 'Uncertainties in the standard ages, decay constants, Argon rations for air, etc. are included in the uncertainty of the age.',
				'examples': ['0.212', '832']
			},
			'age_low': {
				'label': 'Younger Age',
				'group': 'Age',
				'position': 12,
				'type': 'Number',
				'unit': 'Custom',
				'description': 'Sample youngest age constraint',
				'notes': 'Used for asymetrical age uncertainties often calculated using Baysean statistics when one has additional age constraints on the age of the site.',
				'validations': ['requiredUnless("age")']
			},
			'age_high': {
				'label': 'Older Age',
				'group': 'Age',
				'position': 13,
				'type': 'Number',
				'unit': 'Custom',
				'description': 'Sample oldest age constraint. Used for asymetrical age uncertainties often calculated using Baysean statistics when one has additional age constraints on the age of the site.',
				'notes': 'Used for asymetrical age uncertainties often calculated using Baysean statistics when one has additional age constraints on the age of the site.',
				'validations': ['requiredUnless("age")']
			},
			'age_unit': {
				'label': 'Age Unit',
				'group': 'Age',
				'position': 14,
				'type': 'String',
				'description': 'Site age unit',
				'examples': ['ka', 'Ma', 'Ga', 'BP'],
				'validations': ['cv("age_unit")', 'required()']
			},
			'age_method': {
				'label': 'Age Method',
				'group': 'Age',
				'position': 15,
				'type': 'String',
				'description': 'Method by which the age of the site was determined',
				'examples': ['Plateau', 'Isochron', 'Multiple Total Fusion'],
				'validations': ['cv("age_method")', 'required()']
			},
			'age_type': {
				'label': 'Age Type',
				'group': 'Age',
				'position': 16,
				'type': 'String',
				'description': 'What the is being measured by the age',
				'examples': ['Crystalization Age', 'Reheating Event', 'Eruption Age'],
				'validations': ['cv("age_type")', 'required()']
			},
			'age_description': {
				'label': 'Age Description',
				'group': 'Age',
				'position': 17,
				'type': 'String',
				'description': 'Additional information on how the age was determined',
				'examples': ['Isochron age used due to likely fractionalization of atmospheric argon'],
				'validations': ['cv("age_type")', 'required()']
			},
			'samples': {
				'label': 'Sample Names',
				'group': 'Result',
				'position': 18,
				'type': 'List',
				'description': 'Colon-delimited list of the names of samples included in the result',
				'notes': 'If this field is left empty, its value will be determined progammatically from the dataset using result_quality field. Samples labeled bad (b)  will not be included in the list.  ',
				'examples': ['SFVP01'],
				'validations': ['in("samples.sample")']
			},
			'specimens': {
				'label': 'Specimen Names',
				'group': 'Result',
				'position': 19,
				'type': 'List',
				'description': 'Colon-delimited list of the names of specimens included in the result',
				'notes': 'If this field is left empty, its value will be determined progammatically from the dataset using result_quality field. Specimens labeled bad (b)  will not be included in the list.  ',
				'examples': ['SFVP01-01a:SFVP01-01b:SFVP01-02a'],
				'validations': ['in("specimens.specimen")']
			},
			'experiments': {
				'label': 'Experiment Names',
				'group': 'Result',
				'position': 20,
				'type': 'List',
				'description': 'Colon-delimited list of the names of experiments included in the result',
				'notes': 'If this field is left empty, its value will be determined progammatically from the dataset using result_quality field. Experiments labeled bad (b) will not be included in the list.  ',
				'examples': ['SFVP01-01a-1:SFVP01-01a-2:SFVP01-01a-3'],
				'validations': ['in("measurements.experiment")']
			},
			'result_quality': {
				'label': 'Result Quality',
				'group': 'Result',
				'position': 21,
				'type': 'String',
				'unit': 'Flag',
				'description': 'Indicating if the result good (g) or bad (b) data',
				'examples': ['g', 'b'],
				'validations': ['cv("data_quality")', 'required()']
			},
			'display_order': {
				'label': 'Display Order',
				'group': 'Result',
				'position': 22,
				'type': 'Number',
				'description': 'Order of the rows for display purposes',
				'notes': 'If this field is left empty, it will be set to the order in the uploaded file upon publication. Can be a float of either sign',
				'examples': ['1', '0', '1.2', '-4.34']
			},
			'method_codes': {
				'label': 'Method Codes',
				'group': 'Result',
				'position': 23,
				'type': 'List',
				'description': 'Colon-delimited list of method codes',
				'examples': ['GM-ARAR-PLTAU'],
				'validations': ['type("method_codes")', 'required()']
			},
			'citations': {
				'label': 'Citation DOIs',
				'group': 'Result',
				'position': 24,
				'type': 'List',
				'description': 'Colon-delimited list of citation DOIs',
				'examples': ['10.1029/92JB01202', '10.1029/2003GC000635:This study', '"10.1023/A:1015035228810":This study'],
				'validations': ['type("references")']
			},
			'geologic_classes': {
				'label': 'Geologic Classes',
				'group': 'Geology',
				'position': 25,
				'type': 'List',
				'description': 'Colon-delimited list of lithologies or archeological classifications',
				'validations': ['cv("class")', 'required()']
			},
			'geologic_types': {
				'label': 'Sample Material Types',
				'group': 'Geology',
				'position': 26,
				'type': 'List',
				'description': 'Colon-delimited list of sample material types',
				'validations': ['cv("type")', 'required()']
			},
			'lithologies': {
				'label': 'Lithologies',
				'group': 'Geology',
				'position': 27,
				'type': 'List',
				'description': 'Colon-delimited list of sample lithologies',
				'validations': ['cv("lithology")', 'required()']
			},
			'formation': {
				'label': 'Formation Name',
				'group': 'Geology',
				'position': 28,
				'type': 'String',
				'description': 'Name for formation',
				'examples': ['Tuff of Coyote Spring']
			},
			'formation_abbreviation': {
				'label': 'Formation Name Abbreviation',
				'group': 'Geology',
				'position': 29,
				'type': 'String',
				'description': 'Abbreviation for the formation name',
				'examples': ['Mics']
			},
			'member': {
				'label': 'Member Name',
				'group': 'Geology',
				'position': 30,
				'type': 'String',
				'description': 'Name for member',
				'examples': ['Glasshound Member']
			},
			'lat': {
				'label': 'Latitude',
				'group': 'Geography',
				'position': 31,
				'type': 'Number',
				'unit': 'Degrees',
				'description': 'Site latitude',
				'notes': 'Decimal degrees',
				'examples': ['-23.3546'],
				'validations': ['min(-90)', 'max(90)', 'required()']
			},
			'lat_sigma': {
				'label': 'Latitude Sigma',
				'group': 'Geography',
				'position': 32,
				'type': 'Number',
				'unit': 'Degrees',
				'description': 'Site latitude uncertainty at one sigma',
				'notes': 'Decimal degrees',
				'examples': ['0.00055'],
				'validations': ['min(0)', 'max(180)']
			},
			'lon': {
				'label': 'Longitude',
				'group': 'Geography',
				'position': 33,
				'type': 'Number',
				'unit': 'Degrees',
				'description': 'Site longitude',
				'notes': 'Decimal degrees',
				'examples': ['276.93165'],
				'validations': ['min(0)', 'max(360)', 'required()']
			},
			'lon_sigma': {
				'label': 'Longitude Sigma',
				'group': 'Geography',
				'position': 34,
				'type': 'Number',
				'unit': 'Degrees',
				'description': 'Site geographic location longitude uncertainty at one sigma',
				'notes': 'Decimal degrees',
				'examples': ['0.00034'],
				'validations': ['min(0)', 'max(360)']
			},
			'geographic_precision': {
				'label': 'Geographic Precision',
				'group': 'Geography',
				'position': 35,
				'type': 'Number',
				'unit': 'Degrees',
				'description': 'Precision in latitude and longitude',
				'notes': 'Decimal degrees',
				'examples': ['0.0075'],
				'validations': ['min(0)', 'max(360)']
			},
			'continent_ocean': {
				'label': 'Continent or Ocean Name',
				'group': 'Geography',
				'position': 36,
				'type': 'String',
				'description': 'Continent or ocean name',
				'examples': ['North America', 'Africa', 'Pacific Ocean', 'Arctic Ocean'],
				'validations': ['cv("continent_ocean")']
			},
			'country': {
				'label': 'Country Name',
				'group': 'Geography',
				'position': 37,
				'type': 'String',
				'description': 'Country name',
				'examples': ['Nepal', 'Peru', 'Switzerland', 'United States of America'],
				'validations': ['cv("country")']
			},
			'state_province': {
				'label': 'State or Province Name',
				'group': 'Geography',
				'position': 38,
				'type': 'String',
				'description': 'State or province name',
				'examples': ['California', 'Alberta', 'Chongqing', 'Minas Gerais'],
				'validations': ['cv("state_province")']
			},
			'ocean_sea': {
				'label': 'Ocean or Sea Name',
				'group': 'Geography',
				'position': 39,
				'type': 'String',
				'description': 'Ocean or sea name',
				'examples': ['Adriatic Sea', 'English Channel', 'Red Sea', 'Pacific Ocean'],
				'validations': ['cv("ocean_sea")']
			},
			'order': {
				'label': 'Stratigraphic Order',
				'group': 'Geography',
				'position': 40,
				'type': 'Integer',
				'description': 'Order in the stratigraphic section',
				'notes': 'Lower number for younger age.'
			},
			'height': {
				'label': 'Stratigraphic Height',
				'group': 'Geography',
				'position': 41,
				'type': 'Number',
				'unit': 'm',
				'description': 'Stratigraphic height',
				'notes': 'Positive is up in section or core, while negative is down relative to reference height'
			},
			'elevation': {
				'label': 'Elevation',
				'group': 'Geography',
				'position': 42,
				'type': 'Number',
				'unit': 'm',
				'description': 'Site geographic location. Elevation relative to sealevel',
				'notes': 'Meters above sealevel'
			},
			'core_depth': {
				'label': 'Core Depth',
				'group': 'Geography',
				'position': 43,
				'type': 'Number',
				'unit': 'm',
				'description': 'Site geographic location. Core depth below seafloor/lake bottom or surface',
				'notes': 'Meters below seafloor'
			},
			'composite_depth': {
				'label': 'Composite Depth',
				'group': 'Geography',
				'position': 44,
				'type': 'Number',
				'unit': 'm',
				'description': 'Site geographic location. Composite below seafloor/lake bottom or surface',
				'notes': 'Meters below seafloor'
			},
			'description': {
				'label': 'Description',
				'group': 'Metadata',
				'position': 45,
				'type': 'String',
				'description': 'Site and result description and comments'
			},
			'instrument_codes': {
				'label': 'Instrument Codes',
				'group': 'Metadata',
				'position': 46,
				'type': 'List',
				'description': 'Colon-delimited list of instrument codes',
				'validations': ['sv("instrument_code")']
			},
			'software_packages': {
				'label': 'Software Packages',
				'group': 'Metadata',
				'position': 47,
				'type': 'List',
				'description': 'Colon-delimited list of software used for data reduction',
				'examples': ['Mass Spec 5.02', ' ArArCALC v2.5.2']
			},
			'external_results': {
				'label': 'External Results',
				'group': 'Metadata',
				'position': 48,
				'type': 'Matrix',
				'description': 'List of external values associated with a site. Used when external values cannot be linked to other samples\' properties via IGSN',
				'notes': 'Results are in the form of key:value:reference;key2:value2:reference2. Keys are from a controlled vocabulary, values are strings, and references should be a DOI or URL.',
				'examples': ['DELTA-O18-SMOW:4.2:10.1126/science.1059412;DELTA-C13-PDB:0.22:10.1126/science.1059412'],
				'validations': ['cv("external_result")']
			},
			'scientists': {
				'label': 'Research Scientist Names',
				'group': 'Metadata',
				'position': 49,
				'type': 'List',
				'description': 'Colon-delimited list of EarthRef handles or ORCIDs or names and emails for scientists who described the site',
				'examples': ['@user1:@user2:0000-0002-9000-2100:Not A. Member <no.earthref.handle@gmail.com>'],
				'validations': ['type("users")']
			},
			'analysts': {
				'label': 'Analyst Names',
				'group': 'Metadata',
				'position': 50,
				'type': 'List',
				'description': 'Colon-delimited list of EarthRef handles, ORCIDs, or names and emails for scientists who described the sample',
				'examples': ['@user1:@user2:0000-0002-9000-2100:Not A. Member <no.earthref.handle@gmail.com>'],
				'validations': ['type("users")']
			}
		}
	},
	'samples': {
		'label': 'Samples',
		'position': 3,
		'description': 'Samples from a unique site ',
		'notes': 'Field samples or discrete samples from a section of core',
		'columns': {
			'contribution_id': {
				'label': 'Contribution ID',
				'group': 'Contribution',
				'position': 1,
				'type': 'Integer',
				'description': 'Unique KArAr Contribution ID',
				'notes': 'Written during contribution publication',
				'examples': ['5412'],
				'validations': ['downloadOnly()']
			},
			'sample': {
				'label': 'Sample Name',
				'group': 'Names',
				'position': 2,
				'type': 'String',
				'description': 'Name for sample',
				'examples': ['SFVP01-03'],
				'validations': ['key()', 'required()']
			},
			'sample_alternatives': {
				'label': 'Sample Name Alternatives',
				'group': 'Names',
				'position': 3,
				'type': 'List',
				'description': 'Colon-delimited list of alternative names and abbreviations'
			},
			'site': {
				'label': 'Site Name',
				'group': 'Names',
				'position': 4,
				'type': 'String',
				'description': 'Name for site',
				'examples': ['SFVP01'],
				'validations': ['in("sites.site")']
			},
			'igsn': {
				'label': 'Sample IGSN',
				'group': 'Names',
				'position': 5,
				'type': 'String',
				'description': 'International Geo Sample Number (IGSN) of the sample',
				'examples': ['JEALM9616', 'IESS10095'],
				'validations': ['type("igsn")']
			},
			'age': {
				'label': 'Age',
				'group': 'Age',
				'position': 6,
				'type': 'Number',
				'unit': 'Custom',
				'description': 'Sample age',
				'validations': ['requiredUnless("age_younger","age_older")', 'requiredIf("age_sigma")']
			},
			'age_one_sigma_stderr': {
				'label': 'Age One Sigma Standard Error',
				'group': 'Age',
				'position': 7,
				'type': 'Number',
				'unit': 'Custom',
				'description': 'Sample age standard error, one sigma',
				'validations': ['min(0)']
			},
			'age_unit': {
				'label': 'Age Unit',
				'group': 'Age',
				'position': 8,
				'type': 'String',
				'description': 'Sample age, unit',
				'validations': ['cv("age_unit")', 'required()']
			},
			'timestamp': {
				'label': 'Sampling Timestamp',
				'group': 'Result',
				'position': 9,
				'type': 'Timestamp',
				'description': 'Field sampling date and time',
				'notes': 'ISO 8601 date and time (e.g. "yyyy-mm-ddThh:mm:ss.sssZ"). See wikipedia.org/wiki/ISO_8601 for detailed explanation',
				'examples': ['2021-01-01T10:02:34.87', '2020-07-20T22:56:15-04:00'],
				'validations': ['type("date_time")']
			},
			'specimens': {
				'label': 'Specimen Name',
				'group': 'Result',
				'position': 10,
				'type': 'List',
				'description': 'Colon-delimited list of the names of specimens included in the result',
				'examples': ['SFVP01-03a:SFVP01-03b'],
				'validations': ['in("specimens.specimen")']
			},
			'experiments': {
				'label': 'Experiment Name',
				'group': 'Result',
				'position': 11,
				'type': 'List',
				'description': 'Colon-delimited list of the names of experiments included in the result',
				'examples': ['SFVP01-03a-150:SFVP01-03b-400'],
				'validations': ['in("measurements.experiment")']
			},
			'result_quality': {
				'label': 'Result Quality',
				'group': 'Result',
				'position': 12,
				'type': 'String',
				'unit': 'Flag',
				'description': 'Indicating if good (g) or bad (b) data',
				'notes': 'Can be left empty. This is the case for many legacy data sets. It is assumed that, if empty, the result was good',
				'examples': ['g', 'b'],
				'validations': ['cv("data_quality")', 'required()']
			},
			'method_codes': {
				'label': 'Method Codes',
				'group': 'Result',
				'position': 13,
				'type': 'List',
				'description': 'Colon-delimited list of method codes',
				'validations': ['type("method_codes")', 'required()']
			},
			'display_order': {
				'label': 'Display Order',
				'group': 'Result',
				'position': 14,
				'type': 'Number',
				'description': 'Order of the rows for display purposes',
				'notes': 'If not set at upload will be set to the order in the uploaded file. Can be a float of either sign.',
				'examples': ['1', '0', '1.2', '-4.34']
			},
			'citations': {
				'label': 'Citation DOIs',
				'group': 'Result',
				'position': 15,
				'type': 'List',
				'description': 'Colon-delimited list of citation DOIs',
				'examples': ['10.1029/92JB01202', '10.1029/2003GC000635:This study', '"10.1023/A:1015035228810":This study'],
				'validations': ['type("references")']
			},
			'settings': {
				'label': 'Settings',
				'group': 'Geology',
				'position': 16,
				'type': 'List',
				'description': 'Colon-delimited list of geologic, archeological, or astronomical settings',
				'examples': ['Igneous', 'Sedimentary', 'Submarine', 'Lunar', 'Archeologic'],
				'validations': ['cv("class")']
			},
			'material_types': {
				'label': 'Sample Material Types',
				'group': 'Geology',
				'position': 17,
				'type': 'List',
				'description': 'Colon-delimited list of sample material types',
				'examples': ['Pluton', 'Lava Flow', 'Amphora', 'Volcanic Glass', 'Tuff'],
				'validations': ['cv("type")']
			},
			'lithologies': {
				'label': 'Lithologies',
				'group': 'Geology',
				'position': 18,
				'type': 'List',
				'description': 'Colon-delimited list of lithologies or archeological classifications',
				'examples': ['Chalk', 'Felsite', 'Granite', 'H Ordinary Chondrite', 'Organic Silt'],
				'validations': ['cv("lithology")']
			},
			'lat': {
				'label': 'Latitude',
				'group': 'Geography',
				'position': 19,
				'type': 'Number',
				'unit': 'Degrees',
				'description': 'Sample geographic location, Latitude',
				'notes': 'Decimal degrees',
				'examples': ['11.4', '-23.3546'],
				'validations': ['min(-90)', 'max(90)']
			},
			'lat_sigma': {
				'label': 'Latitude Sigma',
				'group': 'Geography',
				'position': 20,
				'type': 'Number',
				'unit': 'Degrees',
				'description': 'Sample geographic location averaging uncertainty, Latitude',
				'notes': 'Decimal degrees',
				'examples': ['0.00055'],
				'validations': ['min(0)', 'max(180)']
			},
			'lon': {
				'label': 'Longitude',
				'group': 'Geography',
				'position': 21,
				'type': 'Number',
				'unit': 'Degrees',
				'description': 'Sample geographic location, Longitude',
				'notes': 'Decimal degrees',
				'examples': ['13.6', '276.93165'],
				'validations': ['min(0)', 'max(360)']
			},
			'lon_sigma': {
				'label': 'Longitude Sigma',
				'group': 'Geography',
				'position': 22,
				'type': 'Number',
				'unit': 'Degrees',
				'description': 'Sample geographic location averaging uncertainty, Longitude',
				'notes': 'Decimal degrees',
				'examples': ['0.00034'],
				'validations': ['min(0)', 'max(360)']
			},
			'lat_lon_precision': {
				'label': 'Geographic Precision',
				'group': 'Geography',
				'position': 23,
				'type': 'Number',
				'unit': 'Degrees',
				'description': 'Sample geographic location, Precision in latitude and longitude',
				'notes': 'Decimal degrees',
				'examples': ['0.1'],
				'validations': ['min(0)', 'max(360)']
			},
			'height': {
				'label': 'Stratigraphic Height',
				'group': 'Geography',
				'position': 24,
				'type': 'Number',
				'unit': 'm',
				'description': 'Sample geographic location, Stratigraphic height',
				'notes': 'Positive is up in section or core, while negative is down relative to reference height',
				'examples': ['1945', '234.6', '-45.3']
			},
			'description': {
				'label': 'Description',
				'group': 'Metadata',
				'position': 25,
				'type': 'String',
				'description': 'Sample and result description and comments',
				'examples': ['This sample was taken 130 cm from a 40 cm thick dike']
			},
			'instrument_codes': {
				'label': 'Instrument Codes',
				'group': 'Metadata',
				'position': 26,
				'type': 'List',
				'description': 'Colon-delimited list of instrument codes',
				'validations': ['sv("instrument_code")']
			},
			'software_packages': {
				'label': 'Software Packages',
				'group': 'Metadata',
				'position': 27,
				'type': 'List',
				'description': 'Colon-delimited list of software used for data reduction',
				'examples': ['Mass Spec 5.02', ' ArArCALC v2.5.2']
			},
			'source_dataset': {
				'label': 'Source Dataset',
				'group': 'Metadata',
				'position': 28,
				'type': 'String',
				'description': 'Data DOI or URL pointing to the source of the dataset if KArAr is not the Antarctica copy of the data',
				'examples': ['Geochron[IESS10095]'],
				'validations': ['cv("database_name")']
			},
			'scientists': {
				'label': 'Research Scientist Names',
				'group': 'Metadata',
				'position': 29,
				'type': 'List',
				'description': 'Colon-delimited list of EarthRef handles, ORCIDs, or names and emails for scientists who described the sample',
				'examples': ['@user1:@user2:0000-0002-9000-2100:Not A. Member <no.earthref.handle@gmail.com>'],
				'validations': ['type("users")']
			},
			'analysts': {
				'label': 'Analyst Names',
				'group': 'Metadata',
				'position': 30,
				'type': 'List',
				'description': 'Colon-delimited list of EarthRef handles, ORCIDs, or names and emails for scientists who described the sample',
				'examples': ['@user1:@user2:0000-0002-9000-2100:Not A. Member <no.earthref.handle@gmail.com>'],
				'validations': ['type("users")']
			}
		}
	},
	'specimens': {
		'label': 'Specimens',
		'position': 4,
		'description': 'Sub-samples being measured',
		'notes': 'Interpretations of measurements, depth position of measurements in the core section',
		'columns': {
			'contribution_id': {
				'label': 'Contribution ID',
				'group': 'Contribution',
				'position': 1,
				'type': 'Integer',
				'description': 'Unique contribution id',
				'notes': 'Written during contribution publication',
				'examples': ['5412'],
				'validations': ['downloadOnly()']
			},
			'specimen': {
				'label': 'Specimen Name',
				'group': 'Names',
				'position': 2,
				'type': 'String',
				'description': 'Name for specimen',
				'examples': ['SFVP01-01a'],
				'validations': ['key()', 'required()']
			},
			'specimen_alternatives': {
				'label': 'Specimen Name Alternatives',
				'group': 'Names',
				'position': 3,
				'type': 'List',
				'description': 'Colon-delimited list of alternative names and abbreviations',
				'examples': ['awr-2-1']
			},
			'sample': {
				'label': 'Sample Name',
				'group': 'Names',
				'position': 4,
				'type': 'String',
				'description': 'The name of the sample the specimen came from',
				'examples': ['SFVP01-01'],
				'validations': ['required()']
			},
			'project': {
				'label': 'Project',
				'group': 'Names',
				'position': 5,
				'type': 'List',
				'description': 'Name of the project the specimen is a part of.',
				'examples': ['Lisa Tauxe - Antarctica dry valleys volcanics']
			},
			'age': {
				'label': 'Age',
				'group': 'Age',
				'position': 6,
				'type': 'Number',
				'unit': 'Custom',
				'description': 'Specimen age',
				'validations': ['required()']
			},
			'age_one_sigma_stderr': {
				'label': 'Age One Sigma Standard Error',
				'group': 'Age',
				'position': 7,
				'type': 'Number',
				'unit': 'Custom',
				'description': 'Specimen age standard error, one sigma',
				'notes': 'Standard error at one sigma',
				'validations': ['min(0)', 'required()']
			},
			'age_unit': {
				'label': 'Age Unit',
				'group': 'Age',
				'position': 8,
				'type': 'String',
				'description': 'Specimen age unit',
				'validations': ['cv("age_unit")', 'required()']
			},
			'stnd_name': {
				'label': 'Age Standard Name',
				'group': 'Age Standard',
				'position': 9,
				'type': 'String',
				'description': 'Name of the irradiation age standard',
				'validations': ['required()']
			},
			'stnd_ref': {
				'label': 'Reference DOI',
				'group': 'Age Standard',
				'position': 10,
				'type': 'String',
				'description': 'DOI for the reference describing the age standard ',
				'validations': ['required()']
			},
			'stnd_material': {
				'label': 'Standard Material',
				'group': 'Age Standard',
				'position': 11,
				'type': 'String',
				'description': 'Material of the age standard',
				'validations': ['required()']
			},
			'stnd_age': {
				'label': 'Standard Age',
				'group': 'Age Standard',
				'position': 12,
				'type': 'Number',
				'unit': 'Custom',
				'description': 'Age of the age standard',
				'examples': ['Sandine', 'Biotite'],
				'validations': ['required()']
			},
			'stnd_age_one_sigma': {
				'label': 'Standard Age Error',
				'group': 'Age Standard',
				'position': 13,
				'type': 'Number',
				'unit': 'Custom',
				'description': 'Standard error of the age of the age standard at one sigma',
				'validations': ['required()']
			},
			'stnd_age_unit': {
				'label': 'Standard Age Unit',
				'group': 'Age Standard',
				'position': 14,
				'type': 'String',
				'description': 'Unit of the age of the age standard',
				'validations': ['cv("age_unit")', 'required()']
			},
			'stnd_decay_con_40ar_tot': {
				'label': 'Total ⁴⁰Ar Decay Constant',
				'group': 'Age Standard',
				'position': 15,
				'type': 'Number',
				'unit': '1/a',
				'description': 'Decay constant for total ⁴⁰Ar',
				'validations': ['required()']
			},
			'stnd_decay_con_40ar_tot_one_sigma': {
				'label': 'Total ⁴⁰Ar Decay Constant Uncertainty',
				'group': 'Age Standard',
				'position': 16,
				'type': 'Number',
				'unit': '1/a',
				'description': 'One sigma uncertainty in the decay constant for total ⁴⁰Ar',
				'validations': ['required()']
			},
			'stnd_decay_con_40ar_beta': {
				'label': '⁴⁰Ar Beta Decay Constant',
				'group': 'Age Standard',
				'position': 17,
				'type': 'Number',
				'unit': '1/a',
				'description': 'Decay constant for ⁴⁰Ar beta decay',
				'validations': ['required()']
			},
			'stnd_decay_con_40ar_beta_one_sigma': {
				'label': '⁴⁰Ar Beta Decay Constant Uncertainty',
				'group': 'Age Standard',
				'position': 18,
				'type': 'Number',
				'unit': '1/a',
				'description': 'One sigma uncertainty in the decay constant for ⁴⁰Ar beta decay',
				'validations': ['required()']
			},
			'stnd_decay_con_40ar_elect': {
				'label': '⁴⁰Ar Electron Decay Constant',
				'group': 'Age Standard',
				'position': 19,
				'type': 'Number',
				'unit': '1/a',
				'description': 'Decay constant for ⁴⁰Ar electron decay',
				'validations': ['required()']
			},
			'stnd_decay_con_40ar_elect_one_sigma': {
				'label': '⁴⁰Ar Electron Decay Constant',
				'group': 'Age Standard',
				'position': 20,
				'type': 'Number',
				'unit': '1/a',
				'description': 'Uncertainty in the decay constant for ⁴⁰Ar electron decay',
				'validations': ['required()']
			},
			'j_value': {
				'label': 'J Value',
				'group': 'Age Standard',
				'position': 21,
				'type': 'Number',
				'description': 'J value of the age determination',
				'notes': 'J is the irradiation flux parameter with its value determined from measuring the ratio of radiogentic ⁴⁰Ar to ³⁹Ar generated by potassium decay from a specimen of known age (the age standard)',
				'validations': ['required()']
			},
			'j_value_one_sigma': {
				'label': 'J Value One Sigma',
				'group': 'Age Standard',
				'position': 22,
				'type': 'Number',
				'description': 'One sigma standard uncertainty of the J value',
				'validations': ['required()']
			},
			'material': {
				'label': 'Specimen Material',
				'group': 'Specimen',
				'position': 23,
				'type': 'String',
				'description': 'The type of material of the specimen',
				'examples': ['Mineral'],
				'validations': ['required()']
			},
			'mineral_name': {
				'label': 'Specimen Mineral Name',
				'group': 'Specimen',
				'position': 24,
				'type': 'String',
				'description': 'The mineral composition of the specimen, if applicable',
				'examples': ['Plagioclase'],
				'validations': ['required()']
			},
			'treatment': {
				'label': 'Treatment',
				'group': 'Specimen',
				'position': 25,
				'type': 'String',
				'description': 'Treatment of the specimen',
				'examples': ['1x leach + 15min HF'],
				'validations': ['required()']
			},
			'grain_size_small': {
				'label': 'Smallest Grain Size',
				'group': 'Specimen',
				'position': 26,
				'type': 'Number',
				'unit': 'μm',
				'description': 'Lower limit on grain diameter',
				'examples': ['50'],
				'validations': ['required()']
			},
			'grain_size_large': {
				'label': 'Largest Grain Size',
				'group': 'Specimen',
				'position': 27,
				'type': 'String',
				'unit': 'μm',
				'description': 'Upper limit on grain diameter',
				'examples': ['100'],
				'validations': ['required()']
			},
			'weight': {
				'label': 'Specimen Weight',
				'group': 'Specimen',
				'position': 28,
				'type': 'Number',
				'unit': 'mg',
				'description': 'Weight of the specimen',
				'examples': ['SFVP01-01a'],
				'validations': ['required()']
			},
			'igsn': {
				'label': 'Specimen IGSN',
				'group': 'Specimen',
				'position': 29,
				'type': 'String',
				'description': 'International Geo Sample Number (IGSN) for the specimen',
				'examples': ['SIO0A0987', 'SIO001317'],
				'validations': ['type("igsn")', 'required()']
			},
			'result_quality': {
				'label': 'Result Quality',
				'group': 'Result',
				'position': 30,
				'type': 'String',
				'unit': 'Flag',
				'description': 'Indicating if good (g) or bad (b) data',
				'notes': 'Can be left empty. This is the case for most legacy data sets.',
				'validations': ['cv("data_quality")', 'required()']
			},
			'method_codes': {
				'label': 'Method Codes',
				'group': 'Result',
				'position': 31,
				'type': 'List',
				'description': 'Colon-delimited list of method codes',
				'validations': ['type("method_codes")', 'required()']
			},
			'display_order': {
				'label': 'Display Order',
				'group': 'Result',
				'position': 32,
				'type': 'Number',
				'description': 'Order of the rows for display purposes. If not set at upload will be set to the order in the uploaded file. Can be a float of either sign.',
				'examples': ['1', '0', '1.2', '-4.34']
			},
			'citations': {
				'label': 'Citation DOIs',
				'group': 'Result',
				'position': 33,
				'type': 'List',
				'description': 'Colon-delimited list of citation DOIs',
				'examples': ['10.1029/92JB01202', '10.1029/2003GC000635:This study', '"10.1023/A:1015035228810":This study'],
				'validations': ['type("references")']
			},
			'geologic_classes': {
				'label': 'Geologic Classes',
				'group': 'Geology',
				'position': 34,
				'type': 'List',
				'description': 'Colon-delimited list of geologic classes',
				'validations': ['cv("class")']
			},
			'geologic_types': {
				'label': 'Sample Material Types',
				'group': 'Geology',
				'position': 35,
				'type': 'List',
				'description': 'Colon-delimited list of sample material types',
				'validations': ['cv("type")']
			},
			'lithologies': {
				'label': 'Lithologies',
				'group': 'Geology',
				'position': 36,
				'type': 'List',
				'description': 'Colon-delimited list of lithologies or archeological classifications',
				'validations': ['cv("lithology")']
			},
			'description': {
				'label': 'Description',
				'group': 'Metadata',
				'position': 37,
				'type': 'String',
				'description': 'Specimen and result description and comments'
			},
			'instrument_codes': {
				'label': 'Instrument Codes',
				'group': 'Metadata',
				'position': 38,
				'type': 'List',
				'description': 'Colon-delimited list of instrument codes',
				'validations': ['sv("instrument_code")']
			},
			'software_packages': {
				'label': 'Software Packages',
				'group': 'Metadata',
				'position': 39,
				'type': 'List',
				'description': 'Colon-delimited list of software used for data reduction',
				'examples': ['PmagPy v1.67b', 'FORCinel v1.11']
			},
			'external_database_ids': {
				'label': 'External Database IDs',
				'group': 'Metadata',
				'position': 40,
				'type': 'Dictionary',
				'description': 'Dictionary of external databases and IDs where data are used',
				'examples': ['GEOMAGIA50[1435]:CALS7K.2[23]', 'ARCHEO00[2329]', 'ARCHEO00[] if the ID is unknown'],
				'validations': ['cv("database_name")']
			},
			'scientists': {
				'label': 'Research Scientist Names',
				'group': 'Metadata',
				'position': 41,
				'type': 'List',
				'description': 'Colon-delimited list of EarthRef handles or ORCIDs or names and emails for scientists who described the specimen',
				'examples': ['@user1:@user2:0000-0002-9000-2100:Not A. Member <no.earthref.handle@gmail.com>'],
				'validations': ['type("users")']
			},
			'analysts': {
				'label': 'Analyst Names',
				'group': 'Metadata',
				'position': 42,
				'type': 'List',
				'description': 'Colon-delimited list of EarthRef handles, ORCIDs, or names and emails for scientists who described the sample',
				'examples': ['@user1:@user2:0000-0002-9000-2100:Not A. Member <no.earthref.handle@gmail.com>'],
				'validations': ['type("users")']
			}
		}
	},
	'experiments': {
		'label': 'Experiments',
		'position': 5,
		'description': 'Experiments',
		'notes': '',
		'columns': {
			'contribution_id': {
				'label': 'Contribution ID',
				'group': 'Contribution',
				'position': 1,
				'type': 'Integer',
				'description': 'Unique contribution id',
				'notes': 'Written during contribution publication',
				'examples': ['5412'],
				'validations': ['downloadOnly()']
			},
			'experiment': {
				'label': 'Experiment Name',
				'group': 'Names',
				'position': 2,
				'type': 'String',
				'description': 'Unique experiment identifier',
				'notes': 'A group of step-heating measurements or total fusion measurements to determine an age of a specimen',
				'examples': ['14D26122'],
				'validations': ['key()', 'required()', 'unique()']
			},
			'irrad_name': {
				'label': 'Irradiation Name',
				'group': 'Irradiation',
				'position': 3,
				'type': 'String',
				'description': 'Irradiation Name',
				'examples': ['14-OSU-02']
			},
			'irrad_reactor_name': {
				'label': 'Irradiation Reactor Name',
				'group': 'Irradiation',
				'position': 4,
				'type': 'String',
				'description': 'Irradiation Reactor Name',
				'examples': ['OSU TRIGA'],
				'validations': ['cv("reactor_name")', 'required()']
			},
			'irrad_total_duration': {
				'label': 'Irradiation Total Duration',
				'group': 'Irradiation',
				'position': 5,
				'type': 'Number',
				'unit': 'hr',
				'description': 'Total Irradiation Duration In Hours',
				'examples': ['5.5'],
				'validations': ['min(0)']
			},
			'irrad_end_timestamp': {
				'label': 'Irradiation End Timestamp',
				'group': 'Irradiation',
				'position': 6,
				'type': 'Timestamp',
				'description': 'ISO 8601 date and time (e.g. "yyyy-mm-ddThh:mm:ss.sssZ")',
				'examples': ['2021-01-01T10:02:34.87', '2020-07-20T22:56:15-04:00']
			},
			'experiment_type': {
				'label': 'Experiment Type',
				'group': 'Experiment',
				'position': 7,
				'type': 'String',
				'description': 'Type of experiment performed',
				'examples': ['Incremental Heating'],
				'validations': ['cv("experiment_type")']
			},
			'weighted_plateau_40ar_39ar_ratio': {
				'label': 'Weighted Plateau ⁴⁰Ar/³⁹Ar Ratio',
				'group': 'Age',
				'position': 8,
				'type': 'Number',
				'description': 'Weighted plateau ⁴⁰Ar/³⁹Ar ratio',
				'examples': ['0.3278178096'],
				'validations': ['required()']
			},
			'weighted_plateau_40ar_39ar_ratio_sigma': {
				'label': 'Weighted Plateau ⁴⁰Ar/³⁹Ar Ratio Sigma',
				'group': 'Age',
				'position': 9,
				'type': 'Number',
				'description': 'Weighted plateau ⁴⁰Ar/³⁹Ar ratio sigma',
				'examples': ['1.63E-03'],
				'validations': ['required()']
			},
			'weighted_plateau_age': {
				'label': 'Weighted Plateau Age',
				'group': 'Age',
				'position': 10,
				'type': 'Number',
				'description': 'Weighted plateau age',
				'examples': ['0.9287'],
				'validations': ['required()']
			},
			'weighted_plateau_age_sigma': {
				'label': 'Weighted Plateau Age Sigma',
				'group': 'Age',
				'position': 11,
				'type': 'Number',
				'description': 'Weighted plateau age sigma',
				'examples': ['0.0046'],
				'validations': ['required()']
			},
			'weighted_plateau_age_sigma_internal': {
				'label': 'Weighted Plateau Age Sigma Internal',
				'group': 'Age',
				'position': 12,
				'type': 'Number',
				'description': 'Weighted plateau age sigma internal',
				'examples': ['0.0049'],
				'validations': ['required()']
			},
			'weighted_plateau_age_sigma_external': {
				'label': 'Weighted Plateau Age Sigma External',
				'group': 'Age',
				'position': 13,
				'type': 'Number',
				'description': 'Weighted plateau age sigma external',
				'examples': ['0.0115'],
				'validations': ['required()']
			},
			'weighted_plateau_k_ca_ratio': {
				'label': 'Weighted Plateau K Ca Ratio',
				'group': 'Age',
				'position': 14,
				'type': 'Number',
				'description': 'Weighted plateau K Ca ratio',
				'examples': ['2.99E-02'],
				'validations': ['required()']
			},
			'weighted_plateau_k_ca_ratio_sigma': {
				'label': 'Weighted Plateau K Ca Ratio Sigma',
				'group': 'Age',
				'position': 15,
				'type': 'Number',
				'description': 'Weighted plateau K Ca ratio sigma',
				'examples': ['5.93E-03'],
				'validations': ['required()']
			},
			'weighted_plateau_mswd': {
				'label': 'Weighted Plateau MSWD',
				'group': 'Age',
				'position': 16,
				'type': 'Number',
				'description': 'Weighted plateau MSWD',
				'examples': ['1.648885685'],
				'validations': ['required()']
			},
			'weighted_plateau_error_magnification': {
				'label': 'Weighted Plateau Error Magnification',
				'group': 'Age',
				'position': 17,
				'type': 'Number',
				'description': 'Weighted plateau error magnification',
				'examples': ['1'],
				'validations': ['required()']
			},
			'weighted_plateau_width': {
				'label': 'Weighted Plateau Width',
				'group': 'Age',
				'position': 18,
				'type': 'Number',
				'description': 'Weighted plateau width',
				'examples': ['71.25573562'],
				'validations': ['required()']
			},
			'weighted_plateau_n': {
				'label': 'Weighted Plateau N',
				'group': 'Age',
				'position': 19,
				'type': 'Integer',
				'description': 'Number of steps in the weighted plateau',
				'examples': ['20'],
				'validations': ['required()']
			},
			'weighted_plateau_steps': {
				'label': 'Weighted Plateau Steps',
				'group': 'Age',
				'position': 20,
				'type': 'String',
				'description': 'Ordered list of plateau step measurement names',
				'examples': ['14D26130:14D26132:14D26133:14D26135:14D26136:14D26138:14D26141:14D26144:14D26145:14D26147:14D26148:14D26150:14D26151:14D26153:14D26154'],
				'validations': ['required()']
			},
			'total_gas_fusion_40ar_39ar_ratio': {
				'label': 'Total Gas Fusion ⁴⁰Ar/³⁹Ar Ratio',
				'group': 'Age',
				'position': 21,
				'type': 'Number',
				'description': 'Total gas fusion ⁴⁰Ar/³⁹Ar ratio',
				'examples': ['0.3550411687'],
				'validations': ['required()']
			},
			'total_gas_fusion_40ar_39ar_ratio_sigma': {
				'label': 'Total Gas Fusion ⁴⁰Ar/³⁹Ar Ratio Sigma',
				'group': 'Age',
				'position': 22,
				'type': 'Number',
				'description': 'Total gas fusion ⁴⁰Ar/³⁹Ar ratio sigma',
				'examples': ['2.12E-03'],
				'validations': ['required()']
			},
			'total_gas_fusion_age': {
				'label': 'Total Gas Fusion Age',
				'group': 'Age',
				'position': 23,
				'type': 'Number',
				'description': 'Total gas fusion age',
				'examples': ['1.0058'],
				'validations': ['required()']
			},
			'total_gas_fusion_age_sigma': {
				'label': 'Total Gas Fusion Age Sigma',
				'group': 'Age',
				'position': 24,
				'type': 'Number',
				'description': 'Total gas fusion age sigma',
				'examples': ['0.006'],
				'validations': ['required()']
			},
			'total_gas_fusion_age_sigma_internal': {
				'label': 'Total Gas Fusion Age Sigma Internal',
				'group': 'Age',
				'position': 25,
				'type': 'Number',
				'description': 'Total gas fusion age sigma internal',
				'examples': ['0.0062'],
				'validations': ['required()']
			},
			'total_gas_fusion_age_sigma_external': {
				'label': 'Total Gas Fusion Age Sigma External',
				'group': 'Age',
				'position': 26,
				'type': 'Number',
				'description': 'Total gas fusion age sigma external',
				'examples': ['0.0129'],
				'validations': ['required()']
			},
			'total_gas_fusion_k_ca_ratio': {
				'label': 'Total Gas Fusion K Ca Ratio',
				'group': 'Age',
				'position': 27,
				'type': 'Number',
				'description': 'Total gas fusion K Ca ratio',
				'examples': ['0.1201469939'],
				'validations': ['required()']
			},
			'total_gas_fusion_k_ca_ratio_sigma': {
				'label': 'Total Gas Fusion K Ca Ratio Sigma',
				'group': 'Age',
				'position': 28,
				'type': 'Number',
				'description': 'Total gas fusion K Ca ratio sigma',
				'examples': ['3.78E-04'],
				'validations': ['required()']
			},
			'total_gas_fusion_n': {
				'label': 'Total Gas Fusion N',
				'group': 'Age',
				'position': 29,
				'type': 'Integer',
				'description': 'Number of steps in the total gas fusion',
				'examples': ['34'],
				'validations': ['required()']
			},
			'total_gas_fusion_steps': {
				'label': 'Total Gas Fusion Steps',
				'group': 'Age',
				'position': 30,
				'type': 'String',
				'description': 'Ordered list of total gas fusion step names',
				'examples': ['14D26123:14D26125:14D26126:14D26127:14D26129:14D26130:14D26132:14D26133:14D26135:14D26136:14D26138:14D26139:14D26141:14D26142:14D26144:14D26145:14D26147:14D26148:14D26150:14D26151:14D26153:14D26154:14D26155:14D26157'],
				'validations': ['required()']
			},
			'normal_isochron_40ar_39ar_ratio': {
				'label': 'Normal Isochron ⁴⁰Ar/³⁹Ar Ratio',
				'group': 'Age',
				'position': 30,
				'type': 'Number',
				'description': 'Normal isochron ⁴⁰Ar/³⁹Ar ratio',
				'examples': ['0.3262444631'],
				'validations': ['required()']
			},
			'normal_isochron_40ar_39ar_ratio_sigma': {
				'label': 'Normal Isochron ⁴⁰Ar/³⁹Ar Ratio Sigma',
				'group': 'Age',
				'position': 31,
				'type': 'Number',
				'description': 'Normal isochron ⁴⁰Ar/³⁹Ar ratio sigma',
				'examples': ['2.10E-03'],
				'validations': ['required()']
			},
			'normal_isochron_age': {
				'label': 'Normal Isochron Age',
				'group': 'Age',
				'position': 32,
				'type': 'Number',
				'description': 'Normal isochron age',
				'examples': ['0.9242'],
				'validations': ['required()']
			},
			'normal_isochron_age_sigma': {
				'label': 'Normal Isochron Age Sigma',
				'group': 'Age',
				'position': 33,
				'type': 'Number',
				'description': 'Normal isochron age sigma',
				'examples': ['0.0059'],
				'validations': ['required()']
			},
			'normal_isochron_age_sigma_internal': {
				'label': 'Normal Isochron Age Sigma Internal',
				'group': 'Age',
				'position': 34,
				'type': 'Number',
				'description': 'Normal isochron age sigma internal',
				'examples': ['0.0061'],
				'validations': ['required()']
			},
			'normal_isochron_age_sigma_external': {
				'label': 'Normal Isochron Age Sigma External',
				'group': 'Age',
				'position': 35,
				'type': 'Number',
				'description': 'Normal isochron age sigma external',
				'examples': ['0.0121'],
				'validations': ['required()']
			},
			'normal_isochron_40ar_36ar_ratio': {
				'label': 'Normal Isochron ⁴⁰Ar/³⁶Ar Ratio',
				'group': 'Age',
				'position': 36,
				'type': 'Number',
				'description': 'Normal isochron ⁴⁰Ar/³⁶Ar ratio',
				'examples': ['297.0133084'],
				'validations': ['required()']
			},
			'normal_isochron_40ar_36ar_ratio_sigma': {
				'label': 'Normal Isochron ⁴⁰Ar/³⁶Ar Ratio Sigma',
				'group': 'Age',
				'position': 37,
				'type': 'Number',
				'description': 'Normal isochron ⁴⁰Ar/³⁶Ar ratio sigma',
				'examples': ['2.589015486'],
				'validations': ['required()']
			},
			'normal_isochron_mswd': {
				'label': 'Normal Isochron MSWD',
				'group': 'Age',
				'position': 38,
				'type': 'Number',
				'description': 'Normal isochron MSWD',
				'examples': ['0.8701809496'],
				'validations': ['required()']
			},
			'normal_isochron_error_magnification': {
				'label': 'Normal Isochron Error Magnification',
				'group': 'Age',
				'position': 39,
				'type': 'Number',
				'description': 'Normal isochron error magnification',
				'examples': ['20'],
				'validations': ['required()']
			},
			'normal_isochron_convergence': {
				'label': 'Normal Isochron Convergence',
				'group': 'Age',
				'position': 40,
				'type': 'Number',
				'description': 'Normal isochron convergence',
				'examples': ['40'],
				'validations': ['required()']
			},
			'normal_isochron_iterations': {
				'label': 'Normal Isochron Iterations',
				'group': 'Age',
				'position': 41,
				'type': 'String',
				'description': 'Normal isochron iterations',
				'examples': ['Weighted York-2'],
				'validations': ['required()']
			},
			'normal_isochron_n': {
				'label': 'Normal Isochron N',
				'group': 'Age',
				'position': 42,
				'type': 'Integer',
				'description': 'Number of steps in the normal isochron',
				'examples': ['20'],
				'validations': ['required()']
			},
			'normal_isochron_steps': {
				'label': 'Total Gas Fusion Steps',
				'group': 'Age',
				'position': 43,
				'type': 'String',
				'description': 'Ordered list of normal isochron step names',
				'examples': ['14D26130:14D26132:14D26133:14D26135:14D26136:14D26138:14D26141:14D26144:14D26145:14D26147:14D26148:14D26150:14D26151:14D26153:14D26154'],
				'validations': ['required()']
			},
			'inverse_isochron_40ar_39ar_ratio': {
				'label': 'Inverse Isochron ⁴⁰Ar/³⁹Ar Ratio',
				'group': 'Age',
				'position': 43,
				'type': 'Number',
				'description': 'Inverse isochron ⁴⁰Ar/³⁹Ar ratio',
				'examples': ['0.3271346226'],
				'validations': ['required()']
			},
			'inverse_isochron_40ar_39ar_ratio_sigma': {
				'label': 'Inverse Isochron ⁴⁰Ar/³⁹Ar Ratio Sigma',
				'group': 'Age',
				'position': 44,
				'type': 'Number',
				'description': 'Inverse isochron ⁴⁰Ar/³⁹Ar ratio sigma',
				'examples': ['2.09E-03'],
				'validations': ['required()']
			},
			'inverse_isochron_age': {
				'label': 'Inverse Isochron Age',
				'group': 'Age',
				'position': 45,
				'type': 'Number',
				'description': 'Inverse isochron age',
				'examples': ['0.9267'],
				'validations': ['required()']
			},
			'inverse_isochron_age_sigma': {
				'label': 'Inverse Isochron Age Sigma',
				'group': 'Age',
				'position': 46,
				'type': 'Number',
				'description': 'Inverse isochron age sigma',
				'examples': ['0.0059'],
				'validations': ['required()']
			},
			'inverse_isochron_age_sigma_internal': {
				'label': 'Inverse Isochron Age Sigma Internal',
				'group': 'Age',
				'position': 47,
				'type': 'Number',
				'description': 'Inverse isochron age sigma internal',
				'examples': ['0.0061'],
				'validations': ['required()']
			},
			'inverse_isochron_age_sigma_external': {
				'label': 'Inverse Isochron Age Sigma External',
				'group': 'Age',
				'position': 48,
				'type': 'Number',
				'description': 'Inverse isochron age sigma external',
				'examples': ['0.0121'],
				'validations': ['required()']
			},
			'inverse_isochron_40ar_36ar_ratio': {
				'label': 'Inverse Isochron ⁴⁰Ar/³⁶Ar Ratio',
				'group': 'Age',
				'position': 49,
				'type': 'Number',
				'description': 'Inverse isochron ⁴⁰Ar/³⁶Ar ratio',
				'examples': ['296.9188587'],
				'validations': ['required()']
			},
			'inverse_isochron_40ar_36ar_ratio_sigma': {
				'label': 'Inverse Isochron ⁴⁰Ar/³⁶Ar Ratio Sigma',
				'group': 'Age',
				'position': 50,
				'type': 'Number',
				'description': 'Inverse isochron ⁴⁰Ar/³⁶Ar ratio sigma',
				'examples': ['2.592270564'],
				'validations': ['required()']
			},
			'inverse_isochron_mswd': {
				'label': 'Inverse Isochron MSWD',
				'group': 'Age',
				'position': 51,
				'type': 'Number',
				'description': 'Inverse isochron MSWD',
				'examples': ['0.8599322214'],
				'validations': ['required()']
			},
			'inverse_isochron_error_magnification': {
				'label': 'Inverse Isochron Error Magnification',
				'group': 'Age',
				'position': 52,
				'type': 'Number',
				'description': 'Inverse isochron error magnification',
				'examples': ['20'],
				'validations': ['required()']
			},
			'inverse_isochron_convergence': {
				'label': 'Inverse Isochron Convergence',
				'group': 'Age',
				'position': 53,
				'type': 'Number',
				'description': 'Inverse isochron convergence',
				'examples': ['3'],
				'validations': ['required()']
			},
			'inverse_isochron_iterations': {
				'label': 'Inverse Isochron Iterations',
				'group': 'Age',
				'position': 54,
				'type': 'String',
				'description': 'Inverse isochron iterations',
				'examples': ['Weighted York-2'],
				'validations': ['required()']
			},
			'inverse_isochron_n': {
				'label': 'Inverse Isochron N',
				'group': 'Age',
				'position': 55,
				'type': 'Integer',
				'description': 'Number of steps in the inverse isochron',
				'examples': ['20'],
				'validations': ['required()']
			},
			'inverse_isochron_steps': {
				'label': 'Total Gas Fusion Steps',
				'group': 'Age',
				'position': 56,
				'type': 'String',
				'description': 'Ordered list of inverse isochron step names',
				'examples': ['14D26130:14D26132:14D26133:14D26135:14D26136:14D26138:14D26141:14D26144:14D26145:14D26147:14D26148:14D26150:14D26151:14D26153:14D26154'],
				'validations': ['required()']
			},
			'description': {
				'label': 'Description',
				'group': 'Metadata',
				'position': 56,
				'type': 'String',
				'description': 'Experiment description and comments',
				'examples': ['Specimen in the same disk as some very old (>3 Ga) samples']
			},
			'software_packages': {
				'label': 'Software Packages',
				'group': 'Metadata',
				'position': 57,
				'type': 'List',
				'description': 'Colon-delimited list of software used for data collection, reduction, and analysis.',
				'examples': ['Mass Spec 5.02', ' ArArCALC v2.5.2'],
				'validations': ['required()']
			}
		}
	},
	'measurements': {
		'label': 'Measurements',
		'position': 6,
		'description': 'Measurements',
		'notes': 'Raw instrument data',
		'columns': {
			'contribution_id': {
				'label': 'Contribution ID',
				'group': 'Contribution',
				'position': 1,
				'type': 'Integer',
				'description': 'Unique KArAr Contribution ID',
				'notes': 'Written during contribution publication',
				'examples': ['5412'],
				'validations': ['downloadOnly()']
			},
			'measurement': {
				'label': 'Measurement Name',
				'group': 'Names',
				'position': 2,
				'type': 'String',
				'description': 'Unique measurement identifier',
				'examples': ['SFVP01-01a-LT-AF-Z-1', 'SFVP01-01a-LT-AF-Z-2', 'SFVP01-01a-LT-T-Z-1'],
				'validations': ['unique()', 'key()', 'required()']
			},
			'experiment': {
				'label': 'Experiment Name',
				'group': 'Names',
				'position': 3,
				'type': 'String',
				'description': 'Name for experiment',
				'examples': ['SFVP01-01a-LT-AF-Z'],
				'validations': ['required()']
			},
			'specimen': {
				'label': 'Specimen Name',
				'group': 'Names',
				'position': 4,
				'type': 'String',
				'description': 'Name for specimen',
				'examples': ['SFVP01-01a'],
				'validations': ['in("specimens.specimen")', 'required()']
			},
			'irradiation': {
				'label': 'Irradiation Name',
				'group': 'Names',
				'position': 5,
				'type': 'String',
				'description': 'Name for the irradiation of the specimen',
				'examples': ['14-OSU-02']
			},
			'age': {
				'label': 'Age',
				'group': 'Measurement',
				'position': 5,
				'type': 'Number',
				'description': 'Age calculated from the gas released from one heating step',
				'examples': ['46.1714277611336'],
				'validations': ['required()']
			},
			'age_one_sigma': {
				'label': 'Age One Sigma',
				'group': 'Measurement',
				'position': 6,
				'type': 'Number',
				'description': 'One sigma standard deviation of the age',
				'examples': ['1.38063235829088'],
				'validations': ['required()']
			},
			'age_unit': {
				'label': 'Age Unit',
				'group': 'Measurement',
				'position': 7,
				'type': 'String',
				'description': 'Unit of the age value',
				'examples': ['ka', 'Ma', 'Ga', 'BP'],
				'validations': ['cv("age_unit")', 'required()']
			},
			'fraction_40ar_radiogenic': {
				'label': 'Fraction of ⁴⁰Ar Radiogenic',
				'group': 'Measurement',
				'position': 8,
				'type': 'Number',
				'description': 'Fraction of ⁴⁰Ar radiogenic',
				'examples': ['75.0568593170697'],
				'validations': ['required()']
			},
			'fraction_39ar_k': {
				'label': 'Fraction of ³⁹Ar K',
				'group': 'Measurement',
				'position': 9,
				'type': 'Number',
				'description': 'Fraction of ³⁹Ar potassium',
				'examples': ['0.699600858319132'],
				'validations': ['required()']
			},
			'k_ca_ratio': {
				'label': 'K to Ca Ratio',
				'group': 'Measurement',
				'position': 7,
				'type': 'Number',
				'description': 'Potassium to calcium ratio calculated from the Ar gas measurements ',
				'examples': ['0.0235523539210429'],
				'validations': ['required()']
			},
			'k_ca_ratio_one_sigma': {
				'label': 'K to Ca Ratio One Sigma',
				'group': 'Measurement',
				'position': 8,
				'type': 'Number',
				'description': 'One sigma standard deviation of the potassium to calcium ratio',
				'examples': ['0.0020463936244812'],
				'validations': ['required()']
			},
			'sequence': {
				'label': 'Sequence',
				'group': 'Measurement',
				'position': 9,
				'type': 'Integer',
				'description': 'Order of the measurements',
				'examples': ['-50', '0', '1', '343'],
				'validations': ['unique()', 'recommended()']
			},
			'standard': {
				'label': 'Standard',
				'group': 'Measurement',
				'position': 10,
				'type': 'String',
				'description': 'Indicating if a standard (s) or an unknown (u) measurement',
				'examples': ['s', 'u'],
				'validations': ['cv("measurement_type")']
			},
			'quality': {
				'label': 'Quality',
				'group': 'Measurement',
				'position': 11,
				'type': 'String',
				'description': 'Indicating if a good (g) or bad (b) measurement',
				'examples': ['g', 'b'],
				'validations': ['cv("data_quality")', 'required()']
			},
			'temp': {
				'label': 'Temperature',
				'group': 'Measurement',
				'position': 12,
				'type': 'Number',
				'description': 'Heating temperature of the measurement step as defined by Temperature Unit',
				'examples': ['200', '1.5'],
				'validations': ['required()']
			},
			'temp_unit': {
				'label': 'Temperature Unit',
				'group': 'Measurement',
				'position': 13,
				'type': 'String',
				'description': 'Temperature Unit',
				'examples': ['Celcius', 'Watts'],
				'validations': ['cv("temp_unit")', 'required()']
			},
			'isolation_duration': {
				'label': 'Specimen Isolation Duration',
				'group': 'Measurement',
				'position': 14,
				'type': 'Number',
				'unit': 'days',
				'description': 'Number of days between the end of the irradiation and the measurement',
				'examples': ['143', '64', '15.4'],
				'validations': ['required()']
			},
			'instrument_codes': {
				'label': 'Instrument Code',
				'group': 'Measurement',
				'position': 15,
				'type': 'List',
				'description': 'Colon-delimited list of instrument codes',
				'examples': ['SIO-Bubba', 'IRM-OldBlue']
			},
			'mdf_value': {
				'label': 'Mass Discrimination Factor',
				'group': 'Mass Discrimination',
				'position': 16,
				'type': 'Number',
				'description': 'Value used to correct ion beam measurements due to systematic differences in measurement values due to isotopic mass differences',
				'examples': ['0.992978'],
				'validations': ['required()']
			},
			'mdf_value_one_sigma': {
				'label': 'Mass Discrimination Factor One Sigma',
				'group': 'Mass Discrimination',
				'position': 17,
				'type': 'Number',
				'description': 'Uncertainty on the mass discrimination factor',
				'examples': ['6.62410E-04'],
				'validations': ['required()']
			},
			'mdf_law_applied': {
				'label': 'Mass Discrimination Interpolation Type',
				'group': 'Mass Discrimination',
				'position': 18,
				'type': 'String',
				'description': 'Type of interpolation used for calculating the mass discrimination values',
				'examples': ['Linear'],
				'validations': ['cv("mdf_law")', 'required()']
			},
			'mdf_40ar_36_standard_ratio': {
				'label': '⁴⁰Ar/³⁶Ar Standard Ratio',
				'group': 'Mass Discrimination',
				'position': 19,
				'type': 'Number',
				'description': 'Usually the ⁴⁰Ar/³⁶Ar for atmospheric argon that is commonly used as the standard for determining mass discrimination',
				'examples': ['295.5', '298.56'],
				'validations': ['required()']
			},
			'mdf_40ar_36ar_standard_ratio_one_sigma': {
				'label': '⁴⁰Ar/³⁶Ar Standard Ratio One Sigma',
				'group': 'Mass Discrimination',
				'position': 20,
				'type': 'Number',
				'description': 'The standard deviaton of the ⁴⁰Ar/³⁶Ar ratio of the standard',
				'validations': ['required()']
			},
			'intercept_36ar': {
				'label': '³⁶Ar Intercept',
				'group': 'Intercepts',
				'position': 21,
				'type': 'Number',
				'description': '³⁶Ar isotopic signal evolution corrected extrapolated back to zero time. ',
				'examples': ['0.049369'],
				'validations': ['required()']
			},
			'intercept_36ar_one_sigma': {
				'label': '³⁶Ar Intercept One Sigma',
				'group': 'Intercepts',
				'position': 22,
				'type': 'Number',
				'description': 'Standard deviation of the corrected ³⁶Ar intercept at one sigma',
				'examples': ['0.000595'],
				'validations': ['required()']
			},
			'intercept_36ar_regression_type': {
				'label': '³⁶Ar Regression Type',
				'group': 'Intercepts',
				'position': 23,
				'type': 'String',
				'description': 'Type of fit to the decay (regression) of the ³⁶Ar ionic gas signal.',
				'examples': ['Exponential'],
				'validations': ['required()']
			},
			'intercept_37ar': {
				'label': '³⁷Ar Intercept',
				'group': 'Intercepts',
				'position': 24,
				'type': 'Number',
				'description': '³⁷Ar isotopic signal evolution corrected extrapolated back to zero time. ',
				'examples': ['0.490369'],
				'validations': ['required()']
			},
			'intercept_37ar_one_sigma': {
				'label': '³⁷Ar Intercept One Sigma',
				'group': 'Intercepts',
				'position': 25,
				'type': 'Number',
				'description': 'Standard deviation of the corrected ³⁶Ar intercept at one sigma',
				'examples': ['0.030336'],
				'validations': ['required()']
			},
			'intercept_37ar_regression_type': {
				'label': '³⁷Ar Regression Type',
				'group': 'Intercepts',
				'position': 26,
				'type': 'String',
				'description': 'Type of fit to the decay (regression) of the ³⁶Ar ionic gas signal.',
				'examples': ['Exponential'],
				'validations': ['required()']
			},
			'intercept_38ar': {
				'label': '³⁸Ar Intercept',
				'group': 'Intercepts',
				'position': 27,
				'type': 'Number',
				'description': '³⁸Ar isotopic signal evolution corrected extrapolated back to zero time. ',
				'examples': ['-0.017148'],
				'validations': ['required()']
			},
			'intercept_38ar_one_sigma': {
				'label': '³⁸Ar Intercept One Sigma',
				'group': 'Intercepts',
				'position': 28,
				'type': 'Number',
				'description': 'Standard deviation of the corrected ³⁶Ar intercept at one sigma',
				'examples': ['0.025811'],
				'validations': ['required()']
			},
			'intercept_38ar_regression_type': {
				'label': '³⁸Ar Regression Type',
				'group': 'Intercepts',
				'position': 29,
				'type': 'String',
				'description': 'Type of fit to the decay (regression) of the ³⁶Ar ionic gas signal.',
				'examples': ['Exponential'],
				'validations': ['required()']
			},
			'intercept_39ar': {
				'label': '³⁹Ar Intercept',
				'group': 'Intercepts',
				'position': 30,
				'type': 'Number',
				'description': '³⁹Ar isotopic signal evolution corrected extrapolated back to zero time. ',
				'examples': ['1.416676'],
				'validations': ['required()']
			},
			'intercept_39ar_sigma': {
				'label': '³⁹Ar Intercept One Sigma',
				'group': 'Intercepts',
				'position': 31,
				'type': 'Number',
				'description': 'Standard deviation of the corrected ³⁶Ar intercept at one sigma',
				'examples': ['0.026428'],
				'validations': ['required()']
			},
			'intercept_39ar_regression_type': {
				'label': '³⁹Ar Regression Type',
				'group': 'Intercepts',
				'position': 32,
				'type': 'String',
				'description': 'Type of fit to the decay (regression) of the ³⁶Ar ionic gas signal.',
				'examples': ['Exponential'],
				'validations': ['required()']
			},
			'intercept_40ar': {
				'label': '⁴⁰Ar Intercept',
				'group': 'Intercepts',
				'position': 33,
				'type': 'Number',
				'description': '⁴⁰Ar isotopic signal evolution corrected extrapolated back to zero time. ',
				'examples': ['33.930073'],
				'validations': ['required()']
			},
			'intercept_40ar_sigma': {
				'label': '⁴⁰Ar Intercept One Sigma',
				'group': 'Intercepts',
				'position': 34,
				'type': 'Number',
				'description': 'Standard deviation of the corrected ³⁶Ar intercept at one sigma',
				'examples': ['0.029470'],
				'validations': ['required()']
			},
			'intercept_40ar_regression_type': {
				'label': '⁴⁰Ar Regression Type',
				'group': 'Intercepts',
				'position': 35,
				'type': 'String',
				'description': 'Type of fit to the decay (regression) of the ³⁶Ar ionic gas signal.',
				'examples': ['Exponential'],
				'validations': ['required()']
			},
			'intercept_unit': {
				'label': 'Intercept Unit',
				'group': 'Intercepts',
				'position': 36,
				'type': 'String',
				'description': 'Type of unit used for the intercept',
				'examples': ['Volts'],
				'validations': ['required()']
			},
			'blank_36ar': {
				'label': '³⁶Ar Blank',
				'group': 'Blanks',
				'position': 37,
				'type': 'Number',
				'description': 'Measuerement of ³⁶Ar blank',
				'examples': ['0.0201'],
				'validations': ['required()']
			},
			'blank_36ar_one_sigma': {
				'label': '³⁶Ar Blank One Sigma',
				'group': 'Blanks',
				'position': 38,
				'type': 'Number',
				'description': 'One sigma standard deviation of the ³⁶Ar blank',
				'examples': ['0.000671'],
				'validations': ['required()']
			},
			'blank_37ar': {
				'label': '³⁷Ar Blank',
				'group': 'Blanks',
				'position': 39,
				'type': 'Number',
				'description': 'Measuerement of ³⁷Ar blank',
				'examples': ['-0.0124'],
				'validations': ['required()']
			},
			'blank_37ar_one_sigma': {
				'label': '³⁷Ar Blank One Sigma',
				'group': 'Blanks',
				'position': 40,
				'type': 'Number',
				'description': 'One sigma standard deviation of the ³⁷Ar blank',
				'examples': ['0.0285'],
				'validations': ['required()']
			},
			'blank_38ar': {
				'label': '³⁸Ar Blank',
				'group': 'Blanks',
				'position': 41,
				'type': 'Number',
				'description': 'Measuerement of ³⁸Ar blank',
				'examples': ['-0.0655'],
				'validations': ['required()']
			},
			'blank_38ar_one_sigma': {
				'label': '³⁸Ar Blank One Sigma',
				'group': 'Blanks',
				'position': 42,
				'type': 'Number',
				'description': 'One sigma standard deviation of the ³⁸Ar blank',
				'examples': ['0.02650452'],
				'validations': ['required()']
			},
			'blank_39ar': {
				'label': '³⁹Ar Blank',
				'group': 'Blanks',
				'position': 43,
				'type': 'Number',
				'description': 'Measuerement of ³⁹Ar blank',
				'examples': ['-0.0329926'],
				'validations': ['required()']
			},
			'blank_39ar_one_sigma': {
				'label': '³⁹Ar Blank One Sigma',
				'group': 'Blanks',
				'position': 44,
				'type': 'Number',
				'description': 'One sigma standard deviation of the ³⁹Ar blank',
				'examples': ['0.025284611'],
				'validations': ['required()']
			},
			'blank_40ar': {
				'label': '⁴⁰Ar Blank',
				'group': 'Blanks',
				'position': 45,
				'type': 'Number',
				'description': 'Measuerement of ⁴⁰Ar blank',
				'examples': ['5.918450679'],
				'validations': ['required()']
			},
			'blank_40ar_one_sigma': {
				'label': '⁴⁰Ar Blank One Sigma',
				'group': 'Blanks',
				'position': 46,
				'type': 'Number',
				'description': 'One sigma standard deviation of the ⁴⁰Ar blank',
				'notes': 'Type of unit used for the blank measurement',
				'examples': ['0.0887'],
				'validations': ['required()']
			},
			'blank_unit': {
				'label': 'Blank Unit',
				'group': 'Blanks',
				'position': 47,
				'type': 'String',
				'description': 'Type of unit used for the blank measurement',
				'notes': 'The total ⁴⁰Ar to ³⁹Ar ratio corrected for the blank, air, and spurious irradiation production',
				'examples': ['Volts'],
				'validations': ['required()']
			},
			'corrected_total_40ar_39ar_ratio': {
				'label': 'Corrected Total ⁴⁰Ar ³⁹Ar Ratio',
				'group': 'Isotopic Ratios',
				'position': 48,
				'type': 'Number',
				'description': 'The total ⁴⁰Ar to ³⁹Ar ratio corrected for the blank, air, and spurious irradiation production',
				'examples': ['19.11172885'],
				'validations': ['required()']
			},
			'corrected_total_40ar_39ar_ratio_one_sigma': {
				'label': 'Corrected Total ⁴⁰Ar ³⁹Ar Ratio One Sigma',
				'group': 'Isotopic Ratios',
				'position': 49,
				'type': 'Number',
				'description': 'One sigma uncertainty on the total ⁴⁰Ar to ³⁹Ar ratio corrected for the blank, air, and spurious irradiation production',
				'examples': ['0.486567232'],
				'validations': ['required()']
			},
			'corrected_total_37ar_39ar_ratio': {
				'label': 'Corrected Total ³⁷Ar ³⁹Ar Ratio',
				'group': 'Isotopic Ratios',
				'position': 50,
				'type': 'Number',
				'description': 'The total ³⁷Ar ³⁹Ar ratio corrected for the blank, air, and spurious irradiation production',
				'examples': ['18.03474773'],
				'validations': ['required()']
			},
			'corrected_total_37ar_39ar_ratio_one_sigma': {
				'label': 'Corrected Total ³⁷Ar ³⁹Ar Ratio One Sigma',
				'group': 'Isotopic Ratios',
				'position': 51,
				'type': 'Number',
				'description': 'One sigma uncertainty on the total ³⁷Ar ³⁹Ar ratio corrected for the blank, air, and spurious irradiation production',
				'examples': ['1.56523173'],
				'validations': ['required()']
			},
			'corrected_total_36ar_39ar_ratio': {
				'label': 'Corrected Total ³⁶Ar ³⁹Ar Ratio',
				'group': 'Isotopic Ratios',
				'position': 52,
				'type': 'Number',
				'description': 'The total ³⁶Ar ³⁹Ar ratio corrected for the blank, air, and spurious irradiation production',
				'examples': ['0.0209'],
				'validations': ['required()']
			},
			'corrected_total_36ar_39ar_ratio_one_sigma': {
				'label': 'Corrected Total ³⁶Ar ³⁹Ar Ratio One Sigma',
				'group': 'Isotopic Ratios',
				'position': 53,
				'type': 'Number',
				'description': 'One sigma uncertainty on the total ³⁶Ar ³⁹Ar ratio corrected for the blank, air, and spurious irradiation production',
				'examples': ['0.000833'],
				'validations': ['required()']
			},
			'corrected_40ar_rad_39ar_k_ratio': {
				'label': 'Corrected ⁴⁰Ar Rad ³⁹Ar K Ratio',
				'group': 'Isotopic Ratios',
				'position': 54,
				'type': 'Number',
				'description': 'The total ⁴⁰Ar Rad ³⁹Ar K  ratio corrected for the blank, air, and spurious irradiation production',
				'examples': ['14.52159859'],
				'validations': ['required()']
			},
			'corrected_40ar_rad_39ar_k_ratio_one_sigma': {
				'label': 'Corrected ⁴⁰Ar Rad ³⁹Ar K Ratio One Sigma',
				'group': 'Isotopic Ratios',
				'position': 55,
				'type': 'Number',
				'description': 'One sigma uncertainty on the total ⁴⁰Ar Rad ³⁹Ar K ratio corrected for the blank, air, and spurious irradiation production',
				'examples': ['0.439796482'],
				'validations': ['required()']
			},
			'corrrected_39ar_k_36ar_atm_ratio': {
				'label': 'Corrected ³⁹Ar K ³⁶Ar Atm Ratio',
				'group': 'Isotopic Ratios',
				'position': 56,
				'type': 'Number',
				'description': 'The total ³⁹Ar K ³⁶Ar ratio corrected for the blank, air, and spurious irradiation production',
				'examples': ['61.28109106'],
				'validations': ['required()']
			},
			'corrrected_39ar_k_36ar_atm_ratio_one_sigma': {
				'label': 'Corrected ³⁹Ar K ³⁶Ar Atm Ratio One Sigma',
				'group': 'Isotopic Ratios',
				'position': 57,
				'type': 'Number',
				'description': 'One sigma uncertainty on the total ³⁹Ar K ³⁶Ar ratio corrected for the blank, air, and spurious irradiation production',
				'examples': ['3.278702202'],
				'validations': ['required()']
			},
			'corrrected_40ar_rad_atm_36ar_atm_ratio': {
				'label': 'Corrected ⁴⁰Ar Rad Atm ³⁶Ar Atm Ratio',
				'group': 'Isotopic Ratios',
				'position': 58,
				'type': 'Number',
				'description': 'The total ⁴⁰Ar Rad Atm ³⁶Ar ratio corrected for the blank, air, and spurious irradiation production',
				'examples': ['1185.399 40569445'],
				'validations': ['required()']
			},
			'corrected_40ar_rad_atm_36ar_atm_ratio_one_sigma': {
				'label': 'Corrected ⁴⁰Ar Rad Atm ³⁶Ar Atm Ratio One Sigma',
				'group': 'Isotopic Ratios',
				'position': 59,
				'type': 'Number',
				'description': 'One sigma uncertainty on the total ⁴⁰Ar Rad Atm ³⁶Ar ratio corrected for the blank, air, and spurious irradiation production',
				'examples': ['55.84951125'],
				'validations': ['required()']
			},
			'corrected_39ar_k_40ar_rad_atm_ratio': {
				'label': 'Corrected ³⁹Ar K ⁴⁰Ar Rad Atm Ratio',
				'group': 'Isotopic Ratios',
				'position': 60,
				'type': 'Number',
				'description': 'The total ³⁹Ar K ⁴⁰Ar ratio corrected for the blank, air, and spurious irradiation production',
				'examples': ['0.0517'],
				'validations': ['required()']
			},
			'corrected_39ar_k_40ar_rad_atm_ratio_one_sigma': {
				'label': 'Corrected ³⁹Ar K ⁴⁰Ar Rad Atm Ratio One Sigma',
				'group': 'Isotopic Ratios',
				'position': 61,
				'type': 'Number',
				'description': 'One sigma uncertainty on the total ³⁹Ar K ⁴⁰Ar ratio corrected for the blank, air, and spurious irradiation production',
				'examples': ['0.00133'],
				'validations': ['required()']
			},
			'corrected_36ar_atm_40ar_rad_atm_ratio': {
				'label': 'Corrected ³⁶Ar Atm ⁴⁰Ar Rad Atm Ratio',
				'group': 'Isotopic Ratios',
				'position': 62,
				'type': 'Number',
				'description': 'The total ³⁶Ar Atm ⁴⁰Ar ratio corrected for the blank, air, and spurious irradiation production',
				'examples': ['0.000844'],
				'validations': ['required()']
			},
			'corrected_36ar_atm_40ar_rad_atm_ratio_one_sigma': {
				'label': 'Corrected ³⁶Ar Atm ⁴⁰Ar Rad Atm Ratio One Sigma',
				'group': 'Isotopic Ratios',
				'position': 63,
				'type': 'Number',
				'description': 'One sigma uncertainty on the total ³⁶Ar Atm ⁴⁰Ar ratio corrected for the blank, air, and spurious irradiation production',
				'examples': ['0.0000397'],
				'validations': ['required()']
			},
			'corr_coefficient_40_36_over_39_36': {
				'label': 'Correlaton Coefficient 40 36 Over 39 36',
				'group': 'Isotopic Ratios',
				'position': 64,
				'type': 'Number',
				'description': 'The correlaton coefficient 40 36 over 39 36',
				'examples': ['0.876178159'],
				'validations': ['required()']
			},
			'corr_coefficient_36_40_over_39_40': {
				'label': 'Correlation Coefficient 36 40 Over 39 40',
				'group': 'Isotopic Ratios',
				'position': 65,
				'type': 'Number',
				'description': 'The correlaton coefficient 36 40 over 39 40',
				'examples': ['0.0887'],
				'validations': ['required()']
			},
			'corrected_36ar_atmospheric': {
				'label': 'Corrected ³⁶Ar Atmospheric',
				'group': 'Isotopes',
				'position': 66,
				'type': 'Number',
				'description': 'Corrected ³⁶Ar atmospheric',
				'examples': ['0.0236'],
				'validations': ['required()']
			},
			'corrected_36ar_atmospheric_one_sigma': {
				'label': 'Corrected ³⁶Ar Atmospheric Sigma',
				'group': 'Isotopes',
				'position': 67,
				'type': 'Number',
				'description': 'Corrected ³⁶Ar atmospheric uncertainty at one sigma',
				'examples': ['0.00111'],
				'validations': ['required()']
			},
			'corrected_36ar_cosmogenic': {
				'label': 'Corrected ³⁶Ar Cosmogenic',
				'group': 'Isotopes',
				'position': 68,
				'type': 'Number',
				'description': 'Corrected ³⁶Ar cosmogenic',
				'examples': ['0'],
				'validations': ['required()']
			},
			'corrected_36ar_cosmogenic_one_sigma': {
				'label': 'Corrected ³⁶Ar Cosmogenic Sigma',
				'group': 'Isotopes',
				'position': 69,
				'type': 'Number',
				'description': 'Corrected ³⁶Ar cosmogenic uncertainty at one sigma',
				'examples': ['0'],
				'validations': ['required()']
			},
			'corrected_36ar_calcium': {
				'label': 'Corrected ³⁶Ar Calcium',
				'group': 'Isotopes',
				'position': 70,
				'type': 'Number',
				'description': 'Corrected ³⁶Ar calcium',
				'examples': ['0.00702'],
				'validations': ['required()']
			},
			'corrected_36ar_calcium_sigma': {
				'label': 'Corrected ³⁶Ar Calcium Sigma',
				'group': 'Isotopes',
				'position': 71,
				'type': 'Number',
				'description': 'Corrected ³⁶Ar calcium uncertainty at one sigma',
				'examples': ['0.000583'],
				'validations': ['required()']
			},
			'corrected_36ar_chlorine': {
				'label': 'Corrected ³⁶Ar Chlorine',
				'group': 'Isotopes',
				'position': 72,
				'type': 'Number',
				'description': 'Corrected ³⁶Ar chlorine',
				'examples': ['0.0000082'],
				'validations': ['required()']
			},
			'corrected_36ar_chlorine_one_sigma': {
				'label': 'Corrected ³⁶Ar Chlorine Sigma',
				'group': 'Isotopes',
				'position': 73,
				'type': 'Number',
				'description': 'Corrected ³⁶Ar chlorine uncertainty at one sigma',
				'examples': ['0.0000121'],
				'validations': ['required()']
			},
			'corrected_37ar_calcium': {
				'label': 'Corrected ³⁷Ar Calcium',
				'group': 'Isotopes',
				'position': 74,
				'type': 'Number',
				'description': 'Corrected ³⁷Ar calcium',
				'examples': ['26.36604476'],
				'validations': ['required()']
			},
			'corrected_37ar_calcium_one_sigma': {
				'label': 'Corrected ³⁷Ar Calcium Sigma',
				'group': 'Isotopes',
				'position': 75,
				'type': 'Number',
				'description': 'Corrected ³⁷Ar calcium uncertainty at one sigma',
				'examples': ['2.189 40507664209'],
				'validations': ['required()']
			},
			'corrected_38ar_atmospheric': {
				'label': 'Corrected ³⁸Ar Atmospheric',
				'group': 'Isotopes',
				'position': 76,
				'type': 'Number',
				'description': 'Corrected ³⁸Ar atmospheric',
				'examples': ['0.004 40447004480264'],
				'validations': ['required()']
			},
			'corrected_38ar_atmospheric_one_sigma': {
				'label': 'Corrected ³⁸Ar Atmospheric Sigma',
				'group': 'Isotopes',
				'position': 77,
				'type': 'Number',
				'description': 'Corrected ³⁸Ar atmospheric uncertainty at one sigma',
				'examples': ['0.000207'],
				'validations': ['required()']
			},
			'corrected_38ar_cosmogenic': {
				'label': 'Corrected ³⁸Ar Cosmogenic',
				'group': 'Isotopes',
				'position': 78,
				'type': 'Number',
				'description': 'Corrected ³⁸Ar cosmogenic',
				'examples': ['0'],
				'validations': ['required()']
			},
			'corrected_38ar_cosmogenic_one_sigma': {
				'label': 'Corrected ³⁸Ar Cosmogenic Sigma',
				'group': 'Isotopes',
				'position': 79,
				'type': 'Number',
				'description': 'Corrected ³⁸Ar cosmogenic uncertainty at one sigma',
				'examples': ['0'],
				'validations': ['required()']
			},
			'corrected_38ar_potassium': {
				'label': 'Corrected ³⁸Ar Potassium',
				'group': 'Isotopes',
				'position': 80,
				'type': 'Number',
				'description': 'Corrected ³⁸Ar potassium',
				'examples': ['0.0174'],
				'validations': ['required()']
			},
			'corrected_38ar_potassium_one_sigma': {
				'label': 'Corrected ³⁸Ar Potassium Sigma',
				'group': 'Isotopes',
				'position': 81,
				'type': 'Number',
				'description': 'Corrected ³⁸Ar potassium uncertainty at one sigma',
				'examples': ['0.000445'],
				'validations': ['required()']
			},
			'corrected_38ar_calcium': {
				'label': 'Corrected ³⁸Ar Calcium',
				'group': 'Isotopes',
				'position': 82,
				'type': 'Number',
				'description': 'Corrected ³⁸Ar calcium',
				'examples': ['0.00189'],
				'validations': ['required()']
			},
			'corrected_38ar_calcium_one_sigma': {
				'label': 'Corrected ³⁸Ar Calcium Sigma',
				'group': 'Isotopes',
				'position': 83,
				'type': 'Number',
				'description': 'Corrected ³⁸Ar calcium uncertainty at one sigma',
				'examples': ['0.0002891566 40411995'],
				'validations': ['required()']
			},
			'corrected_38ar_chlorine': {
				'label': 'Corrected ³⁸Ar Chlorine',
				'group': 'Isotopes',
				'position': 84,
				'type': 'Number',
				'description': 'Corrected ³⁸Ar chlorine',
				'examples': ['0.0253'],
				'validations': ['required()']
			},
			'corrected_38ar_chlorine_one_sigma': {
				'label': 'Corrected ³⁸Ar Chlorine Sigma',
				'group': 'Isotopes',
				'position': 85,
				'type': 'Number',
				'description': 'Corrected ³⁸Ar chlorine uncertainty at one sigma',
				'examples': ['0.037531241 4056014'],
				'validations': ['required()']
			},
			'corrected_39ar_potassium': {
				'label': 'Corrected ³⁹Ar Potassium',
				'group': 'Isotopes',
				'position': 86,
				'type': 'Number',
				'description': 'Corrected ³⁹Ar potassium',
				'examples': ['1.444145157'],
				'validations': ['required()']
			},
			'corrected_39ar_potassium_one_sigma': {
				'label': 'Corrected ³⁹Ar Potassium Sigma',
				'group': 'Isotopes',
				'position': 87,
				'type': 'Number',
				'description': 'Corrected ³⁹Ar potassium uncertainty at one sigma',
				'examples': ['0.0369'],
				'validations': ['required()']
			},
			'corrected_39ar_calcium': {
				'label': 'Corrected ³⁹Ar Calcium',
				'group': 'Isotopes',
				'position': 88,
				'type': 'Number',
				'description': 'Corrected ³⁹Ar calcium',
				'examples': ['0.0178'],
				'validations': ['required()']
			},
			'corrected_39ar_calcium_one_sigma': {
				'label': 'Corrected ³⁹Ar Calcium Sigma',
				'group': 'Isotopes',
				'position': 89,
				'type': 'Number',
				'description': 'Corrected ³⁹Ar calcium uncertainty at one sigma',
				'examples': ['0.0015'],
				'validations': ['required()']
			},
			'corrected_40ar_radiogenic': {
				'label': 'Corrected ⁴⁰Ar Radiogenic',
				'group': 'Isotopes',
				'position': 90,
				'type': 'Number',
				'description': 'Corrected ⁴⁰Ar radiogenic',
				'examples': ['20.97129628'],
				'validations': ['required()']
			},
			'corrected_40ar_radiogenic_one_sigma': {
				'label': 'Corrected ⁴⁰Ar Radiogenic Sigma',
				'group': 'Isotopes',
				'position': 91,
				'type': 'Number',
				'description': 'Corrected ⁴⁰Ar radiogenic uncertainty at one sigma',
				'examples': ['0.3 40300462178874'],
				'validations': ['required()']
			},
			'corrected_40ar_atmospheric': {
				'label': 'Corrected ⁴⁰Ar Atmospheric',
				'group': 'Isotopes',
				'position': 92,
				'type': 'Number',
				'description': 'Corrected ⁴⁰Ar atmospheric',
				'examples': ['6.963728723'],
				'validations': ['required()']
			},
			'corrected_40ar_atmospheric_one_sigma': {
				'label': 'Corrected ⁴⁰Ar Atmospheric Sigma',
				'group': 'Isotopes',
				'position': 93,
				'type': 'Number',
				'description': 'Corrected ⁴⁰Ar atmospheric uncertainty at one sigma',
				'examples': ['0.327267692'],
				'validations': ['required()']
			},
			'corrected_40ar_cosmogenic': {
				'label': 'Corrected ⁴⁰Ar Cosmogenic',
				'group': 'Isotopes',
				'position': 94,
				'type': 'Number',
				'description': 'Corrected ⁴⁰Ar cosmogenic',
				'examples': ['0'],
				'validations': ['required()']
			},
			'corrected_40ar_cosmogenic_one_sigma': {
				'label': 'Corrected ⁴⁰Ar Cosmogenic Sigma',
				'group': 'Isotopes',
				'position': 95,
				'type': 'Number',
				'description': 'Corrected ⁴⁰Ar cosmogenic uncertainty at one sigma',
				'examples': ['0'],
				'validations': ['required()']
			},
			'corrected_40ar_potassium': {
				'label': 'Corrected ⁴⁰Ar Potassium',
				'group': 'Isotopes',
				'position': 96,
				'type': 'Number',
				'description': 'Corrected ⁴⁰Ar potassium',
				'examples': ['0.00552'],
				'validations': ['required()']
			},
			'corrected_40ar_potassium_one_sigma': {
				'label': 'Corrected ⁴⁰Ar Potassium Sigma',
				'group': 'Isotopes',
				'position': 97,
				'type': 'Number',
				'description': 'Corrected ⁴⁰Ar potassium uncertainty at one sigma',
				'examples': ['0.000204'],
				'validations': ['required()']
			},
			'description': {
				'label': 'Description',
				'group': 'Metadata',
				'position': 98,
				'type': 'String',
				'description': 'Measurement description and comments'
			},
			'timestamp': {
				'label': 'Measurement Timestamp',
				'group': 'Metadata',
				'position': 99,
				'type': 'Timestamp',
				'description': 'Date and time when the measurement was made',
				'notes': 'ISO 8601 date and time (e.g. "yyyy-mm-ddThh:mm:ss.sssZ"). See wikipedia.org/wiki/ISO_8601 for detailed explanation',
				'examples': ['2021-01-01T10:02:34.87', '2020-07-20T22:56:15-04:00'],
				'validations': ['required()']
			},
			'software_packages': {
				'label': 'Software Packages',
				'group': 'Metadata',
				'position': 100,
				'type': 'List',
				'description': 'Colon-delimited list of software used for data reduction',
				'examples': ['Mass Spec 5.02', ' ArArCALC v2.5.2'],
				'validations': ['required()']
			},
			'analysts': {
				'label': 'Analyst Names',
				'group': 'Metadata',
				'position': 101,
				'type': 'List',
				'description': 'Colon-delimited list of EarthRef handles, ORCIDs, or names and emails for scientists who described the sample or ORCID id',
				'examples': ['@user1:@user2:0000-0002-9000-2100:Not A. Member <no.earthref.handle@gmail.com>'],
				'validations': ['type("users")']
			}
		}
	}
}
};