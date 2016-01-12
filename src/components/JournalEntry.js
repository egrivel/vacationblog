'use strict';

// Add 'window' to the eslint globals for this file.
/* global window */

var React = require('react');
var Link = require('react-router').Link;

var JournalStore = require('../stores/JournalStore');
var MediaStore = require('../stores/MediaStore');
var UserStore = require('../stores/UserStore');
var CommentStore = require('../stores/CommentStore');

var JournalAction = require('../actions/JournalAction');
var UserAction = require('../actions/UserAction');
var MediaAction = require('../actions/MediaAction');
var CommentAction = require('../actions/CommentAction');

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
 * Recursively heck to see if all comments have been loaded, and make
 * additional comments be loaded if needed.
 * @param {id} tripId - unique trip ID.
 * @param {id} referenceId - unique ID of the item to which comments are
 * loaded.
 * @private
 */
function _checkCommentsLoad(tripId, referenceId) {
  var data = CommentStore.getData(tripId, referenceId);
  if (data) {
    if (data.count) {
      for (var i = 0; i < data.count; i++) {
        _checkCommentsLoad(tripId, data.list[i].commentId);
      }
    }
  } else {
    CommentAction.loadComments(tripId, referenceId);
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
  if (journalData && journalData.userId) {
    var userData = UserStore.getData(journalData.userId);
    if (userData) {
      userName = userData.name;
    }
  }

  if (journalData.tripId && journalData.journalId) {
    _checkCommentsLoad(journalData.tripId, journalData.journalId);
  }
  if (journalData.tripId && journalData.journalText) {
    _checkImagesLoad(journalData.tripId, journalData.journalText);
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
    prevId: journalData.prevId
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

  componentDidMount: function() {
    JournalStore.addChangeListener(this._onChange);
    MediaStore.addChangeListener(this._onChange);
    UserStore.addChangeListener(this._onChange);
    CommentStore.addChangeListener(this._onChange);
    this.getDataIfNeeded(this.props);
  },

  componentWillUnmount: function() {
    CommentStore.removeChangeListener(this._onChange);
    UserStore.removeChangeListener(this._onChange);
    MediaStore.removeChangeListener(this._onChange);
    JournalStore.removeChangeListener(this._onChange);
  },

  componentWillReceiveProps: function(nextProps) {
    // When initially loaded, allways scroll to the top of the page
    window.scrollTo(0, 0);
    this.getDataIfNeeded(nextProps);
  },

  getDataIfNeeded: function(props) {
    var data = JournalStore.getData();
    var tripId = '';
    var journalId = '';
    if (props && props.params) {
      tripId = props.params.tripId;
      journalId = props.params.journalId;
    }
    if ((tripId !== data.tripId) ||
        (journalId !== data.journalId)) {
      JournalAction.loadJournal(tripId, journalId);
    }
  },

  render: function render() {
    var parList = [];
    var parCount = 0;
    var tripId = this.state.tripId;
    var journalId = this.state.journalId;

    if (!tripId) {
      return null;
    }
    if (!journalId) {
      return null;
    }
    if (this.state.journalText) {
      parList = this.state.journalText.split('&lf;');
    }

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
        var parKey = '-p' + parCount;
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
