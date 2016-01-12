'use strict';

var AppDispatcher = require('../AppDispatcher');

var MenuAction = {
  Types: {
    MENU_SELECT: 'MENU_SELECT',
    MENU_VISIBLE: 'MENU_VISIBLE'
  },
  selectItem: function(id) {
    AppDispatcher.dispatch({
      type: this.Types.MENU_SELECT,
      data: {
        id: id
      }
    });
  },
  visibleItem: function(id, visible) {
    AppDispatcher.dispatch({
      type: this.Types.MENU_VISIBLE,
      data: {
        id: id,
        visible: visible
      }
    });
  }
};

module.exports = MenuAction;
