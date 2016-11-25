'use strict';

var AppDispatcher = require('../AppDispatcher');
var utils = require('./utils');

var TripAction = require('./TripAction');
var CommentAction = require('./CommentAction');
var MediaAction = require('./MediaAction');
var UserAction = require('./UserAction');

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

    if (data.userId) {
      UserAction.loadUser(data.userId);
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
  },

  clearJournal: function(tripId, journalId) {
    TripAction.setCurrentTrip(tripId);
    JournalAction._journalLoaded({
      tripId: tripId,
      journalId: journalId
    });
  },

  updateEditJournal: function(journalData) {
    JournalAction._journalLoaded(journalData);
  },

  createJournal: function(tripId, journalData) {
    const url = 'api/putJournal.php?tripId=' + tripId;
    const data = {
      tripId: journalData.tripId,
      journalDate: journalData.journalDate,
      journalTitle: journalData.journalTitle,
      journalText: journalData.journalText
    };
    utils.postAsync(url, data, function(response) {
      var data = JSON.parse(response);
      if (data.resultCode === 200) {
        // do something???
      }
    });
  },

  updateJournal: function(tripId, journalId, journalData) {
    const url = 'api/putJournal.php?tripId=' + tripId +
      '&journalId=' + journalId;
    const data = {
      tripId: journalData.tripId,
      journalId: journalId,
      journalDate: journalData.journalDate,
      journalTitle: journalData.journalTitle,
      journalText: journalData.journalText
    };
    utils.postAsync(url, data, function(response) {
      var data = JSON.parse(response);
      if (data.resultCode === 200) {
        // do something???
      }
    });
  }
};

module.exports = JournalAction;
