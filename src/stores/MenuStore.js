import assign from 'object-assign';
import AppDispatcher from '../AppDispatcher';
import MenuActionTypes from '../actions/MenuActionTypes';
import UserActionTypes from '../actions/UserActionTypes';
import GenericStore from './GenericStore';
import UserStore from './UserStore';

const menuIds = {
  HOME: 'm1',
  TRIP: 'm2',
  SEARCH: 'm3',
  PREFERENCES: 'm4',
  ADMIN: 'm5',
  ABOUT: 'm6'
};

// The menu structure. It uses the following attributes:
//  - id: unique ID for the menu item
//  - label: display label for the menu item
//  - selected: true if currently selected. If the menu entry has a sub-menu,
//    selected indicates that the sub-menu is visible
//  - target: target ref to invoke when the menu is selected (leaf entries only)
//  - submenu: next level menu to display when selected (non-leaf entries
//    only)
const _menuData = [
  {id: menuIds.HOME, label: 'Home', selected: false,
    visible: true, target: '#/'},
  {id: menuIds.TRIP, label: 'Trip', selected: false,
    visible: true, target: '#/trip'},
  {id: menuIds.SEARCH, label: 'Search', selected: false,
    visible: false, target: '#/search'},
  {id: menuIds.PREFERENCES, label: 'Preferences', selected: false,
    visible: false, target: '#/prefs'},
  {id: menuIds.ADMIN, label: 'Admin', selected: false,
    visible: false, target: '#/admin'},
  {id: menuIds.ABOUT, label: 'About', selected: false,
    visible: true, target: '#/about'}
];

/**
 * Find a particular item in the menu given its ID.
 * @param {string} id - ID of the menu item.
 * @return {object} menu item or null if the menu item isn't found.
 */
function _findMenu(id) {
  for (let i = 0; i < _menuData.length; i++) {
    if (_menuData[i].id === id) {
      return _menuData[i];
    }
  }
  return null;
}

/**
 * Update the menu based on the access level.
 * @param {string} access - new access level.
 * @return {boolean} true if the menu changed, false if it didn't.
 */
function _updateMenu(access) {
  let result = false;
  let item;
  let visible;

  item = _findMenu(menuIds.PREFERENCES);
  visible = ((access === 'visitor') || (access === 'admin'));
  if (item && item.visible !== visible) {
    item.visible = visible;
    result = true;
  }

  item = _findMenu(menuIds.ADMIN);
  visible = (access === 'admin');
  if (item && item.visible !== visible) {
    item.visible = visible;
    result = true;
  }

  return result;
}

/**
 * Recursively walk the menu structure to select a specific menu item.
 * All items other than the indicated item will be de-selected.
 * @param {array} list - (sub-) menu to recursively walk through.
 * @param {id} id - menu ID of the item to select.
 * @param {boolean} status - status to which to set visibility
 * @return {boolean} indicator whether the specified item was found in the
 * (sub-) menu.
 * @private
 */
function _selectMenuItem(list, id, status) {
  let didSelect = false;
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      list[i].selected = status;
      didSelect = true;
    } else if (status) {
      // only unselect the others if selecting the specific item
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

const MenuStore = assign({}, GenericStore, {
  menuIds: menuIds,

  getData: function() {
    return _menuData;
  },

  _storeCallback: function(action) {
    let access;

    switch (action.type) {
      case MenuActionTypes.MENU_SELECT:
        _selectMenuItem(_menuData, action.data.id, true);
        MenuStore.emitChange();
        break;

      case MenuActionTypes.MENU_UNSELECT:
        _selectMenuItem(_menuData, action.data.id, false);
        MenuStore.emitChange();
        break;

      case MenuActionTypes.MENU_VISIBLE:
        // _visibleMenuItem(_menuData, action.data.id, action.data.visible);
        // MenuStore.emitChange();
        break;

      case UserActionTypes.USER_SET_DATA:
      case UserActionTypes.USER_SET_LOGGED_IN:
        AppDispatcher.waitFor([UserStore.dispatchToken]);
        access = UserStore.getAccess();
        if (_updateMenu(access)) {
          MenuStore.emitChange();
        }
        break;

      default:
        // do nothing
    }
  }
});

MenuStore.dispatchToken = AppDispatcher.register(MenuStore._storeCallback);

export default MenuStore;
