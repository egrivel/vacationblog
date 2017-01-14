'use strict';

const React = require('react');
const TripStore = require('../stores/TripStore');

const storeMixin = require('./StoreMixin');

const Footer = React.createClass({
  displayName: 'Footer',

  stores: [TripStore],

  mixins: [storeMixin()],

  /**
   * Get the state from the stores.
   * @return {object} new state.
   * @private
   */
  _getStateFromStores: function _getStateFromStores() {
    const tripData = TripStore.getTripData();
    return {
      startDate: tripData.startDate,
      endDate: tripData.endDate
    };
  },

  _getFooterText: function _getFooterText() {
    const startDate = this.state.startDate;
    const endDate = this.state.endDate;

    let copyrightYear = '';
    let startYear = '';
    let endYear = '';

    if (endDate &&
        endDate.length > 4 &&
        !isNaN(endDate.substring(0, 4))) {
      endYear = endDate.substring(0, 4);
    }

    if (startDate &&
        startDate.length > 4 &&
        !isNaN(startDate.substring(0, 4))) {
      startYear = startDate.substring(0, 4);
    } else {
      startYear = endYear;
    }

    if (endYear === '') {
      endYear = startYear;
    }

    if (startYear === endYear) {
      copyrightYear = startYear;
    } else {
      copyrightYear = String(startYear) + '-' + endYear;
    }

    return 'Content copyright \u00A9' + copyrightYear +
      ' by the respective authors.';
  },

  render: function() {
    const footerText = this._getFooterText();
    return (
      React.DOM.div(
        {
          className: 'footer'
        },
        React.DOM.p(null, footerText +
                    ' Website design \u00A92015-17 by Eric Grivel.' +
                    ' All rights reserved.')
      )
    );
  }
});

module.exports = Footer;
