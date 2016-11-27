<?php
include("common.php");
print pageStart("Database Layer");
?>

<h2>Contents</h2>

<ul>
  <li><a href='#naming'>Naming Conventions</a></li>
  <li><a href='#common'>Common Elements</a></li>
  <li><a href='#blogAuth'>blogAuth Table</a></li>
  <li><a href='#blogComment'>blogComment Table</a></li>
  <li><a href='#blogFeedback'>blogFeedback Table</a></li>
  <li><a href='#blogJournal'>blogJournal Table</a></li>
  <li><a href='#blogMedia'>blogMedia Table</a></li>
  <li><a href='#blogSetting'>blogSetting Table</a></li>
  <li><a href='#blogTrip'>blogTrip Table</a></li>
  <li><a href='#blogTripAttribute'>blogTripAttribute Table</a></li>
  <li><a href='#blogTripUser'>blogTripUser Table</a></li>
  <li><a href='#blogUser'>blogUser Table</a></li>
  <li><a href='#updates'>Database Structural Updates</a></li>
  <li><a href='#synchronization'>Database Synchronization Process</a></li>
  <li><a href='#unittest'>Unit Tests</a></li>
</ul>

<?php print gl_top_link(); ?>

<h2 id='naming'>Naming Conventions</h2>

<p>Use camel case for all names; however, beware that depending on the
  implementation, names may or may not be case sensitive. Therefore,
  make sure that names are unique even if the implementation may convert
  all letters to upper or lower case.</p>

<p>Table names reflect the contents of a row in that table, so they are
  typically singular (&ldquo;blogUser&rdquo; etc.).</p>

<p>The database and table names are selected so that it doesn't conflict
  with the previously used databases (since on the public server, they're
  all together). Previous databases:</p>

<ul>
  <li>2007 vacation: db = "vak2007", tables (vak_comments, vak_items,
    vak_photos, vak_user)</li>
  <li>2012 vacation: db = "vak2012", tables (vak12_comments, vak12_items,
    vak12_photos, vak12_user)</li>
  <li>2013, 2014 and 2015 vacations: db = "vacations", tables
    (vacations_comments, vacations_items, vacations_photos,
    vacations_users)</li>
</ul>

<p>The new database will be called "blog" and the tables will be (in
  alphabetical order):</p>
<ul>
  <li>blogAuth</li>
  <li>blogComment</li>
  <li>blogFeedback</li>
  <li>blogJournal</li>
  <li>blogMedia</li>
  <li>blogSetting</li>
  <li>blogTrip</li>
  <li>blogTripAttribute</li>
  <li>blogTripUser</li>
  <li>blogUser</li>
</ul>

<h2 id='common'>Common Elements</h2>

<p>The following data elements are common among several tables.</p>

<ul>
  <li><strong>tripId</strong>: identifies individual trips within the
    vacation website.</li>
  <li><strong>userid</strong>,
    <strong>mediaId</strong>, <strong>journalId</strong> and
    <strong>commentId</strong>: unique ID of a particular item on the
    site.</li>
  <li><strong>created</strong>: timestamp when the item was originally
    created. Any item that has been modified has multiple rows in the
    database, all with the same created timestamp but with different
    updated timestamps. Only the latest updated row should be
    considered.</li>
  <li><strong>updated</strong>: timestamp for this update of the item.</li>
  <li><strong>deleted</strong>: whether the item is deleted or not.
    Deleted items aren&rsquo;t physically deleted from the database (this
    would cause them to re-appear when the database instance is
    synchronized with another instance), but are marked as deleted so that
    the deletion information can propagate to all instances.</li>
  <li><strong>hash</strong>: hash value for all the data in the record.</li>
</ul>

<p>The following functions are common among several tables.</p>

<ul>
  <li><strong>constructor()</strong>: constructor, which typically gets
    an ID value. If an ID is provided, the data for that ID is loaded. If
    no data exists, an empty object with that ID is created.<br/>
    Typically, the ID value is mandatory. Creating an object without an ID
    is considered an error.<br/>
    Some objects take multiple parameters to the constructor, e.g. because
    both a trip ID and object ID are required to construct the object.</li>
  <li><strong>load()</strong>: reload the content of the object with new
    data. This allows for object reuse. Apart from maintaining the same object,
    the behavior of the load() function is the same as the constructor.
    If no data is found, the prior contents of the object is erased.<br/>
    This function returns <strong>true</strong> if data is loaded from
    the database, <strong>false</strong> if the object is only blanked
    out or if there was an error.</li>
  <li><strong>save()</strong>: save the object as it currently is to the
    database. In most cases, this causes a new row to be added to the database
    with a new updated timestamp and a new hash.<br/>
    This function returns <strong>true</strong> when the data is successfully
    saved, <strong>false</strong> if there was a problem (either because
    not enough key fields are present or because the attempt to write to the
    database resulted in an error).</li>
  <li><strong>get...()</strong> and <strong>set...()</strong>: getters and
    setters are provided for all data attributes (elements) with the
    following notable exceptions:
    <ul>
      <li>No <strong>set...()</strong> function is provided for the basic key
        field(s). The basic key field(s) (indicated by <strong>KEY</strong>
        in the table descriptions below) uniquely define the object and
        cannot be changed, because that would mean switching to a different
        object. Use the <strong>load()</strong> function to switch to a
        different object.</li>
      <li>The <strong>setUpdated()</strong> and <strong>setHash()</strong>
        method change the behavior of the <strong>save()</strong> function.
        Normally, both the <em>updated</em> and <em>hash</em> fields will
        be automatically re-computed when the object is saved. If an explicit
        <strong>setUpdated()</strong> or <strong>setHash()</strong> call is
        made, the corresponding field will not be recomputed but the value
        that was set will be stored in the database. This functionality is
        <em>only</em> intended for the database synchronization process.</li>
    </ul>
  </li>
</ul>

<h2 id='blogAuth'>blogAuth Table</h2>

<p>The <em>blogAuth</em> table is used to maintain (authenticated) session
  information. This table does <em>not</em> participate in the
  database synchronization process, so it doesn&rsquo;t have a
  <em>hash</em> field.</p>

<ul>
  <li><strong>authId</strong> (KEY): random string shared with the browser
    client as a cookie uniquely identifying the session.</li>
  <li><strong>created</strong>: timestamp when the item was created.</li>
  <li><strong>updated</strong>: timestamp when the item was updated.</li>
  <li><strong>userId</strong>: if this is an authenticated session, ID
    of the authenticated user. This is blank if the session is not
    an authenticated session.</li>
  <li><strong>expiration</strong>: time (in seconds) that the session is
    valid after the <em>updated</em> timestamp. If the expiration is
    <strong>0</strong>, the session does not expire.</li>
</ul>

<h2 id='blogComment'>blogComment Table</h2>

<ul>
  <li><strong>tripId</strong> (KEY): trip to which this applies.</li>
  <li><strong>commentId</strong> (KEY): unique ID for this comment item.</li>
  <li><strong>created</strong>: timestamp when the item was created.</li>
  <li><strong>updated</strong>: timestamp when the item was updated.</li>
  <li><strong>userId</strong>: user who posted this comment.</li>
  <li><strong>referenceId</strong>: unique ID of the item to which this
    comment applies. This can be a media item, a journal item or another
    comment item.</li>
  <li><strong>commentText</strong>: text of the comment.</li>
  <li><strong>deleted</strong>: &ldquo;Y&rdquo; if the item is deleted.</li>
  <li><strong>hash</strong>: hash value for all the data in the record.</li>
</ul>

<h2 id='blogFeedback'>blogFeedback Table</h2>

<p>The feedback table maintains the &ldquo;likes&rdquo; and
  &rdquo;hugs&rdquo; that the user can give to an item.</p>

<ul>
  <li><strong>tripId</strong> (KEY): trip to which this applies.</li>
  <li><strong>referenceId</strong> (KEY): unique ID of the item to which this
    feedback applies. This can be a media item, a journal item or a
    comment item.</li>
  <li><strong>userId</strong> (KEY): unique ID for the user who gave the
    feedback.</li>
  <li><strong>created</strong>: timestamp when the item was created.</li>
  <li><strong>updated</strong>: timestamp when the item was updated.</li>
  <li><strong>type</strong>: type of feedback, this is one of
    &ldquo;like&rdquo;, &ldquo;hugs&rdquo; or &ldquo;off&rdquo;.
    The <em>hugs</em> can be given when the user wants to express support
    with the item but &ldquo;liking&rdquo; it is&rsquo;t appropriate.</li>
  <li><strong>deleted</strong>: &ldquo;Y&rdquo; if the item is deleted.</li>
  <li><strong>hash</strong>: hash value for all the data in the record.</li>
</ul>

<h2 id='blogJournal'>blogJournal Table</h2>

<p>Fields:</p>
<ul>
  <li><strong>tripId</strong> (KEY): trip to which this applies.</li>
  <li><strong>journalId</strong> (KEY): unique ID for this journal item.</li>
  <li><strong>created</strong>: timestamp when the item was created.</li>
  <li><strong>updated</strong>: timestamp when the item was updated.</li>
  <li><strong>userId</strong>: contributor who posted this journal entry.</li>
  <li><strong>journalDate</strong>: journal date.</li>
  <li><strong>journalTitle</strong>: title of the journal entry.</li>
  <li><strong>journalText</strong>: text of the journal entry.</li>
  <li><strong>deleted</strong>: &ldquo;Y&rdquo; if the item is deleted.</li>
  <li><strong>hash</strong>: hash value for all the data in the record.</li>
</ul>

<p>The following return a new Journal object, with all the attributes
  already loaded:</p>

<ul>
<li><strong>getFirstJournal(tripId)</strong> (static): returns the first
  entry for the trip.</li>
<li><strong>getLastJournal(tripId)</strong> (static): returns the last
  entry for the trip.</li>
<li><strong>getPreviousJournal()</strong>: returns the journal before
  this one, or null if there is none.</li>
<li><strong>getNextJournal()</strong>: returns the journal after
  this one, or null if there is none.</li>
</ul>

<h2 id='blogMedia'>blogMedia Table</h2>

<p>Table used to include definition of all the media items (photos,
  videos).</p>

<ul>
  <li><strong>tripId</strong> (KEY): trip to which this applies.</li>
  <li><strong>mediaId</strong> (KEY): unique ID for this media item.</li>
  <li><strong>created</strong>: timestamp when the item was created.</li>
  <li><strong>updated</strong>: timestamp when the item was updated.</li>
  <li><strong>type</strong>: type of media, either &ldquo;photo&rdquo;
    or &ldquo;video&rdquo;.</li>
  <li><strong>caption</strong>: caption for the media. Previously media
    had both a title and a description; these two are combined into
    a single caption. Also, there is no separate date value to attach
    the media to, since all media is displayed in the context of journal
    items.</li>
  <li><strong>timestamp</strong>: timestamp for the media (when the photo /
    video was taken).</li>
  <li><strong>location</strong>: lat-long coordinate for the media.</li>
  <li><strong>width</strong>: width of the media item (if photo or video).</li>
  <li><strong>height</strong>: height of the media item (if photo or
    video).</li>
  <li><strong>deleted</strong>: &ldquo;Y&rdquo; if the item is deleted.</li>
  <li><strong>hash</strong>: hash value for all the data in the record.</li>
</ul>

<h2 id='blogSetting'>blogSetting Table</h2>

<p>Maintains system-wide side-specific settings. The table is a basic
  name-value pair table. It does not maintain history and is not part
  of the synchronization. Settings get updated through functions invoked
  for the site.</p>

<ul>
  <li><strong>name</strong> (KEY): setting name. The database accepts any
    setting name, however, the system will only use setting names consisting
    of upper and lower case letters, numbers and underscores. The unit
    test system may use setting names that include a hyphen.</li>
  <li><strong>value</strong>: setting value.</li>
  <li><strong>updated</strong>: last update time stamp.</li>
</ul>

<h2 id='blogTrip'>blogTrip Table</h2>

<p>The trip tables contain the configuration for a specific trip. There
  are two tables: the <em>blogTrip</em> table defines the specific trips,
  the <em>blogTripAttribute</em> table maintains additional attributes for
  trips</p>

<p>The <strong>blogTrip</strong> table:</p>
<ul>
  <li><strong>tripId</strong> (KEY): unique ID for the trip.</li>
  <li><strong>created</strong>: timestamp when the item was created.</li>
  <li><strong>updated</strong>: timestamp when the item was updated.</li>
  <li><strong>name</strong>: display name for the trip.</li>
  <li><strong>description</strong>: description text of the trip.</li>
  <li><strong>bannerImg</strong>: name of the banner image.</li>
  <li><strong>startDate</strong>: first day for the trip (used to display
    the trip calendar).</li>
  <li><strong>endDate</strong>: last day for the trip (used to display
    the trip calendar).</li>
  <li><strong>active</strong>: &ldquo;Y&rdquo; if the trip is currently
    active (items can be posted), &ldquo;N&rdquo; if the trip is no longer
    active (archived).</li>
  <li><strong>deleted</strong>: &ldquo;Y&rdquo; if the item is deleted.</li>
  <li><strong>hash</strong>: hash value for all the data in the record.</li>
</ul>

<h2 id='blogTripAttribute'>blogTripAttribute Table</h2>

<p>The <strong>blogTripAttribute</strong> table, which houses name-value pairs
  with additional attributes of a trip:</p>
<ul>
  <li><strong>tripId</strong> (KEY): unique ID for the trip.</li>
  <li><strong>name</strong> (KEY): name for the entry.</li>
  <li><strong>created</strong>: timestamp when the item was created.</li>
  <li><strong>updated</strong>: timestamp when the item was updated.</li>
  <li><strong>value</strong>: value for the entry.</li>
  <li><strong>deleted</strong>: &ldquo;Y&rdquo; if the item is deleted.</li>
  <li><strong>hash</strong>: hash value for all the data in the record.</li>
</ul>

<h2 id='blogTripUser'>blogTripUser Table</h2>

<ul>
  <li><strong>tripId</strong> (KEY): unique ID for the trip.</li>
  <li><strong>userId</strong> (KEY): unique ID for the user.</li>
  <li><strong>created</strong>: timestamp when the item was created.</li>
  <li><strong>updated</strong>: timestamp when the item was updated.</li>
  <li><strong>role</strong>: role of the user for this trip, typically
    this is &ldquo;contributor&rdquo;.</li>
  <li><strong>message</strong>: personal message by the user to the
    readers.</li>
  <li><strong>deleted</strong>: &ldquo;Y&rdquo; if the item is deleted.</li>
  <li><strong>hash</strong>: hash value for all the data in the record.</li>
</ul>

<h2 id='blogUser'>blogUser Table</h2>

<p>The user table maintains information about various visitors to the
  site. This includes any facebook users who are automatically added.</p>

<ul>
  <li><strong>userId</strong> (KEY): unique ID for the user. The database
    accepts any non-blank string as a user ID; however, the application
    has some limitations.
    <ul>
      <li>Regular users select a user ID when registering. The user ID
        can consist of letters, numbers and underscores.</li>
      <li>A user ID is automatically created for &ldquo;external&rdquo;
        users (those registered through facebook or google). This user
        ID starts with a prefix indicating the type of external user
        and a hyphen. Since the hyphen is not valid for regular user IDs,
        there is no risk of conflicts.</li>
      <li>Test user IDs are used in unit testing. These user IDs start with
        a hyphen, so they cannot conflict with any other user IDs.</li>
    </ul>
  </li>
  <li><strong>password</strong>: encrypted password, using the PHP
    password_hash() and password_verify() functions (regular users
    only).<br/>
    Records that were imported from the old system have the MD5 hash of
    the password in the database, prefixed by &ldquo;$0$&rdquo; The system
    will recognize these special cases and will automatically update to
    the newer password hash whenever an old user logs in.</li>
  <li><strong>created</strong>: timestamp when the item was created.</li>
  <li><strong>updated</strong>: timestamp when the item was updated.</li>
  <li><strong>name</strong>: display name for the user.</li>
  <li><strong>externalType</strong>: type of external user, can be one
    of &ldquo;facebook&rdquo; or &ldquo;google&rdquo;.</li>
  <li><strong>externalId</strong>: if this is an external user, the ID
    that the external system (facebook, google etc.) has for this user.</li>
  <li><strong>access</strong>: access level; can be one of &ldquo;temp&rdquo;
    (for temporary access, where a tempCode has been sent but has not yet
    been confirmed),
    &ldquo;visitor&rdquo; (regular visitors to the site),
    &ldquo;contributor&rdquo; (person who can contribute journal entries
    to the site) or &ldquo;admin&rdquo; (site administrator).</li>
  <li><strong>email</strong>: the user&rsquo;s email address, if any.
    Email addresses can be used by regular users to log in, they are
    optional for external users. Email addresses must be unique for
    regular users (since they can be used to log in), but can be
    re-used for external users.</li>
  <li><strong>notification</strong>: indicator whether the user wants to
    receive email notifications (&ldquo;Y&rdquo;) or not
    (&ldquo;N&rdquo;).</li>
  <li><strong>tempCode</strong>: if set, the confirmation code that has
    been sent to the user in an email as part of the registration process;
    users with a confirmation code set have limited access to the site. Once
    the user enters the confirmation code in the dialog, they get full
    visitor access and the temp code will be removed from the database.</li>
  <li><strong>deleted</strong>: &ldquo;Y&rdquo; if the item is deleted.</li>
  <li><strong>hash</strong>: hash identifying the total data for the record.
    This is a hash value of the content of all the fields (except for the
    <em>updated</em> and <em>hash</em> fields) concatenated with a vertical
    bar as separator.</li>
</ul>

<h2 id='updates'>Database Structural Updates</h2>

<p>The following process is in place to support structural updates to
  the database.</p>

<ul>
  <li>Each database class has a private static method called
    <em>createTables()</em> and a public method called
    <em>updateTables()</em>.</li>
  <li>The <em>createTables</em> method will create any database table(s)
    maintained by this class.</li>
  <li>The <em>updateTables</em> method is called with a version string
    parameter which identifies the current state of the database, and will
    take any action necessary to update the database structure to the
    latest supported by the code.</li>
  <li>If called with an empty string, the system is completely fresh and
    no tables are there at all. <em>updateTables</em> will call
    <em>createTables</em> to create the tables.</li>
  <li>The <em>updateTables</em> method has a switch statement for each
    possible version string, and will call a database update method
    appropriate for that version, then fall through to the next version
    to continue updated as needed. Note: the method that is being called
    should have a descriptive name starting with &ldquo;update&rdquo;.</li>
  <li>The <em>updateTables</em> method returns <strong>true</strong> if
    it recognized the version string passed in and did the appropriate
    updated. It returns <strong>false</strong> if it did not recognize
    the version string.</li>
  <li>The unit tests contain a test that calles the <em>updateTables</em>
    method on each data object, making sure that it returns
    <strong>true</strong>. This way, whenever a new database version
    is created, any object not recognizing the new version number will
    cause the unit test to fail.</li>
</ul>

<p>Structure updates do <em>not</em> change hash values, even though new
  fields may be introduced, since those new fields will all be blank (null)
  anyway. If data conversion is needed, new rows will be introduced with
  an updated timestamp and hash.</p>

<p>Example of an <em>updateTables</em> method:</p>
<pre>
   public static function updateTables($dataVersion) {
      switch ($dataVersion) {
      case "":
         // No data version yet - create initial table
         &lt;class&gt;::createTables();
         break;
      case "0.1":
      case "0.2":
      case "0.3":
         &lt;class&gt;::updateAddColumn();
      case "0.4":
         &lt;class&gt;::updateAddExtraIndex();
      case "0.5":
      case "1.0":
      case "1.1":
      case "1.2":
         &lt;class&gt;::updateAddAnotherColumn();
      case "1.3":
      case "1.4":
         // current version
         break;
      default:
         // no provision for this version, should not happen
         print "&lt;class&gt;::updateTables($dataVersion): don't know this version.\n";
         return false;
      }
      return true;
   }
</pre>

<h2 id='synchronization'>Database Synchronization Process</h2>

<p>To be described later.</p>

<h2 id='unittest'>Unit Test</h2>

<p>This section describes the typical unit tests for objects in the database
  layer. It can function as a checklist when writing the unit test
  programs. Each unit test in the list has an ID which should be
  presented in the comments for the implementation of that test.</p>

<ul>
  <li><strong>setup before class</strong>: define the IDs of dependent
    test objects and remove any instances of those
    dependent test objects from the database, then create fresh
    instances of them. Example of dealing with dependent trip
    objects:
<pre>   public static function setUpBeforeClass() {
      global $testTripId1, $testTripId2;

      $testTripId1 = '-test-trip-1';
      $testTripId2 = '-test-trip-2';

      $query = "DELETE FROM blogTrip "
         . "WHERE tripId='$testTripId1'"
         .    "OR tripId='$testTripId2'";
      mysql_query($query);
      $trip = new Trip($testTripId1);
      $trip->save();
      $trip = new Trip($testTripId2);
      $trip->save();
  }</pre></li>
  <li><strong>setup</strong>: define the IDs of the test objects
    for the class being tested, then remove any instances of those
    test objects from the database. Example from testing the
    Comment object:
<pre>   protected function setUp() {
      global $testCommentId1, $testCommentId2;
      $testCommentId1 = '-test-comment-1';
      $testCommentId2 = '-test-comment-2';
      $query = "DELETE FROM blogComment "
         . "WHERE commentId='$testCommentId1'"
         .    "OR commentId='$testCommentId2'";
      mysql_query($query);
   }
</pre></li>
  <li><strong>count functions</strong>: define two functions,
    <em>countAllRows</em> and <em>countTestRows</em>, which count rows
    in the table being tested. These functions are used to confirm that
    only expected changes happen in the database.<br/>
    An example of the <em>countAllRows</em> function:
<pre>   private function countAllRows() {
      $query = "SELECT COUNT(updated) FROM blogFeedback";
      $result = mysql_query($query);
      if ($result
          && (mysql_num_rows($result) > 0)
          ) {
         $array = mysql_fetch_array($result);
         if ((count($array) > 0)
             && (count($array[0]) > 0)) {
            $count = $array[0][0];
            return $count;
         } else {
            print "countAllRows: got result set but not count\n";
         }
      } else {
         print "countAllRows: did not get result set\n";
      }
      return 0;
   }</pre>
    An example of the <em>countTestRows</em> function:
<pre>   private function countTestRows() {
      global $testReferenceId1, $testReferenceId2;
      $query = "SELECT COUNT(updated) FROM blogFeedback "
         . "WHERE referenceId='$testReferenceId1' "
         .    "OR referenceId='$testReferenceId2'";
      $result = mysql_query($query);
      if ($result
          && (mysql_num_rows($result) > 0)
          ) {
         $array = mysql_fetch_array($result);
         if ((count($array) > 0)
             && (count($array[0]) > 0)) {
            $count = $array[0][0];
            return $count;
         } else {
            print "countTestRows: got result set but not count\n";
         }
      } else {
         print "countTestRows: did not get result set\n";
      }
      return 0;
   }</pre></li>

  <li><strong>#1</strong>: Make sure that the class being tested has
    getter functions for the &ldquo;key&rdquo; fields, but does not
    have setter functions. Example:
<pre>   /**
    * test #1.
    * Make sure that there are no set...() functions for the key fields.
    */
   public function testNoSettersForKeyFields() {
      $this->assertTrue(method_exists("Feedback", "getTripId"),
                        "getTripId() exists");
      $this->assertFalse(method_exists("Feedback", "setTripId"),
                         "setTripId() does not exist");
   }</pre></li>

  <li><strong>#2</strong>: Make sure that there are no test rows at the
    beginning of the test. If this test fails, many other tests are
    going to fail as well. Example:
<pre>   /**
    * test #2.
    * Make sure data is wiped before each test.
    */
   public function testDataWipedBeforeTest() {
      $this->assertEquals(0, $this->countTestRows());
   }</pre></li>
  <li><strong>#3</strong>: Creating the object without key fields, with
    null key fields or with empty key fields will throw an
    InvalidArgumentException. The details of this test depend on the
    object type and the number of key fields. The example shows the
    test when there is a single key field. When there are multiple
    key fields, different permutations of valid and invalid key fields
    should be included.
<pre>   /**
    * test #3.
    * Creating the object without key fields, with null key fields or
    * with empty key fields will throw an InvalidArgumentException.
    */
   public function testCreateWithoutId() {
      // Count the number of rows in the table. This number shouldn't
      // change during this test.
      $startCount = $this->countAllRows();

      // constructor without arguments
      $gotException = false;
      try {
         $object = new Trip();
      } catch(InvalidArgumentException $expected) {
         $gotException = true;
      }
      $this->assertTrue($gotException);
      $this->assertFalse(isset($object));
      $endCount = $this->countAllRows();
      $this->assertEquals($startCount, $endCount);

      // constructor with 1 argument
      $gotException = false;
      try {
         $object = new Trip(null);
      } catch(InvalidArgumentException $expected) {
         $gotException = true;
      }
      $this->assertTrue($gotException);
      $this->assertFalse(isset($object));
      $endCount = $this->countAllRows();
      $this->assertEquals($startCount, $endCount);

      // constructor with 1 argument
      $gotException = false;
      try {
         $object = new Trip("");
      } catch(InvalidArgumentException $expected) {
         $gotException = true;
      }
      $this->assertTrue($gotException);
      $this->assertFalse(isset($object));
      $endCount = $this->countAllRows();
      $this->assertEquals($startCount, $endCount);
   }</pre></li>

  <li><strong>#4</strong>: Creating an object with the proper key fields
    results in an empty object. This object has the key fields set to a
    value and all other fields blank, null or the appropriate default
    value. Example:
<pre>   /**
    * test #4.
    * Creating a new object results in an object with the key fields set
    * and the other fields blank.
    * @depends testDataWipedBeforeTest
    */
   public function testCreateGivesEmptyObject() {
      global $testTripId1;
      global $testReferenceId1;
      global $testUserId1;

      // Count the number of rows in the table. This number shouldn't
      // change during this test.
      $startCount = $this->countAllRows();
      $object = new Feedback($testTripId1, $testReferenceId1, $testUserId1);
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testReferenceId1, $object->getReferenceId());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertNull($object->getCreated());
      $this->assertNull($object->getUpdated());
      $this->assertEquals('', $object->getType());
      $this->assertEquals('N', $object->getDeleted());
      $this->assertEquals('', $object->getHash());

      $this->assertEquals($startCount, $this->countAllRows());
   }</pre></li>

  <li><strong>#5</strong>: Save an empty object. When an empty object
    is saved, there has to be a row added to the database. Also, the
    object&rsquo;s <em>created</em>, <em>updated</em> and <em>hash</em>
    fields, which were empty before the save, now have received
    a value. Note: this does not read back the saved object. Reading
    back the saved object is part of the next test. Example:
<pre>   /**
    * test #5.
    * Save an empty object results in a row being added to the database
    * and the created, updated and hash fields getting a value. Since
    * this is the first instance, the created and updated both have the
    * same value.
    * @depends testCreateGivesEmptyObject
    */
   public function testSaveEmptyObject() {
      global $testTripId1;
      global $testReferenceId1;
      global $testUserId1;

      $object = new Feedback($testTripId1, $testReferenceId1, $testUserId1);
      $this->assertEquals(0, $this->countTestRows());

      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());

      $this->assertNotNull($object->getCreated());
      $this->assertNotEquals('', $object->getCreated());
      $this->assertNotNull($object->getUpdated());
      $this->assertNotEquals('', $object->getUpdated());
      $this->assertNotEquals('', $object->getHash());

      $created = $object->getCreated();
      $this->assertEquals($created, $object->getUpdated());
   }</pre></li>

  <li><strong>#6</strong>: Setting attribute values. When attribute
    values are set, they can be read back, both before and after
    saving the object. Also, the attribute values are the same when
    the object is re-readed from the database (a new instance of the
    object is created). Example:
<pre>   /**
    * test #6.
    * Create an object and set all attributes. All the attributes that
    * are set have that value when read back.
    * @depends testCreateGivesEmptyObject
    * @depends testSaveEmptyObject
    */
   public function testSetAttributes() {
      global $testTripId1;
      global $testReferenceId1;
      global $testUserId1;

      $this->assertEquals(0, $this->countTestRows());

      // Create the object and set attributes
      $object = new Feedback($testTripId1, $testReferenceId1, $testUserId1);
      $object->setType("like");
      $object->setDeleted('Y');

      // Confirm the values of all the attributes before saving
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testReferenceId1, $object->getReferenceId());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertNull($object->getCreated());
      $this->assertNull($object->getUpdated());
      $this->assertEquals('like', $object->getType());
      $this->assertEquals('Y', $object->getDeleted());
      $this->assertEquals('', $object->getHash());

      // Save the object and confirm a row is added to the database
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());

      // Confirm the values of all the attributes after saving
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testReferenceId1, $object->getReferenceId());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertNotNull($object->getCreated());
      $this->assertNotEquals('', $object->getCreated());
      $this->assertNotNull($object->getUpdated());
      $this->assertNotEquals('', $object->getUpdated());
      $this->assertEquals('like', $object->getType());
      $this->assertEquals('Y', $object->getDeleted());
      $this->assertNotEquals('', $object->getHash());

      $created = $object->getCreated();
      $updated = $object->getUpdated();
      $hash = $object->getHash();

      // Create a new instance of the object, which loads the previously
      // saved data from the database
      $object = new Feedback($testTripId1, $testReferenceId1, $testUserId1);

      // Confirm the values of all the attributes after loading
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testReferenceId1, $object->getReferenceId());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals($created, $object->getCreated());
      $this->assertEquals($updated, $object->getUpdated());
      $this->assertEquals('like', $object->getType());
      $this->assertEquals('Y', $object->getDeleted());
      $this->assertEquals($hash, $object->getHash());
   }</pre></li>

  <li><strong>#7</strong>: Loading with an incomplete or invalid key.
    When an object is loaded with an incomplete or invalid key, the load()
    function will return false and the object must be empty, except for the
    partial key fields and any fields that have a default value. The
    resulting object cannot be saved (a call to save() returns false and
    no data is written to the database). Example:
<pre>   /**
    * test #7.
    * Load an object using a partial key. The load() operation should
    * return false and object should be empty except for the partial
    * key fields.
    * @depends testSaveEmptyObject
    * @depends testSetAttributes
    */
   public function testLoadInvalidKey() {
      global $testTripId1;
      global $testReferenceId1;
      global $testUserId1;

      $this->assertEquals(0, $this->countTestRows());

      // Create a valid object
      $object = new Feedback($testTripId1, $testReferenceId1, $testUserId1);
      $object->setType('like');
      $object->setDeleted('Y');
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());

      // loading with invalid ID gives an error
      $this->assertFalse($object->load());

      // the object should be empty
      $this->assertEquals('', $object->getTripId());
      $this->assertEquals('', $object->getReferenceId());
      $this->assertEquals('', $object->getUserId());
      $this->assertNull($object->getCreated());
      $this->assertNull($object->getUpdated());
      $this->assertEquals('', $object->getType());
      $this->assertEquals('N', $object->getDeleted());
      $this->assertEquals('', $object->getHash());

      // the object cannot be saved
      $this->assertFalse($object->save());

      // no row has been added to the database
      $this->assertEquals(1, $this->countTestRows());

      // loading with other invalid ID combinations also gives an error
      $this->assertFalse($object->load(null));
      $this->assertFalse($object->load(''));
      /* ... and so on for other invalid key combinations ... */
   }</pre></li>

  <li><strong>#8</strong>: Loading with a valid but non-existent key
    blanks out all attributes. The resulting object can be saved.
<pre>   /**
    * test #8.
    * Loading a valid but not-existing key blanks out all the attributes.
    * The load() function returns false, indicating no data was found.
    * @depends testSaveEmptyObject
    * @depends testSetAttributes
    */
   public function testLoadNonExistent() {
      global $testTripId1, $testReferenceId1, $testUserId1;
      global $testTripId2, $testReferenceId2, $testUserId2;

      // Create an instance and set all the attributes
      $object = new Feedback($testTripId1, $testReferenceId1, $testUserId1);
      $object->setType("like");
      $object->setDeleted('Y');
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());

      // Load a non-existent object into the existing one
      $this->assertFalse($object->load($testTripId2,
                                       $testReferenceId2,
                                       $testUserId2));
      $this->assertEquals(1, $this->countTestRows());

      // All the attributes should be defaulted now
      $this->assertEquals($testTripId2, $object->getTripId());
      $this->assertEquals($testReferenceId2, $object->getReferenceId());
      $this->assertEquals($testUserId2, $object->getUserId());
      $this->assertNull($object->getCreated());
      $this->assertNull($object->getUpdated());
      $this->assertEquals('', $object->getType());
      $this->assertEquals('N', $object->getDeleted());
      $this->assertEquals('', $object->getHash());
   }</pre></li>

  <li><strong>#9</strong>: Loading an existing object fills all the
    attributes, overriding any previous values.
<pre>   /**
    * test #9.
    * Loading a valid, existing key overrides all the attributes with the
    * loaded values. The load() function returns true, indicating that
    * data was found.
    * @depends testSaveEmptyObject
    * @depends testSetAttributes
    */
   public function testLoadExistent() {
      global $testTripId1, $testReferenceId1, $testUserId1;
      global $testTripId2, $testReferenceId2, $testUserId2;

      // create a first instance
      $object = new Feedback($testTripId1, $testReferenceId1, $testUserId1);
      $object->setType("like");
      $object->setDeleted('Y');
      $object->save();
      $this->assertEquals(1, $this->countTestRows());

      // Get the automatically created attributes for this instance
      $created1 = $object->getCreated();
      $updated1 = $object->getUpdated();
      $hash1 = $object->getHash();

      // create a second instance
      $object = new Feedback($testTripId2, $testReferenceId2, $testUserId2);
      $object->setType("hugs");
      $object->setDeleted('N');
      $object->save();
      $this->assertEquals(2, $this->countTestRows());

      // Get the automatically created attributes for this instance, and
      // make sure they are different from those of the first instance.
      $created2 = $object->getCreated();
      $updated2 = $object->getUpdated();
      $hash2 = $object->getHash();
      $this->assertNotEquals($created1, $created2);
      $this->assertNotEquals($updated1, $updated2);
      $this->assertNotEquals($hash1, $hash2);

      // Load the first object, which overrides all the attributes
      $this->assertTrue($object->load($testTripId1,
                                      $testReferenceId1,
                                      $testUserId1));
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testReferenceId1, $object->getReferenceId());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals($created1, $object->getCreated());
      $this->assertEquals($updated1, $object->getUpdated());
      $this->assertEquals('like', $object->getType());
      $this->assertEquals('Y', $object->getDeleted());
      $this->assertEquals($hash1, $object->getHash());
   }</pre></li>

  <li><strong>#10</strong>: Updating data creates a new row in the
    database, and afterwards the new data is returned instead of the
    old data. Note: the changes to the <em>updated</em> and <em>hash</em>
    fields will be tested later. Example:
<pre>   /**
    * test #10.
    * Updating data creates a new row in the database, and aferwards the
    * new data is returned instead of the old data.
    * @depends testSaveEmptyObject
    * @depends testSetAttributes
    */
   public function testUpdate() {
      global $testTripId1, $testReferenceId1, $testUserId1;

      // create the object and save it
      $object = new Feedback($testTripId1, $testReferenceId1, $testUserId1);
      $object->setType("like");
      $object->setDeleted('N');
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());

      // change values and update the object
      $object->setType("off");
      $object->setDeleted('Y');
      $this->assertTrue($object->save());
      $this->assertEquals(2, $this->countTestRows());

      // read the object from the database and confirm that the changed
      // values are returned
      $object = new Feedback($testTripId1, $testReferenceId1, $testUserId1);
      $this->assertEquals("off", $object->getType());
      $this->assertEquals('Y', $object->getDeleted());

      // Load the second object, which overrides all the attributes
      $this->assertTrue($object->load($testTripId2,
                                      $testReferenceId2,
                                      $testUserId2));
      $this->assertEquals($testTripId2, $object->getTripId());
      $this->assertEquals($testReferenceId2, $object->getReferenceId());
      $this->assertEquals($testUserId2, $object->getUserId());
      $this->assertEquals($created2, $object->getCreated());
      $this->assertEquals($updated2, $object->getUpdated());
      $this->assertEquals('hugs', $object->getType());
      $this->assertEquals('N', $object->getDeleted());
      $this->assertEquals($hash2, $object->getHash());
   }</pre></li>

  <li><strong>#11</strong>: Test the automatically computed attributes
    (<em>created</em>, <em>updated</em> and <em>hash</em>). These
    attributes should be set the first time an object is saved. In addition,
    the <em>updated</em> and <em>hash</em> attributes should be changed
    when the object is saved again, even when no data changes. Example:
<pre>   /**
    * test #11.
    * Automatically computed attributes (created, updated, hash) are
    * properly set on the first save, and when appropriate changed on
    * subsequent saves.
    * @depends testSaveEmptyObject
    * @depends testSetAttributes
    * @depends testLoadExistent
    * @depends testUpdate
    */
   public function testAutomaticAttributes() {
      global $testTripId1, $testReferenceId1, $testUserId1;

      // create new object
      $object = new Feedback($testTripId1, $testReferenceId1, $testUserId1);
      $object->setType('like');
      $object->setDeleted('Y');

      // values before save
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testReferenceId1, $object->getReferenceId());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertNull($object->getCreated());
      $this->assertNull($object->getUpdated());
      $this->assertEquals('like', $object->getType());
      $this->assertEquals('Y', $object->getDeleted());
      $this->assertEquals('', $object->getHash());

      $this->assertTrue($object->save());

      // values after save
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testReferenceId1, $object->getReferenceId());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertNotNull($object->getCreated());
      $this->assertNotEquals('', $object->getCreated());
      $this->assertNotNull($object->getUpdated());
      $this->assertNotEquals('', $object->getUpdated());
      $this->assertEquals('like', $object->getType());
      $this->assertEquals('Y', $object->getDeleted());
      $this->assertNotEquals('', $object->getHash());

      // after initial save, created and updated are the same
      $created = $object->getCreated();
      $updated = $object->getUpdated();
      $hash = $object->getHash();
      $this->assertEquals($created, $updated);

      // save again without changing any data
      $this->assertTrue($object->save());

      // after second save, created is still the same but updated
      // and hash are different
      $this->assertEquals($created, $object->getCreated());
      $this->assertNotEquals($updated, $object->getUpdated());
      $this->assertNotEquals($hash, $object->getHash());
   }</pre></li>

  <li><strong>#12</strong>: Override automatic attributes for a
    new record. Example:
<pre>   /**
    * test #12.
    * Overriding automatic attributes for an new record. The explicitly
    * set values should be stored in the database when the record is
    * saved. When the record is saved again after that, the updated and
    * hash fields should again be automatically computed.
    * @depends testSaveEmptyObject
    * @depends testSetAttributes
    * @depends testUpdate
    */
   public function testOverrideAutomaticAttributesNewRecord() {
      global $testTripId1, $testReferenceId1, $testUserId1;

      $object = new Feedback($testTripId1, $testReferenceId1, $testUserId1);
      $object->setCreated('2015-09-30 10:10:10.000000');
      $object->setUpdated('2015-09-30 10:10:11.000000');
      $object->setHash('explicit hash');
      $object->setType('like');
      $object->setDeleted('Y');

      // values before save
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testReferenceId1, $object->getReferenceId());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals('2015-09-30 10:10:10.000000', $object->getCreated());
      $this->assertEquals('2015-09-30 10:10:11.000000', $object->getUpdated());
      $this->assertEquals('explicit hash', $object->getHash());
      $this->assertEquals('like', $object->getType());
      $this->assertEquals('Y', $object->getDeleted());

      // first save
      $this->assertTrue($object->save());

      // values after first save are unchanged
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testReferenceId1, $object->getReferenceId());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals('2015-09-30 10:10:10.000000', $object->getCreated());
      $this->assertEquals('2015-09-30 10:10:11.000000', $object->getUpdated());
      $this->assertEquals('explicit hash', $object->getHash());
      $this->assertEquals('like', $object->getType());
      $this->assertEquals('Y', $object->getDeleted());

      // second save
      $this->assertTrue($object->save());

      // values after second save, created is still the same but
      // updated and hash have changed
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testReferenceId1, $object->getReferenceId());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals('2015-09-30 10:10:10.000000', $object->getCreated());
      $this->assertNotEquals('2015-09-30 10:10:11.000000', $object->getUpdated());
      $this->assertNotEquals('explicit hash', $object->getHash());
      $this->assertEquals('like', $object->getType());
      $this->assertEquals('Y', $object->getDeleted());
   }</pre></li>

  <li><strong>#13</strong>: Override automatic attributes for an
    existing record with past dates. Example:
<pre>   /**
    * test #13.
    * Overriding automatic attributes using a past date. Because
    * a past date is used, the record should be saved but will not
    * be visible.
    * @depends testSaveEmptyObject
    * @depends testSetAttributes
    * @depends testUpdate
    * @depends testOverrideAutomaticAttributesNewRecord
    */
   public function testOverrideAutomaticAttributesPastDate() {
      global $testTripId1, $testReferenceId1, $testUserId1;

      // Create the object, which automatically gets the current date
      $object = new Feedback($testTripId1, $testReferenceId1, $testUserId1);
      $object->setType('like');
      $object->setDeleted('Y');
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());

      $originalCreated = $object->getCreated();
      $originalUpdated = $object->getUpdated();
      $originalHash = $object->getHash();

      // Change the object with different values, using a guaranteed
      // past date for the Created and Updated fields.
      // values after first save are unchanged
      $object->setCreated('2000-01-01 10:10:10.000000');
      $object->setUpdated('2000-01-01 10:10:11.000000');
      $object->setType('plus');
      $object->setDeleted('N');
      $object->setHash('past date hash');

      // Check the values before saving
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testReferenceId1, $object->getReferenceId());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals('2000-01-01 10:10:10.000000', $object->getCreated());
      $this->assertEquals('2000-01-01 10:10:11.000000', $object->getUpdated());
      $this->assertEquals('plus', $object->getType());
      $this->assertEquals('N', $object->getDeleted());
      $this->assertEquals('past date hash', $object->getHash());

      // update the record, this adds a row in the database
      $this->assertTrue($object->save());
      $this->assertEquals(2, $this->countTestRows());

      // after the update, the original values have come back
      // updated and hash have changed
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testReferenceId1, $object->getReferenceId());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals($originalCreated, $object->getCreated());
      $this->assertEquals($originalUpdated, $object->getUpdated());
      $this->assertEquals('like', $object->getType());
      $this->assertEquals('Y', $object->getDeleted());
      $this->assertEquals($originalHash, $object->getHash());
   }</pre></li>

  <li><strong>#14</strong>: Override automatic attributes for an
    existing record with future dates. Example:
<pre>   /**
    * test #14.
    * Overriding automatic attributes using a future date. Because
    * a future date is used, the record can no longer be changed after
    * it was saved.
    * @depends testSaveEmptyObject
    * @depends testSetAttributes
    * @depends testUpdate
    * @depends testOverrideAutomaticAttributesNewRecord
    */
   public function testOverrideAutomaticAttributesFutureDate() {
      global $testTripId1, $testReferenceId1, $testUserId1;

      // Create the object, which automatically gets the current date
      $object = new Feedback($testTripId1, $testReferenceId1, $testUserId1);
      $object->setType('like');
      $object->setDeleted('Y');
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());

      $originalCreated = $object->getCreated();
      $originalUpdated = $object->getUpdated();
      $originalHash = $object->getHash();

      // Change the object with different values, using a guaranteed
      // future date for the Created and Updated fields. Note that
      // the mySQL timestamp values allow for dates up to January 19,
      // 2038. Select as the future date for this test January 18, 2038
      // values after first save are unchanged
      $object->setCreated('2038-01-18 10:10:10.000000');
      $object->setUpdated('2038-01-18 10:10:11.000000');
      $object->setType('plus');
      $object->setDeleted('N');
      $object->setHash('future date hash');

      // Check the values before saving
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testReferenceId1, $object->getReferenceId());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals('2038-01-18 10:10:10.000000', $object->getCreated());
      $this->assertEquals('2038-01-18 10:10:11.000000', $object->getUpdated());
      $this->assertEquals('plus', $object->getType());
      $this->assertEquals('N', $object->getDeleted());
      $this->assertEquals('future date hash', $object->getHash());

      // update the record, this adds a row in the database
      $this->assertTrue($object->save());
      $this->assertEquals(2, $this->countTestRows());

      // after the update, the information has been saved
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testReferenceId1, $object->getReferenceId());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals('2038-01-18 10:10:10.000000', $object->getCreated());
      $this->assertEquals('2038-01-18 10:10:11.000000', $object->getUpdated());
      $this->assertEquals('plus', $object->getType());
      $this->assertEquals('N', $object->getDeleted());
      $this->assertEquals('future date hash', $object->getHash());

      // Try to update the record. This will add a row in the database
      $object->setType('hugs');
      $object->setDeleted('Y');
      $this->assertTrue($object->save());
      $this->assertEquals(3, $this->countTestRows());

      // but the new information is not saved. The previously saved
      // information cannot be overwritten without manually setting the
      // updated field.
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testReferenceId1, $object->getReferenceId());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals('2038-01-18 10:10:10.000000', $object->getCreated());
      $this->assertEquals('2038-01-18 10:10:11.000000', $object->getUpdated());
      $this->assertEquals('plus', $object->getType());
      $this->assertEquals('N', $object->getDeleted());
      // Note: this will FAIL in the current implementation!
      //$this->assertEquals('future date hash', $object->getHash());
   }</pre></li>

</ul>

<?php print pageEnd(); ?>
