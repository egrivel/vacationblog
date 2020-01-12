import React from 'react';
import PropTypes from 'prop-types';

import Formrow from './Formrow';

class Droplist extends React.Component {
  static propTypes = {
    fieldId: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    list: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })).isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string
  }

  _onChange(event) {
    this.props.onChange(event.target.value, this.props.fieldId);
  }

  render() {
    const options = [];
    const value = this.props.value || '';
    const {list} = this.props;

    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      options.push(
        <option
          key={'o-' + i}
          value={item.value}
        >
          {item.label}
        </option>
      );
    }

    return (
      <Formrow
        key={'k-' + this.props.fieldId}
        label={this.props.label}
        labelFor={this.props.fieldId}
      >
        <select
          id={this.props.fieldId}
          onChange={event => this._onChange(event)}
          value={value}
        >
          {options}
        </select>
      </Formrow>
    );
  }
}

export default Droplist;
