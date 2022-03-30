import {Meteor} from 'meteor/meteor';
import {HTTP} from 'meteor/http';

import _ from 'lodash';
import moment from 'moment';
import request from 'request';

import {Collections, collectionDefinitions} from '/lib/collections';

export default function () {

  Meteor.methods({

    'createImportSettingsTemplate': function (user, name, settings) {
      //console.log('create import', user, name, settings);
      return Collections['karar.import.settings.templates'].insert({
        _user: user,
        _name: name,
        _inserted: moment().utc().toISOString(),
        settings: settings
      }, (error) => { console.log('create import', error)});
    },

    'saveImportSettingsTemplate': function (user, ID, settings) {
      //console.log('save import', user, ID, settings);
      Collections['karar.import.settings.templates'].update({
        _id: ID,
        _user: user
      }, {
        $set: { settings: settings }
      }, (error) => { console.log('save import', error)});
    },

    'renameImportSettingsTemplate': function (user, ID, name) {
      //console.log('rename import', user, ID, name);
      Collections['karar.import.settings.templates'].update({
        _id: ID,
        _user: user
      }, {
        $set: { _name: name }
      }, (error) => { console.log('rename import', error)});
    },

    'deleteImportSettingsTemplate': function (user, ID) {
      //console.log('delete import', user, ID);
      Collections['karar.import.settings.templates'].remove({
        _id: ID,
        _user: user
      }, (error) => { console.log('delete import', error)});
    },

    'getImportSettingsTemplates': function (user) {
      console.log('getImportSettingsTemplates', user);
      let templates = Collections['karar.import.settings.templates'].find(
        {_user: user},
        {sort: {'_inserted': -1}}).fetch();
      console.log('getImportSettingsTemplates', user, templates);
      return templates;
    },

    'getImportSettingsTemplate': function (ID) {
      return Collections['karar.import.settings.templates'].findOne(ID);
    },

    async kararGetPrivateContribution(id, user, attempt = 0) {
      this.unblock();
      console.log("kararGetPrivateContribution", id, user, attempt);

      try {
        return await Meteor.call("s3GetObject", { 
          bucket: `karar-private-contributions/${id}`,
          key: `karar_contribution_${id}.txt`,
          encoding: 'utf-8'
        });
      } catch (e) {
        // console.error("kararGetPrivateContribution", `Failed to retrieve private contribution for ${id}`, e);
        throw new Meteor.Error("kararGetPrivateContribution", `Failed to retrieve private contribution for ${id}`);
      }
    },

    async kararGetPrivateContributionZip(id, user, attempt = 0) {
      this.unblock();
      console.log("kararGetPrivateContributionZip", id, user, attempt);

      try {
        return await Meteor.call("s3GetObject", { 
          bucket: `karar-private-contributions/${id}`,
          key: `karar_contribution_${id}.zip`
        });
      } catch (e) {
        // console.error("kararGetPrivateContributionZip", `Failed to retrieve private contribution for ${id}`, e);
        throw new Meteor.Error("kararGetPrivateContributionZip", `Failed to retrieve private contribution for ${id}`);
      }
    },

    async kararGetPublicContributions(ids, fileName, user, attempt = 0) {
      this.unblock();
      console.log("kararGetPublicContributions", ids, fileName, user, attempt);

      try {
        return await Meteor.call("s3GetObjectsZip", {
          fileName,
          objects: ids.map(id => { 
            return { 
              bucket: `karar-activated-contributions/${id}`,
              key: `karar_contribution_${id}.txt`
            };
          })
        });
      } catch (e) {
        console.error("kararGetPublicContributions", `Failed to retrieve private contributions for IDs ${ids.join(', ')}`, e);
        // throw new Meteor.Error("kararGetPublicContributions", `Failed to retrieve private contributions for IDs ${ids.join(', ')}`);
      }
    }

  });

};