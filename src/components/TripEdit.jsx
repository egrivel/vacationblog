'use strict';

var _ = require('lodash');
var React = require('react');

var storeMixin = require('./StoreMixin');
var TripStore = require('../stores/TripStore');
var UserStore = require('../stores/UserStore');

var TripAction = require('../actions/TripAction');
var UserAction = require('../actions/UserAction');

var TripEditContrib = require('./TripEditContrib.jsx');
var TripSelectContrib = require('./TripSelectContrib.jsx');

var TripEdit = React.createClass({
  displayName: 'Trip Edit',

  mixins: [storeMixin()],

  stores: [TripStore, UserStore],

  propTypes: {
    params: React.PropTypes.object
  },

  contextTypes: {
    router: React.PropTypes.object
  },

  componentWillMount: function() {
    const tripId = this.props.params.tripId;
    if (tripId && (tripId !== '_new')) {
      TripAction.loadEditTrip(tripId);
      TripAction.loadTripUsers(tripId);
    }
    UserAction.loadAllUsers();
  },

  getInitialState: function() {
    return {
      showEditLightbox: false,
      showAddLightbox: false,
      lightboxData: {}
    };
  },

  _getStateFromStores: function() {
    let tripData = TripStore.getTripData('_edit');
    if (!tripData) {
      tripData = {};
    }
    const tripUsers = TripStore.getTripUsers(this.props.params.tripId);
    const userList = UserStore.getUserList();
    return {
      tripData: tripData,
      tripUsers: tripUsers,
      userList: userList
    };
  },

  _updateId: function(event) {
    const tripData = _.clone(this.state.tripData);
    tripData.tripEditId = event.target.value;
    TripAction.updateEditTrip(tripData);
  },

  _updateName: function(event) {
    const tripData = _.clone(this.state.tripData);
    tripData.name = event.target.value;
    TripAction.updateEditTrip(tripData);
  },

  // While editing, leave the linefeeds as they are in the description
  _updateDescription: function(event) {
    const tripData = _.clone(this.state.tripData);
    let description = String(event.target.value);
    tripData.description = description;
    TripAction.updateEditTrip(tripData);
  },

  _updateActive: function(event) {
    const tripData = _.clone(this.state.tripData);

    if (event.target.checked) {
      tripData.active = 'Y';
    } else {
      tripData.active = 'N';
    }

    TripAction.updateEditTrip(tripData);
  },

  // When losing focus, linefeeds are to be converted
  _saveDescription: function(event) {
    const tripData = _.clone(this.state.tripData);
    let description = String(event.target.value);
    description = description.replace(/\n\n/g, '&lf;');
    description = description.replace(/\n/g, ' ');
    tripData.description = description;
    TripAction.updateEditTrip(tripData);
  },

  _updateBannerImg: function(event) {
    const tripData = _.clone(this.state.tripData);
    tripData.bannerImg = event.target.value;
    TripAction.updateEditTrip(tripData);
  },

  _updateStartDate: function(event) {
    const tripData = _.clone(this.state.tripData);
    tripData.startDate = event.target.value;
    TripAction.updateEditTrip(tripData);
  },

  _updateEndDate: function(event) {
    const tripData = _.clone(this.state.tripData);
    tripData.endDate = event.target.value;
    TripAction.updateEditTrip(tripData);
  },

  _saveData: function() {
    const tripData = _.clone(this.state.tripData);
    tripData.tripId = this.props.params.tripId;
    if (tripData.tripEditId) {
      tripData.tripId = tripData.tripEditId;
    }
    TripAction.saveTrip(tripData);
    this.context.router.push('/admin/trip');
  },

  _editContributor: function(id) {
    const data = {};

    data.contribId = id;
    if (this.state.tripUsers) {
      for (let i = 0; i < this.state.tripUsers.length; i++) {
        const item = this.state.tripUsers[i];
        if (item.userId === id) {
          data.name = item.name;
          data.profileImg = item.profileImg;
          data.message = item.message;
          break;
        }
      }
    }

    this.setState({
      showEditLightbox: true,
      lightboxData: data
    });
  },

  _addContributor: function() {
    this.setState({showAddLightbox: true});
  },

  _changeEditLightbox: function(data) {
    this.setState({lightboxData: data});
  },

  _saveEditLightbox: function() {
    const data = {
      tripId: this.props.params.tripId,
      userId: this.state.lightboxData.contribId,
      profileImg: this.state.lightboxData.profileImg,
      message: this.state.lightboxData.message
    };
    TripAction.saveTripUser(data);
    this.setState({showEditLightbox: false});
  },

  _saveAddLightbox: function(userId) {
    const data = {
      tripId: this.props.params.tripId,
      userId: userId,
      profileImg: '',
      message: ''
    };
    TripAction.saveTripUser(data);
    this.setState({showAddLightbox: false});
  },

  _deleteContributor: function(userId) {
    const obj = _.find(this.state.userList, {userId: userId});
    const message = _.get(obj, 'message', '');
    const profileImg = _.get(obj, 'profileImg', '');
    const data = {
      tripId: this.props.params.tripId,
      userId: userId,
      profileImg: profileImg,
      message: message
    };
    TripAction.deleteTripUser(data);
  },

  _closeLightbox: function() {
    this.setState({
      showEditLightbox: false,
      showAddLightbox: false
    });
  },

  _saveLightbox: function() {
    this.setState({
      showEditLightbox: false,
      showAddLightbox: false
    });
  },

  _renderNameInput: function() {
    const name = this.state.tripData.name;

    const result = [];
    result.push(
      <div
        key="name-label"
        className="formLabel"
      >
        Name
      </div>
    );
    result.push(
      <div
        key="name-value"
        className="formValue"
      >
        <input type="text"
          value={name}
          onChange={this._updateName}/>
      </div>
    );

    return result;
  },

  _renderDescriptionInput: function() {
    let description = this.state.tripData.description;
    if (description) {
      description = String(description).replace(/&lf;/g, '\n\n');
    }

    const result = [];
    result.push(
      <div
        key="descr-label"
        className="formLabel"
      >
        Description
      </div>
    );
    result.push(
      <div
        key="descr-value"
        className="formValue"
      >
        <textarea rows={10} cols={60}
          value={description}
          onChange={this._updateDescription}
          onBlur={this._saveDescription}>
        </textarea>
      </div>
    );

    return result;
  },

  _renderBannerImg() {
    const bannerImg = this.state.tripData.bannerImg;
    let bannerPreview;
    if (bannerImg) {
      bannerPreview = (
        <img className="preview" src={'media/' + bannerImg}/>
      );
    }

    const result = [];
    result.push(
      <div
        key="banner-label"
        className="formLabel"
      >
        Banner image
      </div>
    );
    result.push(
      <div
        key="banner-value"
        className="formValue"
      >
        <input type="text"
          value={bannerImg}
          onChange={this._updateBannerImg}/>
        {' '} Preview:
        {bannerPreview}
      </div>
    );

    return result;
  },

  _renderStartDate: function() {
    let startDate = '';
    if (this.state.tripData.startDate) {
      startDate = this.state.tripData.startDate;
    }

    const result = [];
    result.push(
      <div
        key="start-label"
        className="formLabel"
      >
        Start date
      </div>
    );
    result.push(
      <div
        key="start-value"
        className="formValue"
      >
        <input type="text"
          value={startDate}
          onChange={this._updateStartDate}/>
      </div>
    );

    return result;
  },

  _renderEndDate: function() {
    let endDate = '';
    if (this.state.tripData.endDate) {
      endDate = this.state.tripData.endDate;
    }

    const result = [];
    result.push(
      <div
        key="end-label"
        className="formLabel"
      >
        End date
      </div>
    );
    result.push(
      <div
        key="end-value"
        className="formValue"
      >
        <input type="text"
          value={endDate}
          onChange={this._updateEndDate}/>
      </div>
    );

    return result;
  },

  _renderActive: function() {
    let checked = false;
    if (this.state.tripData.active === 'Y') {
      checked = true;
    }
    const result = [];
    result.push(
      <div
        key="active-label"
        className="formLabel"
      ></div>
    );
    result.push(
      <div
        key="active-value"
        className="formValue"
      >
        <label htmlFor="active-input">
          <input
            type="checkbox"
            id="active-input"
            value="Y"
            onChange={this._updateActive}
            checked={checked}
          />
          {' '}
          Active
        </label>
        {' '} (posts are allowed for this trip)
      </div>
    );

    return result;
  },

  _renderContributorList: function() {
    const contributorList = [];
    if (this.state.tripUsers) {
      for (let i = 0; i < this.state.tripUsers.length; i++) {
        const item = this.state.tripUsers[i];
        const obj = {
          _editContributor: this._editContributor,
          _deleteContributor: this._deleteContributor,
          contribId: item.userId
        };
        const editFunc = function(event) {
          event.preventDefault();
          this._editContributor(this.contribId);
        }.bind(obj);
        const deleteFunc = function(event) {
          event.preventDefault();
          this._deleteContributor(this.contribId);
        }.bind(obj);
        contributorList.push(
          <li key={'lnk-' + item.userId}>
            <a
              href={'#/admin/trip/' + this.props.params.tripId + '/' + item.userId}
              onClick={editFunc}
            >
              {item.name}
            </a>
            {' '}
            <input
              type="submit"
              name={'delete-' + item.userId}
              value="Delete"
              onClick={deleteFunc}
            />
          </li>
        );
      }
    }

    const result = [];
    result.push(
      <div
        key="list-label"
        className="formLabel"
      >
        Contributors
      </div>
    );
    result.push(
      <div
        key="list-value"
        className="formValue"
      >
        <ul>
          {contributorList}
        </ul>
        <div>
          <button onClick={this._addContributor}>
            Add contributor
          </button>
        </div>
      </div>
    );

    return result;
  },

  render: function() {
    let data = null;
    let tripLabel = 'Please be careful creating a new trip.';
    if (this.props.params.tripId &&
        (this.props.params.tripId !== '_new')) {
      tripLabel = 'Please be careful editing trip ' +
        this.props.params.tripId +
        '.';
    }
    if (this.state.tripData) {
      let id = this.props.params.tripId;
      if (this.props.params.tripId === '_new') {
        id = (
          <input type="text"
            value={this.state.tripData.editId}
            onChange={this._updateId}/>
        );
      }
      data = (
        <div>
          <div className="formLabel">ID</div>
          <div className="formValue">{id}</div>
          {this._renderNameInput()}
          {this._renderDescriptionInput()}
          {this._renderBannerImg()}
          {this._renderStartDate()}
          {this._renderEndDate()}
          {this._renderActive()}
          {this._renderContributorList()}
          <input type="submit" value="Save" onClick={this._saveData}/>
          <TripEditContrib
            data={this.state.lightboxData}
            show={this.state.showEditLightbox}
            onClose={this._closeLightbox}
            onSave={this._saveEditLightbox}
            onChange={this._changeEditLightbox}
          />
          <TripSelectContrib
            userList={this.state.userList}
            existingUserList={this.state.tripUsers}
            show={this.state.showAddLightbox}
            onClose={this._closeLightbox}
            onSave={this._saveAddLightbox}
          />
        </div>
      );
    }
    return (
      <div>
        <p>
          {tripLabel} Once you save your changes, they cannot be undone.
        </p>
        {data}
      </div>
    );
  }
});

module.exports = TripEdit;
