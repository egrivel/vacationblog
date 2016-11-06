'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var hashHistory = require('react-router').hashHistory;

var App = require('./components/App.jsx');
var Welcome = require('./components/Welcome.jsx');
var TripDescription = require('./components/TripDescription.jsx');
var JournalWrapper = require('./components/JournalWrapper.jsx');
var Search = require('./components/Search.jsx');
var Admin = require('./components/Admin.jsx');
var About = require('./components/About.jsx');
var LoginWrapper = require('./components/LoginWrapper.jsx');

var TripAction = require('./actions/TripAction');
var UserAction = require('./actions/UserAction');

const routes = {
  path: '/',
  component: App,
  childRoutes: [
    {path: '/', component: Welcome},
    {path: '/trip', component: TripDescription},
    {path: '/trip/:tripId', component: TripDescription},
    {path: '/journal/:tripId', component: JournalWrapper},
    {path: '/journal/:tripId/:journalId', component: JournalWrapper},
    {path: '/search', component: Search},
    {path: '/login', component: LoginWrapper},
    {path: '/about', component: About},
    {path: '/admin', component: Admin}
  ]
};

/* global document */
ReactDOM.render(
  React.createElement(Router,
    {
      routes: routes,
      history: hashHistory
    }
  ),
  document.getElementById('body')
);

// Load the default trip on startup (until we have a better default)
TripAction.loadTripList();
// setInterval(TripAction.loadTripList, 30000);

// Check if logged in
var cookies = document.cookie.split(';');
for (var i = 0; i < cookies.length; i++) {
  var nameValue = cookies[i].split('=');
  if (nameValue[0] === 'blogAuthId') {
    UserAction.loadLoggedInUser();
    break;
  }
}

