'use strict';

/**
 * Display an entire journal entry.
 *
 * This is the major entry point to display the journal entry, which
 * in turn is the backbone of the vacation blog website.
 *
 * The journal entry is the component that participates in the flux
 * cycle. It will retrieve all the information needed to display the
 * content, and pass them on as props to the various child components.
 *
 * This component does not load data, it only displays data that has
 * already been loaded.
 */

// Add 'window' to the eslint globals for this file.
/* global window */

var React = require('react');
var Link = require('react-router').Link;

var JournalStore = require('../stores/JournalStore');
var MediaStore = require('../stores/MediaStore');
var UserStore = require('../stores/UserStore');
var CommentStore = require('../stores/CommentStore');

var UserAction = require('../actions/UserAction');
var MediaAction = require('../actions/MediaAction');

var Paragraph = require('./Paragraph');
var CommentList = require('./CommentList');
var Feedback = require('./Feedback');
var utils = require('./utils');

/**
 * Check if images are already available and if not, request for them to
 * be loaded.
 * @param {id} tripId - unique trip ID.
 * @param {string} text - journal entry content to parse for images.
 * @private
 */
function _checkImagesLoad(tripId, text) {
  var images = [];
  var imageCount = 0;

  var list = text.split('[IMG ');
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    if (item.indexOf(']') > 0) {
      var img = item.substring(0, item.indexOf(']'));
      if (img.match(/^[\d\-abc]+$/)) {
        // this is a valid image ID; extract it and remove the image reference
        // from the string
        var mediaInfo = MediaStore.getData(tripId, img);
        if (!mediaInfo) {
          images[imageCount++] = img;
        }
      }
    }
  }
  if (imageCount) {
    MediaAction.bulkLoadMedia(tripId, images);
  }
}

/**
 * Get the state from the stores.
 * @return {object} new state.
 * @private
 */
function _getStateFromStores() {
  var journalData = JournalStore.getData();
  var userName = '';
  var comments = null;

  if (journalData && journalData.userId) {
    var userData = UserStore.getData(journalData.userId);
    if (userData) {
      userName = userData.name;
    }
  }

  if (journalData.tripId && journalData.journalText) {
    _checkImagesLoad(journalData.tripId, journalData.journalText);
  }

  if (journalData.tripId && journalData.commentId) {
    comments = CommentStore.recursiveGetComments(JournalData.tripId, JournalData.commentId);
}

  return {
    tripId: journalData.tripId,
    journalId: journalData.journalId,
    journalTitle: journalData.journalTitle,
    journalText: journalData.journalText,
    journalDate: journalData.journalDate,
    created: journalData.created,
    userId: journalData.userId,
    userName: userName,
    nextId: journalData.nextId,
    prevId: journalData.prevId,
    comments: comments
  };
}

/**
 * Build a 'previous' or 'next' link.
 * @param {id} tripId - unique trip ID.
 * @param {id} targetId - unique ID of the target journal entry.
 * @param {string} icon - name of the icon to use in the link.
 * @param {string} className - class name to add to the link.
 * @param {string} label - label for the link.
 * @param {string} defaultLabel - label to use instead if there is no link.
 * @return {object} React element representing the previous or next link.
 * @private
 */
function _getPrevNextPart(tripId, targetId, icon, className,
                          label, defaultLabel) {
  var icon1 = null;
  var icon2 = null;
  if (className === 'prevlink') {
    icon1 = React.DOM.i(
      {
        className: 'fa ' + icon
      }
    );
  } else {
    icon2 = React.DOM.i(
      {
        className: 'fa ' + icon
      }
    );
  }
  if (targetId) {
    return React.DOM.span(
      {
        className: className
      },
      React.createElement(
        Link,
        {
          to: '/journal/' + tripId + '/' + targetId
        },
        icon1, icon1,
        ' ' + label + ' ',
        icon2, icon2
      )
    );
  }
  return React.DOM.span(
    {
      className: className
    },
    defaultLabel
  );
}

/**
 * Get the prev/next line for a journal entry.
 * @param {id} tripId - unique trip ID.
 * @param {id} prevId - ID of the previous journal entry.
 * @param {id} nextId - ID of the next journal entry.
 * @param {int} nr - instance number in the parent; there are two
 * prev/next lines on display, which need to get a unique React key.
 * @return {object} React element for the prev/next line.
 * @private
 */
function _getPrevNextLine(tripId, prevId, nextId, nr) {
  var prevPart =
    _getPrevNextPart(tripId, prevId, 'fa-chevron-left', 'prevlink',
                     'Previous Post', '(no previous post)');
  var nextPart =
    _getPrevNextPart(tripId, nextId, 'fa-chevron-right', 'nextlink',
                     'Next Post', '(no next post)');
  return React.DOM.p(
    {
      key: 'prevnext-' + nr,
      className: 'prevnext'
    },
    prevPart, ' \u2022 ', nextPart);
}

/**
 * Get the header for the journal entry.
 * @param {string} journalTitle - title of the entry.
 * @param {date} journalDate - date for the entry.
 * @param {id} userId - user ID of the user who created the entry.
 * @param {string} userName - formatted name of the user who created the
 * entry.
 * @param {date} created - timestamp when entry was created.
 * @return {object} React element for journal entry header.
 * @private
 */
function _getHeader(journalTitle, journalDate, userId, userName, created) {
  var titleText = '';
  if (journalDate) {
    titleText += utils.formatDate(journalDate);
    if (journalTitle) {
      titleText += ': ' + utils.replaceEntities(journalTitle);
    }
  } else if (journalTitle) {
    titleText = utils.replaceEntities(journalTitle);
  } else {
    titleText = '(Untitled)';
  }

  // a created of zeros is not created at all
  if (created === '0000-00-00 00:00:00.000000') {
    created = '';
  }

  var title = React.DOM.span(
    {
      className: 'title'
    },
    titleText);
  var subtitle = null;
  if (userId && !userName) {
    // if the user name isn't available yet, fire off an action to
    // get it loaded
    UserAction.loadUser(userId);
  } else if (!userName) {
    userName = userId;
  }
  if (userName || created) {
    if (userId && created) {
      subtitle = React.DOM.span(
        {
          className: 'subtitle'
        },
        React.DOM.em({}, 'by')
        , ' ' + userName,
        ' (' + utils.formatDate(created) + ')');
    } else if (userName) {
      subtitle = React.DOM.span(
        {
          className: 'subtitle'
        },
        React.DOM.em({}, 'by'),
        ' ' + userName);
    } else {
      subtitle = React.DOM.span(
        {
          className: 'subtitle'
        },
        ' (' + utils.formatDate(created) + ')');
    }
  }

  return React.DOM.h3({}, title, subtitle);
}

var JournalEntry = React.createClass({
  displayName: 'JournalEntry',

  getInitialState: function() {
    return _getStateFromStores();
  },

  _onChange: function() {
    this.setState(_getStateFromStores());
  },

  /**
   * React lifecycle function. Called when the component is first
   * mounted. Not called on updates; the componentWillReceiveProps is
   * called on updates.
   */
  componentDidMount: function() {
    JournalStore.addChangeListener(this._onChange);
    MediaStore.addChangeListener(this._onChange);
    UserStore.addChangeListener(this._onChange);
    CommentStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    CommentStore.removeChangeListener(this._onChange);
    UserStore.removeChangeListener(this._onChange);
    MediaStore.removeChangeListener(this._onChange);
    JournalStore.removeChangeListener(this._onChange);
  },

  /**
   * React lifecycle function. Called when the components is already
   * mounted and there are new props passed in.
   * @param {object} nextProps - new properties that are passed to this
   * component as part of the update.
   */
  // standard lifecyle parameter is not used - this is not a problem
  /* eslint-disable no-unused-vars */
  componentWillReceiveProps: function(nextProps) {
    // When the page is loaded with new parameters (i.e. a new journal
    // entry is displayed), scroll to the top of the page.
    window.scrollTo(0, 0);
  },
  /* eslint-enable no-unused-vars */

  render: function render() {
    var parCount = 0;
    var tripId = this.state.tripId;
    var journalId = this.state.journalId;

    if (!tripId) {
      return null;
    }
    if (!journalId) {
      return null;
    }

    var parList = utils.splitText(this.state.journalText);

    var comment = null;
    if (this.state.tripId && this.state.journalId) {
      comment = React.createElement(CommentList, {
        tripId: this.state.tripId,
        referenceId: this.state.journalId});
    }

    // Unique key for this journal item. Since the journal item has this
    // unique key, the sub items can have simple sequential keys.
    var key = this.state.tripId + '-' + this.state.journalId;
    var feedback = React.createElement(Feedback, null);
    var val =
      React.DOM.div({
        className: 'journalitem',
        key: key
      },
      _getHeader(this.state.journalTitle,
                 this.state.journalDate,
                 this.state.userId,
                 this.state.userName,
                 this.state.created),
      _getPrevNextLine(this.state.tripId,
                       this.state.prevId,
                       this.state.nextId,
                       1),
      parList.map(function(par) {
        parCount++;
        var parKey = 'p-' + parCount;
        return React.createElement(Paragraph, {
          tripId: tripId,
          key: parKey,
          text: par
        });
      }),
      feedback,
      comment,
      _getPrevNextLine(this.state.tripId,
                       this.state.prevId,
                       this.state.nextId,
                       2)
      );
    return val;
  }
});

module.exports = JournalEntry;
