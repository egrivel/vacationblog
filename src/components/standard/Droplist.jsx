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

  static defaultProps = {
    value: ''
  }

  render() {
    const options = [];
    const {fieldId, label, list, onChange, value} = this.props;

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
        key={'k-' + fieldId}
        label={label}
        labelFor={fieldId}
      >
        <select
          id={fieldId}
          onChange={event => onChange(event.target.value, fieldId)}
          value={value}
        >
          {options}
        </select>
      </Formrow>
    );
  }
}

export default Droplist;
