'use strict';

const _ = require('lodash');
const React = require('react');
const createReactClass = require('create-react-class');
const PropTypes = require('prop-types');
const moment = require('moment-timezone');

const storeMixin = require('./StoreMixin');
const TripAction = require('../actions/TripAction');
const TripStore = require('../stores/TripStore');
const utils = require('./utils');

const TripJournalList = createReactClass({
  displayName: 'Trip Journal List',

  mixins: [storeMixin()],

  stores: [TripStore],

  propTypes: {
    tripId: PropTypes.string.isRequired
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
    // always (re-) load upon mounting.
    TripAction.loadTripJournals(this.props.tripId);
    TripAction.loadTripUsers(this.props.tripId);
  },

  _renderItem: function(tripId, journalId, journalDate, journalTitle,
      userList) {
    const itemDate = moment(journalDate).format('dddd M/D');
    let count = 0;
    let title;
    if (journalTitle) {
      title = utils.replaceEntities(journalTitle);
    } else {
      title = '(no title)';
    }

    const fmtList = [];
    for (let i = 0; i < userList.length; i++) {
      const item = userList[i];
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
        if (user.name && (user.name.indexOf(' ') > 0)) {
          result = user.name.substring(0, user.name.indexOf(' ')) + ': ';
        } else {
          result = user.name + ': ';
        }
      }
      let prefix = '';
      if (count) {
        prefix = ', ';
      }
      count++;
      fmtList.push(
        <span key={'u-' + count}>
          {prefix}{result}
          <em>{title}</em>
        </span>
      );
    }

    return (
      <li key={journalId}>
        <a href={'#/journal/' + tripId + '/' + journalId}>
         {itemDate}
        </a> {fmtList}
      </li>
    );
  },

  render: function() {
    let journalId = '';
    let journalDate = '';
    let journalTitle = '';
    let userList = [];
    const journalList = [];

    const tripId = this.props.tripId;

    if (this.state.journalList && this.state.journalList.length) {
      for (let i = 0; i < this.state.journalList.length; i++) {
        const item = this.state.journalList[i];
        if (journalDate /* && (item.journalDate !== journalDate) */) {
          // need to push last entry
          const list = this._renderItem(
            tripId, journalId, journalDate, journalTitle, userList);
          journalList.push(list);
          userList = [];
        }
        // Journal date can be either in yyyymmdd or yyyy-mm-dd format....?
        let checkLength = 6;
        if (journalDate.substring(4, 5) === '-') {
          checkLength = 7;
        }
        if (!journalDate ||
          (journalDate.substring(0, checkLength) !==
                item.journalDate.substring(0, checkLength))) {
          const month = moment(item.journalDate).format('MMMM YYYY');
          journalList.push(<h3 key={item.journalDate}>{month}</h3>);
        }
        journalDate = item.journalDate;
        journalTitle = item.journalTitle;
        journalId = item.journalId;
        userList.unshift(item.userId);
      }

      if (journalDate) {
        // need to push last entry
        const list = this._renderItem(
          tripId, journalId, journalDate, journalTitle, userList);
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
