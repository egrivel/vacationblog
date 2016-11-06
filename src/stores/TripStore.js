'use strict';

/**
 * Trip Store
 *
 * Provides trip information. This includes:
 *  - List of all the trips in the system.
 *  - ID of the current trip.
 *  - All the attributes of the current trip.
 */
var _ = require('lodash');
var assign = require('object-assign');

var AppDispatcher = require('../AppDispatcher');
var GenericStore = require('./GenericStore');
var TripActionTypes = require('../actions/TripAction').Types;

// ---
// Ordered list of all the trips in the whole system. This list is
// primarily used to display the trip menu, but is also available
// for other purposes.
// ---
var _tripList = [];

// ---
// The current trip that the system is displaying. The current trip
// can only be changed by the TRIP_SET_CURRENT action.
// The store only receives data for the current trip. If it receives
// data for a different trip, that action will be ignored.
// The store emits a TRIP_LOAD_DATA action if the current trip changes.
// ---
var _currentTripId = '';

// ---
// All the data about the current trip.
// ---
var _tripData = {};

/**
 * Trip store maintains information about the current trip.
 */
var TripStore = assign({}, GenericStore, {
  /**
   * Reset the trip store (for testing only).
   */
  _reset: function() {
    _currentTripId = '';
    _tripData = {};
    _tripList = [];
  },

  /**
   * Obtain the ID of the currently displayed trip.
   * @return {id} ID of the current trip.
   */
  getCurrentTripId: function() {
    return _currentTripId;
  },

  /**
   * Obtain all the data elements of the currently displayed trip.
   * @param {string} tripId - ID of trip to get data about.
   * @return {object} Information about the current trip.
   */
  getTripData: function(tripId) {
    if (tripId) {
      return _tripData[tripId];
    }
    if (_currentTripId && _tripData[_currentTripId]) {
      return _tripData[_currentTripId];
    }
    return {};
  },

  /**
   * Obtain the list of all the trips in the system.
   * @return {array} list of all the trips.
   */
  getTripList: function() {
    console.log(JSON.stringify(_tripList));
    return _tripList;
  },

  _storeCallback: function(action) {
    switch (action.type) {
      case TripActionTypes.TRIP_LOAD_DATA:
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
        break;
      case TripActionTypes.TRIP_LOAD_LIST:
        if (!_.isEqual(_tripList, action.data)) {
          // Only emit change if different
          _tripList = action.data;
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
      default:
        // do nothing
    }
  }
});

TripStore.dispatchToken = AppDispatcher.register(TripStore._storeCallback);

module.exports = TripStore;
