import React from 'react';
import PropTypes from 'prop-types';

class Formrow extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    labelFor: PropTypes.string,
    children: PropTypes.object
  };

  render() {
    const {label, labelFor, children} = this.props;

    return (
      <div>
        <div
          className="formLabel"
          htmlFor={labelFor}
        >
          {label}
        </div>
        <div className="formValue">
          {children}
        </div>
      </div>
    );
  }
}

export default Formrow;
