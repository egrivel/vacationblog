'use strict';

const React = require('react');

const MenuAction = require('../actions/MenuAction');
const MenuStore = require('../stores/MenuStore');

const About = React.createClass({
  displayName: 'About',

  componentDidMount: function() {
    MenuAction.selectItem(MenuStore.menuIds.ABOUT);
  },

  componentWillUnmount: function() {
    MenuAction.unselectItem(MenuStore.menuIds.ABOUT);
  },

  render: function() {
    return (
      <div>
        <h3>Information For Testers</h3>
        <p>This website is currently being tested. It has not yet been
          officially released. Thank you to those who have participated in
          testing this website.</p>
        <p>Please be aware that when the testing is concluded and the website
          is officially released, all test data will be removed. In addition,
          data can be changed or removed at any time during the testing.</p>

        <h4>What Works</h4>
        <p>The following functionalities should be working at this time:</p>
        <ul>
          <li>Posts and comments from previous vacations are displayed.</li>
          <li>Users from previous vacations have been ported over and can
            log in.</li>
          <li>New users can register (but their information will be removed
            on any data reset).</li>
          <li>Users can retrieve their user ID and password if those were
            lost.</li>
          <li>The <em>Oklahoma</em> trip has been activated, allowing for
            new posts, comments and "likes".</li>
          <li>Improved support for phones in portrait mode (narrow screens)
            with reduced margins, a custom navigation menu and handling of
            deeply nested comments.</li>
          <li>Pressing <em>Enter</em> should now work to submit various
            forms (please report where it does not work).</li>
          <li>Feedback mechanism to "enjoy" a post or comment, similar to
            facebook's like and google's plus mechanism.</li>
          <li>Maps were added to the overall trip information pages, where
            applicable.</li>
          <li>It is now possible for users to update their name, change their
            password and their notification preference.</li>
          <li>Return to where you left off. If you use the original link to the
            site, you are automatically returned to the last post you were
            reading before. This should make it easier to follow us when we're
            on vacation...</li>
          <li>On login, presented with an option to stay logged in. This should
            only be used on "safe" devices.</li>
          <li>Timestamps are now displayed in the user's local time, and in
            their time preference (12/24 hour clock) -- hopefully.</li>
          <li>Daily maps are working again! those from the 2014 and 2015 trips
            have been imported and new onces can be created.</li>
        </ul>

        <h4>What Is Not Working</h4>
        <p>The following issues are known:</p>
        <ul>
          <li>No known issues. Known issues will be added here when
            they are discovered.</li>
        </ul>

        <h4>Features To Add</h4>
        <ul>
          <li>Connection with social network sites (facebook, google, ...)</li>
          <li>Deleting comments (replacing by [deleted comment] placeholder
            which is not displayed if there are no child comments)</li>
        </ul>

        <h3>About This Website</h3>
        <p>Welcome to the <em>Eric Grivel and Nicoline Smits vacation
          blogging website</em>. This is where we share our vacation
          experiences.</p>

        <p>We started a Vacation Blog with out 2007 family
          roadtrip <em>Around the U.S. in Eight Weeks</em>. For that trip we
          had rented a minivan and criss-crossed the lower 48 states for Eight
          weeks. While on the road we regularly wrote about our
          “adventures” on a website we created for this purpose.</p>

        <p>When Eric and Nicoline started planning their <em>I-70</em> trip
          in 2012, we found that we were discovering a lot of interesting
          information about America, the National Road, and the roads
          westward, so we wanted a place to record and share all of that
          information. We copied the code for the 2007 website to a new
          location and, with a few modifications, used that to blog about
          our 2012 trip.</p>

        <p>In following years we continued to create new sites by copying
         the previous year’s site, which worked well for a while, but
         then started to become tedious. So after the
         2015 <em>Oklahoma</em> trip, we decided to re-do the whole thing into
         a modernized, integrated vacation blog.</p>
      </div>
    );
  }
});

module.exports = About;
