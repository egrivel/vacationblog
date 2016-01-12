'use strict';

var React = require('react');
var TripStore = require('../stores/TripStore');

var storeMixin = require('./StoreMixin');

var Footer = React.createClass({
  displayName: 'Footer',

  stores: [TripStore],

  mixins: [storeMixin()],

  /**
   * Get the state from the stores.
   * @return {object} new state.
   * @private
   */
  _getStateFromStores: function _getStateFromStores() {
    var tripData = TripStore.getTripData();
    return {
      startDate: tripData.startDate,
      endDate: tripData.endDate
    };
  },

  _getFooterText: function _getFooterText() {
    var startDate = this.state.startDate;
    var endDate = this.state.endDate;

    var copyrightYear = '';
    var startYear = '';
    var endYear = '';

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
    var footerText = this._getFooterText();
    return (
      React.DOM.div(
        {
          className: 'footer'
        },
        React.DOM.p(null, footerText +
                    ' Website design \u00A92015 by Eric Grivel.' +
                    ' All rights reserved.')
      )
    );
  }
});

module.exports = Footer;
