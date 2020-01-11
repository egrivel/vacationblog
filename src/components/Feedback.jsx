'use strict';

const React = require('react');
const createClass = require('create-react-class');
const PropTypes = require('prop-types');

const UserStore = require('../stores/UserStore');
const FeedbackStore = require('../stores/FeedbackStore');
const FeedbackAction = require('../actions/FeedbackAction');
const storeMixin = require('./StoreMixin');

const Feedback = createClass({
  displayName: 'Feedback',

  stores: [FeedbackStore, UserStore],

  mixins: [storeMixin()],

  propTypes: {
    tripId: PropTypes.string,
    referenceId: PropTypes.string
  },

  componentWillMount: function() {
    if (this.props.tripId && this.props.referenceId) {
      FeedbackAction.loadData(this.props.tripId, this.props.referenceId);
    }
  },

  _getStateFromStores: function() {
    const tripId = this.props.tripId;
    const referenceId = this.props.referenceId;
    const userId = UserStore.getLoggedInUser();

    let likeCount = 0;
    let plusCount = 0;
    let smileCount = 0;
    let doesUserLike = false;
    let doesUserPlus = false;
    let doesUserSmile = false;
    let likeList = '';
    let plusList = '';
    let smileList = '';

    if (tripId && referenceId) {
      likeCount = FeedbackStore.getLikeCount(tripId, referenceId);
      plusCount = FeedbackStore.getPlusCount(tripId, referenceId);
      smileCount = FeedbackStore.getSmileCount(tripId, referenceId);
      doesUserLike = FeedbackStore.doesUserLike(tripId, referenceId, userId);
      doesUserPlus = FeedbackStore.doesUserPlus(tripId, referenceId, userId);
      doesUserSmile = FeedbackStore.doesUserSmile(tripId, referenceId, userId);
      likeList = FeedbackStore.getLikeList(tripId, referenceId, userId);
      plusList = FeedbackStore.getPlusList(tripId, referenceId, userId);
      smileList = FeedbackStore.getSmileList(tripId, referenceId, userId);
    }

    return {
      likeCount: likeCount,
      plusCount: plusCount,
      smileCount: smileCount,
      doesUserLike: doesUserLike,
      doesUserPlus: doesUserPlus,
      doesUserSmile: doesUserSmile,
      userId: userId,
      likeList: likeList,
      plusList: plusList,
      smileList: smileList
    };
  },

  clickLike: function() {
    const tripId = this.props.tripId;
    const referenceId = this.props.referenceId;
    const userId = UserStore.getLoggedInUser();

    if (userId && tripId && referenceId) {
      if (FeedbackStore.doesUserLike(tripId, referenceId, userId)) {
        FeedbackAction.clearLike(tripId, referenceId, userId);
      } else {
        FeedbackAction.setLike(tripId, referenceId, userId);
      }
    }
  },

  clickPlus: function() {
    const tripId = this.props.tripId;
    const referenceId = this.props.referenceId;
    const userId = UserStore.getLoggedInUser();
    if (userId && tripId && referenceId) {
      if (FeedbackStore.doesUserPlus(tripId, referenceId, userId)) {
        FeedbackAction.clearPlus(tripId, referenceId, userId);
      } else {
        FeedbackAction.setPlus(tripId, referenceId, userId);
      }
    }
  },

  clickSmile: function() {
    const tripId = this.props.tripId;
    const referenceId = this.props.referenceId;
    const userId = UserStore.getLoggedInUser();
    if (userId && tripId && referenceId) {
      if (FeedbackStore.doesUserSmile(tripId, referenceId, userId)) {
        FeedbackAction.clearSmile(tripId, referenceId, userId);
      } else {
        FeedbackAction.setSmile(tripId, referenceId, userId);
      }
    }
  },

  render: function render() {
    let likeClassname = 'fa';
    let plusClassname = 'fa';
    let smileClassname = 'fa';

    let likeTitle = '';
    let plusTitle = '';
    let smileTitle = '';

    if (this.state.doesUserLike) {
      likeClassname += ' my-like';
      if (this.state.likeList) {
        likeTitle = 'You and ' + this.state.likeList + ' like this.';
      } else {
        likeTitle = 'You like this.';
      }
    } else if (this.state.likeList) {
      likeTitle = this.state.likeList + ' like this.';
    }

    if (this.state.doesUserPlus) {
      plusClassname += ' my-plus';
      if (this.state.plusList) {
        plusTitle = 'You and ' + this.state.plusList + ' plussed this.';
      } else {
        plusTitle = 'You plussed this.';
      }
    } else if (this.state.plusList) {
      plusTitle = this.state.plusList + ' plussed this.';
    }

    if (this.state.doesUserSmile) {
      smileClassname += ' my-smile';
      if (this.state.smileList) {
        smileTitle = 'You and ' + this.state.smileList + ' enjoyed this.';
      } else {
        smileTitle = 'You enjoyed this.';
      }
    } else if (this.state.smileList) {
      smileTitle = this.state.smileList + ' enjoyed this.';
    }

    if (this.state.userId) {
      likeClassname += ' select';
      plusClassname += ' select';
      smileClassname += ' select';
    }

    // Note: reserved for future use
    // eslint-disable-next-line no-unused-vars
    const likeBlock = (
      <span onClick={this.clickLike}>
        <i className={likeClassname} title={likeTitle}>
          {'\uf087'} {this.state.likeCount}
        </i>
        &nbsp; facebook &nbsp;
      </span>
    );

    // Note: reserved for future use
    // eslint-disable-next-line no-unused-vars
    const plusBlock = (
      <span onClick={this.clickPlus}>
        <i className={plusClassname} title={plusTitle}>
          {'\uf067'} {this.state.plusCount}
        </i>
        &nbsp; Google &nbsp;
      </span>
    );

    const smileBlock = (
      <span onClick={this.clickSmile}>
        <i className={smileClassname} title={smileTitle}>
          {'\uf118'} {this.state.smileCount}
        </i>
        &nbsp; enjoy &nbsp;
      </span>
    );

    return (
      <div className="feedback">
        {smileBlock}
      </div>
    );
  }
});

module.exports = Feedback;
