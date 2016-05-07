'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var hashHistory = require('react-router').hashHistory;

var Header = require('./components/Header');
var Footer = require('./components/Footer');
var TripDescription = require('./components/TripDescription');
var JournalWrapper = require('./components/JournalWrapper.jsx');
var TripAction = require('./actions/TripAction');

var Search = require('./components/Search');
var Login = require('./components/Login.jsx');
var About = require('./components/About');

/**
 * The application object renders the framework of the application, which
 * includes the header and footer. It allows for the page-specific content
 * to be inserted by the React Router, except when there is no router-inserted
 * content, it will default to a trip description page. This is the initial
 * view when someone enters the site.
 */
var App = React.createClass({
  propTypes: {
    children: React.PropTypes.object
  },

  render: function() {
    var children = this.props.children;
    if (!children || children.length === 0) {
      children = React.createElement(TripDescription, null);
    }
    return React.DOM.div(
      null,
      React.createElement(Header, null),
      children,
      React.createElement(Footer, null)
    );
  }
});

const routes = {
  path: '/',
  component: App,
  childRoutes: [
    {path: '/', component: TripDescription},
    {path: '/trip', component: TripDescription},
    {path: '/trip/:tripId', component: TripDescription},
    {path: '/journal/:tripId', component: JournalWrapper},
    {path: '/journal/:tripId/:journalId', component: JournalWrapper},
    {path: '/search', component: Search},
    {path: '/login', component: Login},
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
  document.getElementById('body')
);

// Load the default trip on startup (until we have a better default)
TripAction.loadTripList();
setInterval(TripAction.loadTripList, 30000);
