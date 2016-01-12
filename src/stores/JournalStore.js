'use strict';

/**
 * Journal entry store.
 *
 * Provide information about the currently displayed journal entry.
 */

var assign = require('object-assign');

var AppDispatcher = require('../AppDispatcher');
var GenericStore = require('./GenericStore');
var JournalActionTypes = require('../actions/JournalAction').Types;

// ---
// All the data about the current journal.
// ---
var _journalData = {};

var JournalStore = assign({}, GenericStore, {
  /**
   * Obtain all the attributes of the currently journal entry.
   * @return {object} Information about the current journal entry.
   */
  getData: function() {
    return _journalData;
  }
});

var storeCallback = function(action) {
  switch (action.type) {
    case JournalActionTypes.JOURNAL_DATA:
      _journalData = action.data;
      JournalStore.emitChange();
      break;
    default:
      // do nothing
  }
};

JournalStore.dispatchToken = AppDispatcher.register(storeCallback);

module.exports = JournalStore;
