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
const LoginWrapper = require('./components/LoginWrapper.jsx');
const Notification = require('./components/Notification.jsx');

const TripAction = require('./actions/TripAction');
const UserAction = require('./actions/UserAction');

const utils = require('./utils');

const routes = {
  path: '/',
  component: App,
  childRoutes: [
    {path: '/', component: Welcome},
    {path: '/login', component: LoginWrapper},
    {path: '/login/:target', component: LoginWrapper},
    {path: '/trip/:tripId', component: TripDescription},
    {path: '/journal/:tripId/:journalId', component: JournalWrapper},
    {path: '/journal/:tripId/:journalId/:map', component: JournalWrapper},
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
    {path: '/admin/notification', component: Notification},
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

// Check if logged in
const loginCookie = utils.getCookie(utils.cookies.AUTH);
if (loginCookie) {
  UserAction.loadLoggedInUser();
}

// Return where we left off (by default; maybe offer option to disable this
// later)
const lastEntryCookie = utils.getCookie(utils.cookies.ENTRY);
if (lastEntryCookie) {
  // eslint-disable-next-line no-undef
  let location = String(window.location);
  let originalDestination = '';
  for (let i = 0; i < location.length; i++) {
    if (location.charAt(i) === '#') {
      originalDestination = location.substring(i + 1);
      location = location.substring(0, i) + '#/' + lastEntryCookie;
      break;
    }
  }

  // "location" now contains the desired location, but only go there if the
  // initial location was at the root of the application. If the application
  // was started with a different URL than the root, changes are the user
  // followed a specific link so we don't want to interfere with that.
  if ((originalDestination === '') || (originalDestination === '/')) {
    // eslint-disable-next-line no-undef
    window.location = location;
  }
}
