'use strict';

/**
 * Trip Actions. This is a set of actions regarding trips, including the list
 * of contributors to a trip ("trip users").
 */

const AppDispatcher = require('../AppDispatcher');
const utils = require('./utils');

const TripAction = {
  Types: {
    TRIP_SET_CURRENT: 'TRIP_SET_CURRENT',
    TRIP_LOAD_LIST: 'TRIP_LOAD_LIST',
    TRIP_LOAD_DATA: 'TRIP_LOAD_DATA',
    TRIP_LOAD_USERLIST: 'TRIP_LOAD_USERLIST',
    TRIP_LOAD_JOURNALS: 'TRIP_LOAD_JOURNALS'
  },

  /**
   * Initial trip load. This function will do an initial load to
   * retrieve from the server the default trip and set it as the
   * current trip on the front-end.
   */
  initialLoadTrip: function() {
    const url = 'api/getTrip.php?current';
    utils.getAsync(url, function(response) {
      const data = JSON.parse(response);
      const tripId = data.tripId;
      TripAction.setCurrentTrip(tripId);
      TripAction._tripLoaded(data);
    });
  },

  /**
   * Load a specific trip (by ID) and make it the currently active
   * trip on the front-end.
   * @param {string} id - ID of the trip to load.
   */
  loadTrip: function(id) {
    const url = 'api/getTrip.php?tripId=' + id;

    utils.getAsync(url, function(response) {
      const data = JSON.parse(response);
      TripAction._tripLoaded(data);
    });
  },

  _tripLoaded: function(data) {
    AppDispatcher.dispatch({
      type: this.Types.TRIP_LOAD_DATA,
      data: data
    });
  },

  /**
   * Set the current trip. This changes what the front-end identifies
   * as the currently active trip.
   * @param {string} id - ID of the trip to set.
   */
  setCurrentTrip: function(id) {
    if (id) {
      AppDispatcher.dispatch({
        type: this.Types.TRIP_SET_CURRENT,
        data: id
      });
      TripAction.loadTrip(id);
    } else {
      TripAction.initialLoadTrip()
    }
  },

  /**
   * Load the list of users (contributors) associated with a specific
   * trip.
   * @param {string} id - ID of the trip for which to load the users.
   */
  loadTripUsers: function(id) {
    const url = 'api/getTripUser.php?tripId=' + id;
    utils.getAsync(url, function(response) {
      const data = JSON.parse(response);
      TripAction._tripUserLoaded(data);
    });
  },

  _tripUserLoaded: function(data) {
    AppDispatcher.dispatch({
      type: this.Types.TRIP_LOAD_USERLIST,
      data: data
    });
  },

  loadTripJournals: function(id) {
    const url = 'api/getJournal.php?tripId=' + id;
    utils.getAsync(url, function(response) {
      const data = JSON.parse(response);
      AppDispatcher.dispatch({
        type: TripAction.Types.TRIP_LOAD_JOURNALS,
        tripId: id,
        data: data.resultSet
      });
    });
  },

  /**
   * Load a trip for editing. This loads the information for a trip
   * without making it the current trip, and without modifying the
   * current trip.
   * @param {string} id - ID of the trip to load for editing.
   */
  loadEditTrip: function(id) {
    const url = 'api/getTrip.php?tripId=' + id;

    utils.getAsync(url, function(response) {
      const data = JSON.parse(response);
      TripAction._editTripLoaded(data);
    });
  },

  /**
   * Load the user of users (contributors) of a trip for editing. This
   * loads the information of the trip users without modifying the
   * current list of trip users.
   * @param {string} id - ID of the trip for which to load the users for
   * editing.
   */
  loadEditTripUser: function(id) {
    const url = 'api/getTripUser.php?tripId=' + id;
    utils.getAsync(url, function(response) {
      const data = JSON.parse(response);
      TripAction._tripUserLoaded(data);
    });
  },

  _editTripUserLoaded: function(data) {
    AppDispatcher.dispatch({
      type: this.Types.TRIP_EDIT_LOAD_USER_LIST,
      data: data
    });
  },

  updateEditTrip: function(data) {
    data.tripId = '_edit';
    AppDispatcher.dispatch({
      type: this.Types.TRIP_LOAD_DATA,
      data: data
    });
  },

  loadTripList: function() {
    const url = 'api/findTrip.php';
    utils.getAsync(url, function(response) {
      const data = JSON.parse(response);
      TripAction._tripListLoaded(data.resultSet);
    });
  },

  _editTripLoaded: function(data) {
    data.tripId = '_edit';
    AppDispatcher.dispatch({
      type: this.Types.TRIP_LOAD_DATA,
      data: data
    });
  },

  _tripListLoaded: function(data) {
    AppDispatcher.dispatch({
      type: this.Types.TRIP_LOAD_LIST,
      data: data
    });
  },

  saveTrip: function(data) {
    const url = 'api/putTrip.php';
    utils.postAsync(url, data, function() {
      AppDispatcher.dispatch({
        type: TripAction.Types.TRIP_LOAD_DATA,
        data: data
      });
    });
  },

  saveTripUser: function(data) {
    const url = 'api/putTripUser.php';
    const sendObj = {};
    sendObj.tripId = data.tripId;
    sendObj.userId = data.userId;
    sendObj.role = 'maint';
    sendObj.profileImg = data.profileImg;
    sendObj.message = data.message;
    sendObj.deleted = 'N';
    utils.postAsync(url, sendObj, function() {
      TripAction.loadTripUsers(data.tripId);
    });
  },

  deleteTripUser: function(data) {
    const url = 'api/putTripUser.php';
    const sendObj = {};
    sendObj.tripId = data.tripId;
    sendObj.userId = data.userId;
    sendObj.role = 'maint';
    sendObj.profileImg = data.profileImg;
    sendObj.message = data.message;
    sendObj.deleted = 'Y';
    utils.postAsync(url, sendObj, function() {
      TripAction.loadTripUsers(data.tripId);
    });
  }
};

module.exports = TripAction;
