'use strict';

const React = require('react');

const UserStore = require('../stores/UserStore');
const MediaStore = require('../stores/MediaStore');
const MediaAction = require('../actions/MediaAction');

const Image = require('./Image.jsx');
const ButtonBar = require('./standard/ButtonBar.jsx');
const Display = require('./standard/Display.jsx');
const Textbox = require('./standard/Textbox.jsx');
const utils = require('./utils');
const Orientation = utils.orientation;

function _getMediaInfo(tripId, mediaId) {
  const result = {
    orientation: Orientation.LANDSCAPE,
    caption: '',
    location: '',
    imageId: mediaId,
    url: ''
  };

  const mediaInfo = MediaStore.getData(tripId, mediaId);
  if (mediaInfo) {
    result.width = mediaInfo.width;
    result.height = mediaInfo.height;
    result.caption = mediaInfo.caption;
    result.location = mediaInfo.location;
    result.url = mediaInfo.url;
    if (mediaInfo.height > mediaInfo.width) {
      result.orientation = Orientation.PORTRAIT;
    }
  } else {
    MediaAction.loadMedia(tripId, mediaId);
  }

  return result;
}

const JournalImage = React.createClass({
  displayName: 'JournalImage',

  propTypes: {
    tripId: React.PropTypes.string,
    mediaId: React.PropTypes.string,
    className: React.PropTypes.string,
    offset: React.PropTypes.number,
    format: React.PropTypes.string
  },

  getInitialState: function() {
    return {
      editModal: false,
      imageModal: false
    };
  },

  // Handling dynamic sizing of images in modal: set the event handler to
  // update size upon resizing
  componentDidMount: function() {
    /* global window */
    window.addEventListener('resize', this._sizeModalImg, false);
  },

  // Handling dynamic sizing of images in modal: remove the event handler to
  // update size upon resizing
  componentWillUnmount: function() {
    window.removeEventListener('resize', this._sizeModalImg);
  },

  // Handling dynamic sizing of images in modal: size right upon render
  componentDidUpdate: function() {
    this._sizeModalImg();
  },

  _onClick: function() {
    this.setState({
      editModal: false,
      imageModal: !this.state.imageModal
    });
  },

  _onEdit: function() {
    const mediaInfo = _getMediaInfo(this.props.tripId, this.props.mediaId);
    this.setState({
      editModal: !this.state.editModal,
      imageModal: false,
      width: mediaInfo.width,
      height: mediaInfo.height,
      caption: mediaInfo.caption,
      location: mediaInfo.location
    });
  },

  _onClose: function() {
    this.setState({editModal: false});
  },

  _onSave: function() {
    MediaAction.saveMedia(this.props.tripId, this.props.mediaId, {
      width: this.state.width,
      height: this.state.height,
      caption: this.state.caption,
      location: this.state.location
    });
    this.setState({editModal: false});
  },

  _onChange: function(value, prop) {
    const newState = {};
    newState[prop] = value;
    this.setState(newState);
  },

  _renderImageModal: function() {
    if (!this.state.imageModal) {
      return null;
    }

    const tripId = this.props.tripId;
    const mediaId = this.props.mediaId;
    const mediaInfo = _getMediaInfo(tripId, mediaId);

    return (
      <div
        key="modal"
        className="modal"
        onClick={this._onClick}
      >
        <div id="the-modal" className="modal-content image-modal">
          <Image
            elementId="the-modal-image"
            className="modal-img"
            tripId={tripId}
            imageId={mediaId}
            format={mediaInfo.orientation}
            caption={utils.replaceEntities(mediaInfo.caption)}
          />
          <div className="modal-image-caption">
            {utils.replaceEntities(mediaInfo.caption)}
          </div>
        </div>
      </div>
    );
  },

  _renderEditModal: function() {
    if (!this.state.editModal) {
      return null;
    }

    const buttons = [];
    buttons.push({label: 'Save', onClick: this._onSave});
    buttons.push({label: 'Close', onClick: this._onClose});

    return (
      <div
        key="modal"
        className="modal"
      >
        <div id="the-modal" className="modal-content edit-modal">
          <Display
            fieldId="mediaId"
            label="ID"
            value={this.props.mediaId}
          />
          <Textbox
            fieldId="width"
            label="Width"
            value={this.state.width}
            onChange={this._onChange}
          />
          <Textbox
            fieldId="height"
            label="Height"
            value={this.state.height}
            onChange={this._onChange}
          />
          <Textbox
            fieldId="caption"
            label="Caption"
            value={this.state.caption}
            onChange={this._onChange}
          />
          <Textbox
            fieldId="location"
            label="Location"
            value={this.state.location}
            onChange={this._onChange}
          />
          <ButtonBar buttons={buttons}/>
        </div>
      </div>
    );
  },

  /**
   * Make sure the images in the modal window are appropriately sized. Handling
   * a maximum vertical size through CSS doesn't seem to be working, so have
   * this sizing function which looks at the original size of the image and the
   * current window size, and makes sure the actual height of the image does not
   * exceed 75% of the window height.
   */
  _sizeModalImg: function() {
    if (this.state && this.state.imageModal) {
      // The modal is displayed. Get the image
      // eslint-disable-next-line no-undef
      const containerElement = document.getElementById('the-modal');
      // eslint-disable-next-line no-undef
      const imgElement = document.getElementById('the-modal-image');
      if (containerElement && imgElement) {
        const orientation = _getMediaInfo(this.props.tripId,
          this.props.mediaId).orientation;

        // Determine underlying image size and width/height ration
        let imageHeight = 600;
        let imageWidthMult = 1.5;
        if (orientation === Orientation.PORTRAIT) {
          imageHeight = 900;
          imageWidthMult = (2 / 3);
        }

        // First the image height is limited to 75% of the window height
        // eslint-disable-next-line no-undef
        const windowHeight = window.innerHeight;
        // eslint-disable-next-line no-undef
        const windowWidth = window.innerWidth;
        if (imageHeight > (0.75 * windowHeight)) {
          imageHeight = 0.75 * windowHeight;
        }

        // Calculate the image width based on the (possibly limited) height
        let imageWidth = imageHeight * imageWidthMult;

        // Available width is the container width minus padding on
        // each side
        // For small windows, the padding is 2 pixels, for large, it is 20
        let availableWidth = containerElement.clientWidth - 4;
        if (windowWidth > 480) {
          availableWidth -= 36;
        }

        // If window width exceeds available width, adjust both width and height
        if (imageWidth > availableWidth) {
          imageWidth = availableWidth;
          imageHeight = imageWidth / imageWidthMult;
        }

        // Set calculated size
        imgElement.style.height = String(imageHeight) + 'px';
        imgElement.style.width = String(imageWidth) + 'px';
      }
    }
  },

  render: function() {
    const editModal = this._renderEditModal();
    const imageModal = this._renderImageModal();
    const tripId = this.props.tripId;
    const mediaId = this.props.mediaId;
    const className = this.props.className;
    const mediaInfo = _getMediaInfo(tripId, mediaId);
    const offset = this.props.offset;
    let format = this.props.format;
    if (!format) {
      format = mediaInfo.orientation;
    }

    let onEdit = null;
    if (UserStore.canEditMedia()) {
      onEdit = this._onEdit;
    }

    let onClick = this._onClick;
    if (format === 'pano') {
      // don't do a modal window for panoramas
      onClick = null;
    }

    return (
      <span>
        <Image
          tripId={tripId}
          imageId={mediaId}
          format={format}
          className={className}
          key={mediaId}
          caption={mediaInfo.caption}
          offset={offset}
          onClick={onClick}
          onEdit={onEdit}
          url={mediaInfo.url}
        />
        {editModal}
        {imageModal}
      </span>
    );
  }
});

module.exports = JournalImage;
