import React from 'react';
import PropTypes from 'prop-types';

class Formrow extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    labelFor: PropTypes.string,
    children: PropTypes.object
  };

  render() {
    return (
      <div>
        <div
          className="formLabel"
          htmlFor={this.props.labelFor}
        >
          {this.props.label}
        </div>
        <div className="formValue">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Formrow;
