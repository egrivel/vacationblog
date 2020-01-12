
import AppDispatcher from '../AppDispatcher';

import MenuActionTypes from './MenuActionTypes';

const MenuAction = {
  Types: MenuActionTypes,
  selectItem: function(id) {
    AppDispatcher.dispatch({
      type: this.Types.MENU_SELECT,
      data: {
        id: id
      }
    });
  },
  unselectItem: function(id) {
    AppDispatcher.dispatch({
      type: this.Types.MENU_UNSELECT,
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

export default MenuAction;
