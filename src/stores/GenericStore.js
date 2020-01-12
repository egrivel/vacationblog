
import {EventEmitter} from 'events';
import assign from 'object-assign';

const CHANGE_EVENT = 'change';

const GenericStore = assign({}, EventEmitter.prototype, {
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * Register a callback function to listen to change events.
   * @param {function} callback - callback function to register.
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * Remove a previously registered callback function.
   * @param {function} callback - callback function to remove.
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

export default GenericStore;
