'use strict';

const _ = require('lodash');
const React = require('react');

const TripSelectContrib = React.createClass({
  displayName: 'Trip Select Contrib',

  propTypes: {
    show: React.PropTypes.bool.isRequired,
    userList: React.PropTypes.array,
    existingUserList: React.PropTypes.array,
    onClose: React.PropTypes.func,
    onSave: React.PropTypes.func
  },

  getInitialState: function() {
    if (this.props.userList && this.props.userList[0]) {
      return {selectedValue: this.props.userList[0].userId};
    }
    return {};
  },

  _onSelect: function(event) {
    this.setState({selectedValue: event.target.value});
  },

  _onSave: function() {
    const userId = this.state.selectedValue;
    const obj = _.find(this.props.userList, {userId: userId});
    const name = _.get(obj, 'name', '');
    this.props.onSave(userId, name);
  },

  render: function() {
    if (!this.props.show) {
      return null;
    }
    const list = [];
    if (this.props.userList) {
      for (let i = 0; i < this.props.userList.length; i++) {
        const item = this.props.userList[i];
        if (item.userId && item.name) {
          if (!_.some(this.props.existingUserList, {userId: item.userId})) {
            list.push(
              <option key={item.userId} value={item.userId}>
                {item.name} ({item.userId})
              </option>
            );
          }
        }
      }
    }
    return (
      <div className="modal">
        <div className="modal-content">
          <h2>Select Contributor</h2>

          <p>
            Contributors to a trip are people who can write blog entries for
            the trip. Select a contributor from the list of all the users
            below. You can add one contributor at a time.
          </p>
          <div className="formLabel">User</div>
          <div className="formValue">
            <select
              name="users"
              value={this.state.selectedValue}
              onChange={this._onSelect}
            >
              {list}
            </select>
          </div>
          <div className="formLabel"></div>
          <div className="formValue">
            <input
              type="submit"
              name="save"
              value="Save"
              onClick={this._onSave}
            />
            {' '}
            <input
              type="submit"
              name="cancel"
              value="Cancel"
              onClick={this.props.onClose}
            />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = TripSelectContrib;
