'use strict';

/**
 * Single paragraph (block) of text. The paragraph contains formatted
 * text and/or media.
 */

const React = require('react');
const createReactClass = require('create-react-class');
const PropTypes = require('prop-types');

const MediaStore = require('../stores/MediaStore');
const MediaAction = require('../actions/MediaAction');
const JournalImage = require('./JournalImage.jsx');

const utils = require('./utils');
const Orientation = utils.orientation;

/**
 * Get the media info for a media element.
 * @param {id} tripId - unique trip ID.
 * @param {id} mediaId - unique media ID.
 * @return {object} information about the media.
 * @private
 */
function _getMediaInfo(tripId, mediaId) {
  const result = {
    orientation: Orientation.LANDSCAPE,
    caption: '',
    imageId: mediaId
  };

  const mediaInfo = MediaStore.getData(tripId, mediaId);
  if (mediaInfo) {
    result.width = mediaInfo.width;
    result.height = mediaInfo.height;
    result.caption = mediaInfo.caption;
    if (mediaInfo.height > mediaInfo.width) {
      result.orientation = Orientation.PORTRAIT;
    }
  } else if (!MediaStore.getStatus(mediaId)) {
    MediaStore.setLoading(mediaId);
    MediaAction.loadMedia(tripId, mediaId);
  }

  return result;
}

/**
 * Standard paragraph with a single image.
 * @param {object} parent - object that handles the click to display a
 * modal window with the image.
 * @param {id} tripId - unique trip ID.
 * @param {string} text - paragraph text.
 * @param {id} mediaId - unique media ID.
 * @param {object} mediaInfo - info about the media.
 * @param {string} key - React key to use for the image.
 * @return {object} React element for the standard paragraph.
 * @private
 */
function _standardParagraph(parent, tripId, text, mediaId, canEdit) {
  const mediaInfo = _getMediaInfo(tripId, mediaId);
  // standard text paragraph with a single image
  let orientation = Orientation.LANDSCAPE;
  if (mediaInfo && mediaInfo.orientation) {
    orientation = mediaInfo.orientation;
  }
  const label = (
    <span className={'label-' + orientation}>
      <JournalImage
        tripId={tripId}
        mediaId={mediaId}
        className=""
        canEdit={canEdit}
      />
    </span>
  );
  const value = utils.buildTextNode('span', 'value', 'value', text);
  const clear = <span key="clear" className="clear" />;
  // const clear = React.DOM.span(
  //   {
  //     key: 'clear',
  //     className: 'clear'
  //   }
  // );

  return (
    <div>
      <div className="img-text">
        {label}
        {value}
        {clear}
      </div>
    </div>
  );
  // return React.DOM.div(
  //   null,
  //   React.DOM.div(
  //     {
  //       className: 'img-text'
  //     },
  //     label,
  //     value,
  //     clear
  //   )
  // );
}

/**
 * Display a line of three images.
 * @param {object} parent - object that handles the click to display a
 * modal window with the image.
 * @param {id} tripId - unique trip ID.
 * @param {array} images - array with image IDs.
 * @param {array} mediaInfo - array with information about the images
 * @param {int} start - starting offset in the arrays.
 * @param {string} key - React key to use for the image.
 * @return {object} React element for the line with three images
 * @private
 */
function _lineThreeImages(parent, tripId, images, mediaInfo, start, key, canEdit) {
  const img1 = images[start];
  const img2 = images[start + 1];
  const img3 = images[start + 2];

  const orientation1 = mediaInfo[start].orientation;
  const orientation2 = mediaInfo[start + 1].orientation;
  const orientation3 = mediaInfo[start + 2].orientation;

  let nrHor = 0;
  let nrVert = 0;
  if (orientation1 === Orientation.LANDSCAPE) {
    nrHor++;
  } else {
    nrVert++;
  }
  if (orientation2 === Orientation.LANDSCAPE) {
    nrHor++;
  } else {
    nrVert++;
  }
  if (orientation3 === Orientation.LANDSCAPE) {
    nrHor++;
  } else {
    nrVert++;
  }

  let className = '';
  switch (nrHor) {
    case 3:
      className += 'h';
      // fall-through
      // eslint-disable-line no-fallthrough
    case 2:
      className += 'h';
      // fall-through
      // eslint-disable-line no-fallthrough
    case 1:
      className += 'h';
      // fall-through
      // eslint-disable-line no-fallthrough
    default:
      // nothing
  }

  switch (nrVert) {
    case 3:
      className += 'v';
      // fall-through
      // eslint-disable-line no-fallthrough
    case 2:
      className += 'v';
      // fall-through
      // eslint-disable-line no-fallthrough
    case 1:
      className += 'v';
      // fall-through
      // eslint-disable-line no-fallthrough
    default:
      // nothing
  }

  return (
    <div
      className={'images three ' + className}
      key={'p-' + start}
    >
      <JournalImage
        tripId={tripId}
        mediaId={img1}
        className="img3"
        canEdit={canEdit}
      />
      {' '}
      <JournalImage
        tripId={tripId}
        mediaId={img2}
        className="img3"
        canEdit={canEdit}
      />
      {' '}
      <JournalImage
        tripId={tripId}
        mediaId={img3}
        className="img3"
        canEdit={canEdit}
      />
      <span className="clear"></span>
    </div>
  );
}

/**
 * Display a line of three images.
 * @param {object} parent - object that handles the click to display a
 * modal window with the image.
 * @param {id} tripId - unique trip ID.
 * @param {array} images - array with image IDs.
 * @param {array} mediaInfo - array with information about the images
 * @param {int} start - starting offset in the arrays.
 * @param {string} key - React key to use for the image.
 * @return {object} React element for the line with three images
 * @private
 */
function _lineTwoImages(parent, tripId, images, mediaInfo, start, key, canEdit) {
  const img1 = images[start];
  const img2 = images[start + 1];

  const orientation1 = mediaInfo[start].orientation;
  const orientation2 = mediaInfo[start + 1].orientation;

  let nrHor = 0;
  let nrVert = 0;
  if (orientation1 === Orientation.LANDSCAPE) {
    nrHor++;
  } else {
    nrVert++;
  }
  if (orientation2 === Orientation.LANDSCAPE) {
    nrHor++;
  } else {
    nrVert++;
  }

  let className = '';
  switch (nrHor) {
    case 2:
      className += 'h';
      // fall-through
      // eslint-disable-line no-fallthrough
    case 1:
      className += 'h';
      // fall-through
      // eslint-disable-line no-fallthrough
    default:
      // nothing
  }

  switch (nrVert) {
    case 2:
      className += 'v';
      // fall-through
      // eslint-disable-line no-fallthrough
    case 1:
      className += 'v';
      // fall-through
      // eslint-disable-line no-fallthrough
    default:
      // nothing
  }

  return (
    <div
      className={'images two ' + className}
      key={'p-' + start}
    >
      <JournalImage
        tripId={tripId}
        mediaId={img1}
        className="img2"
        canEdit={canEdit}
      />
      {' '}
      <JournalImage
        tripId={tripId}
        mediaId={img2}
        className="img2"
        canEdit={canEdit}
      />
      <span className="clear"></span>
    </div>
  );
}

/**
 * Display a paragraph with only text.
 * @param {object} parent - object that handles the click to display a
 * modal window with the image.
 * @param {string} text - paragraph text.
 * @param {string} key - React key to use for the text paragraph.
 * @return {object} React element for the text paragraph.
 * @private
 */
function _paragraphTextOnly(parent, text) {
  return utils.buildTextNode('p', 'text', 'p-0', text);
}

/**
 * Display a paragraph with multiple (two or more) images.
 * @param {object} parent - object that handles the click to display a
 * modal window with the image.
 * @param {id} tripId - unique trip ID.
 * @param {string} text - paragraph text.
 * @param {array} images - array with image IDs.
 * @param {string} key - React key to use for the image.
 * @return {object} React element for the line with three images
 * @private
 */
function _paragraphMultipleImages(parent, tripId, text, images, canEdit) {
  const result = [];
  let resultCount = 0;

  const mediaInfo = [];
  for (let i = 0; i < images.length; i++) {
    mediaInfo[i] = _getMediaInfo(tripId, images[i]);
  }

  let textPart = null;
  // if there is text, handle that
  if (text) {
    textPart = _paragraphTextOnly(parent, text, 'textline');
  }

  // handle the different image length options
  // The options are:
  //  - two images: one paragraph with two 'img2' entries
  //  - three images: one paragraph with three 'img3' entries
  //  - four images: two paragraphs with two 'img2' entries
  //  - five images: two paragraphs, one with three 'img3' entries and
  //    one with two 'img2' entries
  //  - five or more images: take the first three in a paragraph
  //    with three 'img3' entries, then do the above for the rest
  let currentImg = 0;
  while ((images.length - currentImg) >= 5) {
    result[resultCount] = _lineThreeImages(parent, tripId, images, mediaInfo,
                                           currentImg, 'line-' + resultCount,
                                           canEdit);
    resultCount++;
    currentImg += 3;
  }

  if ((images.length - currentImg) === 2) {
    result[resultCount] = _lineTwoImages(parent, tripId, images, mediaInfo,
                                         currentImg, 'line-' + resultCount,
                                         canEdit);
    resultCount++;
    currentImg += 2;
  } else if ((images.length - currentImg) === 3) {
    result[resultCount] = _lineThreeImages(parent, tripId, images, mediaInfo,
                                           currentImg, 'line-' + resultCount,
                                           canEdit);
    resultCount++;
    currentImg += 3;
  } else {
    // (images.length - currentImg) must be 4
    result[resultCount] = _lineTwoImages(parent, tripId, images, mediaInfo,
                                         currentImg, 'line-' + resultCount,
                                         canEdit);
    resultCount++;
    currentImg += 2;
    result[resultCount] = _lineTwoImages(parent, tripId, images, mediaInfo,
                                         currentImg, 'line-' + resultCount,
                                         canEdit);
    resultCount++;
    currentImg += 2;
  }

  return (
    <div className="result">
      {textPart}
      {result}
    </div>
  );
  // const realResult = React.DOM.div(
  //   {className: 'result'},
  //   textPart,
  //   result,
  //   null // parent.buildModal()
  // );
  // return realResult;
}

/**
 * Display a paragraph with a single image.
 * @param {object} parent - object that handles the click to display a
 * modal window with the image.
 * @param {id} tripId - unique trip ID.
 * @param {id} mediaId - unique media ID.
 * @param {object} mediaInfo - info about the media.
 * @param {string} key - React key to use for the image.
 * @return {object} React element for the line with three images
 * @private
 */
function _paragraphSingleImage(parent, tripId, mediaId, canEdit) {
  return (
    <div>
      <div className="images">
        <JournalImage
          tripId={tripId}
          mediaId={mediaId}
          className="img1"
          canEdit={canEdit}
        />
        <span className="clear"></span>
      </div>
    </div>
  );
}

const JournalParagraph = createReactClass({
  displayName: 'JournalParagraph',

  propTypes: {
    // need trip ID to get media info
    tripId: PropTypes.string.isRequired,
    tripActive: PropTypes.string.isRequired,
    // canEdit to know whether to allow editing on media
    canEdit: PropTypes.bool,
    text: PropTypes.string.isRequired
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

  /**
   * Make sure the images in the modal window are appropriately sized. Handling
   * a maximum vertical size through CSS doesn't seem to be working, so have
   * this sizing function which looks at the original size of the image and the
   * current window size, and makes sure the actual height of the image does not
   * exceed 75% of the window height.
   */
  _sizeModalImg: function() {
    if (this.state && this.state.modal && this.state.modal !== '') {
      // The modal is displayed. Get the image
      /* global document */
      const containerElement = document.getElementById('the-modal');
      const imgElement = document.getElementById('the-modal-image');
      if (containerElement && imgElement) {
        const orientation = _getMediaInfo(this.props.tripId,
          this.state.modal).orientation;

        // Determine underlying image size and width/height ration
        let imageHeight = 600;
        let imageWidthMult = 1.5;
        if (orientation === Orientation.PORTRAIT) {
          imageHeight = 900;
          imageWidthMult = (2 / 3);
        }

        // First the image height is limited to 75% of the window height
        const windowHeight = window.innerHeight;
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

  /**
   * Render a panoramic image.
   * @param {string} tripId: ID of the trip.
   * @param {string} imageId: ID of image to render
   * @param {string} offset: (optional) vertical offset, range from -50 to +50.
   * Default value is 0, which centers the image vertically. An offset of -50
   * renders the image bottom-aligned, +50 renders it top-aligned.
   * @return {object} React rendered component.
   */
  _renderPanorama: function(tripId, imageId, offset, canEdit) {
    // make sure offset is in range -50 to +50 and default 0
    if (offset) {
      if (offset < -50) {
        offset = -50;
      }
      if (offset > 50) {
        offset = 50;
      }
    } else {
      offset = 0;
    }

    return (
      <div className="panorama">
        <JournalImage
          tripId={tripId}
          mediaId={imageId}
          elementId={imageId}
          format="pano"
          offset={parseInt(offset)}
          canEdit={canEdit}
        />
      </div>
    );
  },

  render: function() {
    if (!this.props.text) {
      return null;
    }

    let text = utils.replaceEntities(this.props.text);
    const tripId = this.props.tripId;

    const images = [];
    let imageCount = 0;

    const pano = text.match(/^\s*\[PANO ([\d\-abc]+)(\s+[+\-]\d+)?\]\s*$/);
    if (pano) {
      return this._renderPanorama(tripId, pano[1], pano[2], this.props.canEdit);
    }

    text = text.replace('[IMGS]', '');
    const list = text.split('[IMG ');
    let outtext = list[0];
    for (let i = 1; i < list.length; i++) {
      const item = list[i];
      if (item.indexOf(']') > 0) {
        const img = item.substring(0, item.indexOf(']'));
        if (img.match(/^[\d\-abc]+$/)) {
          images[imageCount++] = img;
          outtext += ' ' + item.substring(item.indexOf(']') + 1);
        } else {
          outtext += '[IMG ' + item;
        }
      } else {
        outtext += '[IMG ' + item;
      }
    }

    text = outtext;
    text = text.replace(/\s\s+/g, ' ');

    if ((text === '') || (text === ' ')) {
      // no text left
      text = null;
    }

    if ((images.length === 1) && text) {
      return _standardParagraph(this, tripId, text, images[0], this.props.canEdit);
    } else if (images.length > 1) {
      return _paragraphMultipleImages(this, tripId, text,
                                     images, this.props.canEdit);
    } else if (text) {
      return _paragraphTextOnly(this, text);
    } else if (images.length === 1) {
      return _paragraphSingleImage(this, tripId, images[0], this.props.canEdit);
    }

    // default if nothing applies
    return null;
  }
});

module.exports = JournalParagraph;
