'use strict';

var React = require('react');

var About = React.createClass({
  displayName: 'About',

  render: function() {
    return (
      <div>
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
