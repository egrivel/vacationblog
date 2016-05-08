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

    if (tripId && referenceId) {
      likeCount = FeedbackStore.getLikeCount(tripId, referenceId);
      plusCount = FeedbackStore.getPlusCount(tripId, referenceId);
      doesUserLike = FeedbackStore.doesUserLike(tripId, referenceId, userId);
      doesUserPlus = FeedbackStore.doesUserPlus(tripId, referenceId, userId);
    }

    return {
      likeCount: likeCount,
      plusCount: plusCount,
      doesUserLike: doesUserLike,
      doesUserPlus: doesUserPlus,
      userId: userId
    };
  },

  clickLike: function() {
    var tripId = this.props.tripId;
    var referenceId = this.props.referenceId;
    var userId = UserStore.getLoggedInUser();

    if (userId) {
      if (tripId && referenceId) {
        if (FeedbackStore.doesUserLike(tripId, referenceId, userId)) {
          FeedbackAction.clearLike(tripId, referenceId, userId);
        } else {
          FeedbackAction.setLike(tripId, referenceId, userId);
        }
        this.setState({
          likeCount: FeedbackStore.getLikeCount(tripId, referenceId)
        });
      }
    }
  },

  clickPlus: function() {
    var tripId = this.props.tripId;
    var referenceId = this.props.referenceId;
    var userId = UserStore.getLoggedInUser();
    if (tripId && referenceId && userId) {
      if (FeedbackStore.doesUserPlus(tripId, referenceId, userId)) {
        FeedbackAction.clearPlus(tripId, referenceId, userId);
      } else {
        FeedbackAction.setPlus(tripId, referenceId, userId);
      }
    }
    this.setState({likeCount: FeedbackStore.getLikeCount(tripId, referenceId)});
  },

  componentWillMount: function() {
    this.setState(this._getStateFromStores());
  },

  render: function render() {
    var fbClassname = 'fa';
    var googleClassname = 'fa';
    var loginText = null;

    if (this.state.doesUserLike) {
      fbClassname += ' my-like';
    }
    if (this.state.doesUserPlus) {
      googleClassname += ' my-plus';
    }
    if (this.state.userId) {
      fbClassname += ' select';
      googleClassname += ' select';
    } else {
      fbClassname += ' need-login';
      googleClassname += ' need-login';
      loginText = <span className="login-text">Must be logged in to like or plus</span>;
    }
    return (
      <div className="feedback">
        <i className={fbClassname} onClick={this.clickLike}>
          {'\uf087'} {this.state.likeCount}
          {loginText}
        </i>
        &nbsp; facebook. &nbsp;
        <i className={googleClassname} onClick={this.clickPlus}>
          {'\uf067'} {this.state.plusCount}
          {loginText}
        </i>
        &nbsp; Google.
      </div>
    );
  }
});

module.exports = Feedback;
