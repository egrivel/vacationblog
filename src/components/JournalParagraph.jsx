'use strict';

/**
 * Single paragraph (block) of text. The paragraph contains formatted
 * text and/or media.
 */

var React = require('react');

var MediaStore = require('../stores/MediaStore');
var CommentList = require('./CommentList');
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
    caption: ''
  };

  var mediaInfo = MediaStore.getData(tripId, mediaId);
  if (mediaInfo) {
    result.caption = mediaInfo.caption;
    if (mediaInfo.height > mediaInfo.width) {
      result.orientation = Orientation.PORTRAIT;
    }
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
 * @param {string} className - className to apply to the image.
 * @param {string} key - React key to use for the image.
 * @return {object} React element for the image.
 * @private
 */
function _imgWithModal(parent, tripId, mediaId, className) {
  if (!mediaId) {
    return null;
  }

  var mediaInfo = _getMediaInfo(tripId, mediaId);

  return React.createElement(Image, {
    tripId: tripId,
    imageId: mediaId,
    format: mediaInfo.orientation,
    className: className,
    key: mediaId,
    caption: mediaInfo.caption,
    onClick: function() {
      if (parent) {
        parent.clickImg(mediaId);
      }
    }
  });
}

/**
 * Standard paragraph with a single image.
 * @param {object} parent - object that handles the click to display a
 * modal window with the image.
 * @param {id} tripId - unique trip ID.
 * @param {string} text - paragraph text.
 * @param {id} mediaId - unique media ID.
 * @param {string} key - React key to use for the image.
 * @return {object} React element for the standard paragraph.
 * @private
 */
function _standardParagraph(parent, tripId, text, mediaId) {
  // standard text paragraph with a single image
  var label = React.DOM.span(
    {
      key: 'label',
      className: 'label'
    },
    _imgWithModal(parent, tripId, mediaId, '')
  );
  var value = utils.buildTextNode('span', 'value', 'value', text);
  var clear = React.DOM.span(
    {
      key: 'clear',
      className: 'clear'
    }
  );
  var modal = null;
  if (parent) {
    modal = parent.buildModal();
  }
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
  if (orientation1 === 'landscape') {
    nrHor++;
  } else {
    nrVert++;
  }
  if (orientation2 === 'landscape') {
    nrHor++;
  } else {
    nrVert++;
  }
  if (orientation3 === 'landscape') {
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
    _imgWithModal(parent, tripId, img1, 'img3'),
    _imgWithModal(parent, tripId, img2, 'img3'),
    _imgWithModal(parent, tripId, img3, 'img3'),
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
  if (orientation1 === 'landscape') {
    nrHor++;
  } else {
    nrVert++;
  }
  if (orientation2 === 'landscape') {
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
    _imgWithModal(parent, tripId, img1, 'img2'),
    _imgWithModal(parent, tripId, img2, 'img2'),
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
 * Display a paragraph with multiple images.
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
  var orientationMap = '';
  for (i = 0; i < images.length; i++) {
    mediaInfo[i] = _getMediaInfo(tripId, images[i]);
    if (mediaInfo[i] === 'portrait') {
      orientationMap += 'v';
    } else {
      orientationMap += 'h';
    }
  }

  // if there is text, handle that
  if (text) {
    result[resultCount] = _paragraphTextOnly(parent, text, 'textline');
    resultCount++;
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
  } else if ((images.length - currentImg) === 4) {
    result[resultCount] = _lineTwoImages(parent, tripId, images, mediaInfo,
                                         currentImg, 'line-' + resultCount);
    resultCount++;
    currentImg += 2;
    result[resultCount] = _lineTwoImages(parent, tripId, images, mediaInfo,
                                         currentImg, 'line-' + resultCount);
    resultCount++;
    currentImg += 2;
  }
  result[resultCount++] = parent.buildModal();

  return React.DOM.div({}, result);
}

/**
 * Display a paragraph with a single image.
 * @param {object} parent - object that handles the click to display a
 * modal window with the image.
 * @param {id} tripId - unique trip ID.
 * @param {id} mediaId - unique media ID.
 * @param {string} key - React key to use for the image.
 * @return {object} React element for the line with three images
 * @private
 */
function _paragraphSingleImage(parent, tripId, mediaId) {
  return React.DOM.div(
    null,
    React.DOM.p(
      {
        className: 'images'
      },
      _imgWithModal(parent, tripId, mediaId, 'img1'),
      React.DOM.span(
        {
          className: 'clear'
        }
      )
    ),
    parent.buildModal()
  );
}

var JournalParagraph = React.createClass({
  displayName: 'JournalParagraph',

  propTypes: {
    // need trip ID to get media info
    tripId: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired
  },

  buildModal: function buildModal() {
    if (this.state && this.state.modal && this.state.modal !== '') {
      var clickImg = this.clickImg;
      var mediaId = this.state.modal;
      var mediaInfo = _getMediaInfo(this.props.tripId, mediaId);
      var comment = React.createElement(CommentList, {
        tripId: this.props.tripId,
        referenceId: mediaId
      });

      return React.DOM.div(
        {
          key: 'modal',
          className: 'modal',
          onClick: function() {
            clickImg(mediaId);
          }
        },
        React.DOM.div(
          {
            className: 'modal-content'
          },
          React.createElement(
            Image,
            {
              tripId: this.props.tripId,
              imageId: mediaId,
              format: mediaInfo.orientation,
              caption: utils.replaceEntities(mediaInfo.caption)
            }
          ),
          React.DOM.div(
            {
              key: 'modal-caption',
              className: 'modal-image-caption'
            },
            utils.replaceEntities(mediaInfo.caption)
          ),
          comment
        )
      );
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
