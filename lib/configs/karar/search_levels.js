let levels = [
  { name: 'Contributions' },
  { name: 'Samples'       },
  { name: 'Specimens'     },
  { name: 'Experiments'   },
  { name: 'Measurements'  }
];

let index = 'karar';

levels[0].views = [ { name: 'Summaries', es: { index: index, type: 'contribution' , source: {excludes: ['*.vals'                   ], includes: ['summary._incomplete_summary', 'summary.contribution.*',                                     'summary._all.*']} }}],
//                    { name: 'Sites Map', es: { index: index, type: 'sites'        , source: {excludes: [                           ], includes: ['summary._incomplete_summary', 'summary.contribution.*', 'summary.' + 'sites'        + '.*', 'summary._all._geo_point']} }}];
//                  { name: 'Plots'    , es: { index: index, type: 'contribution' , source: {excludes: ['*.vals', '*._geo_point'   ], includes: ['summary._incomplete_summary', 'summary.contribution.*',                                     'summary._all.*'} } ,
//                  { name: 'Images'   , es: { index: index, type: 'contribution' , source: {excludes: ['*.vals', '*._geo_point'   ], includes: ['summary._incomplete_summary', 'summary.contribution.*',                                     'summary._all.*'} } ];
levels[1].views = [ { name: 'Summaries', es: { index: index, type: 'samples'      , source: {excludes: ['*.vals', '*._geo_envelope'], includes: ['summary._incomplete_summary', 'summary.contribution.*', 'summary.' + 'samples'      + '.*', 'summary._all.*']} }} ,
//                    { name: 'Map'      , es: { index: index, type: 'samples'      , source: {excludes: [                           ], includes: ['summary._incomplete_summary', 'summary.contribution.*', 'summary.' + 'samples'      + '.*', 'summary._all._geo_point']} }} ,
                    { name: 'Rows'     , es: { index: index, type: 'samples'      , source: {excludes: ['*.vals', '*._geo_envelope'], includes: ['summary._incomplete_summary', 'summary.contribution.*', 'summary.' + 'samples'      + '.*', 'summary._all.*']}    , countField: 'summary.samples._n_results' }} ]; //,
//                  { name: 'Ages'     , es: { index: index, type: 'samples'      , source: {excludes: ['*.vals', '*._geo_envelope'], includes: ['summary._incomplete_summary', 'summary.contribution.*', 'summary.' + 'samples'      + '.*', 'summary._all.*'} } ,
levels[2].views = [ { name: 'Summaries', es: { index: index, type: 'specimens'    , source: {excludes: ['*.vals', '*._geo_envelope'], includes: ['summary._incomplete_summary', 'summary.contribution.*', 'summary.' + 'specimens'    + '.*', 'summary._all.*']} }} ,
                    { name: 'Rows'     , es: { index: index, type: 'specimens'    , source: {excludes: ['*.vals', '*._geo_envelope'], includes: ['summary._incomplete_summary', 'summary.contribution.*', 'summary.' + 'specimens'    + '.*', 'summary._all.*']}    , countField: 'summary.specimens._n_results' }} ]; //,
//                  { name: 'Plots'    , es: { index: index, type: 'specimens'    , source: {excludes: ['*.vals', '*._geo_envelope'], includes: ['summary._incomplete_summary', 'summary.contribution.*', 'summary.' + 'specimens'    + '.*', 'summary._all.*'} } ,
//                  { name: 'Images'   , es: { index: index, type: 'specimens'    , source: {excludes: ['*.vals', '*._geo_envelope'], includes: ['summary._incomplete_summary', 'summary.contribution.*', 'summary.' + 'specimens'    + '.*', 'summary._all.*'} } ];
levels[3].views = [ { name: 'Summaries', es: { index: index, type: 'experiments'  , source: {excludes: ['*.vals', '*._geo_envelope'], includes: ['summary._incomplete_summary', 'summary.contribution.*', 'summary.' + 'experiments'  + '.*', 'summary._all.*']} }} ,
                    { name: 'Rows'     , es: { index: index, type: 'experiments'  , source: {excludes: ['*.vals', '*._geo_envelope'], includes: ['summary._incomplete_summary', 'summary.contribution.*', 'summary.' + 'experiments'  + '.*', 'summary._all.*']}    , countField: 'summary.experiments._n_results' }} ];
levels[4].views = [ { name: 'Rows'     , es: { index: index, type: 'measurements'  , source: {excludes: ['*.vals', '*._geo_envelope'], includes: ['summary._incomplete_summary', 'summary.contribution.*', 'summary.' + 'measurements'  + '.*', 'summary._all.*']}    , countField: 'summary.measurements._n_results' }} ];

export {levels, index};