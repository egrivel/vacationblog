'use strict';

import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

import Formrow from './Formrow.jsx';

const ButtonBar = createReactClass({
  displayName: 'ButtonBar',

  propTypes: {
    buttons: PropTypes.array.isRequired
  },

  render: function() {
    const buttonList = [];
    for (let i = 0; i < this.props.buttons.length; i++) {
      if (i) {
        buttonList.push(' ');
      }
      buttonList.push(
        <button
          type="submit"
          key={'b-' + i}
          onClick={this.props.buttons[i].onClick}
        >
          {this.props.buttons[i].label}
        </button>
      );
    }
    return (
      <Formrow
        label=""
      >
        <div>
          {buttonList}
        </div>
      </Formrow>
    );
  }
});

export default ButtonBar;
