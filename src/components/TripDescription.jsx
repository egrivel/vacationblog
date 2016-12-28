'use strict';

const React = require('react');
const Link = require('react-router').Link;

const TripAction = require('../actions/TripAction');
const TripStore = require('../stores/TripStore');
const UserStore = require('../stores/UserStore');
const MenuAction = require('../actions/MenuAction');
const MenuStore = require('../stores/MenuStore');

const TripJournalList = require('./TripJournalList.jsx');
const utils = require('./utils');
const cookieUtils = require('../utils');

/**
 * Get the state from the stores.
 * @return {object} new state content.
 * @private
 */
function _getStateFromStores() {
  const tripData = TripStore.getTripData();
  const tripId = tripData.tripId;
  const tripActive = tripData.active;
  const description = tripData.description;
  const firstJournalId = tripData.firstJournalId;
  const contributorList = TripStore.getTripUsers(tripId);
  const loggedInUser = UserStore.getLoggedInUser();

  return {
    tripId: tripId,
    tripActive: tripActive,
    description: description,
    firstJournalId: firstJournalId,
    contributorList: contributorList,
    loggedInUser: loggedInUser
  };
}

/**
 * Output a 'start reading' link for a trip. This link goes to the first
 * journal entry for the trip.
 * @param {id} tripId - trip for which to generate the link.
 * @param {id} journalId - journal entry to target in the link.
 * @return {object} React element to render the link.
 * @private
 */
function _startReadingLink(tripId, journalId) {
  let journalPart = '(no journal entries)';
  if (journalId) {
    journalPart = React.DOM.span(
      {
        className: 'readJournalLink'
      },
      'Scroll down to see a list of days where we have posts below or ',
      React.createElement(
        Link,
        {
          to: '/journal/' + tripId + '/' + journalId
        },
        'start reading at the beginning ',
        React.DOM.i({className: 'fa fa-chevron-right'}),
        React.DOM.i({className: 'fa fa-chevron-right'})
      )
    );
  }

  return React.DOM.p(
    {className: 'readJournal'},
    journalPart
  );
}

const TripDescription = React.createClass({
  displayName: 'TripDescription',

  propTypes: {
    params: React.PropTypes.shape({
      tripId: React.PropTypes.string
    })
  },

  getInitialState: function() {
    return _getStateFromStores();
  },

  _onChange: function() {
    this.setState(_getStateFromStores());
  },

  componentDidMount: function() {
    TripStore.addChangeListener(this._onChange);
    UserStore.addChangeListener(this._onChange);

    if (this.props.params.tripId) {
      TripAction.setCurrentTrip(this.props.params.tripId);
      TripAction.loadTripUsers(this.props.params.tripId);
    } else {
      TripAction.setCurrentTrip(null);
    }
    this.getDataIfNeeded(this.props);
    MenuAction.selectItem(MenuStore.menuIds.HOME);

    let cookieValue = '';
    if (this.props.params.tripId) {
      cookieValue += 'trip/' + this.props.params.tripId;
    }
    cookieUtils.setCookie(cookieUtils.cookies.ENTRY, cookieValue, 1000);
  },

  componentWillUnmount: function() {
    TripStore.removeChangeListener(this._onChange);
    UserStore.removeChangeListener(this._onChange);
    MenuAction.unselectItem(MenuStore.menuIds.HOME);
  },

  componentWillReceiveProps: function(nextProps) {
    this.getDataIfNeeded(nextProps);

    let cookieValue = '';
    if (this.props.params.tripId) {
      cookieValue += 'trip/' + this.props.params.tripId;
    }
    cookieUtils.setCookie(cookieUtils.cookies.ENTRY, cookieValue, 1000);
  },

  getDataIfNeeded: function(props) {
    const currentTripId = TripStore.getCurrentTripId();
    if (props && props.params && props.params.tripId) {
      if (props.params.tripId !== currentTripId) {
        TripAction.setCurrentTrip(props.params.tripId);
      }
      const tripUsers = TripStore.getTripUsers(props.params.tripId);
      if (!tripUsers) {
        TripAction.loadTripUsers(props.params.tripId);
      }
    } else {
      TripAction.setCurrentTrip(null);
      // if we don't have props or params or tripId, need default
      // TripAction.initialLoadTrip();
    }
  },

  _renderContributors: function() {
    if (this.state.contributorList) {
      const messages = [];
      let parCount = 0;
      for (let i = 0; i < this.state.contributorList.length; i++) {
        const item = this.state.contributorList[i];
        parCount++;
        let profileImg;
        if (item.profileImg) {
          profileImg = (
            <img
              className="profileImg"
              src={'media/' + item.profileImg}
            />
          );
        }
        messages.push(
          <h3 key={'head-' + parCount}>
            Contributor to this blog: <em>{item.name}</em>
            {profileImg}
          </h3>
        );
        if (item.message) {
          const parList = utils.splitText(item.message);
          for (let j = 0; j < parList.length; j++) {
            parCount++;
            messages.push(utils.buildTextNode('p', 'text noclear',
              'p-' + parCount, parList[j]));
          }
        }
      }
      return messages;
    }
  },

  _renderNewPostLink: function() {
    const tripId = this.state.tripId;
    if (!tripId) {
      return null;
    }

    if (this.state.tripActive !== 'Y') {
      // can't post if not active
      return null;
    }

    let isContributing = false;
    if (this.state.loggedInUser && this.state.contributorList) {
      for (let i = 0; i < this.state.contributorList.length; i++) {
        if (this.state.contributorList[i].userId === this.state.loggedInUser) {
          isContributing = true;
          break;
        }
      }
    }
    if (!isContributing) {
      return null;
    }

    return (
      <p>
        <a href={'#/journaledit/' + tripId + '/_new'}>
          Create a New Post
        </a>
      </p>
    );
  },

  render: function() {
    let parCount = 0;
    const tripId = this.state.tripId;

    if (tripId) {
      const parList = utils.splitText(this.state.description);
      const paragraphs = parList.map(function(par) {
        parCount++;
        return utils.buildTextNode('p', 'text', 'p-' + parCount, par);
      });
      return (
        <div className="trip">
          {paragraphs}
          {_startReadingLink(tripId, this.state.firstJournalId)}
          {this._renderNewPostLink()}
          {this._renderContributors()}
          <h3>Post List</h3>
          <p>Use the list below to jump to a specific day in the trip and start
            reading.</p>
          <TripJournalList tripId={tripId} />
        </div>
      );
    }
    return <div>nothing here</div>;
  }
});

module.exports = TripDescription;
