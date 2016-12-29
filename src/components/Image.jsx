'use strict';

/**
 * Component to display an image. This is an atomic component which
 * focuses on the display of a single image.
 */

const _ = require('lodash');
const React = require('react');

const utils = require('./utils');
const Orientation = utils.orientation;

const Image = React.createClass({
  displayName: 'Image',

  propTypes: {
    // Unique trip ID
    tripId: React.PropTypes.string.isRequired,
    // Unique image ID
    imageId: React.PropTypes.string.isRequired,
    // optional element ID
    elementId: React.PropTypes.string,
    // Image format: either 'portrait' or 'landscape'
    format: React.PropTypes.oneOf([
      Orientation.PORTRAIT,
      Orientation.LANDSCAPE,
      Orientation.PANO
    ]).isRequired,
    // CSS class name
    className: React.PropTypes.string,
    // Style (used for panorama)
    style: React.PropTypes.object,
    // Caption, if available
    caption: React.PropTypes.string,
    // Callback when clicked on the image
    onClick: React.PropTypes.func,
    onEdit: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      className: '',
      caption: '',
      onClick: _.noop
    };
  },

  render: function() {
    const fullClassname =
      _.trim(this.props.format + ' ' + this.props.className);
    const baseUrl = 'http://photos-egrivel.rhcloud.com/phimg?large=';
    const url = baseUrl + this.props.imageId;
    let editButton = null;
    if (this.props.onEdit) {
      editButton = (
        <input
          type='button'
          className="imageEdit"
          onClick={this.props.onEdit}
          value="Edit"
        />
      );
    }
    return (
      <span className="imageWrapper">
        <img
          id={this.props.elementId}
          className={fullClassname}
          title={this.props.caption}
          src={url}
          onClick={this.props.onClick}
        />
        {editButton}
      </span>
    );
  }
});

module.exports = Image;
