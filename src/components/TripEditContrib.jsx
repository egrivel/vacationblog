'use strict';

const _ = require('lodash');
const React = require('react');
const createReactClass = require('create-react-class');
const PropTypes = require('prop-types');

const TripEditContrib = createReactClass({
  displayName: 'Trip Edit Contrib',

  propTypes: {
    show: PropTypes.bool.isRequired,
    data: PropTypes.shape({
      contribId: PropTypes.string,
      name: PropTypes.string,
      profileImg: PropTypes.string,
      message: PropTypes.string
    }),
    onChange: PropTypes.func,
    onClose: PropTypes.func,
    onSave: PropTypes.func
  },

  _updateMessage: function(event) {
    const data = _.cloneDeep(this.props.data);
    data.message = event.target.value;
    this.props.onChange(data);
  },

  _updateProfileImg: function(event) {
    const data = _.cloneDeep(this.props.data);
    data.profileImg = event.target.value;
    this.props.onChange(data);
  },

  render: function() {
    if (!this.props.show) {
      return null;
    }
    return (
      <div className="modal">
        <div className="modal-content">
          <h2>Edit Contributor</h2>
          <div className="formLabel">ID</div>
          <div className="formValue">{this.props.data.contribId}</div>
          <div className="formLabel">Name</div>
          <div className="formValue">{this.props.data.name}</div>
          <div className="formLabel">Profile Image</div>
          <div className="formValue">
            <input type="text"
              name="profileImg"
              value={this.props.data.profileImg}
              onChange={this._updateProfileImg}
            />
            <div className="profileImgPreview">
              <img src={'media/' + this.props.data.profileImg}/>
            </div>

          </div>
          <div className="formLabel">Message</div>
          <div className="formValue">
            <textarea rows={10} cols={60}
              value={this.props.data.message}
              onChange={this._updateMessage}>
            </textarea>
          </div>
          <div className="formLabel"></div>
          <div className="formValue">
            <input
              type="submit"
              name="close"
              value="Close"
              onClick={this.props.onClose}
            />
            <input
              type="submit"
              name="save"
              value="Save"
              onClick={this.props.onSave}
            />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = TripEditContrib;
