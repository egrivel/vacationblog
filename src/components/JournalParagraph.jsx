'use strict';

/**
 * Single paragraph (block) of text. The paragraph contains formatted
 * text and/or media.
 */

var _ = require('lodash');
var React = require('react');

var MediaStore = require('../stores/MediaStore');
var MediaAction = require('../actions/MediaAction');
var CommentList = require('./CommentList.jsx');
var Image = require('./Image.jsx');

var utils = require('./utils');
var Orientation = utils.orientation;

/**
 * Get the media info for a media element.
 * @param {id} tripId - unique trip ID.
 * @param {id} mediaId - unique media ID.
 * @return {object} information about the media.
 * @private
 */
function _getMediaInfo(tripId, mediaId) {
  var result = {
    orientation: Orientation.LANDSCAPE,
    caption: '',
    imageId: mediaId
  };

  var mediaInfo = MediaStore.getData(tripId, mediaId);
  if (mediaInfo) {
    result.width = mediaInfo.width;
    result.height = mediaInfo.height;
    result.caption = mediaInfo.caption;
    if (mediaInfo.height > mediaInfo.width) {
      result.orientation = Orientation.PORTRAIT;
    }
  } else {
    MediaAction.loadMedia(tripId, mediaId);
  }

  return result;
}

/**
 * Get a React element for an image which displays a modal window
 * when clicked.
 * @param {object} parent - object that handles the click to display a
 * modal window with the image.
 * @param {id} tripId - unique trip ID.
 * @param {id} mediaId - unique media ID.
 * @param {object} mediaInfo - info about the media.
 * @param {string} className - className to apply to the image.
 * @param {string} key - React key to use for the image.
 * @return {object} React element for the image.
 * @private
 */
function _imgWithModal(parent, tripId, mediaId, mediaInfo, className) {
  if (!mediaInfo) {
    mediaInfo = _getMediaInfo(tripId, mediaId);
  }

  return (
    <Image
      tripId={tripId}
      imageId={mediaId}
      format={mediaInfo.orientation}
      className={className}
      key={mediaId}
      caption={mediaInfo.caption}
      onClick={() => parent.clickImg(mediaId)}
    />
  );
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
function _standardParagraph(parent, tripId, text, mediaId) {
  const mediaInfo = _getMediaInfo(tripId, mediaId);
  // standard text paragraph with a single image
  let orientation = Orientation.LANDSCAPE;
  if (mediaInfo && mediaInfo.orientation) {
    orientation = mediaInfo.orientation;
  }
  const label = (
    <span className={'label-' + orientation}>
      {_imgWithModal(parent, tripId, mediaId, mediaInfo, '')}
    </span>
  );
  var value = utils.buildTextNode('span', 'value', 'value', text);
  var clear = React.DOM.span(
    {
      key: 'clear',
      className: 'clear'
    }
  );
  var modal = parent.buildModal();

  return React.DOM.div(
    null,
    React.DOM.p(
      {
        className: 'img-text'
      },
      label,
      value,
      clear
    ),
    modal
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
function _lineThreeImages(parent, tripId, images,
                         mediaInfo, start) {
  var img1 = images[start];
  var img2 = images[start + 1];
  var img3 = images[start + 2];

  var orientation1 = mediaInfo[start].orientation;
  var orientation2 = mediaInfo[start + 1].orientation;
  var orientation3 = mediaInfo[start + 2].orientation;

  var nrHor = 0;
  var nrVert = 0;
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

  var className = '';
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

  return React.DOM.p(
    {
      className: 'images three ' + className,
      key: 'p-' + start
    },
    _imgWithModal(parent, tripId, img1, mediaInfo[start], 'img3'), ' ',
    _imgWithModal(parent, tripId, img2, mediaInfo[start + 1], 'img3'), ' ',
    _imgWithModal(parent, tripId, img3, mediaInfo[start + 2], 'img3'),
    React.DOM.span(
      {
        key: 'clear',
        className: 'clear'
      }
    )
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
function _lineTwoImages(parent, tripId, images,
                       mediaInfo, start) {
  var img1 = images[start];
  var img2 = images[start + 1];

  var orientation1 = mediaInfo[start].orientation;
  var orientation2 = mediaInfo[start + 1].orientation;

  var nrHor = 0;
  var nrVert = 0;
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

  var className = '';
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

  return React.DOM.p(
    {
      className: 'images two ' + className,
      key: 'p-' + start
    },
    _imgWithModal(parent, tripId, img1, mediaInfo[start], 'img2'), ' ',
    _imgWithModal(parent, tripId, img2, mediaInfo[start + 1], 'img2'),
    React.DOM.span(
      {className: 'clear'}
    )
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
function _paragraphMultipleImages(parent, tripId, text, images) {
  var result = [];
  var resultCount = 0;

  var mediaInfo = [];
  var i;
  for (i = 0; i < images.length; i++) {
    mediaInfo[i] = _getMediaInfo(tripId, images[i]);
  }

  var textPart = null;
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
  var currentImg = 0;
  while ((images.length - currentImg) >= 5) {
    result[resultCount] = _lineThreeImages(parent, tripId, images, mediaInfo,
                                           currentImg, 'line-' + resultCount);
    resultCount++;
    currentImg += 3;
  }

  if ((images.length - currentImg) === 2) {
    result[resultCount] = _lineTwoImages(parent, tripId, images, mediaInfo,
                                         currentImg, 'line-' + resultCount);
    resultCount++;
    currentImg += 2;
  } else if ((images.length - currentImg) === 3) {
    result[resultCount] = _lineThreeImages(parent, tripId, images, mediaInfo,
                                           currentImg, 'line-' + resultCount);
    resultCount++;
    currentImg += 3;
  } else {
    // (images.length - currentImg) must be 4
    result[resultCount] = _lineTwoImages(parent, tripId, images, mediaInfo,
                                         currentImg, 'line-' + resultCount);
    resultCount++;
    currentImg += 2;
    result[resultCount] = _lineTwoImages(parent, tripId, images, mediaInfo,
                                         currentImg, 'line-' + resultCount);
    resultCount++;
    currentImg += 2;
  }

  var realResult = React.DOM.div(
    {className: 'result'},
    textPart,
    result,
    parent.buildModal()
  );
  return realResult;
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
function _paragraphSingleImage(parent, tripId, mediaId) {
  const mediaInfo = _.getMediaInfo(tripId, mediaId);
  return React.DOM.div(
    null,
    React.DOM.p(
      {
        className: 'images'
      },
      _imgWithModal(parent, tripId, mediaId, mediaInfo, 'img1'),
      React.DOM.span(
        {
          className: 'clear'
        }
      )
    ),
    parent.buildModal()
  );
}

/**
 * Make sure the images in the modal window are appropriately sized. Handling
 * a maximum vertical size through CSS doesn't seem to be working, so have
 * this sizing function which looks at the original size of the image and the
 * current window size, and makes sure the actual height of the image does not
 * exceed 75% of the window height.
 */
function _sizeModalImg() {
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
      if (imageHeight > (0.75 * windowHeight)) {
        imageHeight = 0.75 * windowHeight;
      }

      // Calculate the image width based on the (possibly limited) height
      let imageWidth = imageHeight * imageWidthMult;

      // Available width is the container width minus 20px padding on
      // each side
      const availableWidth = containerElement.clientWidth - 40;

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
}

var JournalParagraph = React.createClass({
  displayName: 'JournalParagraph',

  propTypes: {
    // need trip ID to get media info
    tripId: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired
  },

  // Handling dynamic sizing of images in modal: set the event handler to
  // update size upon resizing
  componentDidMount: function() {
    /* global window */
    window.addEventListener('resize', _sizeModalImg.bind(this), false);
  },

  // Handling dynamic sizing of images in modal: remove the event handler to
  // update size upon resizing
  componentWillUnmount: function() {
    window.removeEventListener('resize', _sizeModalImg);
  },

  // Handling dynamic sizing of images in modal: size right upon render
  componentDidUpdate: function() {
    _sizeModalImg.bind(this)();
  },

  buildModal: function buildModal() {
    if (this.state && this.state.modal && this.state.modal !== '') {
      const tripId = this.props.tripId;
      const clickImg = this.clickImg;
      const mediaId = this.state.modal;
      const mediaInfo = _getMediaInfo(tripId, mediaId);
      const comment = (
        <CommentList
          tripId={tripId}
          referenceId={mediaId}
        />
      );

      return (
        <div
          key="modal"
          className="modal"
          onClick={() => clickImg(mediaId)} onResize={() => this._modalResize()}
        >
          <div id="the-modal" className="modal-content">
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
            {comment}
          </div>
        </div>
      );
      // return React.DOM.div(
      //   {
      //     key: 'modal',
      //     className: 'modal',
      //     onClick: function() {
      //       clickImg(mediaId);
      //     }
      //   },
      //   React.DOM.div(
      //     {
      //       className: 'modal-content'
      //     },
      //     React.createElement(
      //       Image,
      //       {
      //         className: 'modal-img',
      //         tripId: this.props.tripId,
      //         imageId: mediaId,
      //         format: mediaInfo.orientation,
      //         caption: utils.replaceEntities(mediaInfo.caption)
      //       }
      //     ),
      //     React.DOM.div(
      //       {
      //         key: 'modal-caption',
      //         className: 'modal-image-caption'
      //       },
      //       utils.replaceEntities(mediaInfo.caption)
      //     ),
      //     comment
      //   )
      // );
    }
    return null;
  },

  clickImg: function clickImg(id) {
    if (this.state && this.state.modal && this.state.modal === id) {
      this.setState({modal: ''});
    } else {
      this.setState({modal: id});
    }
  },

  render: function() {
    if (!this.props.text) {
      return null;
    }

    var text = utils.replaceEntities(this.props.text);
    var tripId = this.props.tripId;

    var images = [];
    var imageCount = 0;

    text = text.replace('[IMGS]', '');
    var list = text.split('[IMG ');
    var outtext = list[0];
    for (var i = 1; i < list.length; i++) {
      var item = list[i];
      if (item.indexOf(']') > 0) {
        var img = item.substring(0, item.indexOf(']'));
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
      return _standardParagraph(this, tripId, text, images[0]);
    } else if (images.length > 1) {
      return _paragraphMultipleImages(this, tripId, text,
                                     images);
    } else if (text) {
      return _paragraphTextOnly(this, text);
    } else if (images.length === 1) {
      return _paragraphSingleImage(this, tripId, images[0]);
    }
    // default if nothing applies
    return null;
  }
});

module.exports = JournalParagraph;
