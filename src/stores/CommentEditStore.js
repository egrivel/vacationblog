'use strict';

var assign = require('object-assign');

var GenericStore = require('./GenericStore');
var AppDispatcher = require('../AppDispatcher');
var CommentEditActionTypes = require('../actions/CommentEditAction').Types;

var CommentEditStore;

var _isEditing = [];
var _value = [];

CommentEditStore = assign({}, GenericStore, {

  isEditing: function(tripId, referenceId) {
    var index = tripId + ':' + referenceId;
    return _isEditing[index];
  },

  getValue: function(tripId, referenceId) {
    var index = tripId + ':' + referenceId;
    if (_isEditing[index]) {
      return _value[index];
    }
    return '';
  },

  _storeCallback: function(action) {
    var index;
    switch (action.type) {
      case CommentEditActionTypes.COMMENT_SET_EDITING:
        index = action.tripId + ':' + action.referenceId;
        _isEditing[index] = action.isEditing;
        CommentEditStore.emitChange();
        break;
      case CommentEditActionTypes.COMMENT_SET_VALUE:
        index = action.tripId + ':' + action.referenceId;
        _value[index] = action.value;
        CommentEditStore.emitChange();
        break;
      default:
        // do nothing
        break;
    }
  }
});

CommentEditStore.dispatchToken =
  AppDispatcher.register(CommentEditStore._storeCallback);

module.exports = CommentEditStore;
