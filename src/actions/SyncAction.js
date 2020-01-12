
import AppDispatcher from '../AppDispatcher';
import utils from './utils';
import SyncActionTypes from './SyncActionTypes';

const SyncAction = {
  Types: SyncActionTypes,

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
    utils.postAsync(url, sendObj, (response) => {
      AppDispatcher.dispatch({
        type: SyncAction.Types.SYNC_SET_MESSAGE,
        message: 'Called ' + site + ' which responded with "' +
          response + '"'
      });
    });
  }
};

export default SyncAction;
