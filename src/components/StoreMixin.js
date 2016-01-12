'use strict';

/**
 * Creating a store mixin.
 * @return {object} mixin.
 */
function StoreMixin() {
  var Mixin = {
    getInitialState: function() {
      return this._getStateFromStores();
    },

    componentDidMount: function() {
      var i;
      for (i = 0; i < this.stores.length; i++) {
        this.stores[i].addChangeListener(this._onChange);
      }
    },

    componentWillUnmount: function() {
      for (var i = 0; i < this.stores.length; i++) {
        this.stores[i].removeChangeListener(this._onChange);
      }
    },

    _onChange: function() {
      this.setState(this._getStateFromStores());
    }
  };
  return Mixin;
}

module.exports = StoreMixin;
