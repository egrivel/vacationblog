
/**
 * Creating a store mixin.
 * @return {object} mixin.
 */
function StoreMixin() {
  const Mixin = {
    getInitialState: function() {
      return this._getStateFromStores();
    },

    componentDidMount: function() {
      this.isMounted = true;
      this._totalChangeEvents = 0;
      this._totalRendersSaved = 0;

      for (let i = 0; i < this.stores.length; i++) {
        this.stores[i].addChangeListener(this._onChange);
      }
    },

    componentWillUnmount: function() {
      this.isMounted = false;
      for (let i = 0; i < this.stores.length; i++) {
        this.stores[i].removeChangeListener(this._onChange);
      }
    },

    _onEndTimer: function() {
      if (this._changeCount) {
        // there was at least one change event that happened while the timer
        // was running, so there is a need to re-render
        if (this.isMounted) {
          this.setState(this._getStateFromStores());
        }
        // we saved rendering all but the last change event
        this._totalRendersSaved += this._changeCount - 1;
      }
      delete this._changeCount;
    },

    _onChange: function() {
      const state = this._getStateFromStores();
      if (this.isMounted) {
        this.setState(state);
      }
    },

    // The timer thing causes issues in combination with typing in a text
    // area. When you type fast enough, re-renders aren't happening between
    // characters, which has the result that React moves the cursor to the end
    // of the text area. Very annoing.
    _onChangeWithTimer: function() {
      this._totalChangeEvents++;
      if (this._changeCount === undefined) {
        // not on a timer yet. Re-render, but then set a timer to capture all
        // subsequent change events that would cause a rerender as well and
        // combine them into a single re-render
        this._changeCount = 0;
        if (this.isMounted) {
          this.setState(this._getStateFromStores());
          setTimeout(this._onEndTimer, 100);
        }
      } else {
        // already on a timer to re-render the component, so hold off until
        // the timer expires
        this._changeCount++;
      }
    }
  };
  return Mixin;
}

export default StoreMixin;
