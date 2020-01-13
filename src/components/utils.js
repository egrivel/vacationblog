
/**
 * Common display utilities. These utilities can be used to render
 * all the different types of text that comes from the database.
 *
 * The following utility functions are provided:
 *  - splitText: take a text blob and split it in a series of
 *    objects representing individual blocks (paragraphs) in the text.
 *  - renderBlock: take a block object and return the React representation
 *    of that object.
 */

import React from 'react';
import moment from 'moment-timezone';

function _replaceEntities(inputText) {
  let text = inputText;

  text = text.replace(/&aacute;/g, '\u00e1');
  text = text.replace(/&agrave;/g, '\u00e0');

  text = text.replace(/&ccedil;/g, '\u00e7');

  text = text.replace(/&eacute;/g, '\u00e9');
  text = text.replace(/&ecirc;/g, '\u00ea');
  text = text.replace(/&egrave;/g, '\u00e8');
  text = text.replace(/&euml;/g, '\u00eb');

  text = text.replace(/&iacute;/g, '\u00ed');

  text = text.replace(/&ntilde;/g, '\u00f1');

  text = text.replace(/&ocirc;/g, '\u00f4');
  text = text.replace(/&omacron;/g, '\u014d');
  text = text.replace(/&ouml;/g, '\u00f6');

  text = text.replace(/&uuml;/g, '\u00fc');

  text = text.replace(/&mdash;/g, '\u2014');
  text = text.replace(/&frac12;/g, '\u00bd');
  text = text.replace(/&frac14;/g, '\u00bc');
  text = text.replace(/&sup2;/g, '\u00b2');
  text = text.replace(/&deg;/g, '\u00b0');

  text = text.replace(/&ldquo;/g, '\u201c');
  text = text.replace(/&rdquo;/g, '\u201d');
  text = text.replace(/&lsquo;/g, '\u2018');
  text = text.replace(/&rsquo;/g, '\u2019');
  text = text.replace(/&apos;/g, '\u2019');

  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&lf;/g, ' ');
  text = text.replace(/&nl;/g, ' ');
  /* eslint no-regex-spaces: 0 */
  text = text.replace(/  +/g, ' ');

  return text;
}

/**
 * Recursively get all the nodes from a string of text.
 * This function will parse a string (text) into a series of React elements
 * and return the array of React elements representing the original text.
 * The following parts are recognized:
 * <ul>
 * <li>[EM] for emphasized (italic) text.</li>
 * <li>[B] for bold text (rendered as emphasized unless legacy).</li>
 * <li>[U] for underlined text (rendered as emphasized unless legacy).</li>
 * <li>[LINK] for a link.</li>
 * </ul>
 * @param {string} text - text to parse.
 * @param {int} count - counter to create unique key attributes.
 * @return {array} list of React elements.
 * @private
 */
// eslint-disable-next-line complexity
function _recursivelyGetNodes(inputText, count) {
  const nodes = [];
  let text = inputText;
  let end;

  if (text.indexOf('[') < 0) {
    // no markup, that's easy
    nodes.push(_replaceEntities(text));
    return nodes;
  }

  if (text.indexOf('[') > 0) {
    nodes.push(_replaceEntities(text.substring(0, text.indexOf('['))));
    text = text.substring(text.indexOf('['));
  }

  if (text.substring(0, 4).toUpperCase() === '[EM]') {
    end = text.toUpperCase().indexOf('[/EM]');
    if (end > 0) {
      nodes.push(
        <em key={count}>
          {_recursivelyGetNodes(text.substring(4, end), count + 1)}
        </em>
      );
      // nodes.push(React.DOM.em({key: count},
      //                         _recursivelyGetNodes(text.substring(4, end),
      //                                            count + 1)));
      nodes.push(_recursivelyGetNodes(text.substring(end + 5),
        count + 1));
    } else {
      nodes.push(
        <em key={count}>
          {_recursivelyGetNodes(text.substring(4), count + 1)}
        </em>
      );
      // nodes.push(React.DOM.em({key: count},
      //                         _recursivelyGetNodes(text.substring(4),
      //                                            count + 1)));
    }
  } else if (text.substring(0, 3) === '[B]') {
    end = text.indexOf('[/B]');
    if (end > 0) {
      nodes.push(
        <strong key={count}>
          {_recursivelyGetNodes(text.substring(3, end), count + 1)}
        </strong>
      );
      // nodes.push(React.DOM.strong({key: count},
      //                             _recursivelyGetNodes(text.substring(3, end),
      //                                                 count + 1)));
      nodes.push(_recursivelyGetNodes(text.substring(end + 4),
        count + 1));
    } else {
      nodes.push(
        <strong key={count}>
          {_recursivelyGetNodes(text.substring(3), count + 1)}
        </strong>
      );
      // nodes.push(React.DOM.strong({key: count},
      //                             _recursivelyGetNodes(text.substring(3),
      //                                                  count + 1)));
    }
  } else if (text.substring(0, 3) === '[U]') {
    end = text.indexOf('[/U]');
    if (end > 0) {
      nodes.push(
        <u key={count}>
          {_recursivelyGetNodes(text.substring(3, end), count + 1)}
        </u>
      );
      // nodes.push(React.DOM.u({key: count},
      //                        _recursivelyGetNodes(text.substring(3, end),
      //                                             count + 1)));
      nodes.push(_recursivelyGetNodes(text.substring(end + 4),
        count + 1));
    } else {
      nodes.push(
        <u key={count}>
          {_recursivelyGetNodes(text.substring(3), count + 1)}
        </u>
      );
      // nodes.push(React.DOM.u({key: count},
      //                        _recursivelyGetNodes(text.substring(3),
      //                                             count + 1)));
    }
  } else if (text.substring(0, 6).toUpperCase() === '[LINK ') {
    const endOpen = text.indexOf(']');
    let open = '';
    if (endOpen > 0) {
      open = text.substring(6, endOpen);
      text = text.substring(endOpen + 1);
    } else {
      // open tag doesn't end; just remove open tag and keep rest of
      // the text
      text = text.substring(6);
    }
    if (open) {
      const href = open;
      end = text.toUpperCase().indexOf('[/LINK]');
      if (end > 0) {
        // Note: using rel="noopener noreferrer" to prevent a potentiall
        // security problem, see
        // https://mathiasbynens.github.io/rel-noopener/
        nodes.push(
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            key={count}
          >
            {_recursivelyGetNodes(text.substring(0, end), count + 1)}
          </a>
        );
        // nodes.push(React.DOM.a({href: href, target: '_blank', key: count},
        //                        _recursivelyGetNodes(text.substring(0, end),
        //                                           count + 1)));
        nodes.push(_recursivelyGetNodes(text.substring(end + 7),
          count + 1));
      } else {
        // Note: using rel="noopener noreferrer" to prevent a potentiall
        // security problem, see
        // https://mathiasbynens.github.io/rel-noopener/
        nodes.push(
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            key={count}
          >
            {_recursivelyGetNodes(text, count + 1)}
          </a>
        );
        // nodes.push(React.DOM.a({href: href, target: '_blank', key: count},
        //   _recursivelyGetNodes(text, count + 1)));
      }
    } else {
      nodes.push(_recursivelyGetNodes(text, count + 1));
    }
  } else if (text.substring(0, 7).toUpperCase() === '[MEDIA ') {
    const endOpen = text.indexOf(']');
    let open = '';
    if (endOpen > 0) {
      open = text.substring(7, endOpen);
      text = text.substring(endOpen + 1);
    } else {
      // open tag doesn't end; just remove open tag and keep rest of
      // the text
      text = text.substring(7);
    }
    if (open) {
      const src = open.trim();
      nodes.push(
        <img
          src={'media/' + src}
          keys={count}
        />
      );
      // nodes.push(React.DOM.img(
      //   {src: 'media/' + src, key: count}
      // ));
    }
  } else {
    nodes.push(text);
  }
  return nodes;
}

const utils = {
  orientation: {
    PORTRAIT: 'portrait',
    LANDSCAPE: 'landscape',
    PANO: 'pano'
  },

  replaceEntities: function(text) {
    return _replaceEntities(text);
  },

  buildTextNode: function(type, className, key, text) {
    const nodes = _recursivelyGetNodes(text, 0);
    if (type === 'p') {
      return (
        <p
          className={className || null}
          key={key}
        >{nodes}</p>
      );
      // return React.DOM.p(
      //   {
      //     className: className,
      //     key: key
      //   },
      //   nodes
      // );
    } else if (type === 'span') {
      return (
        <span
          className={className || null}
          key={key}
        >{nodes}</span>
      );
      // return React.DOM.span(
      //   {
      //     className: className,
      //     key: key
      //   },
      //   nodes
      // );
    }
  },

  /**
   * Provide consistent display for all date and date-time in the app.
   * @param {date} date - date-time in internal format.
   * @return {string} human-readable representation of the date or date-time.
   */
  formatDate: function(date) {
    if (!date) {
      return null;
    } else if (date.length === 8) {
      // date in yyyymmdd format
      return moment(date, 'YYYYMMDD').format('dddd MMMM D YYYY');
    } else if (date.length === 10) {
      // date in yyyy-mm-dd format
      return moment(date).format('dddd MMMM D YYYY');
    } else if (date.length === 26) {
      // date in yyyy-mm-dd hh:mm:ss.mmmmmm microsecond format
      // In this format, the date is in UTC and needs to be converted
      // to local time (the moment library will take care of DST)
      // Note: default to the American 12-hour time format. Allow
      // users to select a 24-hour time format in the future.
      const momentObj = moment.utc(date);
      // const result = moment.tz(m, moment.tz.guess())
      //   .format('dddd MMMM D YYYY h:mm:ssa z');
      // Use the "LTS" string in moment to generate a format that will
      // be 12 or 24 hour depending on the user's locale's conventions.
      const result = moment.tz(momentObj, moment.tz.guess())
        .format('dddd MMMM D YYYY LTS z');
      return result;
    } else if (date.length === 19) {
      // date in yyyy-mm-dd hh:mm:ss without microsecond format
      // In this format, the date is in UTC and needs to be converted
      // to local time (the moment library will take care of DST)
      // Note: default to the American 12-hour time format. Allow
      // users to select a 24-hour time format in the future.
      const momentObj = moment.utc(date);
      // const result = moment.tz(m, moment.tz.guess())
      //   .format('dddd MMMM D YYYY h:mm:ssa z');
      // Use the "LTS" string in moment to generate a format that will
      // be 12 or 24 hour depending on the user's locale's conventions.
      const result = moment.tz(momentObj, moment.tz.guess())
        .format('dddd MMMM D YYYY LTS z');
      return result;
    }
    utils.warning('formatDate(' + JSON.stringify(date) + '): - unknown format');
    return date;
  },

  warning: function(text) {
    // eslint-disable-next-line no-console
    console.log(text);
  },

  splitText: function(text) {
    if (text) {
      return text.split('&lf;');
    }

    return [];
  }
};

export default utils;
