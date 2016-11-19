'use strict';

var _ = require('lodash');
var assign = require('object-assign');
var AppDispatcher = require('../AppDispatcher');
var MenuActionTypes = require('../actions/MenuAction').Types;
var UserActionTypes = require('../actions/UserAction').Types;
var GenericStore = require('./GenericStore');
var UserStore = require('./UserStore');

// The menu structure. It uses the following attributes:
//  - id: unique ID for the menu item
//  - label: display label for the menu item
//  - selected: true if currently selected. If the menu entry has a sub-menu,
//    selected indicates that the sub-menu is visible
//  - target: target ref to invoke when the menu is selected (leaf entries only)
//  - submenu: next level menu to display when selected (non-leaf entries
//    only)
var _menuData = [
  {id: 'm1', label: 'Trip', selected: false, visible: true,
    target: '#/'},
  {id: 'm2', label: 'Search', selected: false, visible: true,
    target: '#/search'},
  {id: 'm4', label: 'Admin', selected: false, visible: false,
    target: '#/admin'},
  {id: 'm5', label: 'About', selected: false, visible: true,
    target: '#/about'}
];

/**
 * Recursively walk the menu structure to select a specific menu item.
 * All items other than the indicated item will be de-selected.
 * @param {array} list - (sub-) menu to recursively walk through.
 * @param {id} id - menu ID of the item to select.
 * @return {boolean} indicator whether the specified item was found in the
 * (sub-) menu.
 * @private
 */
function _selectMenuItem(list, id) {
  var didSelect = false;
  var i;
  for (i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      list[i].selected = true;
      didSelect = true;
    } else {
      list[i].selected = false;
    }
    if (list[i].submenu) {
      if (_selectMenuItem(list[i].submenu, id)) {
        // an item in the submenu is selected, so keep the
        // parent selected as well.
        list[i].selected = true;
        didSelect = true;
      }
    }
  }
  return didSelect;
}

/**
 * Recursively update the menu to make a specific item visible or invisible.
 * This function will walk down the menu tree and make all item except the
 * indicated item invisible; the indicated item will be marked as specified
 * by the isVisible parameter. When unwinding the recursion, all parents of
 * the indicated item will also be marked as specified.
 * @param {array} list - (sub-) menu structure to recursively parse.
 * @param {id} id - menu item ID of the item to update
 * @param {boolean} isVisible - specification of what the item to update must
 * be set to.
 * @return {boolean} whether the indicated item was found in the (sub-) menu.
 * @private
 */
function _visibleMenuItem(list, id, isVisible) {
  var didFind = false;
  var i;
  for (i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      list[i].visible = isVisible;
      didFind = true;
    } else {
      list[i].visible = false;
    }
    if (list[i].submenu) {
      if (_visibleMenuItem(list[i].submenu, id, isVisible)) {
        // an item in the submenu is visible, so keep the
        // parent visible as well.
        list[i].visible = isVisible;
        didFind = true;
      }
    }
  }
  return didFind;
}

var MenuStore = assign({}, GenericStore, {
  getData: function() {
    return _menuData;
  },

  _storeCallback: function(action) {
    switch (action.type) {
      case MenuActionTypes.MENU_SELECT:
        _selectMenuItem(_menuData, action.data.id);
        MenuStore.emitChange();
        break;

      case MenuActionTypes.MENU_VISIBLE:
        // _visibleMenuItem(_menuData, action.data.id, action.data.visible);
        // MenuStore.emitChange();
        break;

      case UserActionTypes.USER_SET_DATA:
      case UserActionTypes.USER_SET_LOGGED_IN:
        AppDispatcher.waitFor([UserStore.dispatchToken]);
        var visible = false;
        var access = UserStore.getAccess();
        if (access === 'admin') {
          visible = true;
        }
        if (visible !== _menuData[3].visible) {
          _menuData[2].visible = visible;
          MenuStore.emitChange();
        }
        break;

      default:
        // do nothing
    }
  }
});

MenuStore.dispatchToken = AppDispatcher.register(MenuStore._storeCallback);

module.exports = MenuStore;
