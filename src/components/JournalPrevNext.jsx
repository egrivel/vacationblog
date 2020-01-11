'use strict';

/**
 * The previous / next line in journal entries.
 */

const React = require('react');
const createClass = require('create-react-class');
const PropTypes = require('prop-types');

const Link = require('react-router').Link;

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
  let icon1 = null;
  let icon2 = null;
  if (className === 'prevlink') {
    icon1 = <i className={'fa ' + icon} />;
    // icon1 = React.DOM.i(
    //   {
    //     className: 'fa ' + icon
    //   }
    // );
  } else {
    icon2 = <i className={'fa ' + icon} />;
    // icon2 = React.DOM.i(
    //   {
    //     className: 'fa ' + icon
    //   }
    // );
  }
  if (targetId) {
    return (
      <span className={className}>
        <Link to={'/journal/' + tripId + '/' + targetId}>
          {icon1}
          {' ' + label + ' '}
          {icon2}
        </Link>
      </span>
    );
  }
  // if (targetId) {
  //   return React.DOM.span(
  //     {
  //       className: className
  //     },
  //     React.createElement(
  //       Link,
  //       {
  //         to: '/journal/' + tripId + '/' + targetId
  //       },
  //       icon1, icon1,
  //       ' ' + label + ' ',
  //       icon2, icon2
  //     )
  //   );
  // }
  return (
    <span className={className}>
      {defaultLabel}
    </span>
  );
  // return React.DOM.span(
  //   {
  //     className: className
  //   },
  //   defaultLabel
  // );
}

const JournalPrevNext = createClass({
  displayName: 'JournalPrevNext',

  propTypes: {
    tripId: PropTypes.string.isRequired,
    prevId: PropTypes.string,
    nextId: PropTypes.string,
    nr: PropTypes.number.isRequired
  },

  render: function() {
    const prevPart = getPrevNextPart(this.props.tripId, this.props.prevId,
      'fa-chevron-left', 'prevlink',
      'Previous Post', '(no previous post)');
    const nextPart = getPrevNextPart(this.props.tripId, this.props.nextId,
      'fa-chevron-right', 'nextlink',
      'Next Post', '(no next post)');
    const key = 'prevnext-' + this.props.nr;
    return (
      <p className="prevnext" key={key}>
        {prevPart}
        {'\u2022'}
        {nextPart}
      </p>
    );
  }
});

module.exports = JournalPrevNext;
