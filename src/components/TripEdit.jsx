'use strict';

var _ = require('lodash');
var React = require('react');
var moment = require('moment');

var storeMixin = require('./StoreMixin');
var TripStore = require('../stores/TripStore');

var TripAction = require('../actions/TripAction');

var TripEdit = React.createClass({
  displayName: 'Trip Edit',

  mixins: [storeMixin()],

  stores: [TripStore],

  propTypes: {
    params: React.PropTypes.object
  },

  componentWillMount: function() {
    const tripId = this.props.params.tripId;
    if (tripId && (tripId !== 'new')) {
      TripAction.loadEditTrip(tripId);
      TripAction.loadTripUser(tripId);
    }
  },

  _getStateFromStores: function() {
    let tripData = TripStore.getTripData('_edit');
    if (!tripData) {
      tripData = {};
    }
    return {tripData: tripData};
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
  },

  render: function() {
    let data;
    if (this.state.tripData) {
      let id = this.props.params.tripId;
      if (this.props.params.tripId === '_new') {
        id = (
          <input type="text"
            value={this.state.tripData.editId}
            onChange={this._updateId}/>
        );
      }
      let startDate = '';
      let endDate = '';
      if (this.state.tripData.startDate) {
        startDate = this.state.tripData.startDate;
      }
      if (this.state.tripData.endDate) {
        endDate = this.state.tripData.endDate;
      }
      const name = this.state.tripData.name;
      let description = this.state.tripData.description;
      if (description) {
        description = String(description).replace(/&lf;/g, '\n\n');
      }
      const bannerImg = this.state.tripData.bannerImg;
      let bannerPreview;
      if (bannerImg) {
        bannerPreview = (
          <img className="preview" src={'media/' + bannerImg}/>
        );
      }
      data = (
        <div>
          <div className="formLabel">ID</div>
          <div className="formValue">{id}</div>
          <div className="formLabel">Name</div>
          <div className="formValue">
            <input type="text"
              value={name}
              onChange={this._updateName}/>
          </div>
          <div className="formLabel">Description</div>
          <div className="formValue">
            <textarea rows={10} cols={60}
              value={description}
              onChange={this._updateDescription}
              onBlur={this._saveDescription}>
            </textarea>
          </div>
          <div className="formLabel">Banner image</div>
          <div className="formValue">
            <input type="text"
              value={bannerImg}
              onChange={this._updateBannerImg}/>
            {' '} Preview:
            {bannerPreview}
          </div>
          <div className="formLabel">Start date</div>
          <div className="formValue">
            <input type="text"
              value={startDate}
              onChange={this._updateStartDate}/>
          </div>
          <div className="formLabel">End date</div>
          <div className="formValue">
            <input type="text"
              value={endDate}
              onChange={this._updateEndDate}/>
          </div>
          <input type="submit" value="Save" onClick={this._saveData}/>
        </div>
      );
    }
    return (
      <div>
        <p>Trip editing for trip {this.props.params.tripId} is
          not yet implemented.</p>
        {data}
      </div>
    );
  }
});

module.exports = TripEdit;
