'use strict';

var AppDispatcher = require('../AppDispatcher');
var utils = require('./utils');

var MediaAction = {
  Types: {
    MEDIA_DATA: 'MEDIA_DATA',
    MEDIA_BULK_DATA: 'MEDIA_BULK_DATA'
  },
  loadMedia: function(tripId, mediaId) {
    var url = 'api/getMedia.php?tripId=' + tripId + '&mediaId=' + mediaId;
    utils.getAsync(url, function(response) {
      var data = JSON.parse(response);
      MediaAction._mediaLoaded(data);
    });
  },
  bulkLoadMedia: function(tripId, list) {
    var listString = '';
    var i;
    for (i = 0; i < list.length; i++) {
      if (i) {
        listString += ',';
      }
      listString += list[i];
    }
    var url = 'api/getMedia.php?tripId=' + tripId + '&list=' + listString;
    utils.getAsync(url, function(response) {
      var data = JSON.parse(response);
      MediaAction._bulkMediaLoaded(data);
    });
  },
  _mediaLoaded: function(data) {
    AppDispatcher.dispatch({
      type: this.Types.MEDIA_DATA,
      data: data
    });
  },
  _bulkMediaLoaded: function(data) {
    AppDispatcher.dispatch({
      type: this.Types.MEDIA_BULK_DATA,
      data: data
    });
  }
};

module.exports = MediaAction;
