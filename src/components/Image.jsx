'use strict';

/**
 * Component to display an image. This is an atomic component which
 * focuses on the display of a single image.
 */

var _ = require('lodash');
var React = require('react');

var utils = require('./utils');
var Orientation = utils.orientation;

var Image = React.createClass({
  displayName: 'Image',

  propTypes: {
    // Unique trip ID
    tripId: React.PropTypes.string.isRequired,
    // Unique image ID
    imageId: React.PropTypes.string.isRequired,
    // Image format: either 'portrait' or 'landscape'
    format: React.PropTypes.oneOf([
      Orientation.PORTRAIT,
      Orientation.LANDSCAPE
    ]).isRequired,
    // CSS class name
    className: React.PropTypes.string,
    // Caption, if available
    caption: React.PropTypes.string,
    // Callback when clicked on the image
    onClick: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      className: '',
      caption: '',
      onClick: _.noop
    };
  },

  render: function() {
    var fullClassname = _.trim(this.props.format + ' ' + this.props.className);
    return React.DOM.img(
      {
        className: fullClassname,
        title: this.props.caption,
        src: 'http://washington/cgi-bin/photos/phimg?large=' + this.props.imageId,
        onClick: this.props.onClick
      }
    );
  }
});

module.exports = Image;
