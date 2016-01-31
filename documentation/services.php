<?php
include("common.php");
print pageStart("Services");
?>

<h2>Basic Services</h2>

<p>Basic services align relatively straight-forward with the various
  database structures. For each database structure, there is a
  &ldquo;get&rdquo;, &ldquo;put&rdquo;, &ldquo;find&rdquo; and
  &ldquo;synch&rdquo; service.</p>

<ul>
  <li><strong>get&lt;Object&gt;.php</strong>: pass in an ID value and
    return a JSON object with all the content for that object.
    Example: <code>getJournal.php?journalId=12345</code>. The
    &ldquo;hash&rdquo; value is <em>not</em> returned through this
    interface, use the synch&lt;Object&gt;.php for that.<br/>
    A 401 Invalid Parameter error is returned if the ID value is
    absent or malformed.<br/>
    A 403 Not Authorized error is returned if the user is not
    authorized to get any object, or to get the particular object.
    A 404 Not Found error is returned if the requested object is
    not found.</li>
  <li><strong>put&lt;Object&gt;.php</strong>: HTTP POST with a JSON
    object that has all the (new) content for that object. The JSON data
    gives the ID for the object. Example: <code>putJournal.php</code>.
    The &ldquo;created&rdquo;, &ldquo;updated&rdquo; and &ldquo;hash&rdquo;
    values cannot be set through this interface, use the 
    synch&lt;Object&gt;.php for that.<br/>
    A 401 Invalid Parameter error is returned if the JSON data is
    absent or malformed, or if key parts of the JSON data are missing.<br/>
    A 403 Not Authorized error is returned if the user is not
    authorized to create/update any object, or to create/update the
    particular object.</li>
  <li><strong>find&lt;Object&gt;.php</strong>: do a search and return
    an array of JSON objects that match the search. The search parameters
    are passed as GET parameters. Example:
    <code>findComment.php?refId=12345</code> returns all comments on the
    object with ID <code>12345</code>.<br/>
    A 401 Invalid Parameter error is returned if the search parameters are
    absent or malformed.<br/>
    A 403 Not Authorized error is returned if the user is not authorized
    to search, or not authorized to do the particular type of search.<br/>
    If no data matches the search criteria, an empty list is returned
    rather than a 404 error.</li>
  <li><strong>synch&lt;Object&gt;.php</strong>: support synching between
    databases. This service can only be invoked through synchronization
    authority. The synch service is invoked in one of the following
    ways:
    <ul>
      <li>A <strong>GET</strong> request with a <strong>hash=</strong>
        parameter will return a JSON object with all the attributes for the
        object matching that hash value, or a 404 Not Found if the hash
        value was not found.</li>
      <li>A <strong>PUT</strong> request with a JSON body containing all
        the attributes for the object will write the corresponding
        row in the database, provided the specified hash value does not
        yet exist.</li>
      <li>A <strong>GET</strong> request without any parameters will
        return a JSON array of hash values that are in the system.</li>
    </ul>
    The synch service functionality may be expanded in the future to make
    more efficient synchronization possible.<br/>
    A 401 Invalid Parameter error is returned in any part of the request
    is malformed or missing.<br/>
    A 403 Not Authorized error is returned if the user is not authorized
    to perform synchronization.<br/>
    A 404 Not Found error is returned if a specific object is requested
    and that object is not found.</li>
</ul>

<p>All service calls return a JSON object with the response. The JSON
  response object always contains a <strong>resultCode</strong> and a
  <strong>resultMessage</strong> field. The resultCode field has a
  three-digit code, whose values are based on the HTTP response codes.
  A successful response has a result code of <strong>200</strong>. Possible
  error codes are defined for each of the service call. The
  resultMessage field has a human-readable string corresponding with the
  result code. Additional fields will be present in the JSON response
  as appropriate.</p>

<h2>Special Functions</h2>

<h3>First, last, previous and next</h3>

<p>The various <strong>get&lt;Object&gt;.php</strong> services provide
  the ability to iterate through the objects, where appropriate.</p>

<h3>Current Trip</h3>

<p>For the <strong>getTrip.php</strong> service, passing a
  &ldquo;current=&rdquo; parameter instead of a trip ID will
  return the information about the most
  current trip. The most current trip is defined as the last
  trip to have started in the past. This means that trips that
  have not yet started (have a start date in the future) are
  not considered for this function.</p>

<?php print pageEnd(); ?>
