'use strict';

/**
 * The previous / next line in journal entries.
 */

var React = require('react');
var Link = require('react-router').Link;

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
function getPrevNextPart(tripId, targetId, icon, className,
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

var JournalEntryPrevNext = React.createClass({
  displayName: 'JournalEntryPrevNext',

  propTypes: {
    tripId: React.PropTypes.string.isRequired,
    prevId: React.PropTypes.string.isRequired,
    nextId: React.PropTypes.string.isRequired,
    nr: React.PropTypes.number.isRequired
  },

  render: function() {
    var prevPart = getPrevNextPart(this.props.tripId, this.props.prevId,
      'fa-chevron-left', 'prevlink',
      'Previous Post', '(no previous post)');
    var nextPart = getPrevNextPart(this.props.tripId, this.props.nextId,
      'fa-chevron-right', 'nextlink',
      'Next Post', '(no next post)');
    var key = 'prevnext-' + this.props.nr;
    return (
      <p className="prevnext" key={key}>
        {prevPart}
        {'\u2022'}
        {nextPart}
      </p>
    );
  }
});

module.exports = JournalEntryPrevNext;
