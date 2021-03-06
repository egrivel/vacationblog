'use strict';

import React from 'react';
import createReactClass from 'create-react-class';

import storeMixin from './StoreMixin';
import TripStore from '../stores/TripStore';
import MenuAction from '../actions/MenuAction';
import MenuStore from '../stores/MenuStore';
import UserStore from '../stores/UserStore';

const TripAdmin = createReactClass({
  displayName: 'Trip Admin',

  mixins: [storeMixin()],

  stores: [TripStore],

  componentDidMount: function() {
    MenuAction.selectItem(MenuStore.menuIds.ADMIN);
  },

  componentWillUnmount: function() {
    MenuAction.unselectItem(MenuStore.menuIds.ADMIN);
  },

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
    if (UserStore.getAccess() !== 'admin') {
      return <div>No access</div>;
    }
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

export default TripAdmin;
