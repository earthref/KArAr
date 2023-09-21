/* Instructions for updating:

    1) Go to https://docs.google.com/spreadsheets/d/1l6zLUyqeJ5eC6Qc2L0rJ7kLn7YVbijkU2R0p7JUvU74 and 
      copy the JSON cells (column P row 2 to the last entry in column R).
    2) Go to https://jsonlint.com/, paste the JSON into the text area, click "Validate JSON", and 
      copy the formatted JSON.
    3) Replace the JSON starting after "'tables': " roughly on line 17 and before the "};" at the end.
    4) Update the 'updated_day' field at the beginning.

*/

export const model = {
	'updated_day': '2023:09:06',
	'published_day': '2023:09:06',
	'data_model_version': '1.1',
	'tables': {
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
	'samples': {
		'label': 'Samples',
		'position': 2,
		'description': 'Samples from a unique site ',
		'notes': 'Field samples or discrete samples fFsrom a section of core',
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
			'location': {
				'label': 'Location Name',
				'group': 'Names',
				'position': 4,
				'type': 'String',
				'description': 'Name for location, dredge, or drill site',
				'notes': 'The location label for a site can be used to group sites. Use location_type to specify the type of location',
				'examples': ['San Francisco Volcanic Province', 'Dredge AMAT02-D12', 'Site 801'],
				'validations': ['required()']
			},
			'location_alternatives': {
				'label': 'Location Name Alternatives',
				'group': 'Names',
				'position': 5,
				'type': 'List',
				'description': 'Colon-delimited list of alternative names and/or abbreviations'
			},
			'location_type': {
				'label': 'Location Type',
				'group': 'Names',
				'position': 6,
				'type': 'String',
				'description': 'The group of sites location type',
				'notes': 'The location type is a controlled vocabulary. Please contact the KArAr team if you need additional terms added to the vocabulary.',
				'validations': ['cv("location_type")', 'recommended()']
			},
			'site': {
				'label': 'Site Name',
				'group': 'Names',
				'position': 7,
				'type': 'String',
				'description': 'Name for site',
				'examples': ['SFVP01']
			},
			'site_alternatives': {
				'label': 'Site Name Alternatives',
				'group': 'Names',
				'position': 8,
				'type': 'List',
				'description': 'Colon-delimited list of alternative names and abbreviations',
				'notes': 'Other names this site may have. Can be useful for cross referencing other data associated with the site.'
			},
			'igsn': {
				'label': 'Sample IGSN',
				'group': 'Names',
				'position': 9,
				'type': 'String',
				'description': 'International Geo Sample Number (IGSN) of the sample',
				'examples': ['JEALM9616', 'IESS10095'],
				'validations': ['type("igsn")']
			},
			'timestamp': {
				'label': 'Sampling Timestamp',
				'group': 'Result',
				'position': 10,
				'type': 'Timestamp',
				'description': 'Field sampling date and time',
				'notes': 'ISO 8601 date and time (e.g. "yyyy-mm-ddThh:mm:ss.sssZ"). See wikipedia.org/wiki/ISO_8601 for detailed explanation',
				'examples': ['2021-01-01T10:02:34.87', '2020-07-20T22:56:15-04:00'],
				'validations': ['type("date_time")']
			},
			'specimens': {
				'label': 'Specimen Name',
				'group': 'Result',
				'position': 11,
				'type': 'List',
				'description': 'Colon-delimited list of the names of specimens included in the result',
				'examples': ['SFVP01-03a:SFVP01-03b'],
				'validations': ['in("specimens.specimen")']
			},
			'experiments': {
				'label': 'Experiment Name',
				'group': 'Result',
				'position': 12,
				'type': 'List',
				'description': 'Colon-delimited list of the names of experiments included in the result',
				'examples': ['SFVP01-03a-150:SFVP01-03b-400'],
				'validations': ['in("experiments.experiment")']
			},
			'result_quality': {
				'label': 'Result Quality',
				'group': 'Result',
				'position': 13,
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
				'position': 14,
				'type': 'List',
				'description': 'Colon-delimited list of method codes',
				'validations': ['type("method_codes")', 'required()']
			},
			'display_order': {
				'label': 'Display Order',
				'group': 'Result',
				'position': 15,
				'type': 'Number',
				'description': 'Order of the rows for display purposes',
				'notes': 'If not set at upload will be set to the order in the uploaded file. Can be a float of either sign.',
				'examples': ['1', '0', '1.2', '-4.34']
			},
			'citations': {
				'label': 'Citation DOIs',
				'group': 'Result',
				'position': 16,
				'type': 'List',
				'description': 'Colon-delimited list of citation DOIs',
				'examples': ['10.1029/92JB01202', '10.1029/2003GC000635:This study', '"10.1023/A:1015035228810":This study'],
				'validations': ['type("references")']
			},
			'settings': {
				'label': 'Settings',
				'group': 'Geology',
				'position': 17,
				'type': 'List',
				'description': 'Colon-delimited list of geologic, archeological, or astronomical settings',
				'examples': ['Igneous', 'Sedimentary', 'Submarine', 'Lunar', 'Archeologic'],
				'validations': ['cv("class")']
			},
			'material_types': {
				'label': 'Sample Material Types',
				'group': 'Geology',
				'position': 18,
				'type': 'List',
				'description': 'Colon-delimited list of sample material types',
				'examples': ['Pluton', 'Lava Flow', 'Amphora', 'Volcanic Glass', 'Tuff'],
				'validations': ['cv("type")']
			},
			'lithologies': {
				'label': 'Lithologies',
				'group': 'Geology',
				'position': 19,
				'type': 'List',
				'description': 'Colon-delimited list of lithologies or archeological classifications',
				'examples': ['Chalk', 'Felsite', 'Granite', 'H Ordinary Chondrite', 'Organic Silt'],
				'validations': ['cv("lithology")']
			},
			'dir_polarity': {
				'label': 'Polarity',
				'group': 'Geology',
				'position': 20,
				'type': 'String',
				'unit': 'Flag',
				'description': 'Magnetic polarity of the site',
				'notes': 'n for normal, r for reverse, t for transitional, e for excursional',
				'examples': ['n', 'r', 't', 'e'],
				'validations': ['cv("polarity")']
			},
			'formation': {
				'label': 'Formation Name',
				'group': 'Geology',
				'position': 21,
				'type': 'String',
				'description': 'Name for formation',
				'examples': ['Tuff of Coyote Spring']
			},
			'formation_abbreviation': {
				'label': 'Formation Name Abbreviation',
				'group': 'Geology',
				'position': 22,
				'type': 'String',
				'description': 'Abbreviation for the formation name',
				'examples': ['Mics']
			},
			'member': {
				'label': 'Member Name',
				'group': 'Geology',
				'position': 23,
				'type': 'String',
				'description': 'Name for member',
				'examples': ['Glasshound Member']
			},
			'lat': {
				'label': 'Latitude',
				'group': 'Geography',
				'position': 24,
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
				'position': 25,
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
				'position': 26,
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
				'position': 27,
				'type': 'Number',
				'unit': 'Degrees',
				'description': 'Sample geographic location averaging uncertainty, Longitude',
				'notes': 'Decimal degrees',
				'examples': ['0.00034'],
				'validations': ['min(0)', 'max(360)']
			},
			'geographic_precision': {
				'label': 'Geographic Precision',
				'group': 'Geography',
				'position': 28,
				'type': 'Number',
				'unit': 'Degrees',
				'description': 'Sample geographic location, Precision in latitude and longitude',
				'notes': 'Decimal degrees',
				'examples': ['0.1'],
				'validations': ['min(0)', 'max(360)']
			},
			'continent_ocean': {
				'label': 'Continent or Ocean Name',
				'group': 'Geography',
				'position': 29,
				'type': 'String',
				'description': 'Continent or ocean name',
				'examples': ['North America', 'Africa', 'Pacific Ocean', 'Arctic Ocean'],
				'validations': ['cv("continent_ocean")']
			},
			'country': {
				'label': 'Country Name',
				'group': 'Geography',
				'position': 30,
				'type': 'String',
				'description': 'Country name',
				'examples': ['Nepal', 'Peru', 'Switzerland', 'United States of America'],
				'validations': ['cv("country")']
			},
			'state_province': {
				'label': 'State or Province Name',
				'group': 'Geography',
				'position': 31,
				'type': 'String',
				'description': 'State or province name',
				'examples': ['California', 'Alberta', 'Chongqing', 'Minas Gerais'],
				'validations': ['cv("state_province")']
			},
			'ocean_sea': {
				'label': 'Ocean or Sea Name',
				'group': 'Geography',
				'position': 32,
				'type': 'String',
				'description': 'Ocean or sea name',
				'examples': ['Adriatic Sea', 'English Channel', 'Red Sea', 'Pacific Ocean'],
				'validations': ['cv("ocean_sea")']
			},
			'order': {
				'label': 'Stratigraphic Order',
				'group': 'Geography',
				'position': 33,
				'type': 'Integer',
				'description': 'Order in the stratigraphic section',
				'notes': 'Lower number for younger age.'
			},
			'height': {
				'label': 'Stratigraphic Height',
				'group': 'Geography',
				'position': 34,
				'type': 'Number',
				'unit': 'm',
				'description': 'Sample geographic location, Stratigraphic height',
				'notes': 'Positive is up in section or core, while negative is down relative to reference height',
				'examples': ['1945', '234.6', '-45.3']
			},
			'elevation': {
				'label': 'Elevation',
				'group': 'Geography',
				'position': 35,
				'type': 'Number',
				'unit': 'm',
				'description': 'Site geographic location. Elevation relative to sealevel',
				'notes': 'Meters above sealevel'
			},
			'core_depth': {
				'label': 'Core Depth',
				'group': 'Geography',
				'position': 36,
				'type': 'Number',
				'unit': 'm',
				'description': 'Site geographic location. Core depth below seafloor/lake bottom or surface',
				'notes': 'Meters below seafloor'
			},
			'composite_depth': {
				'label': 'Composite Depth',
				'group': 'Geography',
				'position': 37,
				'type': 'Number',
				'unit': 'm',
				'description': 'Site geographic location. Composite below seafloor/lake bottom or surface',
				'notes': 'Meters below seafloor'
			},
			'description': {
				'label': 'Description',
				'group': 'Metadata',
				'position': 38,
				'type': 'String',
				'description': 'Sample and result description and comments',
				'examples': ['This sample was taken 130 cm from a 40 cm thick dike']
			},
			'instrument_codes': {
				'label': 'Instrument Codes',
				'group': 'Metadata',
				'position': 39,
				'type': 'List',
				'description': 'Colon-delimited list of instrument codes',
				'validations': ['sv("instrument_code")']
			},
			'software_packages': {
				'label': 'Software Packages',
				'group': 'Metadata',
				'position': 40,
				'type': 'List',
				'description': 'Colon-delimited list of software used for data reduction',
				'examples': ['Mass Spec 5.02', ' ArArCALC v2.5.2']
			},
			'source_dataset': {
				'label': 'Source Dataset',
				'group': 'Metadata',
				'position': 41,
				'type': 'String',
				'description': 'Data DOI or URL pointing to the source of the dataset if KArAr is not the Antarctica copy of the data',
				'examples': ['Geochron[IESS10095]'],
				'validations': ['cv("database_name")']
			},
			'scientists': {
				'label': 'Research Scientist Names',
				'group': 'Metadata',
				'position': 42,
				'type': 'List',
				'description': 'Colon-delimited list of EarthRef handles, ORCIDs, or names and emails for scientists who described the sample',
				'examples': ['@user1:@user2:0000-0002-9000-2100:Not A. Member <no.earthref.handle@gmail.com>'],
				'validations': ['type("users")']
			},
			'analysts': {
				'label': 'Analyst Names',
				'group': 'Metadata',
				'position': 43,
				'type': 'List',
				'description': 'Colon-delimited list of EarthRef handles, ORCIDs, or names and emails for scientists who described the sample',
				'examples': ['@user1:@user2:0000-0002-9000-2100:Not A. Member <no.earthref.handle@gmail.com>'],
				'validations': ['type("users")']
			}
		}
	},
	'specimens': {
		'label': 'Specimens',
		'position': 3,
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
			'age_internal_one_sigma_stderr': {
				'label': 'Age Internal One Sigma Standard Error',
				'group': 'Age',
				'position': 8,
				'type': 'Number',
				'unit': 'Custom',
				'description': 'Site age uncertainty, one sigma standard error of the internal age',
				'notes': 'Uncertianties in measurements and flux monitor values, but not external uncertainties, are included.',
				'examples': ['0.23', '850']
			},
			'age_external_one_sigma_stderr': {
				'label': 'Age External One Sigma Standard Error',
				'group': 'Age',
				'position': 9,
				'type': 'Number',
				'unit': 'Custom',
				'description': 'Site age uncertainty, one sigma standard error of the external age',
				'notes': 'Uncertainties in the standard ages, decay constants, Argon rations for air, etc. are included in the uncertainty of the age.',
				'examples': ['0.212', '832']
			},
			'age_low': {
				'label': 'Younger Age',
				'group': 'Age',
				'position': 10,
				'type': 'Number',
				'unit': 'Custom',
				'description': 'Sample youngest age constraint',
				'notes': 'Used for asymetrical age uncertainties often calculated using Baysean statistics when one has additional age constraints on the age of the site.',
				'validations': ['requiredUnless("age")']
			},
			'age_high': {
				'label': 'Older Age',
				'group': 'Age',
				'position': 11,
				'type': 'Number',
				'unit': 'Custom',
				'description': 'Sample oldest age constraint. Used for asymetrical age uncertainties often calculated using Baysean statistics when one has additional age constraints on the age of the site.',
				'notes': 'Used for asymetrical age uncertainties often calculated using Baysean statistics when one has additional age constraints on the age of the site.',
				'validations': ['requiredUnless("age")']
			},
			'age_unit': {
				'label': 'Age Unit',
				'group': 'Age',
				'position': 12,
				'type': 'String',
				'description': 'Specimen age unit',
				'examples': ['Ga', 'Ma', 'ka', 'BP'],
				'validations': ['cv("age_unit")', 'required()']
			},
			'age_calculation_method': {
				'label': 'Age Calculation Method',
				'group': 'Age',
				'position': 13,
				'type': 'String',
				'description': 'Method by which the age was determined',
				'examples': ['Plateau', 'Isochron', 'Multiple Total Fusion'],
				'validations': ['cv("age_method")', 'required()']
			},
			'age_interpretation': {
				'label': 'Age Interpretation',
				'group': 'Age',
				'position': 14,
				'type': 'String',
				'description': 'What the is being measured by the age',
				'examples': ['Crystalization Age', 'Reheating Event', 'Eruption Age'],
				'validations': ['cv("age_type")', 'required()']
			},
			'age_is_preferred': {
				'label': 'Age Is Preferred',
				'group': 'Age',
				'position': 15,
				'type': 'String',
				'description': 'Label the age as preferred for each calculation method',
				'validations': ['type("age_is_preferred")']
			},
			'age_description': {
				'label': 'Age Description',
				'group': 'Age',
				'position': 15,
				'type': 'String',
				'description': 'Additional information on how the age was determined',
				'examples': ['Isochron age used due to likely fractionalization of atmospheric argon']
			},
			'stnd_name': {
				'label': 'Age Standard Name',
				'group': 'Age Standard',
				'position': 16,
				'type': 'String',
				'description': 'Name of the irradiation age standard',
				'validations': ['required()']
			},
			'stnd_ref': {
				'label': 'Reference DOI',
				'group': 'Age Standard',
				'position': 17,
				'type': 'String',
				'description': 'DOI for the reference describing the age standard ',
				'validations': ['required()']
			},
			'stnd_material': {
				'label': 'Standard Material',
				'group': 'Age Standard',
				'position': 18,
				'type': 'String',
				'description': 'Material of the age standard',
				'validations': ['required()']
			},
			'stnd_age': {
				'label': 'Standard Age',
				'group': 'Age Standard',
				'position': 19,
				'type': 'Number',
				'unit': 'Custom',
				'description': 'Age of the age standard',
				'examples': ['Sandine', 'Biotite'],
				'validations': ['required()']
			},
			'stnd_age_one_sigma': {
				'label': 'Standard Age Error',
				'group': 'Age Standard',
				'position': 20,
				'type': 'Number',
				'unit': 'Custom',
				'description': 'Standard error of the age of the age standard at one sigma',
				'validations': ['required()']
			},
			'stnd_age_unit': {
				'label': 'Standard Age Unit',
				'group': 'Age Standard',
				'position': 21,
				'type': 'String',
				'description': 'Unit of the age of the age standard',
				'validations': ['cv("age_unit")', 'required()']
			},
			'stnd_decay_con_40ar_tot': {
				'label': 'Total ⁴⁰Ar Decay Constant',
				'group': 'Age Standard',
				'position': 22,
				'type': 'Number',
				'unit': '1/a',
				'description': 'Decay constant for total ⁴⁰Ar',
				'validations': ['required()']
			},
			'stnd_decay_con_40ar_tot_one_sigma': {
				'label': 'Total ⁴⁰Ar Decay Constant Uncertainty',
				'group': 'Age Standard',
				'position': 23,
				'type': 'Number',
				'unit': '1/a',
				'description': 'One sigma uncertainty in the decay constant for total ⁴⁰Ar',
				'validations': ['required()']
			},
			'stnd_decay_con_40ar_beta': {
				'label': '⁴⁰Ar Beta Decay Constant',
				'group': 'Age Standard',
				'position': 24,
				'type': 'Number',
				'unit': '1/a',
				'description': 'Decay constant for ⁴⁰Ar beta decay',
				'validations': ['required()']
			},
			'stnd_decay_con_40ar_beta_one_sigma': {
				'label': '⁴⁰Ar Beta Decay Constant Uncertainty',
				'group': 'Age Standard',
				'position': 25,
				'type': 'Number',
				'unit': '1/a',
				'description': 'One sigma uncertainty in the decay constant for ⁴⁰Ar beta decay',
				'validations': ['required()']
			},
			'stnd_decay_con_40ar_elect': {
				'label': '⁴⁰Ar Electron Decay Constant',
				'group': 'Age Standard',
				'position': 26,
				'type': 'Number',
				'unit': '1/a',
				'description': 'Decay constant for ⁴⁰Ar electron decay',
				'validations': ['required()']
			},
			'stnd_decay_con_40ar_elect_one_sigma': {
				'label': '⁴⁰Ar Electron Decay Constant',
				'group': 'Age Standard',
				'position': 27,
				'type': 'Number',
				'unit': '1/a',
				'description': 'Uncertainty in the decay constant for ⁴⁰Ar electron decay',
				'validations': ['required()']
			},
			'material': {
				'label': 'Specimen Material',
				'group': 'Specimen',
				'position': 28,
				'type': 'String',
				'description': 'The type of material of the specimen',
				'examples': ['Mineral'],
				'validations': ['required()']
			},
			'mineral_name': {
				'label': 'Specimen Mineral Name',
				'group': 'Specimen',
				'position': 29,
				'type': 'String',
				'description': 'The mineral composition of the specimen, if applicable',
				'examples': ['Plagioclase'],
				'validations': ['required()']
			},
			'treatment': {
				'label': 'Treatment',
				'group': 'Specimen',
				'position': 30,
				'type': 'String',
				'description': 'Treatment of the specimen',
				'examples': ['1x leach + 15min HF']
			},
			'grain_size_small': {
				'label': 'Smallest Grain Size',
				'group': 'Specimen',
				'position': 31,
				'type': 'Number',
				'unit': 'μm',
				'description': 'Lower limit on grain diameter',
				'examples': ['50']
			},
			'grain_size_large': {
				'label': 'Largest Grain Size',
				'group': 'Specimen',
				'position': 32,
				'type': 'String',
				'unit': 'μm',
				'description': 'Upper limit on grain diameter',
				'examples': ['100']
			},
			'weight': {
				'label': 'Specimen Weight',
				'group': 'Specimen',
				'position': 33,
				'type': 'Number',
				'unit': 'mg',
				'description': 'Weight of the specimen',
				'examples': ['SFVP01-01a'],
				'validations': ['required()']
			},
			'igsn': {
				'label': 'Specimen IGSN',
				'group': 'Specimen',
				'position': 34,
				'type': 'String',
				'description': 'International Geo Sample Number (IGSN) for the specimen',
				'examples': ['SIO0A0987', 'SIO001317'],
				'validations': ['type("igsn")', 'required()']
			},
			'result_quality': {
				'label': 'Result Quality',
				'group': 'Result',
				'position': 35,
				'type': 'String',
				'unit': 'Flag',
				'description': 'Indicating if good (g) or bad (b) data',
				'notes': 'Can be left empty. This is the case for most legacy data sets.',
				'validations': ['cv("data_quality")', 'required()']
			},
			'method_codes': {
				'label': 'Method Codes',
				'group': 'Result',
				'position': 36,
				'type': 'List',
				'description': 'Colon-delimited list of method codes',
				'validations': ['type("method_codes")', 'required()']
			},
			'display_order': {
				'label': 'Display Order',
				'group': 'Result',
				'position': 37,
				'type': 'Number',
				'description': 'Order of the rows for display purposes. If not set at upload will be set to the order in the uploaded file. Can be a float of either sign.',
				'examples': ['1', '0', '1.2', '-4.34']
			},
			'citations': {
				'label': 'Citation DOIs',
				'group': 'Result',
				'position': 38,
				'type': 'List',
				'description': 'Colon-delimited list of citation DOIs',
				'examples': ['10.1029/92JB01202', '10.1029/2003GC000635:This study', '"10.1023/A:1015035228810":This study'],
				'validations': ['type("references")']
			},
			'geologic_classes': {
				'label': 'Geologic Classes',
				'group': 'Geology',
				'position': 39,
				'type': 'List',
				'description': 'Colon-delimited list of geologic classes',
				'validations': ['cv("class")']
			},
			'geologic_types': {
				'label': 'Sample Material Types',
				'group': 'Geology',
				'position': 40,
				'type': 'List',
				'description': 'Colon-delimited list of sample material types',
				'validations': ['cv("type")']
			},
			'lithologies': {
				'label': 'Lithologies',
				'group': 'Geology',
				'position': 41,
				'type': 'List',
				'description': 'Colon-delimited list of lithologies or archeological classifications',
				'validations': ['cv("lithology")']
			},
			'description': {
				'label': 'Description',
				'group': 'Metadata',
				'position': 42,
				'type': 'String',
				'description': 'Specimen and result description and comments'
			},
			'instrument_codes': {
				'label': 'Instrument Codes',
				'group': 'Metadata',
				'position': 43,
				'type': 'List',
				'description': 'Colon-delimited list of instrument codes',
				'validations': ['sv("instrument_code")']
			},
			'software_packages': {
				'label': 'Software Packages',
				'group': 'Metadata',
				'position': 44,
				'type': 'List',
				'description': 'Colon-delimited list of software used for data reduction',
				'examples': ['PmagPy v1.67b', 'FORCinel v1.11']
			},
			'external_database_ids': {
				'label': 'External Database IDs',
				'group': 'Metadata',
				'position': 45,
				'type': 'Dictionary',
				'description': 'Dictionary of external databases and IDs where data are used',
				'examples': ['GEOMAGIA50[1435]:CALS7K.2[23]', 'ARCHEO00[2329]', 'ARCHEO00[] if the ID is unknown'],
				'validations': ['cv("database_name")']
			},
			'scientists': {
				'label': 'Research Scientist Names',
				'group': 'Metadata',
				'position': 46,
				'type': 'List',
				'description': 'Colon-delimited list of EarthRef handles or ORCIDs or names and emails for scientists who described the specimen',
				'examples': ['@user1:@user2:0000-0002-9000-2100:Not A. Member <no.earthref.handle@gmail.com>'],
				'validations': ['type("users")']
			},
			'analysts': {
				'label': 'Analyst Names',
				'group': 'Metadata',
				'position': 47,
				'type': 'List',
				'description': 'Colon-delimited list of EarthRef handles, ORCIDs, or names and emails for scientists who described the sample',
				'examples': ['@user1:@user2:0000-0002-9000-2100:Not A. Member <no.earthref.handle@gmail.com>'],
				'validations': ['type("users")']
			}
		}
	},
	'experiments': {
		'label': 'Experiments',
		'position': 4,
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
				'validations': ['cv("reactor_name")']
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
			'extraction_type': {
				'label': 'Extraction Type',
				'group': 'Experiment',
				'position': 8,
				'type': 'String',
				'description': 'Type of extraction used to release the gas',
				'examples': ['Bulk Laser Heating'],
				'validations': ['cv("extraction_type")']
			},
			'age_calculation_method': {
				'label': 'Age Calculation Method',
				'group': 'Age',
				'position': 9,
				'type': 'String',
				'description': 'Method by which the age was determined',
				'examples': ['Plateau', 'Isochron', 'Multiple Total Fusion'],
				'validations': ['cv("age_method")', 'required()']
			},
			'age': {
				'label': 'Age',
				'group': 'Age',
				'position': 10,
				'type': 'Number',
				'description': 'Age',
				'examples': ['0.9287'],
				'validations': ['recommended()']
			},
			'age_sigma': {
				'label': 'Age Sigma',
				'group': 'Age',
				'position': 11,
				'type': 'Number',
				'description': 'Age sigma',
				'examples': ['0.0046'],
				'validations': ['recommended()']
			},
			'age_sigma_internal': {
				'label': 'Age Sigma Internal',
				'group': 'Age',
				'position': 12,
				'type': 'Number',
				'description': 'Age sigma internal',
				'examples': ['0.0049'],
				'validations': ['recommended()']
			},
			'age_sigma_external': {
				'label': 'Age Sigma External',
				'group': 'Age',
				'position': 13,
				'type': 'Number',
				'description': 'Age sigma external',
				'examples': ['0.0115'],
				'validations': ['recommended()']
			},
			'age_mswd': {
				'label': 'Age MSWD',
				'group': 'Age',
				'position': 14,
				'type': 'Number',
				'description': 'MSWD',
				'examples': ['1.648885685'],
				'validations': ['recommended()']
			},
			'age_error_magnification': {
				'label': 'Age Error Magnification',
				'group': 'Age',
				'position': 15,
				'type': 'Number',
				'description': 'Error magnification',
				'examples': ['1'],
				'validations': ['recommended()']
			},
			'age_width': {
				'label': 'Age Width',
				'group': 'Age',
				'position': 16,
				'type': 'Number',
				'description': 'Width',
				'examples': ['71.25573562'],
				'validations': ['recommended()']
			},
			'age_n': {
				'label': 'Age N',
				'group': 'Age',
				'position': 17,
				'type': 'Integer',
				'description': 'Number of steps in the weighted plateau',
				'examples': ['20'],
				'validations': ['recommended()']
			},
			'age_steps': {
				'label': 'Age Steps',
				'group': 'Age',
				'position': 18,
				'type': 'String',
				'description': 'Ordered list of plateau step measurement names',
				'examples': ['14D26130:14D26132:14D26133:14D26135:14D26136:14D26138:14D26141:14D26144:14D26145:14D26147:14D26148:14D26150:14D26151:14D26153:14D26154'],
				'validations': ['recommended()']
			},
			'k_ca_ratio': {
				'label': 'K/Ca Ratio',
				'group': 'Age',
				'position': 19,
				'type': 'Number',
				'description': 'K/Ca ratio',
				'examples': ['2.99E-02'],
				'validations': ['recommended()']
			},
			'k_ca_ratio_sigma': {
				'label': 'K/Ca Ratio Sigma',
				'group': 'Age',
				'position': 20,
				'type': 'Number',
				'description': 'K/Ca ratio sigma',
				'examples': ['5.93E-03'],
				'validations': ['recommended()']
			},
			'40ar_39ar_ratio': {
				'label': '⁴⁰Ar/³⁹Ar Ratio',
				'group': 'Age',
				'position': 21,
				'type': 'Number',
				'description': '⁴⁰Ar/³⁹Ar ratio',
				'examples': ['0.3278178096'],
				'validations': ['recommended()']
			},
			'40ar_39ar_ratio_sigma': {
				'label': '⁴⁰Ar/³⁹Ar Ratio Sigma',
				'group': 'Age',
				'position': 22,
				'type': 'Number',
				'description': '⁴⁰Ar/³⁹Ar ratio sigma',
				'examples': ['1.63E-03'],
				'validations': ['recommended()']
			},
			'isochron_40ar_36ar_ratio': {
				'label': 'Isochron ⁴⁰Ar/³⁶Ar Ratio',
				'group': 'Age',
				'position': 23,
				'type': 'Number',
				'description': 'Isochron ⁴⁰Ar/³⁶Ar ratio',
				'examples': ['297.0133084'],
				'validations': ['recommended()']
			},
			'isochron_40ar_36ar_ratio_sigma': {
				'label': 'Isochron ⁴⁰Ar/³⁶Ar Ratio Sigma',
				'group': 'Age',
				'position': 24,
				'type': 'Number',
				'description': 'Isochron ⁴⁰Ar/³⁶Ar ratio sigma',
				'examples': ['2.589015486'],
				'validations': ['recommended()']
			},
			'isochron_convergence': {
				'label': 'Isochron Convergence',
				'group': 'Age',
				'position': 25,
				'type': 'Number',
				'description': 'Isochron convergence',
				'examples': ['3'],
				'validations': ['recommended()']
			},
			'isochron_iterations': {
				'label': 'Isochron Iterations',
				'group': 'Age',
				'position': 26,
				'type': 'String',
				'description': 'Isochron iterations',
				'examples': ['Weighted York-2'],
				'validations': ['recommended()']
			},
			'description': {
				'label': 'Description',
				'group': 'Metadata',
				'position': 27,
				'type': 'String',
				'description': 'Experiment description and comments',
				'examples': ['Specimen in the same disk as some very old (>3 Ga) samples']
			},
			'software_packages': {
				'label': 'Software Packages',
				'group': 'Metadata',
				'position': 28,
				'type': 'List',
				'description': 'Colon-delimited list of software used for data collection, reduction, and analysis.',
				'examples': ['Mass Spec 5.02', ' ArArCALC v2.5.2'],
				'validations': ['recommended()']
			}
		}
	},
	'measurements': {
		'label': 'Measurements',
		'position': 5,
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
				'position': 6,
				'type': 'Number',
				'description': 'Age calculated from the gas released from one heating step',
				'examples': ['46.1714277611336'],
				'validations': ['required()']
			},
			'age_one_sigma': {
				'label': 'Age One Sigma',
				'group': 'Measurement',
				'position': 7,
				'type': 'Number',
				'description': 'One sigma standard deviation of the age',
				'examples': ['1.38063235829088'],
				'validations': ['required()']
			},
			'age_unit': {
				'label': 'Age Unit',
				'group': 'Measurement',
				'position': 8,
				'type': 'String',
				'description': 'Unit of the age value',
				'examples': ['ka', 'Ma', 'Ga', 'BP'],
				'validations': ['cv("age_unit")', 'required()']
			},
			'fraction_40ar_radiogenic': {
				'label': 'Fraction of ⁴⁰Ar Radiogenic',
				'group': 'Measurement',
				'position': 9,
				'type': 'Number',
				'description': 'Fraction of ⁴⁰Ar radiogenic',
				'examples': ['75.0568593170697'],
				'validations': ['required()']
			},
			'fraction_39ar_k': {
				'label': 'Fraction of ³⁹Ar K',
				'group': 'Measurement',
				'position': 10,
				'type': 'Number',
				'description': 'Fraction of ³⁹Ar potassium',
				'examples': ['0.699600858319132'],
				'validations': ['required()']
			},
			'k_ca_ratio': {
				'label': 'K to Ca Ratio',
				'group': 'Measurement',
				'position': 11,
				'type': 'Number',
				'description': 'Potassium to calcium ratio calculated from the Ar gas measurements ',
				'examples': ['0.0235523539210429'],
				'validations': ['required()']
			},
			'k_ca_ratio_one_sigma': {
				'label': 'K to Ca Ratio One Sigma',
				'group': 'Measurement',
				'position': 12,
				'type': 'Number',
				'description': 'One sigma standard deviation of the potassium to calcium ratio',
				'examples': ['0.0020463936244812'],
				'validations': ['required()']
			},
			'sequence': {
				'label': 'Sequence',
				'group': 'Measurement',
				'position': 13,
				'type': 'Integer',
				'description': 'Order of the measurements',
				'examples': ['-50', '0', '1', '343'],
				'validations': ['unique()', 'recommended()']
			},
			'standard': {
				'label': 'Standard',
				'group': 'Measurement',
				'position': 14,
				'type': 'String',
				'description': 'Indicating if a standard (s) or an unknown (u) measurement',
				'examples': ['s', 'u'],
				'validations': ['cv("measurement_type")']
			},
			'quality': {
				'label': 'Quality',
				'group': 'Measurement',
				'position': 15,
				'type': 'String',
				'description': 'Indicating if a good (g) or bad (b) measurement',
				'examples': ['g', 'b'],
				'validations': ['cv("data_quality")', 'required()']
			},
			'temp': {
				'label': 'Temperature',
				'group': 'Measurement',
				'position': 16,
				'type': 'Number',
				'description': 'Heating temperature of the measurement step as defined by Temperature Unit',
				'examples': ['200', '1.5'],
				'validations': ['required()']
			},
			'temp_unit': {
				'label': 'Temperature Unit',
				'group': 'Measurement',
				'position': 17,
				'type': 'String',
				'description': 'Temperature Unit',
				'examples': ['Celcius', 'Watts'],
				'validations': ['cv("temp_unit")', 'required()']
			},
			'isolation_duration': {
				'label': 'Specimen Isolation Duration',
				'group': 'Measurement',
				'position': 18,
				'type': 'Number',
				'unit': 'days',
				'description': 'Number of days between the end of the irradiation and the measurement',
				'examples': ['143', '64', '15.4'],
				'validations': ['required()']
			},
			'instrument_codes': {
				'label': 'Instrument Code',
				'group': 'Measurement',
				'position': 19,
				'type': 'List',
				'description': 'Colon-delimited list of instrument codes',
				'examples': ['SIO-Bubba', 'IRM-OldBlue']
			},
			'mdf_value': {
				'label': 'Mass Discrimination Factor',
				'group': 'Mass Discrimination',
				'position': 20,
				'type': 'Number',
				'description': 'Value used to correct ion beam measurements due to systematic differences in measurement values due to isotopic mass differences',
				'examples': ['0.992978'],
				'validations': ['required()']
			},
			'mdf_value_one_sigma': {
				'label': 'Mass Discrimination Factor One Sigma',
				'group': 'Mass Discrimination',
				'position': 21,
				'type': 'Number',
				'description': 'Uncertainty on the mass discrimination factor',
				'examples': ['6.62410E-04'],
				'validations': ['required()']
			},
			'mdf_law_applied': {
				'label': 'Mass Discrimination Interpolation Type',
				'group': 'Mass Discrimination',
				'position': 22,
				'type': 'String',
				'description': 'Type of interpolation used for calculating the mass discrimination values',
				'examples': ['Linear'],
				'validations': ['cv("mdf_law")', 'required()']
			},
			'mdf_40ar_36_standard_ratio': {
				'label': '⁴⁰Ar/³⁶Ar Standard Ratio',
				'group': 'Mass Discrimination',
				'position': 23,
				'type': 'Number',
				'description': 'Usually the ⁴⁰Ar/³⁶Ar for atmospheric argon that is commonly used as the standard for determining mass discrimination',
				'examples': ['295.5', '298.56'],
				'validations': ['required()']
			},
			'mdf_40ar_36ar_standard_ratio_one_sigma': {
				'label': '⁴⁰Ar/³⁶Ar Standard Ratio One Sigma',
				'group': 'Mass Discrimination',
				'position': 24,
				'type': 'Number',
				'description': 'The standard deviaton of the ⁴⁰Ar/³⁶Ar ratio of the standard',
				'validations': ['required()']
			},
			'intercept_36ar': {
				'label': '³⁶Ar Intercept',
				'group': 'Intercepts',
				'position': 25,
				'type': 'Number',
				'description': '³⁶Ar isotopic signal evolution corrected extrapolated back to zero time. ',
				'examples': ['0.049369'],
				'validations': ['required()']
			},
			'intercept_36ar_one_sigma': {
				'label': '³⁶Ar Intercept One Sigma',
				'group': 'Intercepts',
				'position': 26,
				'type': 'Number',
				'description': 'Standard deviation of the corrected ³⁶Ar intercept at one sigma',
				'examples': ['0.000595'],
				'validations': ['required()']
			},
			'intercept_36ar_regression_type': {
				'label': '³⁶Ar Regression Type',
				'group': 'Intercepts',
				'position': 27,
				'type': 'String',
				'description': 'Type of fit to the decay (regression) of the ³⁶Ar ionic gas signal.',
				'examples': ['Exponential'],
				'validations': ['required()']
			},
			'intercept_37ar': {
				'label': '³⁷Ar Intercept',
				'group': 'Intercepts',
				'position': 28,
				'type': 'Number',
				'description': '³⁷Ar isotopic signal evolution corrected extrapolated back to zero time. ',
				'examples': ['0.490369'],
				'validations': ['required()']
			},
			'intercept_37ar_one_sigma': {
				'label': '³⁷Ar Intercept One Sigma',
				'group': 'Intercepts',
				'position': 29,
				'type': 'Number',
				'description': 'Standard deviation of the corrected ³⁶Ar intercept at one sigma',
				'examples': ['0.030336'],
				'validations': ['required()']
			},
			'intercept_37ar_regression_type': {
				'label': '³⁷Ar Regression Type',
				'group': 'Intercepts',
				'position': 30,
				'type': 'String',
				'description': 'Type of fit to the decay (regression) of the ³⁶Ar ionic gas signal.',
				'examples': ['Exponential'],
				'validations': ['required()']
			},
			'intercept_38ar': {
				'label': '³⁸Ar Intercept',
				'group': 'Intercepts',
				'position': 31,
				'type': 'Number',
				'description': '³⁸Ar isotopic signal evolution corrected extrapolated back to zero time. ',
				'examples': ['-0.017148'],
				'validations': ['required()']
			},
			'intercept_38ar_one_sigma': {
				'label': '³⁸Ar Intercept One Sigma',
				'group': 'Intercepts',
				'position': 32,
				'type': 'Number',
				'description': 'Standard deviation of the corrected ³⁶Ar intercept at one sigma',
				'examples': ['0.025811'],
				'validations': ['required()']
			},
			'intercept_38ar_regression_type': {
				'label': '³⁸Ar Regression Type',
				'group': 'Intercepts',
				'position': 33,
				'type': 'String',
				'description': 'Type of fit to the decay (regression) of the ³⁶Ar ionic gas signal.',
				'examples': ['Exponential'],
				'validations': ['required()']
			},
			'intercept_39ar': {
				'label': '³⁹Ar Intercept',
				'group': 'Intercepts',
				'position': 34,
				'type': 'Number',
				'description': '³⁹Ar isotopic signal evolution corrected extrapolated back to zero time. ',
				'examples': ['1.416676'],
				'validations': ['required()']
			},
			'intercept_39ar_sigma': {
				'label': '³⁹Ar Intercept One Sigma',
				'group': 'Intercepts',
				'position': 35,
				'type': 'Number',
				'description': 'Standard deviation of the corrected ³⁶Ar intercept at one sigma',
				'examples': ['0.026428'],
				'validations': ['required()']
			},
			'intercept_39ar_regression_type': {
				'label': '³⁹Ar Regression Type',
				'group': 'Intercepts',
				'position': 36,
				'type': 'String',
				'description': 'Type of fit to the decay (regression) of the ³⁶Ar ionic gas signal.',
				'examples': ['Exponential'],
				'validations': ['required()']
			},
			'intercept_40ar': {
				'label': '⁴⁰Ar Intercept',
				'group': 'Intercepts',
				'position': 37,
				'type': 'Number',
				'description': '⁴⁰Ar isotopic signal evolution corrected extrapolated back to zero time. ',
				'examples': ['33.930073'],
				'validations': ['required()']
			},
			'intercept_40ar_sigma': {
				'label': '⁴⁰Ar Intercept One Sigma',
				'group': 'Intercepts',
				'position': 38,
				'type': 'Number',
				'description': 'Standard deviation of the corrected ³⁶Ar intercept at one sigma',
				'examples': ['0.029470'],
				'validations': ['required()']
			},
			'intercept_40ar_regression_type': {
				'label': '⁴⁰Ar Regression Type',
				'group': 'Intercepts',
				'position': 39,
				'type': 'String',
				'description': 'Type of fit to the decay (regression) of the ³⁶Ar ionic gas signal.',
				'examples': ['Exponential'],
				'validations': ['required()']
			},
			'intercept_unit': {
				'label': 'Intercept Unit',
				'group': 'Intercepts',
				'position': 40,
				'type': 'String',
				'description': 'Type of unit used for the intercept',
				'examples': ['Volts'],
				'validations': ['required()']
			},
			'blank_36ar': {
				'label': '³⁶Ar Blank',
				'group': 'Blanks',
				'position': 41,
				'type': 'Number',
				'description': 'Measuerement of ³⁶Ar blank',
				'examples': ['0.0201'],
				'validations': ['required()']
			},
			'blank_36ar_one_sigma': {
				'label': '³⁶Ar Blank One Sigma',
				'group': 'Blanks',
				'position': 42,
				'type': 'Number',
				'description': 'One sigma standard deviation of the ³⁶Ar blank',
				'examples': ['0.000671'],
				'validations': ['required()']
			},
			'blank_37ar': {
				'label': '³⁷Ar Blank',
				'group': 'Blanks',
				'position': 43,
				'type': 'Number',
				'description': 'Measuerement of ³⁷Ar blank',
				'examples': ['-0.0124'],
				'validations': ['required()']
			},
			'blank_37ar_one_sigma': {
				'label': '³⁷Ar Blank One Sigma',
				'group': 'Blanks',
				'position': 44,
				'type': 'Number',
				'description': 'One sigma standard deviation of the ³⁷Ar blank',
				'examples': ['0.0285'],
				'validations': ['required()']
			},
			'blank_38ar': {
				'label': '³⁸Ar Blank',
				'group': 'Blanks',
				'position': 45,
				'type': 'Number',
				'description': 'Measuerement of ³⁸Ar blank',
				'examples': ['-0.0655'],
				'validations': ['required()']
			},
			'blank_38ar_one_sigma': {
				'label': '³⁸Ar Blank One Sigma',
				'group': 'Blanks',
				'position': 46,
				'type': 'Number',
				'description': 'One sigma standard deviation of the ³⁸Ar blank',
				'examples': ['0.02650452'],
				'validations': ['required()']
			},
			'blank_39ar': {
				'label': '³⁹Ar Blank',
				'group': 'Blanks',
				'position': 47,
				'type': 'Number',
				'description': 'Measuerement of ³⁹Ar blank',
				'examples': ['-0.0329926'],
				'validations': ['required()']
			},
			'blank_39ar_one_sigma': {
				'label': '³⁹Ar Blank One Sigma',
				'group': 'Blanks',
				'position': 48,
				'type': 'Number',
				'description': 'One sigma standard deviation of the ³⁹Ar blank',
				'examples': ['0.025284611'],
				'validations': ['required()']
			},
			'blank_40ar': {
				'label': '⁴⁰Ar Blank',
				'group': 'Blanks',
				'position': 49,
				'type': 'Number',
				'description': 'Measuerement of ⁴⁰Ar blank',
				'examples': ['5.918450679'],
				'validations': ['required()']
			},
			'blank_40ar_one_sigma': {
				'label': '⁴⁰Ar Blank One Sigma',
				'group': 'Blanks',
				'position': 50,
				'type': 'Number',
				'description': 'One sigma standard deviation of the ⁴⁰Ar blank',
				'examples': ['0.0887'],
				'validations': ['required()']
			},
			'blank_unit': {
				'label': 'Blank Unit',
				'group': 'Blanks',
				'position': 51,
				'type': 'String',
				'description': 'Type of unit used for the blank measurement',
				'examples': ['Volts'],
				'validations': ['required()']
			},
			'j_value': {
				'label': 'Irradiation Flux Parameter',
				'group': 'Irradiation',
				'position': 52,
				'type': 'Number',
				'description': 'J value of the age determination',
				'notes': 'J is the irradiation flux parameter with its value determined from measuring the ratio of radiogentic ⁴⁰Ar to ³⁹Ar generated by potassium decay from a specimen of known age (the age standard)',
				'validations': ['required()']
			},
			'j_value_one_sigma': {
				'label': 'Irradiation Flux Parameter One Sigma',
				'group': 'Irradiation',
				'position': 53,
				'type': 'Number',
				'description': 'One sigma standard uncertainty of the J value',
				'validations': ['required()']
			},
			'correction_40ar_36ar_atmospheric': {
				'label': '⁴⁰Ar/³⁶Ar Atmospheric Correction',
				'group': 'Irradiation',
				'position': 54,
				'type': 'Number',
				'description': 'The ⁴⁰Ar/³⁶Ar atmospheric correction',
				'examples': [295.5],
				'validations': ['required()']
			},
			'correction_40ar_36ar_atmospheric_one_sigma': {
				'label': '⁴⁰Ar/³⁶Ar Atmospheric Correction One Sigma',
				'group': 'Irradiation',
				'position': 55,
				'type': 'Number',
				'description': 'The ⁴⁰Ar/³⁶Ar atmospheric correction at one sigma',
				'examples': [0],
				'validations': ['required()']
			},
			'correction_40ar_36ar_cosmogenic': {
				'label': '⁴⁰Ar/³⁶Ar Cosmogenic Correction',
				'group': 'Irradiation',
				'position': 56,
				'type': 'Number',
				'description': 'The ⁴⁰Ar/³⁶Ar cosmogenic correction',
				'examples': [0.018],
				'validations': ['recommended()']
			},
			'correction_40ar_36ar_cosmogenic_one_sigma': {
				'label': '⁴⁰Ar/³⁶Ar Cosmogenic Correction One Sigma',
				'group': 'Irradiation',
				'position': 57,
				'type': 'Number',
				'description': 'The ⁴⁰Ar/³⁶Ar cosmogenic correction at one sigma',
				'examples': [0.0063],
				'validations': ['recommended()']
			},
			'correction_38ar_36ar_atmospheric': {
				'label': '³⁸Ar/³⁶Ar Atmospheric Correction',
				'group': 'Irradiation',
				'position': 58,
				'type': 'Number',
				'description': 'The ³⁸Ar/³⁶Ar Atmospheric correction',
				'examples': [0.1869],
				'validations': ['recommended()']
			},
			'correction_38ar_36ar_atmospheric_one_sigma': {
				'label': '³⁸Ar/³⁶Ar Atmospheric Correction One Sigma',
				'group': 'Irradiation',
				'position': 59,
				'type': 'Number',
				'description': 'The ³⁸Ar/³⁶Ar Atmospheric correction at one sigma',
				'examples': [0],
				'validations': ['recommended()']
			},
			'correction_38ar_36ar_cosmogenic': {
				'label': '³⁸Ar/³⁶Ar Cosmogenic Correction',
				'group': 'Irradiation',
				'position': 60,
				'type': 'Number',
				'description': 'The ³⁸Ar/³⁶Ar Cosmogenic correction',
				'examples': [1.493],
				'validations': ['recommended()']
			},
			'correction_38ar_36ar_cosmogenic_one_sigma': {
				'label': '³⁸Ar/³⁶Ar Cosmogenic Correction One Sigma',
				'group': 'Irradiation',
				'position': 61,
				'type': 'Number',
				'description': 'The ³⁸Ar/³⁶Ar Cosmogenic correction at one sigma',
				'examples': [0.04479],
				'validations': ['recommended()']
			},
			'correction_39ar_37ar_calcium': {
				'label': '³⁹Ar/³⁷Ar Calcium Correction',
				'group': 'Irradiation',
				'position': 62,
				'type': 'Number',
				'description': 'The ³⁹Ar/³⁷Ar Calcium correction',
				'examples': [0.0006756],
				'validations': ['recommended()']
			},
			'correction_39ar_37ar_calcium_one_sigma': {
				'label': '³⁹Ar/³⁷Ar Calcium Correction One Sigma',
				'group': 'Irradiation',
				'position': 63,
				'type': 'Number',
				'description': 'The ³⁹Ar/³⁷Ar Calcium correction at one sigma',
				'examples': [0.00000891792],
				'validations': ['recommended()']
			},
			'correction_38ar_37ar_calcium': {
				'label': '³⁸Ar/³⁷Ar Calcium Correction',
				'group': 'Irradiation',
				'position': 64,
				'type': 'Number',
				'description': 'The ³⁸Ar/³⁷Ar Calcium correction',
				'examples': [0.0000718],
				'validations': ['recommended()']
			},
			'correction_38ar_37ar_calcium_one_sigma': {
				'label': '³⁸Ar/³⁷Ar Calcium Correction One Sigma',
				'group': 'Irradiation',
				'position': 65,
				'type': 'Number',
				'description': 'The ³⁸Ar/³⁷Ar Calcium correction at one sigma',
				'examples': [0.00000920476],
				'validations': ['recommended()']
			},
			'correction_36ar_37ar_calcium': {
				'label': '³⁶Ar/³⁷Ar Calcium Correction',
				'group': 'Irradiation',
				'position': 66,
				'type': 'Number',
				'description': 'The ³⁶Ar/³⁷Ar Calcium correction',
				'examples': [0.0002663],
				'validations': ['recommended()']
			},
			'correction_36ar_37ar_calcium_one_sigma': {
				'label': '³⁶Ar/³⁷Ar Calcium Correction One Sigma',
				'group': 'Irradiation',
				'position': 67,
				'type': 'Number',
				'description': 'The ³⁶Ar/³⁷Ar Calcium correction at one sigma',
				'examples': [0.00000039945],
				'validations': ['recommended()']
			},
			'correction_40ar_39ar_potassium': {
				'label': '⁴⁰Ar/³⁹Ar Potassium Correction',
				'group': 'Irradiation',
				'position': 68,
				'type': 'Number',
				'description': 'The ⁴⁰Ar/³⁹Ar Potassium correction',
				'examples': [0.003823],
				'validations': ['recommended()']
			},
			'correction_40ar_39ar_potassium_one_sigma': {
				'label': '⁴⁰Ar/³⁹Ar Potassium Correction One Sigma',
				'group': 'Irradiation',
				'position': 69,
				'type': 'Number',
				'description': 'The ⁴⁰Ar/³⁹Ar Potassium correction at one sigma',
				'examples': [0.000101692],
				'validations': ['recommended()']
			},
			'correction_38ar_39ar_potassium': {
				'label': '³⁸Ar/³⁹Ar Potassium Correction',
				'group': 'Irradiation',
				'position': 70,
				'type': 'Number',
				'description': 'The ³⁸Ar/³⁹Ar Potassium correction',
				'examples': [0.012031],
				'validations': ['recommended()']
			},
			'correction_38ar_39ar_potassium_one_sigma': {
				'label': '³⁸Ar/³⁹Ar Potassium Correction One Sigma',
				'group': 'Irradiation',
				'position': 71,
				'type': 'Number',
				'description': 'The ³⁸Ar/³⁹Ar Potassium correction at one sigma',
				'examples': [0.0000192496],
				'validations': ['recommended()']
			},
			'chlorine_production_ratio_36ar_38ar': {
				'label': 'Chlorine Production Ratio ³⁶Ar/³⁸Ar',
				'group': 'Irradiation',
				'position': 72,
				'type': 'Number',
				'description': 'The Chlorine production ratio ³⁶Ar/³⁸Ar',
				'examples': [0],
				'validations': ['recommended()']
			},
			'chlorine_production_ratio_36ar_38ar_one_sigma': {
				'label': 'Chlorine Production Ratio ³⁶Ar/³⁸Ar One Sigma',
				'group': 'Irradiation',
				'position': 73,
				'type': 'Number',
				'description': 'The Chlorine production ratio ³⁶Ar/³⁸Ar at one sigma',
				'examples': [0],
				'validations': ['recommended()']
			},
			'correction_k_ca': {
				'label': 'K/Ca Correction',
				'group': 'Irradiation',
				'position': 74,
				'type': 'Number',
				'description': 'The K/Ca correction',
				'examples': [0.43]
			},
			'correction_k_ca_one_sigma': {
				'label': 'K/Ca Correction One Sigma',
				'group': 'Irradiation',
				'position': 75,
				'type': 'Number',
				'description': 'The K/Ca correction at one sigma',
				'examples': [0]
			},
			'correction_k_cl': {
				'label': 'K/Cl Correction',
				'group': 'Irradiation',
				'position': 76,
				'type': 'Number',
				'description': 'The K/Cl correction',
				'examples': [0]
			},
			'correction_k_cl_one_sigma': {
				'label': 'K/Cl Correction One Sigma',
				'group': 'Irradiation',
				'position': 77,
				'type': 'Number',
				'description': 'The K/Cl correction at one sigma',
				'examples': [0]
			},
			'correction_ca_cl': {
				'label': 'Ca/Cl Correction',
				'group': 'Irradiation',
				'position': 78,
				'type': 'Number',
				'description': 'The Ca/Cl correction',
				'examples': [0]
			},
			'correction_ca_cl_one_sigma': {
				'label': 'Ca/Cl Correction One Sigma',
				'group': 'Irradiation',
				'position': 79,
				'type': 'Number',
				'description': 'The Ca/Cl correction at one sigma',
				'examples': [0]
			},
			'corrected_total_40ar_39ar_ratio': {
				'label': 'Corrected Total ⁴⁰Ar ³⁹Ar Ratio',
				'group': 'Isotopic Ratios',
				'position': 80,
				'type': 'Number',
				'description': 'The total ⁴⁰Ar to ³⁹Ar ratio corrected for the blank, air, and spurious irradiation production',
				'examples': ['19.11172885'],
				'validations': ['required()']
			},
			'corrected_total_40ar_39ar_ratio_one_sigma': {
				'label': 'Corrected Total ⁴⁰Ar ³⁹Ar Ratio One Sigma',
				'group': 'Isotopic Ratios',
				'position': 81,
				'type': 'Number',
				'description': 'One sigma uncertainty on the total ⁴⁰Ar to ³⁹Ar ratio corrected for the blank, air, and spurious irradiation production',
				'examples': ['0.486567232'],
				'validations': ['required()']
			},
			'corrected_total_37ar_39ar_ratio': {
				'label': 'Corrected Total ³⁷Ar ³⁹Ar Ratio',
				'group': 'Isotopic Ratios',
				'position': 82,
				'type': 'Number',
				'description': 'The total ³⁷Ar ³⁹Ar ratio corrected for the blank, air, and spurious irradiation production',
				'examples': ['18.03474773'],
				'validations': ['required()']
			},
			'corrected_total_37ar_39ar_ratio_one_sigma': {
				'label': 'Corrected Total ³⁷Ar ³⁹Ar Ratio One Sigma',
				'group': 'Isotopic Ratios',
				'position': 83,
				'type': 'Number',
				'description': 'One sigma uncertainty on the total ³⁷Ar ³⁹Ar ratio corrected for the blank, air, and spurious irradiation production',
				'examples': ['1.56523173'],
				'validations': ['required()']
			},
			'corrected_total_36ar_39ar_ratio': {
				'label': 'Corrected Total ³⁶Ar ³⁹Ar Ratio',
				'group': 'Isotopic Ratios',
				'position': 84,
				'type': 'Number',
				'description': 'The total ³⁶Ar ³⁹Ar ratio corrected for the blank, air, and spurious irradiation production',
				'examples': ['0.0209'],
				'validations': ['required()']
			},
			'corrected_total_36ar_39ar_ratio_one_sigma': {
				'label': 'Corrected Total ³⁶Ar ³⁹Ar Ratio One Sigma',
				'group': 'Isotopic Ratios',
				'position': 85,
				'type': 'Number',
				'description': 'One sigma uncertainty on the total ³⁶Ar ³⁹Ar ratio corrected for the blank, air, and spurious irradiation production',
				'examples': ['0.000833'],
				'validations': ['required()']
			},
			'corrected_40ar_rad_39ar_k_ratio': {
				'label': 'Corrected ⁴⁰Ar Rad ³⁹Ar K Ratio',
				'group': 'Isotopic Ratios',
				'position': 86,
				'type': 'Number',
				'description': 'The total ⁴⁰Ar Rad ³⁹Ar K  ratio corrected for the blank, air, and spurious irradiation production',
				'examples': ['14.52159859'],
				'validations': ['required()']
			},
			'corrected_40ar_rad_39ar_k_ratio_one_sigma': {
				'label': 'Corrected ⁴⁰Ar Rad ³⁹Ar K Ratio One Sigma',
				'group': 'Isotopic Ratios',
				'position': 87,
				'type': 'Number',
				'description': 'One sigma uncertainty on the total ⁴⁰Ar Rad ³⁹Ar K ratio corrected for the blank, air, and spurious irradiation production',
				'examples': ['0.439796482'],
				'validations': ['required()']
			},
			'corrrected_39ar_k_36ar_atm_ratio': {
				'label': 'Corrected ³⁹Ar K ³⁶Ar Atm Ratio',
				'group': 'Isotopic Ratios',
				'position': 88,
				'type': 'Number',
				'description': 'The total ³⁹Ar K ³⁶Ar ratio corrected for the blank, air, and spurious irradiation production',
				'examples': ['61.28109106'],
				'validations': ['required()']
			},
			'corrrected_39ar_k_36ar_atm_ratio_one_sigma': {
				'label': 'Corrected ³⁹Ar K ³⁶Ar Atm Ratio One Sigma',
				'group': 'Isotopic Ratios',
				'position': 89,
				'type': 'Number',
				'description': 'One sigma uncertainty on the total ³⁹Ar K ³⁶Ar ratio corrected for the blank, air, and spurious irradiation production',
				'examples': ['3.278702202'],
				'validations': ['required()']
			},
			'corrrected_40ar_rad_atm_36ar_atm_ratio': {
				'label': 'Corrected ⁴⁰Ar Rad Atm ³⁶Ar Atm Ratio',
				'group': 'Isotopic Ratios',
				'position': 90,
				'type': 'Number',
				'description': 'The total ⁴⁰Ar Rad Atm ³⁶Ar ratio corrected for the blank, air, and spurious irradiation production',
				'examples': ['1185.399 40569445'],
				'validations': ['required()']
			},
			'corrected_40ar_rad_atm_36ar_atm_ratio_one_sigma': {
				'label': 'Corrected ⁴⁰Ar Rad Atm ³⁶Ar Atm Ratio One Sigma',
				'group': 'Isotopic Ratios',
				'position': 91,
				'type': 'Number',
				'description': 'One sigma uncertainty on the total ⁴⁰Ar Rad Atm ³⁶Ar ratio corrected for the blank, air, and spurious irradiation production',
				'examples': ['55.84951125'],
				'validations': ['required()']
			},
			'corrected_39ar_k_40ar_rad_atm_ratio': {
				'label': 'Corrected ³⁹Ar K ⁴⁰Ar Rad Atm Ratio',
				'group': 'Isotopic Ratios',
				'position': 92,
				'type': 'Number',
				'description': 'The total ³⁹Ar K ⁴⁰Ar ratio corrected for the blank, air, and spurious irradiation production',
				'examples': ['0.0517'],
				'validations': ['required()']
			},
			'corrected_39ar_k_40ar_rad_atm_ratio_one_sigma': {
				'label': 'Corrected ³⁹Ar K ⁴⁰Ar Rad Atm Ratio One Sigma',
				'group': 'Isotopic Ratios',
				'position': 93,
				'type': 'Number',
				'description': 'One sigma uncertainty on the total ³⁹Ar K ⁴⁰Ar ratio corrected for the blank, air, and spurious irradiation production',
				'examples': ['0.00133'],
				'validations': ['required()']
			},
			'corrected_36ar_atm_40ar_rad_atm_ratio': {
				'label': 'Corrected ³⁶Ar Atm ⁴⁰Ar Rad Atm Ratio',
				'group': 'Isotopic Ratios',
				'position': 94,
				'type': 'Number',
				'description': 'The total ³⁶Ar Atm ⁴⁰Ar ratio corrected for the blank, air, and spurious irradiation production',
				'examples': ['0.000844'],
				'validations': ['required()']
			},
			'corrected_36ar_atm_40ar_rad_atm_ratio_one_sigma': {
				'label': 'Corrected ³⁶Ar Atm ⁴⁰Ar Rad Atm Ratio One Sigma',
				'group': 'Isotopic Ratios',
				'position': 95,
				'type': 'Number',
				'description': 'One sigma uncertainty on the total ³⁶Ar Atm ⁴⁰Ar ratio corrected for the blank, air, and spurious irradiation production',
				'examples': ['0.0000397'],
				'validations': ['required()']
			},
			'corr_coefficient_40_36_over_39_36': {
				'label': 'Correlaton Coefficient 40 36 Over 39 36',
				'group': 'Isotopic Ratios',
				'position': 96,
				'type': 'Number',
				'description': 'The correlaton coefficient 40 36 over 39 36',
				'examples': ['0.876178159'],
				'validations': ['required()']
			},
			'corr_coefficient_36_40_over_39_40': {
				'label': 'Correlation Coefficient 36 40 Over 39 40',
				'group': 'Isotopic Ratios',
				'position': 97,
				'type': 'Number',
				'description': 'The correlaton coefficient 36 40 over 39 40',
				'examples': ['0.0887'],
				'validations': ['required()']
			},
			'corrected_36ar_atmospheric': {
				'label': 'Corrected ³⁶Ar Atmospheric',
				'group': 'Isotopes',
				'position': 98,
				'type': 'Number',
				'description': 'Corrected ³⁶Ar atmospheric',
				'examples': ['0.0236'],
				'validations': ['required()']
			},
			'corrected_36ar_atmospheric_one_sigma': {
				'label': 'Corrected ³⁶Ar Atmospheric Sigma',
				'group': 'Isotopes',
				'position': 99,
				'type': 'Number',
				'description': 'Corrected ³⁶Ar atmospheric uncertainty at one sigma',
				'examples': ['0.00111'],
				'validations': ['required()']
			},
			'corrected_36ar_cosmogenic': {
				'label': 'Corrected ³⁶Ar Cosmogenic',
				'group': 'Isotopes',
				'position': 100,
				'type': 'Number',
				'description': 'Corrected ³⁶Ar cosmogenic',
				'examples': ['0'],
				'validations': ['required()']
			},
			'corrected_36ar_cosmogenic_one_sigma': {
				'label': 'Corrected ³⁶Ar Cosmogenic Sigma',
				'group': 'Isotopes',
				'position': 101,
				'type': 'Number',
				'description': 'Corrected ³⁶Ar cosmogenic uncertainty at one sigma',
				'examples': ['0'],
				'validations': ['required()']
			},
			'corrected_36ar_calcium': {
				'label': 'Corrected ³⁶Ar Calcium',
				'group': 'Isotopes',
				'position': 102,
				'type': 'Number',
				'description': 'Corrected ³⁶Ar calcium',
				'examples': ['0.00702'],
				'validations': ['required()']
			},
			'corrected_36ar_calcium_sigma': {
				'label': 'Corrected ³⁶Ar Calcium Sigma',
				'group': 'Isotopes',
				'position': 103,
				'type': 'Number',
				'description': 'Corrected ³⁶Ar calcium uncertainty at one sigma',
				'examples': ['0.000583'],
				'validations': ['required()']
			},
			'corrected_36ar_chlorine': {
				'label': 'Corrected ³⁶Ar Chlorine',
				'group': 'Isotopes',
				'position': 104,
				'type': 'Number',
				'description': 'Corrected ³⁶Ar chlorine',
				'examples': ['0.0000082'],
				'validations': ['required()']
			},
			'corrected_36ar_chlorine_one_sigma': {
				'label': 'Corrected ³⁶Ar Chlorine Sigma',
				'group': 'Isotopes',
				'position': 105,
				'type': 'Number',
				'description': 'Corrected ³⁶Ar chlorine uncertainty at one sigma',
				'examples': ['0.0000121'],
				'validations': ['required()']
			},
			'corrected_37ar_calcium': {
				'label': 'Corrected ³⁷Ar Calcium',
				'group': 'Isotopes',
				'position': 106,
				'type': 'Number',
				'description': 'Corrected ³⁷Ar calcium',
				'examples': ['26.36604476'],
				'validations': ['required()']
			},
			'corrected_37ar_calcium_one_sigma': {
				'label': 'Corrected ³⁷Ar Calcium Sigma',
				'group': 'Isotopes',
				'position': 107,
				'type': 'Number',
				'description': 'Corrected ³⁷Ar calcium uncertainty at one sigma',
				'examples': ['2.189 40507664209'],
				'validations': ['required()']
			},
			'corrected_38ar_atmospheric': {
				'label': 'Corrected ³⁸Ar Atmospheric',
				'group': 'Isotopes',
				'position': 108,
				'type': 'Number',
				'description': 'Corrected ³⁸Ar atmospheric',
				'examples': ['0.004 40447004480264'],
				'validations': ['required()']
			},
			'corrected_38ar_atmospheric_one_sigma': {
				'label': 'Corrected ³⁸Ar Atmospheric Sigma',
				'group': 'Isotopes',
				'position': 109,
				'type': 'Number',
				'description': 'Corrected ³⁸Ar atmospheric uncertainty at one sigma',
				'examples': ['0.000207'],
				'validations': ['required()']
			},
			'corrected_38ar_cosmogenic': {
				'label': 'Corrected ³⁸Ar Cosmogenic',
				'group': 'Isotopes',
				'position': 110,
				'type': 'Number',
				'description': 'Corrected ³⁸Ar cosmogenic',
				'examples': ['0'],
				'validations': ['required()']
			},
			'corrected_38ar_cosmogenic_one_sigma': {
				'label': 'Corrected ³⁸Ar Cosmogenic Sigma',
				'group': 'Isotopes',
				'position': 111,
				'type': 'Number',
				'description': 'Corrected ³⁸Ar cosmogenic uncertainty at one sigma',
				'examples': ['0'],
				'validations': ['required()']
			},
			'corrected_38ar_potassium': {
				'label': 'Corrected ³⁸Ar Potassium',
				'group': 'Isotopes',
				'position': 112,
				'type': 'Number',
				'description': 'Corrected ³⁸Ar potassium',
				'examples': ['0.0174'],
				'validations': ['required()']
			},
			'corrected_38ar_potassium_one_sigma': {
				'label': 'Corrected ³⁸Ar Potassium Sigma',
				'group': 'Isotopes',
				'position': 113,
				'type': 'Number',
				'description': 'Corrected ³⁸Ar potassium uncertainty at one sigma',
				'examples': ['0.000445'],
				'validations': ['required()']
			},
			'corrected_38ar_calcium': {
				'label': 'Corrected ³⁸Ar Calcium',
				'group': 'Isotopes',
				'position': 114,
				'type': 'Number',
				'description': 'Corrected ³⁸Ar calcium',
				'examples': ['0.00189'],
				'validations': ['required()']
			},
			'corrected_38ar_calcium_one_sigma': {
				'label': 'Corrected ³⁸Ar Calcium Sigma',
				'group': 'Isotopes',
				'position': 115,
				'type': 'Number',
				'description': 'Corrected ³⁸Ar calcium uncertainty at one sigma',
				'examples': ['0.0002891566 40411995'],
				'validations': ['required()']
			},
			'corrected_38ar_chlorine': {
				'label': 'Corrected ³⁸Ar Chlorine',
				'group': 'Isotopes',
				'position': 116,
				'type': 'Number',
				'description': 'Corrected ³⁸Ar chlorine',
				'examples': ['0.0253'],
				'validations': ['required()']
			},
			'corrected_38ar_chlorine_one_sigma': {
				'label': 'Corrected ³⁸Ar Chlorine Sigma',
				'group': 'Isotopes',
				'position': 117,
				'type': 'Number',
				'description': 'Corrected ³⁸Ar chlorine uncertainty at one sigma',
				'examples': ['0.037531241 4056014'],
				'validations': ['required()']
			},
			'corrected_39ar_potassium': {
				'label': 'Corrected ³⁹Ar Potassium',
				'group': 'Isotopes',
				'position': 118,
				'type': 'Number',
				'description': 'Corrected ³⁹Ar potassium',
				'examples': ['1.444145157'],
				'validations': ['required()']
			},
			'corrected_39ar_potassium_one_sigma': {
				'label': 'Corrected ³⁹Ar Potassium Sigma',
				'group': 'Isotopes',
				'position': 119,
				'type': 'Number',
				'description': 'Corrected ³⁹Ar potassium uncertainty at one sigma',
				'examples': ['0.0369'],
				'validations': ['required()']
			},
			'corrected_39ar_calcium': {
				'label': 'Corrected ³⁹Ar Calcium',
				'group': 'Isotopes',
				'position': 120,
				'type': 'Number',
				'description': 'Corrected ³⁹Ar calcium',
				'examples': ['0.0178'],
				'validations': ['required()']
			},
			'corrected_39ar_calcium_one_sigma': {
				'label': 'Corrected ³⁹Ar Calcium Sigma',
				'group': 'Isotopes',
				'position': 121,
				'type': 'Number',
				'description': 'Corrected ³⁹Ar calcium uncertainty at one sigma',
				'examples': ['0.0015'],
				'validations': ['required()']
			},
			'corrected_40ar_radiogenic': {
				'label': 'Corrected ⁴⁰Ar Radiogenic',
				'group': 'Isotopes',
				'position': 122,
				'type': 'Number',
				'description': 'Corrected ⁴⁰Ar radiogenic',
				'examples': ['20.97129628'],
				'validations': ['required()']
			},
			'corrected_40ar_radiogenic_one_sigma': {
				'label': 'Corrected ⁴⁰Ar Radiogenic Sigma',
				'group': 'Isotopes',
				'position': 123,
				'type': 'Number',
				'description': 'Corrected ⁴⁰Ar radiogenic uncertainty at one sigma',
				'examples': ['0.3 40300462178874'],
				'validations': ['required()']
			},
			'corrected_40ar_atmospheric': {
				'label': 'Corrected ⁴⁰Ar Atmospheric',
				'group': 'Isotopes',
				'position': 124,
				'type': 'Number',
				'description': 'Corrected ⁴⁰Ar atmospheric',
				'examples': ['6.963728723'],
				'validations': ['required()']
			},
			'corrected_40ar_atmospheric_one_sigma': {
				'label': 'Corrected ⁴⁰Ar Atmospheric Sigma',
				'group': 'Isotopes',
				'position': 125,
				'type': 'Number',
				'description': 'Corrected ⁴⁰Ar atmospheric uncertainty at one sigma',
				'examples': ['0.327267692'],
				'validations': ['required()']
			},
			'corrected_40ar_cosmogenic': {
				'label': 'Corrected ⁴⁰Ar Cosmogenic',
				'group': 'Isotopes',
				'position': 126,
				'type': 'Number',
				'description': 'Corrected ⁴⁰Ar cosmogenic',
				'examples': ['0'],
				'validations': ['required()']
			},
			'corrected_40ar_cosmogenic_one_sigma': {
				'label': 'Corrected ⁴⁰Ar Cosmogenic Sigma',
				'group': 'Isotopes',
				'position': 127,
				'type': 'Number',
				'description': 'Corrected ⁴⁰Ar cosmogenic uncertainty at one sigma',
				'examples': ['0'],
				'validations': ['required()']
			},
			'corrected_40ar_potassium': {
				'label': 'Corrected ⁴⁰Ar Potassium',
				'group': 'Isotopes',
				'position': 128,
				'type': 'Number',
				'description': 'Corrected ⁴⁰Ar potassium',
				'examples': ['0.00552'],
				'validations': ['required()']
			},
			'corrected_40ar_potassium_one_sigma': {
				'label': 'Corrected ⁴⁰Ar Potassium Sigma',
				'group': 'Isotopes',
				'position': 129,
				'type': 'Number',
				'description': 'Corrected ⁴⁰Ar potassium uncertainty at one sigma',
				'examples': ['0.000204'],
				'validations': ['required()']
			},
			'description': {
				'label': 'Description',
				'group': 'Metadata',
				'position': 130,
				'type': 'String',
				'description': 'Measurement description and comments'
			},
			'timestamp': {
				'label': 'Measurement Timestamp',
				'group': 'Metadata',
				'position': 131,
				'type': 'Timestamp',
				'description': 'Date and time when the measurement was made',
				'notes': 'ISO 8601 date and time (e.g. "yyyy-mm-ddThh:mm:ss.sssZ"). See wikipedia.org/wiki/ISO_8601 for detailed explanation',
				'examples': ['2021-01-01T10:02:34.87', '2020-07-20T22:56:15-04:00'],
				'validations': ['required()']
			},
			'software_packages': {
				'label': 'Software Packages',
				'group': 'Metadata',
				'position': 132,
				'type': 'List',
				'description': 'Colon-delimited list of software used for data reduction',
				'examples': ['Mass Spec 5.02', ' ArArCALC v2.5.2'],
				'validations': ['required()']
			},
			'analysts': {
				'label': 'Analyst Names',
				'group': 'Metadata',
				'position': 133,
				'type': 'List',
				'description': 'Colon-delimited list of EarthRef handles, ORCIDs, or names and emails for scientists who described the sample or ORCID id',
				'examples': ['@user1:@user2:0000-0002-9000-2100:Not A. Member <no.earthref.handle@gmail.com>'],
				'validations': ['type("users")']
			}
		}
	}

}
};