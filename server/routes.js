import { Picker } from 'meteor/meteorhacks:picker';

import { models } from '/lib/configs/karar/data_models';

Picker.route('/KArAr/data-models/1.1.json', function(params, request, response, next) {
  response.setHeader('Content-Type', "text/plain;charset=utf-8");
  response.statusCode = 200;
  response.end(JSON.stringify(models['1.0'], null, '\t'));
});