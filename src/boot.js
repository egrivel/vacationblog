'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Router = require('react-router').Router;
const hashHistory = require('react-router').hashHistory;

const App = require('./components/App.jsx');
const Welcome = require('./components/Welcome.jsx');
const TripDescription = require('./components/TripDescription.jsx');
const TripEdit = require('./components/TripEdit.jsx');
const TripAdmin = require('./components/TripAdmin.jsx');
const UserEdit = require('./components/UserEdit.jsx');
const UserAdmin = require('./components/UserAdmin.jsx');
const JournalWrapper = require('./components/JournalWrapper.jsx');
const JournalEdit = require('./components/JournalEdit.jsx');
const Search = require('./components/Search.jsx');
const Preferences = require('./components/Preferences.jsx');
const Sync = require('./components/Sync.jsx');
const Admin = require('./components/Admin.jsx');
const About = require('./components/About.jsx');

const TripAction = require('./actions/TripAction');
const UserAction = require('./actions/UserAction');

const routes = {
  path: '/',
  component: App,
  childRoutes: [
    {path: '/', component: Welcome},
    {path: '/trip', component: TripDescription},
    {path: '/trip/:tripId', component: TripDescription},
    {path: '/journal/:tripId', component: JournalWrapper},
    {path: '/journal/:tripId/:journalId', component: JournalWrapper},
    {path: '/journaledit/:tripId', component: JournalEdit},
    {path: '/journaledit/:tripId/:journalId', component: JournalEdit},
    {path: '/search', component: Search},
    {path: '/prefs', component: Preferences},
    {path: '/admin', component: Admin},
    {path: '/admin/trip', component: TripAdmin},
    {path: '/admin/trip/:tripId', component: TripEdit},
    {path: '/admin/user', component: UserAdmin},
    {path: '/admin/user/:userId', component: UserEdit},
    {path: '/admin/sync', component: Sync},
    {path: '/about', component: About}
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
  document.getElementById('react-root')
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

