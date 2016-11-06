'use strict';

var React = require('react');

var Header = require('./Header.jsx');
var Welcome = require('./Welcome.jsx');
var Footer = require('./Footer.jsx');

/**
 * The application object renders the framework of the application, which
 * includes the header and footer. It allows for the page-specific content
 * to be inserted by the React Router, except when there is no router-inserted
 * content, it will default to a trip description page. This is the initial
 * view when someone enters the site.
 */
var App = React.createClass({
  displayName: 'App',

  propTypes: {
    children: React.PropTypes.object
  },

  render: function() {
    var children = this.props.children;
    if (!children || children.length === 0) {
      children = <Welcome/>;
    }
    return (
      <div className="body">
        <Header/>
        <div className="content">
          {children}
        </div>
        <Footer/>
      </div>
    );
  }
});

module.exports = App;