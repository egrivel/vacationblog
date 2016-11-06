'use strict';

var React = require('react');

var storeMixin = require('./StoreMixin');
var TripAction = require('../actions/TripAction');
var TripStore = require('../stores/TripStore');

var Welcome = React.createClass({
  displayName: 'Welcome',

  mixins: [storeMixin()],

  stores: [TripStore],

  _getStateFromStores: function() {
    var tripList = TripStore.getTripList();
    return {
      tripList: tripList
    };
  },

  componentDidMount: function() {
    var currentTripId = TripStore.getCurrentTripId();
    if (currentTripId) {
      TripAction.setCurrentTrip(null);
    }
  },

  _getTripList: function() {
    var list = this.state.tripList;
    if (list && list.length) {
      var count = 0;
      var listItems = list.map(function(item) {
        count++;
        return (
          <li key={count}>
            <a href={'#/trip/' + item.tripId}>
              {item.name}
            </a>
          </li>
        );
      });
      return <ul>{listItems}</ul>;
    }
  },

  render: function() {
    return (
      <div className="trip">
        <p>
          Hi there, and welcome to our Vacation Blog website. We use this
          site to keep a vacation blog whenever we are exploring some new
          part of the world. Select from the various trips below to start
          reading!
        </p>
        {this._getTripList()}
      </div>
    );
  }
});

module.exports = Welcome;
