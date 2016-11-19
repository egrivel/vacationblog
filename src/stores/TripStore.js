'use strict';

/**
 * Trip Store
 *
 * Provides trip information. This includes:
 *  - List of all the trips in the system.
 *  - ID of the current trip.
 *  - All the attributes of the current trip.
 */
const _ = require('lodash');
const assign = require('object-assign');

const AppDispatcher = require('../AppDispatcher');
const GenericStore = require('./GenericStore');
const TripActionTypes = require('../actions/TripAction').Types;

// ---
// Ordered list of all the trips in the whole system. This list is
// primarily used to display the trip menu, but is also available
// for other purposes. The list is ordered by most recent trip first.
// ---
let _tripList = [];

// ---
// The current trip that the system is displaying. The current trip
// can only be changed by the TRIP_SET_CURRENT action.
// The store only receives data for the current trip. If it receives
// data for a different trip, that action will be ignored.
// The store emits a TRIP_LOAD_DATA action if the current trip changes.
// ---
let _currentTripId = '';

// ---
// All the data for trips. This is an associative array, indexed by
// trip ID.
// ---
let _tripData = {};

// ---
// List of users ("contributors") for a trip. This is an associative
// array, indexed by trip ID.
// ---
let _tripUsers = {};

// ---
// List of the journal entries in a trip. This is an associative array,
// indexed by trip ID.
// ---
let _tripJournals = {};

/**
 * Set the trip list
 * @param {array} data - New data with all trips. This data is assumed to
 * be sorted, with the most recent trip first.
 * @return {boolean} true if the store was updated, false if no changes
 * occurred.
 */
function _setTripList(data) {
  if (!_.isEqual(_tripList, data)) {
    // Only emit change if different
    _tripList = data;
    return true;
  }

  return false;
}

/**
 * Trip store maintains information about the current trip.
 */
var TripStore = assign({}, GenericStore, {
  /**
   * Reset the trip store (for testing only).
   */
  _reset: function() {
    _tripList = [];
    _currentTripId = '';
    _tripData = {};
    _tripUsers = {};
    _tripJournals = {};
  },

  /**
   * Obtain the list of all the trips in the system.
   * @return {array} list of all the trips, ordered by most recent trip
   * first. Each trip object contains the following information:
   *  - tripId: unique ID for the trip.
   *  - name: display name for the trip.
   */
  getTripList: function() {
    return _tripList;
  },

  /**
   * Obtain the ID of the currently displayed trip.
   * @return {id} ID of the current trip, or an empty string if no trip
   * has currently been selected.
   */
  getCurrentTripId: function() {
    return _currentTripId;
  },

  /**
   * Obtain all the data elements of the currently displayed trip.
   * @param {string} tripId - ID of trip to get data about; if no trip ID
   * is specified, data about the current trip is returned.
   * @return {object} Information about the requested trip. If there is no
   * information for the requested trip, an empty object is returned.
   * The following information can be expected in the trip data (if applicable):
   * - tripId: unique ID for the trip.
   * - name: display name for the trip.
   * - description: full description for the trip.
   * - startDate: start date for the trip.
   * - endDate: end date for the trip.
   * - bannerImg: URI (relative to ./media) for the trip's banner graphic.
   * - active: "Y" or "N" depending whether the trip is active.
   * - deleted: should always be "N".
   * - firstJournalId: unique ID for the first journal entry.
   * - lastJournalId: unique ID for the last (most recent) journal entry.
   * - created: datetime when the trip record was created.
   * - updated: datetime when the trip record was updated.
   */
  getTripData: function(tripId) {
    if (!tripId) {
      tripId = _currentTripId;
    }
    if (tripId && _tripData[tripId]) {
      return _tripData[tripId];
    }
    return {};
  },

  /**
   * Get the list of users for a trip
   * @param {string} tripId - ID of the trip to get the users for.
   * @return {array} list of users.
   */
  getTripUsers: function(tripId) {
    if (tripId && _tripUsers[tripId]) {
      return _tripUsers[tripId];
    }
    return [];
  },

  /**
   * Return a list of all the journal entries for a trip.
   * @param {string} tripId - ID of the trip to get the journals for
   * @return {array} list of journal entries, sorted descending by date,
   * with for each entry:
   *  - journalId: unique ID of the journal entry.
   *  - journalDate: date of the journal entry.
   *  - userId: unique ID of the user who made the entry.
   */
  getTripJournals: function(tripId) {
    if (tripId && _tripJournals[tripId]) {
      return _tripJournals[tripId];
    }
    return [];
  },

  _storeCallback: function(action) {
    switch (action.type) {
      case TripActionTypes.TRIP_LOAD_DATA:
        if (action.data && action.data.tripId) {
          _tripData[action.data.tripId] = action.data;
          if (action.data.tripId && action.data.name) {
            _tripList = _tripList.map(function(item) {
              if (item.tripId === action.data.tripId) {
                item.name = action.data.name;
              }
              return item;
            });
          }
          TripStore.emitChange();
        }
        break;

      case TripActionTypes.TRIP_LOAD_LIST:
        if (_setTripList(action.data)) {
          TripStore.emitChange();
        }
        break;

      case TripActionTypes.TRIP_SET_CURRENT:
        if (action.data !== _currentTripId) {
          _currentTripId = action.data;
          if (!_tripData[_currentTripId]) {
            _tripData[_currentTripId] = {};
          }
          TripStore.emitChange();
        }
        break;

      case TripActionTypes.TRIP_LOAD_USERLIST:
        if (action.data && action.data.tripId) {
          _tripUsers[action.data.tripId] = action.data.userList;
          TripStore.emitChange();
        }
        break;

      case TripActionTypes.TRIP_LOAD_JOURNALS:
        if (action.tripId && action.data) {
          _tripJournals[action.tripId] = action.data;
          TripStore.emitChange();
        }
        break;

      default:
        // do nothing
    }
  }
});

TripStore.dispatchToken = AppDispatcher.register(TripStore._storeCallback);

module.exports = TripStore;
