'use strict';

import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

import Formrow from './Formrow.jsx';

const Display = createReactClass({
  displayName: 'Display',

  propTypes: {
    fieldId: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string
  },

  defaultProps: {
    value: ''
  },

  render: function() {
    return (
      <Formrow
        key={'k-' + this.props.fieldId}
        label={this.props.label}
      >
        <span>
          {this.props.value}
        </span>
      </Formrow>
    );
  }
});

export default Display;
