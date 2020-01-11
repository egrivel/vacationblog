'use strict';

/**
 * Journal entry store.
 *
 * Provide information about the currently displayed journal entry.
 */

import _ from 'lodash';
import assign from 'object-assign';

import AppDispatcher from '../AppDispatcher';
import GenericStore from './GenericStore';
import JournalActionTypes from '../actions/JournalActionTypes';

// ---
// All the data about the current journal.
// ---
let _journalData = {};

const JournalStore = assign({}, GenericStore, {
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

export default JournalStore;
