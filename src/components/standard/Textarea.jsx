import React from 'react';
import PropTypes from 'prop-types';

import Formrow from './Formrow';

class Textarea extends React.Component {
  static propTypes = {
    fieldId: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string
  }

  static defaultProps = {
    value: ''
  }

  render() {
    const {fieldId, label, onChange, value} = this.props;

    return (
      <Formrow
        key={'k-' + fieldId}
        label={label}
        labelFor={fieldId}
      >
        <textarea
          rows={10}
          cols={60}
          id={fieldId}
          value={value}
          onChange={event => onChange(event.target.value, fieldId)}
        />
      </Formrow>
    );
  }
}

export default Textarea;
