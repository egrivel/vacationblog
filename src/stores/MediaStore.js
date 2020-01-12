import _ from 'lodash';
import assign from 'object-assign';

import GenericStore from './GenericStore';
import AppDispatcher from '../AppDispatcher';
import MediaActionTypes from '../actions/MediaActionTypes';

let _mediaData = {};
let _mediaStatus = {};

const MediaStore = assign({}, GenericStore, {
  _reset: function() {
    _mediaData = {};
    _mediaStatus = {};
  },

  /**
   * Obtain all the information of the media item.
   * @param {id} tripId - unique trip ID.
   * @param {id} mediaId - unique media ID.
   * @return {object} information about the media item.
   */
  getData: function getData(tripId, mediaId) {
    const data = _mediaData[tripId + '|' + mediaId];
    return data;
  },

  getStatus: function getStatus(mediaId) {
    return _mediaStatus[mediaId];
  },

  setLoading: function setLoading(mediaId) {
    _mediaStatus[mediaId] = 'loading';
  },

  // eslint-disable-next-line complexity
  _storeCallback: function(action) {
    let count;
    let list;
    let updateCount;
    let index;

    switch (action.type) {
      case MediaActionTypes.MEDIA_LOADING:
        _mediaStatus[action.data.mediaId] = 'loading';
        break;

      case MediaActionTypes.MEDIA_DATA:
        _mediaStatus[action.data.mediaId] = 'loaded';
        index = action.data.tripId + '|' + action.data.mediaId;
        if (!_.isEqual(_mediaData[index], action.data)) {
          _mediaData[index] = action.data;
          MediaStore.emitChange();
        }
        break;

      case MediaActionTypes.MEDIA_BULK_DATA:
        count = action.data.count;
        list = action.data.list;
        updateCount = 0;
        for (let i = 0; i < count; i++) {
          const id = list[i].tripId + '|' + list[i].mediaId;
          if (!_mediaData[id] || !_.isEqual(_mediaData[id], list[i])) {
            _mediaData[id] = list[i];
            updateCount++;
          }
        }
        if (updateCount) {
          MediaStore.emitChange();
        }
        break;

      default:
        // do nothing
        break;
    }
  }
});

MediaStore.dispatchToken = AppDispatcher.register(MediaStore._storeCallback);

export default MediaStore;
