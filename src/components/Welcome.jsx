import React from 'react';
import createReactClass from 'create-react-class';

import storeMixin from './StoreMixin';
import TripAction from '../actions/TripAction';
import TripStore from '../stores/TripStore';
import MenuAction from '../actions/MenuAction';
import MenuStore from '../stores/MenuStore';

const Welcome = createReactClass({
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
        if (item.deleted != 'Y') {
          count++;
          return (
            <li key={count}>
              <a href={'#/trip/' + item.tripId}>
                {item.name}
              </a>
            </li>
          );
        }
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

export default Welcome;
