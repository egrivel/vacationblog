import React from 'react';
import PropTypes from 'prop-types';

import Formrow from './Formrow.jsx';

class ButtonBar extends React.Component {
  static propTypes = {
    buttons: PropTypes.arrayOf(
      PropTypes.shape({
        onClick: PropTypes.func.isRequired,
        label: PropTypes.string.isRequired
      })
    ).isRequired
  }

  render() {
    const {buttons} = this.props;

    const buttonList = [];
    for (let i = 0; i < buttons.length; i++) {
      if (i) {
        buttonList.push(' ');
      }
      buttonList.push(
        <button
          type="submit"
          key={'b-' + i}
          onClick={buttons[i].onClick}
        >
          {buttons[i].label}
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
}

export default ButtonBar;
