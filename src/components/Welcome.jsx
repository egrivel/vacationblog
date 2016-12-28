'use strict';

const React = require('react');

const storeMixin = require('./StoreMixin');
const TripAction = require('../actions/TripAction');
const TripStore = require('../stores/TripStore');
const MenuAction = require('../actions/MenuAction');
const MenuStore = require('../stores/MenuStore');

const Welcome = React.createClass({
  displayName: 'Welcome',

  mixins: [storeMixin()],

  stores: [TripStore],

  _getStateFromStores: function() {
    const tripList = TripStore.getTripList();
    return {
      tripList: tripList
    };
  },

  componentDidMount: function() {
    const currentTripId = TripStore.getCurrentTripId();
    if (currentTripId) {
      TripAction.setCurrentTrip(null);
    }
    MenuAction.selectItem(MenuStore.menuIds.HOME);
  },

  componentWillUnmount: function() {
    MenuAction.unselectItem(MenuStore.menuIds.HOME);
  },

  _getTripList: function() {
    const list = this.state.tripList;
    if (list && list.length) {
      let count = 0;
      const listItems = list.map(function(item) {
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
