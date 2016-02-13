'use strict';

var AppDispatcher = require('../AppDispatcher');
var utils = require('./utils');

var TripAction = require('./TripAction');
var CommentAction = require('./CommentAction');
var MediaAction = require('./MediaAction');

var JournalAction = {
  Types: {
    JOURNAL_DATA: 'JOURNAL_DATA'
  },

  _getMediaFromText: function(text) {
    if (!text) {
      return null;
    }

    var images = [];

    var list = text.split('[IMG ');
    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      if (item.indexOf(']') > 0) {
        var img = item.substring(0, item.indexOf(']')).trim();
        if (img.match(/^[\d\-abc]+$/)) {
          // this is a valid image ID
          images.push(img);
        }
      }
    }

    return images;
  },

  _journalLoaded: function(data) {
    AppDispatcher.dispatch({
      type: this.Types.JOURNAL_DATA,
      data: data
    });

    var tripId = data.tripId;
    var journalId = data.journalId;
    if (tripId && journalId) {
      CommentAction.recursivelyLoadComments(tripId, journalId);
    }

    var journalText = data.journalText;
    if (tripId && journalId && journalText) {
      var mediaList = this._getMediaFromText(journalText);
      if (mediaList && mediaList.length) {
        var i;
        for (i = 0; i < mediaList.length; i++) {
          MediaAction.loadMedia(tripId, mediaList[i]);
          CommentAction.recursivelyLoadComments(tripId, mediaList[i]);
        }
      }
    }
  },

  loadJournal: function(tripId, journalId) {
    TripAction.setCurrentTrip(tripId);
    var url = 'api/getJournal.php?tripId=' + tripId;
    if (!journalId || journalId === '') {
      url += '&latest';
    } else {
      url += '&journalId=' + journalId;
    }
    utils.getAsync(url, function(response) {
      var data = JSON.parse(response);
      JournalAction._journalLoaded(data);
    });
  }
};

module.exports = JournalAction;
