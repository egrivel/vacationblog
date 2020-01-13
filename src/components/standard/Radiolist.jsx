import React from 'react';
import PropTypes from 'prop-types';

import Formrow from './Formrow';

class Radiolist extends React.Component {
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
    const {fieldId, label, list, onChange, value} = this.props;

    const options = [];
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      let checked = false;
      if (item.value === value) {
        checked = true;
      }
      options.push(
        <label
          className="radiobutton"
          htmlFor={fieldId + '-' + i}
          key={'r-' + i}
          onClick={event => onChange(event.target.value, fieldId)}
        >
          <input
            id={fieldId + '-' + i}
            name={fieldId}
            type="radio"
            value={item.value}
            checked={checked}
            onClick={event => onChange(event.target.value, fieldId)}
          />
          {item.label + ' '}
        </label>
      );
    }
    return (
      <Formrow
        key={'k-' + fieldId}
        label={label}
        labelFor={fieldId}
      >
        <span className="radioList">
          {options}
        </span>
      </Formrow>
    );
  }
}

export default Radiolist;
