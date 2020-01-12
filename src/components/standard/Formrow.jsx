'use strict';

import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

const Formrow = createReactClass({
  displayName: 'Form row',

  propTypes: {
    label: PropTypes.string,
    labelFor: PropTypes.string,
    children: PropTypes.object
  },

  render: function() {
    return (
      <div>
        <div className="formLabel" htmlFor={this.props.labelFor}>
          {this.props.label}
        </div>
        <div className="formValue">
          {this.props.children}
        </div>
      </div>
    );
  }
});

export default Formrow;
