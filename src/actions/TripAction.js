'use strict';

var AppDispatcher = require('../AppDispatcher');
var utils = require('./utils');

var TripAction = {
  Types: {
    TRIP_SET_CURRENT: 'TRIP_SET_CURRENT',
    TRIP_LOAD_DATA: 'TRIP_LOAD_DATA',
    TRIP_LOAD_LIST: 'TRIP_LOAD_LIST',
    TRIP_LOAD_USERLIST: 'TRIP_LOAD_USER_LIST'
  },

  setCurrentTrip: function(id) {
    AppDispatcher.dispatch({
      type: this.Types.TRIP_SET_CURRENT,
      data: id
    });
    if (id) {
      TripAction.loadTrip(id);
    }
  },

  /** Special load function to load the system with the current trip. */
  initialLoadTrip: function() {
    var url = 'api/getTrip.php?current';
    utils.getAsync(url, function(response) {
      var data = JSON.parse(response);
      var tripId = data.tripId;
      TripAction.setCurrentTrip(tripId);
      TripAction._tripLoaded(data);
    });
  },

  loadTrip: function(id) {
    var url = 'api/getTrip.php?';
    url += 'tripId=' + id;

    utils.getAsync(url, function(response) {
      var data = JSON.parse(response);
      TripAction._tripLoaded(data);
    });
  },

  loadEditTrip: function(id) {
    var url = 'api/getTrip.php?';
    url += 'tripId=' + id;

    utils.getAsync(url, function(response) {
      var data = JSON.parse(response);
      TripAction._editTripLoaded(data);
    });
  },

  loadTripUser: function(id) {
    const url = 'api/getTripUser.php?tripId=' + id;
    console.log('Loading trip users ' + url);
    utils.getAsync(url, function(response) {
      var data = JSON.parse(response);
      TripAction._tripUserLoaded(data);
    });
  },

  _tripUserLoaded: function(data) {
    console.log('Loaded trip users: ' + JSON.stringify(data));
    AppDispatcher.dispatch({
      type: this.Types.TRIP_LOAD_USER_LIST,
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
    var url = 'api/findTrip.php';
    utils.getAsync(url, function(response) {
      var data = JSON.parse(response);
      TripAction._tripListLoaded(data.resultSet);
    });
  },

  _tripLoaded: function(data) {
    AppDispatcher.dispatch({
      type: this.Types.TRIP_LOAD_DATA,
      data: data
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
      console.log('Data posted');
      AppDispatcher.dispatch({
        type: TripAction.Types.TRIP_LOAD_DATA,
        data: data
      });
    });
  }
};

module.exports = TripAction;
