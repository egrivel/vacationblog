import React from 'react';
import PropTypes from 'prop-types';

import Formrow from './Formrow.jsx';

class Display extends React.Component {
  static propTypes = {
    fieldId: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string
  };

  static defaultProps = {
    value: ''
  }

  render() {
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
}

export default Display;
