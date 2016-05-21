'use strict';

var React = require('react');

var UserStore = require('../stores/UserStore');
var FeedbackStore = require('../stores/FeedbackStore');
var FeedbackAction = require('../actions/FeedbackAction');
var storeMixin = require('./StoreMixin');

var Feedback = React.createClass({
  displayName: 'Feedback',

  stores: [FeedbackStore, UserStore],

  mixins: [storeMixin()],

  propTypes: {
    tripId: React.PropTypes.string,
    referenceId: React.PropTypes.string
  },

  _getStateFromStores: function() {
    var tripId = this.props.tripId;
    var referenceId = this.props.referenceId;
    var userId = UserStore.getLoggedInUser();

    var likeCount = 0;
    var plusCount = 0;
    var doesUserLike = false;
    var doesUserPlus = false;
    var likeList = '';
    var plusList = '';

    if (tripId && referenceId) {
      likeCount = FeedbackStore.getLikeCount(tripId, referenceId);
      plusCount = FeedbackStore.getPlusCount(tripId, referenceId);
      doesUserLike = FeedbackStore.doesUserLike(tripId, referenceId, userId);
      doesUserPlus = FeedbackStore.doesUserPlus(tripId, referenceId, userId);
      likeList = FeedbackStore.getLikeList(tripId, referenceId, userId);
      plusList = FeedbackStore.getPlusList(tripId, referenceId, userId);
    }

    return {
      likeCount: likeCount,
      plusCount: plusCount,
      doesUserLike: doesUserLike,
      doesUserPlus: doesUserPlus,
      userId: userId,
      likeList: likeList,
      plusList: plusList
    };
  },

  clickLike: function() {
    var tripId = this.props.tripId;
    var referenceId = this.props.referenceId;
    var userId = UserStore.getLoggedInUser();

    if (userId && tripId && referenceId) {
      if (FeedbackStore.doesUserLike(tripId, referenceId, userId)) {
        FeedbackAction.clearLike(tripId, referenceId, userId);
      } else {
        FeedbackAction.setLike(tripId, referenceId, userId);
      }
    }
  },

  clickPlus: function() {
    var tripId = this.props.tripId;
    var referenceId = this.props.referenceId;
    var userId = UserStore.getLoggedInUser();
    if (userId && tripId && referenceId) {
      if (FeedbackStore.doesUserPlus(tripId, referenceId, userId)) {
        FeedbackAction.clearPlus(tripId, referenceId, userId);
      } else {
        FeedbackAction.setPlus(tripId, referenceId, userId);
      }
    }
  },

  componentWillMount: function() {
    if (this.props.tripId && this.props.referenceId) {
      FeedbackAction.loadData(this.props.tripId, this.props.referenceId);
    }
  },

  render: function render() {
    var fbClassname = 'fa';
    var googleClassname = 'fa';

    var fbTitle = '';
    var googleTitle = '';

    if (this.state.doesUserLike) {
      fbClassname += ' my-like';
      if (this.state.likeList) {
        fbTitle = 'You and ' + this.state.likeList + ' like this.';
      } else {
        fbTitle = 'You like this.';
      }
    } else if (this.state.likeList) {
      fbTitle = this.state.likeList + ' like this.';
    }

    if (this.state.doesUserPlus) {
      googleClassname += ' my-plus';
      if (this.state.plusList) {
        googleTitle = 'You and ' + this.state.plusList + ' plussed this.';
      } else {
        googleTitle = 'You plussed this.';
      }
    } else if (this.state.plusList) {
      googleTitle = this.state.plusList + ' plussed this.';
    }

    if (this.state.userId) {
      fbClassname += ' select';
      googleClassname += ' select';
    }

    return (
      <div className="feedback">
        <i className={fbClassname} onClick={this.clickLike}
          title={fbTitle}>
          {'\uf087'} {this.state.likeCount}
        </i>
        &nbsp; facebook. &nbsp;
        <i className={googleClassname} onClick={this.clickPlus}
          title={googleTitle}>
          {'\uf067'} {this.state.plusCount}
        </i>
        &nbsp; Google.
      </div>
    );
  }
});

module.exports = Feedback;
