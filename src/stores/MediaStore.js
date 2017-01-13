'use strict';

const _ = require('lodash');
const assign = require('object-assign');

const GenericStore = require('./GenericStore');
const AppDispatcher = require('../AppDispatcher');
const MediaActionTypes = require('../actions/MediaAction').Types;

let _mediaData = {};

const MediaStore = assign({}, GenericStore, {
  _reset: function() {
    _mediaData = {};
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

  _storeCallback: function(action) {
    switch (action.type) {
      case MediaActionTypes.MEDIA_DATA:
        var index = action.data.tripId + '|' + action.data.mediaId;
        if (!_.isEqual(_mediaData[index], action.data)) {
          _mediaData[index] = action.data;
          MediaStore.emitChange();
        }
        break;

      case MediaActionTypes.MEDIA_BULK_DATA:
        var count = action.data.count;
        var list = action.data.list;
        var updateCount = 0;
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

module.exports = MediaStore;
