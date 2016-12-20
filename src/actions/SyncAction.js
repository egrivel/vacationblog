'use strict';

const AppDispatcher = require('../AppDispatcher');
const utils = require('./utils');

const SyncAction = {
  Types: {
    SYNC_UPDATE_INFO: 'SYNC_UPDATE_INFO',
    SYNC_SET_MESSAGE: 'SYNC_SET_MESSAGE'
  },

  updateInfo: function(info) {
    AppDispatcher.dispatch({
      type: SyncAction.Types.SYNC_UPDATE_INFO,
      info: info
    });
  },

  doSync: function(site, password) {
    AppDispatcher.dispatch({
      type: SyncAction.Types.SYNC_SET_MESSAGE,
      message: 'Calling ' + site
    });
    const url = 'api/synchMaster.php';
    const sendObj = {};
    sendObj.site = site;
    sendObj.password = password;
    utils.postAsync(url, sendObj, function(response) {
      AppDispatcher.dispatch({
        type: SyncAction.Types.SYNC_SET_MESSAGE,
        message: 'Called ' + site + ' which responded with "' +
          response + '"'
      });
    });
  }
};

module.exports = SyncAction;
