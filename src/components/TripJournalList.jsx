'use strict';

const _ = require('lodash');
const React = require('react');
const moment = require('moment-timezone');

const storeMixin = require('./StoreMixin');
const TripAction = require('../actions/TripAction');
const TripStore = require('../stores/TripStore');

const TripJournalList = React.createClass({
  displayName: 'Trip Journal List',

  mixins: [storeMixin()],

  stores: [TripStore],

  propTypes: {
    tripId: React.PropTypes.string.isRequired
  },

  _getStateFromStores: function() {
    const tripId = this.props.tripId;
    const journalList = TripStore.getTripJournals(tripId);
    const userList = TripStore.getTripUsers(tripId);
    return {
      journalList: journalList,
      userList: userList
    };
  },

  componentDidMount: function() {
    const tripId = this.props.tripId;
    const journalList = TripStore.getTripJournals(tripId);
    if (!journalList || !journalList.length) {
      TripAction.loadTripJournals(tripId);
    }
    const userList = TripStore.getTripUsers(tripId);
    if (!userList || !userList.length) {
      TripAction.loadTripUsers(tripId);
    }
  },

  _renderItem: function(tripId, journalId, journalDate, userList) {
    const itemDate = moment(journalDate).format('dddd M/D');
    let count = 0;
    return (
      <li key={journalId}>
        <a href={'#/journal/' + tripId + '/' + journalId}>
         {itemDate}
        </a> ({userList.map((item) => {
          let result = item;
          const user = _.find(this.state.userList, {userId: item});
          if (user) {
            result = (
              <span
                className="userRef"
                title={user.name}
              >
                {user.name.substring(0, 1)}
              </span>
            );
          }
          let prefix = '';
          if (count) {
            prefix = ', ';
          }
          count++;
          return <span key={'u-' + count}>{prefix}{result}</span>;
        })})
      </li>
    );
  },

  render: function() {
    let journalId = '';
    let journalDate = '';
    let userList = [];
    let journalList = [];

    let tripId = this.props.tripId;

    if (this.state.journalList && this.state.journalList.length) {
      this.state.journalList.map((item) => {
        if (journalDate && (item.journalDate !== journalDate)) {
          // need to push last entry
          const list = this._renderItem(
            tripId, journalId, journalDate, userList);
          journalList.push(list);
          userList = [];
        }
        if (!journalDate ||
          (journalDate.substring(0, 6) !==
                item.journalDate.substring(0, 6))) {
          const month = moment(item.journalDate).format('MMMM YYYY');
          journalList.push(<h3 key={item.journalDate}>{month}</h3>);
        }
        journalDate = item.journalDate;
        journalId = item.journalId;
        userList.unshift(item.userId);
        return item;
      });

      if (journalDate) {
        // need to push last entry
        const list = this._renderItem(
          tripId, journalId, journalDate, userList);
        journalList.push(list);
      }
    }

    if (journalList.length) {
      return <ul className="journalList">{journalList}</ul>;
    }

    return <div>No journal entries available.</div>;
  }
});

module.exports = TripJournalList;
