'use strict';

/**
 * Display the header for a journal entry.
 */

const React = require('react');
const utils = require('./utils');

const JournalHeader = React.createClass({
  displayName: 'JournalHeader',

  propTypes: {
    title: React.PropTypes.string,
    editCallback: React.PropTypes.func,
    date: React.PropTypes.string,
    userName: React.PropTypes.string,
    created: React.PropTypes.string,
    profileImg: React.PropTypes.string,
    map: React.PropTypes.string
  },

  _mapCallback: function() {
    this.setState({mapDisplay: true});
  },

  /**
   * Construct the title part of the journal entry header.
   * @param {string} title - entry title.
   * @param {string} date - entry date.
   * @param {string} profileImg - addres of profile img, if any.
   * @param {string} editLink - target of edit, if any
   * @return {react} element representing the title.
   */
  _constructTitle: function(title, date, profileImg, map) {
    let titleText = '';

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

    let mapImgElement;
    if (map) {
      mapImgElement = (
        <img className="journal-entry-map"
          title="View a map of today"
          onClick={this._mapCallback}
          src={'media/map.png'}/>
      );
    }

    return (
      <span className="title">
        {titleText}
        {' '} {editButton}
        {profileImgElement}
        {mapImgElement}
      </span>
    );
  },

  _onCloseMap: function() {
    this.setState({mapDisplay: false});
  },

  _renderMap: function(map) {
    if (!this.state || !this.state.mapDisplay || !map) {
      return null;
    }
    return (
      <div className="modal" onClick={this._onCloseMap}>
        <div className="map">
          <iframe
            className="map"
            width="920"
            height="620"
            src={map}
          >
          </iframe>
        </div>
      </div>
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
      let byElement = null;
      let createdText = null;

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
    const title = this._constructTitle(this.props.title, this.props.date,
      this.props.profileImg, this.props.map);
    const subtitle = this._constructSubtitle(this.props.created,
      this.props.userName);

    return (
      <h3>
        {title}
        {subtitle}
        {this._renderMap(this.props.map)}
      </h3>
    );
  }
});

module.exports = JournalHeader;
