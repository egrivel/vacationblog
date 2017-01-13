'use strict';

const AppDispatcher = require('../AppDispatcher');
const utils = require('./utils');

const TripAction = require('./TripAction');
const CommentAction = require('./CommentAction');
const MediaAction = require('./MediaAction');
const UserAction = require('./UserAction');

const JournalAction = {
  Types: {
    JOURNAL_DATA: 'JOURNAL_DATA'
  },

  _getMediaFromText: function(text) {
    if (!text) {
      return null;
    }

    const images = [];

    let list = text.split('[IMG ');
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (item.indexOf(']') > 0) {
        const img = item.substring(0, item.indexOf(']')).trim();
        if (img.match(/^[\d\-abc]+$/)) {
          // this is a valid image ID
          images.push(img);
        }
      }
    }

    list = text.split('[PANO ');
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (item.indexOf(']') > 0) {
        const data = item.substring(0, item.indexOf(']')).trim();
        if (data.match(/^[\d\-abc]+(\s+[\+\-]\d+)?$/)) {
          const img = data.substring(0, item.indexOf(' ')).trim();
          if (img.match(/^[\d\-abc]+$/)) {
            // this is a valid image ID for a panorama
            images.push(img);
          }
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

    const tripId = data.tripId;
    const journalId = data.journalId;
    if (tripId && journalId && (journalId !== '_new')) {
      // Only load comments if not a new entry
      CommentAction.recursivelyLoadComments(tripId, journalId);
    }

    if (data.userId) {
      UserAction.loadUser(data.userId);
    }

    const journalText = data.journalText;
    if (tripId && journalId && journalText) {
      const mediaList = this._getMediaFromText(journalText);
      if (mediaList && mediaList.length) {
        let i;
        for (i = 0; i < mediaList.length; i++) {
          MediaAction.loadMedia(tripId, mediaList[i]);
          CommentAction.recursivelyLoadComments(tripId, mediaList[i]);
        }
      }
    }
  },

  loadJournal: function(tripId, journalId) {
    TripAction.setCurrentTrip(tripId);
    let url = 'api/getJournal.php?tripId=' + tripId;
    if (!journalId || journalId === '') {
      url += '&latest';
    } else {
      url += '&journalId=' + journalId;
    }
    utils.getAsync(url, function(response) {
      const data = JSON.parse(response);
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
      const data = JSON.parse(response);
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
      const data = JSON.parse(response);
      if (data.resultCode === 200) {
        // do something???
      }
    });
  }
};

module.exports = JournalAction;
