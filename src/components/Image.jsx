'use strict';

/**
 * Component to display an image. This is an atomic component which
 * focuses on the display of a single image.
 */

const _ = require('lodash');
const React = require('react');
const createClass = require('create-react-class');
const PropTypes = require('prop-types');

const utils = require('./utils');
const Orientation = utils.orientation;

const Image = createClass({
  displayName: 'Image',

  propTypes: {
    // Unique image ID
    imageId: PropTypes.string.isRequired,
    // optional element ID
    elementId: PropTypes.string,
    // Image format: either 'portrait' or 'landscape'
    format: PropTypes.oneOf([
      Orientation.PORTRAIT,
      Orientation.LANDSCAPE,
      Orientation.PANO
    ]).isRequired,
    // CSS class name
    className: PropTypes.string,
    // Style (used for panorama)
    offset: PropTypes.number,
    // Caption, if available
    caption: PropTypes.string,
    // Callback when clicked on the image
    onClick: PropTypes.func,
    onEdit: PropTypes.func,
    url: PropTypes.string
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
    let url = this.props.url;
    if (!url) {
      return null;
//      const baseUrl = 'https://egrivel.net/proxy/phimg.php?large=';
//      const baseUrl = 'https://egrivel.net/blogphotos/';
//      url = baseUrl + this.props.imageId + '.jpg';
    }
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
    let style = null;
    if (this.props.format === 'pano') {
      style = {top: (this.props.offset - 50) + '%'};
    }
    return (
      <span className="imageWrapper">
        <img
          id={this.props.elementId}
          className={fullClassname}
          title={this.props.caption}
          src={url}
          onClick={this.props.onClick}
          style={style}
        />
        {editButton}
      </span>
    );
  }
});

module.exports = Image;
