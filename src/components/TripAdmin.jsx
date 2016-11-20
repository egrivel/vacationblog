'use strict';

var React = require('react');

var storeMixin = require('./StoreMixin');
var TripStore = require('../stores/TripStore');

var TripAdmin = React.createClass({
  displayName: 'Trip Admin',

  mixins: [storeMixin()],

  stores: [TripStore],

  _getStateFromStores: function() {
    const tripList = TripStore.getTripList();
    return {
      tripList: tripList
    };
  },

  render: function() {
    const list = this.state.tripList.map(function(item) {
      return (
        <li key={item.tripId}>
          <a href={'#/admin/trip/' + item.tripId}>{item.name}</a>
        </li>
      );
    });
    return (
      <div>
        <h3>Trip Administration</h3>
        <p>This is an adminitrative function to update individual trips.
          The trip title, trip description, as well as start and end
          date can be modified.</p>
        <p>Please select one of the trips to administer:</p>
        <ul>
          {list}
        </ul>
        <p>Or <a href="#/admin/trip/_new">create a new trip</a>.</p>
      </div>
    );
  }
});

module.exports = TripAdmin;
