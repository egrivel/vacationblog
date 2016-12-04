'use strict';

var React = require('react');

var About = React.createClass({
  displayName: 'About',

  render: function() {
    return (
      <div>
        <h3>Information For Testers</h3>
        <p>This website is currently being tested. It has not yet been
          officially release. Thank you to those who have participated in
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
        </ul>

        <h4>What Is Not Working</h4>
        <p>The following issues are known:</p>
        <ul>
          <li>Search functionality is not available.</li>
          <li>It is not yet possible for users to change their settings.</li>
          <li>Pressing <em>Enter</em> on inputs doesn't work consistently.</li>
          <li>The overall trip information page (describing each trip) is
            missing information and details.</li>
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
