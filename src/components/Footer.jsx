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

    if (!startDate && !endDate) {
      return '';
    }

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
      ' by the respective authors. ';
  },

  render: function() {
    const footerText = this._getFooterText();
    return (
      <div className='footer'>
        <p>
          {footerText}
          Website design &copy;2015-18 by Eric Grivel.
          All rights reserved.
          <br/>
          <a
            href="feature-requests.php"
            target="_blank"
          >
            Ideas and suggestions <i className="fa fa-external-link"></i>
          </a>
          {' \u2022 '}
          <a
            href="policy-terms.php"
            target="_blank"
          >
            Privacy Policy <i className="fa fa-external-link"></i>
          </a>
          {' \u2022 '}
          <a
            href="policy-terms.php"
            target="_blank"
          >
            Terms of Service <i className="fa fa-external-link"></i>
          </a>
        </p>
      </div>
    );
  }
});

module.exports = Footer;
