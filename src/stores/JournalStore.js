'use strict';

/**
 * Journal entry store.
 *
 * Provide information about the currently displayed journal entry.
 */

var _ = require('lodash');
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
   * Reset the store contents, for testing purposes.
   */
  _reset: function() {
    _journalData = {};
  },

  /**
   * Obtain all the attributes of the currently journal entry.
   * @return {object} Information about the current journal entry.
   */
  getData: function() {
    return _journalData;
  },

  _storeCallback: function(action) {
    switch (action.type) {
      case JournalActionTypes.JOURNAL_DATA:
        if (!_journalData || !_.isEqual(_journalData, action.data)) {
          _journalData = _.cloneDeep(action.data);
          JournalStore.emitChange();
        }
        break;
      default:
        // do nothing
    }
  }

});

JournalStore.dispatchToken =
 AppDispatcher.register(JournalStore._storeCallback);

module.exports = JournalStore;
