'use strict';

var AppDispatcher = require('../AppDispatcher');
var utils = require('./utils');

var TripAction = require('./TripAction');

var JournalAction = {
  Types: {
    JOURNAL_DATA: 'JOURNAL_DATA'
  },

  _journalLoaded: function(data) {
    AppDispatcher.dispatch({
      type: this.Types.JOURNAL_DATA,
      data: data
    });
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
