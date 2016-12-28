'use strict';

const utils = {
  setCookie: function(name, value, days) {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      expires = '; expires=' + date.toUTCString();
    }
    // eslint-disable-next-line no-undef
    document.cookie = name + '=' + value + expires + '; path=/';
  },

  cookies: {
    AUTH: 'blogAuthId',
    ENTRY: 'blogLastEntry'
  },

  getCookie: function(name) {
    const nameEQ = name + '=';

    // eslint-disable-next-line no-undef
    const cookieList = document.cookie.split(';');

    for (let i = 0; i < cookieList.length; i++) {
        let cookie = cookieList[i];
        while (cookie.charAt(0) == ' ') {
          cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) == 0) {
          return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
  },

  eraseCookie: function(name) {
    utils.createCookie(name, '', -1);
  }
};

module.exports = utils;
