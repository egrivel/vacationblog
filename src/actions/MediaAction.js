
import AppDispatcher from '../AppDispatcher';
import utils from './utils';
import MediaActionTypes from './MediaActionTypes';

const MediaAction = {
  Types: MediaActionTypes,

  loadMedia: function(tripId, mediaId) {
    setTimeout(() => {
      AppDispatcher.dispatch({
        type: MediaAction.Types.MEDIA_LOADING,
        data: {
          mediaId: mediaId
        }
      });
    }, 0);
    const url = 'api/getMedia.php?tripId=' + tripId + '&mediaId=' + mediaId;
    utils.getAsync(url, (response) => {
      const data = JSON.parse(response);
      MediaAction._mediaLoaded(data);
    });
  },

  bulkLoadMedia: function(tripId, list) {
    let listString = '';
    for (let i = 0; i < list.length; i++) {
      if (i) {
        listString += ',';
      }
      listString += list[i];
    }
    const url = 'api/getMedia.php?tripId=' + tripId + '&list=' + listString;
    utils.getAsync(url, (response) => {
      const data = JSON.parse(response);
      MediaAction._bulkMediaLoaded(data);
    });
  },

  saveMedia: function(tripId, mediaId, info) {
    const submitData = {
      tripId: tripId,
      mediaId: mediaId,
      width: info.width,
      height: info.height,
      caption: info.caption,
      location: info.location,
      url: info.url
    };
    AppDispatcher.dispatch({
      type: this.Types.MEDIA_DATA,
      data: submitData
    });
    const url = 'api/putMedia.php';
    utils.postAsync(url, submitData, (response) => {
      const responseData = JSON.parse(response, true);
      if (!responseData.resultCode || (responseData.resultCode !== '200')) {
        // eslint-disable-next-line no-console
        console.log('Got response ' + response);
      }
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

export default MediaAction;
