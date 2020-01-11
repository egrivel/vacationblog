'use strict';

// /* global XMLHttpRequest */

const utils = {
  getAsync: function getAsync(url, callback) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      if ((xmlHttp.readyState === 4) && (xmlHttp.status === 200)) {
        callback(xmlHttp.responseText);
      }
    };
    // use 'true' for asynchronous
    xmlHttp.open('GET', url, true);
    xmlHttp.send(null);
  },
  postAsync: function(url, data, callback) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      if ((xmlHttp.readyState === 4) && (xmlHttp.status === 200)) {
        callback(xmlHttp.responseText);
      }
    };
    // use 'true' for asynchronous
    xmlHttp.open('PUT', url, true);
    xmlHttp.send(JSON.stringify(data));
  }
};

export default utils;
