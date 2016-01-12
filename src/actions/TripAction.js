'use strict';

var AppDispatcher = require('../AppDispatcher');
var utils = require('./utils');

var TripAction = {
  Types: {
    TRIP_SET_CURRENT: 'TRIP_SET_CURRENT',
    TRIP_LOAD_DATA: 'TRIP_LOAD_DATA',
    TRIP_LOAD_LIST: 'TRIP_LOAD_LIST'
  },

  setCurrentTrip: function(id) {
    AppDispatcher.dispatch({
      type: this.Types.TRIP_SET_CURRENT,
      data: id
    });
    TripAction.loadTrip(id);
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

  loadTripList: function() {
    var url = 'api/findTrip.php';
    utils.getAsync(url, function(response) {
      // console.log('Response: ' + response);
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

  _tripListLoaded: function(data) {
    AppDispatcher.dispatch({
      type: this.Types.TRIP_LOAD_LIST,
      data: data
    });
  }
};

module.exports = TripAction;
