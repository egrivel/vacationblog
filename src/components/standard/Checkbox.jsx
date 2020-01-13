import React from 'react';
import PropTypes from 'prop-types';

import Formrow from './Formrow';

class Checkbox extends React.Component {
  static propTypes = {
    fieldId: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    selected: PropTypes.bool
  }

  render() {
    const {fieldId, label, onChange, selected} = this.props;
    return (
      <Formrow
        key={'k-' + fieldId + selected}
      >
        <label
          className="checkbox"
          htmlFor={fieldId}
          onClick={() => onChange(!selected, fieldId)}
        >
          <input
            type="checkbox"
            id={fieldId}
            value="Y"
            checked={selected}
            onChange={event => onChange(event.target.checked, fieldId)}
          />
          {label}
        </label>
      </Formrow>
    );
  }
}

export default Checkbox;
