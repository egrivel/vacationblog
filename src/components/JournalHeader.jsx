'use strict';

/**
 * Display the header for a journal entry.
 */

const React = require('react');
const createReactClass = require('create-react-class');
const PropTypes = require('prop-types');
const Link = require('react-router').Link;
const utils = require('./utils');

const JournalHeader = createReactClass({
  displayName: 'JournalHeader',

  propTypes: {
    tripId: PropTypes.string,
    journalId: PropTypes.string,
    title: PropTypes.string,
    editCallback: PropTypes.func,
    date: PropTypes.string,
    userName: PropTypes.string,
    created: PropTypes.string,
    profileImg: PropTypes.string,
    map: PropTypes.string,
    dispMap: PropTypes.bool
  },

  contextTypes: {
    router: PropTypes.object
  },

  // Handling dynamic sizing of images in modal: set the event handler to
  // update size upon resizing
  componentDidMount: function() {
    /* global window */
    window.addEventListener('resize', this._sizeMapFrame, false);
  },

  // Handling dynamic sizing of images in modal: remove the event handler to
  // update size upon resizing
  componentWillUnmount: function() {
    window.removeEventListener('resize', this._sizeMapFrame);
  },

  // Handling dynamic sizing of images in modal: size right upon render
  componentDidUpdate: function() {
    this._sizeMapFrame();
  },

  _onOpenMap: function() {
    this.setState({mapDisplay: true});
  },

  _onCloseMap: function() {
    // this.setState({mapDisplay: false});
    this.context.router.push('/journal/' + this.props.tripId +
      '/' + this.props.journalId);
  },

  /**
   * Make sure the images in the modal window are appropriately sized. Handling
   * a maximum vertical size through CSS doesn't seem to be working, so have
   * this sizing function which looks at the original size of the image and the
   * current window size, and makes sure the actual height of the image does not
   * exceed 75% of the window height.
   */
  _sizeMapFrame: function() {
    if (this.props && this.props.dispMap) {
      // The modal is displayed. Get the image
      // eslint-disable-next-line no-undef
      const containerElement = document.getElementById('the-modal');
      // eslint-disable-next-line no-undef
      const mapElement = document.getElementById('the-modal-map');
      if (containerElement && mapElement) {
        // First the image height is limited to 75% of the window height
        // eslint-disable-next-line no-undef
        const windowHeight = window.innerHeight;
        // eslint-disable-next-line no-undef
        const windowWidth = window.innerWidth;

        let mapHeight = windowHeight - 50;
        let mapTop = 25;
        let mapWidth = windowWidth - 50;

        if (mapHeight < 50) {
          mapHeight = windowHeight;
          mapTop = 0;
        }
        if (mapWidth < 50) {
          mapWidth = windowWidth;
        }

        // Set calculated size
        mapElement.style.height = String(mapHeight) + 'px';
        mapElement.style.width = String(mapWidth) + 'px';
        mapElement.style.top = String(mapTop) + 'px';
      }
    }
  },

  _renderMap: function(map) {
    if (!this.props || !this.props.dispMap || !map) {
      return null;
    }
    return (
      <div id="the-modal" className="modal" onClick={this._onCloseMap}>
        <Link
          className="the-modal-close"
          to={'/journal/' + this.props.tripId + '/' + this.props.journalId}>
          <i className="fa fa-times"></i>
        </Link>
        <div id="the-modal-map">
          <iframe
            className="map"
            width="100%"
            height="100%"
            src={map}
          >
          </iframe>
        </div>
      </div>
    );
  },

  /**
   * Construct the title part of the journal entry header.
   * @param {string} title - entry title.
   * @param {string} date - entry date.
   * @param {string} profileImg - addres of profile img, if any.
   * @param {string} map - location of map, if any.
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
        <Link href={'#/journal/' + this.props.tripId +
            '/' + this.props.journalId + '/1'}>
          <img className="journal-entry-map"
            title="View a map of today"
            onClick={this._onOpenMap}
            src={'media/map.png'}/>
        </Link>
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
