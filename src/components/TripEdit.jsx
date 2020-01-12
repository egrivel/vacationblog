'use strict';

import _ from 'lodash';
import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

import storeMixin from './StoreMixin';
import TripStore from '../stores/TripStore';
import UserStore from '../stores/UserStore';

import TripAction from '../actions/TripAction';
import UserAction from '../actions/UserAction';

import ButtonBar from './standard/ButtonBar';
import Display from './standard/Display';

import TripEditContrib from './TripEditContrib';
import TripSelectContrib from './TripSelectContrib';

const TripEdit = createReactClass({
  displayName: 'Trip Edit',

  mixins: [storeMixin()],

  stores: [TripStore, UserStore],

  propTypes: {
    params: PropTypes.object
  },

  contextTypes: {
    router: PropTypes.object
  },

  componentDidMount: function() {
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
    const description = String(event.target.value);
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

  _updateDeleted: function(event) {
    const tripData = _.clone(this.state.tripData);

    if (event.target.checked) {
      tripData.deleted = 'Y';
    } else {
      tripData.deleted = 'N';
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

  _save: function() {
    const tripData = _.clone(this.state.tripData);
    tripData.tripId = this.props.params.tripId;
    if (tripData.tripEditId) {
      tripData.tripId = tripData.tripEditId;
    }
    TripAction.saveTrip(tripData);
    this.context.router.push('/admin/trip');
  },

  _close: function() {
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
    let name = this.state.tripData.name;
    if (!name) {
      name = '';
    }

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
    } else {
      description = '';
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

  _renderBannerImg: function() {
    let bannerImg = this.state.tripData.bannerImg;
    let bannerPreview;
    if (bannerImg) {
      bannerPreview = (
        <img className="preview" src={'media/' + bannerImg}/>
      );
    } else {
      bannerImg = '';
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
        <input
          type="checkbox"
          id="active-input"
          value="Y"
          onChange={this._updateActive}
          checked={checked}
        />
        <label className="checkbox" htmlFor="active-input">
          {' '}
          Active
        </label>
        {' '} (posts are allowed for this trip)
      </div>
    );

    return result;
  },

  _renderDeleted: function() {
    let checked = false;
    if (this.state.tripData.deleted === 'Y') {
      checked = true;
    }
    const result = [];
    result.push(
      <div
        key="deleted-label"
        className="formLabel"
      ></div>
    );
    result.push(
      <div
        key="deleted-value"
        className="formValue"
      >
        <input
          type="checkbox"
          id="deleted-input"
          value="Y"
          onChange={this._updateDeleted}
          checked={checked}
        />
        <label className="checkbox" htmlFor="deleted-input">
          {' '}
          Deleted
        </label>
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
              href={'#/admin/trip/' + this.props.params.tripId +
                '/' + item.userId}
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

      const buttonList = [];
      buttonList.push({
        label: 'Save',
        onClick: this._save
      });
      buttonList.push({
        label: 'Close',
        onClick: this._close
      });

      data = (
        <div>
          <Display
            fieldId="id"
            label="ID"
            value={id}
          />
          {this._renderNameInput()}
          {this._renderDescriptionInput()}
          {this._renderBannerImg()}
          {this._renderStartDate()}
          {this._renderEndDate()}
          {this._renderActive()}
          {this._renderDeleted()}
          {this._renderContributorList()}
          <ButtonBar buttons={buttonList}/>
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
    if (UserStore.getAccess() !== 'admin') {
      return <div>No access</div>;
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

export default TripEdit;
