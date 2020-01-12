import React from 'react';
import PropTypes from 'prop-types';

import Formrow from './Formrow.jsx';

class Checkbox extends React.Component {
  static propTypes = {
    fieldId: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    selected: PropTypes.bool,
    onChange: PropTypes.func.isRequired
  }

  _onChange(event) {
    this.props.onChange(event.target.checked, this.props.fieldId);
  }

  _toggleValue() {
    this.props.onChange(!this.props.selected, this.props.fieldId);
  }

  render() {
    const {fieldId, label, selected} = this.props;
    return (
      <Formrow
        key={'k-' + fieldId + selected}
      >
        <label
          className="checkbox"
          htmlFor={fieldId}
          onClick={() => this._toggleValue()}
        >
          <input
            type="checkbox"
            id={fieldId}
            value="Y"
            checked={selected}
            onChange={event => this._onChange(event)}
          />
          {label}
        </label>
      </Formrow>
    );
  }
}

export default Checkbox;
