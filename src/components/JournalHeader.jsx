'use strict';

/**
 * Display the header for a journal entry.
 */

var React = require('react');
var utils = require('./utils');

var JournalHeader = React.createClass({
  displayName: 'JournalHeader',

  propTypes: {
    title: React.PropTypes.string,
    editCallback: React.PropTypes.func,
    date: React.PropTypes.string,
    userName: React.PropTypes.string,
    created: React.PropTypes.string,
    profileImg: React.PropTypes.string
  },

  /**
   * Construct the title part of the journal entry header.
   * @param {string} title - entry title.
   * @param {string} date - entry date.
   * @param {string} profileImg - addres of profile img, if any.
   * @param {string} editLink - target of edit, if any
   * @return {react} element representing the title.
   */
  _constructTitle: function(title, date, profileImg) {
    var titleText = '';

    if (title) {
      titleText = utils.replaceEntities(title);
    } else {
      titleText = '(Untitled)';
    }

    if (date) {
      titleText = utils.formatDate(date) + ': ' + titleText;
    }

    let editButton = null;
    if (this.props.editCallback) {
      editButton = (
        <button onClick={this.props.editCallback}>
          Edit
        </button>
      );
    }

    let profileImgElement;
    if (profileImg) {
      profileImgElement = (
        <img className="journal-entry-profile-thumbnail"
          src={'media/' + profileImg}/>
      );
    }

    return (
      <span className="title">
        {titleText}
        {' '} {editButton}
        {profileImgElement}
      </span>
    );
  },

  /**
   * Construct the subtitle part of the journal entry header.
   * @param {datetime} created - timestamp when the entry was created.
   * @param {string} userName - name of the user creating the entry.
   * @return {react} element representing the subtitle.
   */
  _constructSubtitle: function(created, userName) {
    // a created of zeros is not created at all
    if (created === '0000-00-00 00:00:00.000000') {
      created = '';
    }

    if (userName || created) {
      var byElement = null;
      var createdText = null;

      if (userName) {
        byElement = <em>by</em>;
        userName = ' ' + userName;
      }

      if (created) {
        createdText = ' (' + utils.formatDate(created) + ')';
      }

      return (
        <span className="subtitle">
          {byElement}
          {userName}
          {createdText}
        </span>
      );
    }

    return null;
  },

  render: function() {
    var title = this._constructTitle(this.props.title, this.props.date,
      this.props.profileImg);
    var subtitle = this._constructSubtitle(this.props.created,
      this.props.userName);

    return (
      <h3>
        {title}
        {subtitle}
      </h3>
    );
  }
});

module.exports = JournalHeader;
