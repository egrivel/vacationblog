'use strict';

var React = require('react');

var Feedback = React.createClass({
  displayName: 'Feedback',
  clickLike: function() {
    this.setState({likeCount: this.state.likeCount + 1});
  },

  clickPlus: function() {
    this.setState({plusCount: this.state.plusCount + 1});
  },

  componentWillMount: function() {
    this.setState({likeCount: 0, plusCount: 0});
  },

  render: function render() {
    return React.DOM.div(
      {
        className: 'feedback'
      },
      React.DOM.i(
        {
          className: 'fa',
          onClick: this.clickLike
        },
        '\uf087'),
      ' ' + this.state.likeCount + ' facebook. ',
      React.DOM.i(
        {
          className: 'fa',
          onClick: this.clickPlus
        },
        '\uf067'),
      ' ' + this.state.plusCount + ' Google.'
    );
  }
});

module.exports = Feedback;
