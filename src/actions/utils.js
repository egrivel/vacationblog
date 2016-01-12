'use strict';

/* global XMLHttpRequest */

var utils = {
  getAsync: function getAsync(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      if ((xmlHttp.readyState === 4) && (xmlHttp.status === 200)) {
        callback(xmlHttp.responseText);
      }
    };
    // use 'true' for asynchronous
    xmlHttp.open('GET', url, true);
    xmlHttp.send(null);
  }
};

module.exports = utils;

