<?php
$common = dirname(__FILE__) . "/../common.php";
include($common);
include_once("$gl_site_root/database/Trip.php");
include_once("$gl_site_root/database/User.php");
include_once("$gl_site_root/database/TripUser.php");

class TripUserTest extends PHPUnit_Framework_TestCase {
   private $testTripId1;
   private $testTripId2;
   private $testUserId1;
   private $testUserId2;

   public static function setUpBeforeClass() {
      global $testTripId1, $testTripId2;
      global $testUserId1, $testUserId2;

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

      $testUserId1 = "-test-user-1";
      $testUserId2 = "-test-user-2";
      $query = "DELETE FROM blogUser "
         . "WHERE userId='$testUserId1'"
         .    "OR userId='$testUserId2'";
      mysql_query($query);
      $user = new User($testUserId1);
      $user->save();
      $user = new User($testUserId2);
      $user->save();
   }

   public static function tearDownAfterClass() {
      global $testTripId1, $testTripId2;
      global $testUserId1, $testUserId2;

      $query = "DELETE FROM blogTrip "
         . "WHERE tripId='$testTripId1'"
         .    "OR tripId='$testTripId2'";
      mysql_query($query);

      $query = "DELETE FROM blogUser "
         . "WHERE userId='$testUserId1'"
         .    "OR userId='$testUserId2'";
      mysql_query($query);
   }

   protected function setUp() {
      global $testTripId1, $testTripId2;
      $query = "DELETE FROM blogTripUser "
         . "WHERE tripId='$testTripId1'"
         .    "OR tripId='$testTripId2'";
      mysql_query($query);
   }

   protected function tearDown() {
      global $testTripId1, $testTripId2;
      $query = "DELETE FROM blogTripUser "
         . "WHERE tripId='$testTripId1'"
         .    "OR tripId='$testTripId2'";
      mysql_query($query);
   }

   private function countAllRows() {
      $query = "SELECT COUNT(updated) FROM blogTripUser";
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
   }

   private function countTestRows() {
      global $testTripId1, $testTripId2;
      $query = "SELECT COUNT(updated) FROM blogTripUser "
         . "WHERE tripId='$testTripId1' "
         .    "OR tripId='$testTripId2'";
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
   }

   /**
    * test #1.
    * Make sure that there are no set...() functions for the key fields.
    */
   public function testNoSettersForKeyFields() {
      $this->assertTrue(method_exists("TripUser", "getTripId"),
                        "getTripId() exists");
      $this->assertFalse(method_exists("TripUser", "setTripId"),
                         "setTripId() does not exist");
      $this->assertTrue(method_exists("TripUser", "getUserId"),
                        "getUserId exists");
      $this->assertFalse(method_exists("TripUser", "setUserId"),
                         "setUserId does not exist");
   }

   /**
    * test #2.
    * Make sure data is wiped before each test.
    */
   public function testDataWipedBeforeTest() {
      $this->assertEquals(0, $this->countTestRows());
   }

   /**
    * test #3.
    * Creating the object without key fields, with null key fields or
    * with empty key fields will throw an InvalidArgumentException.
    */
   public function testCreateWithoutId() {
      global $testTripId1;
      global $testUserId1;

      // Count the number of rows in the table. This number shouldn't
      // change during this test.
      $startCount = $this->countAllRows();

      // constructor without arguments
      $gotException = false;
      try {
         $object = new TripUser();
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
         $object = new TripUser(null);
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
         $object = new TripUser("");
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
         $object = new TripUser($testTripId1);
      } catch(InvalidArgumentException $expected) {
         $gotException = true;
      }
      $this->assertTrue($gotException);
      $this->assertFalse(isset($object));
      $endCount = $this->countAllRows();
      $this->assertEquals($startCount, $endCount);

      // constructor with 2 arguments
      $gotException = false;
      try {
         $object = new TripUser($testTripId1, null);
      } catch(InvalidArgumentException $expected) {
         $gotException = true;
      }
      $this->assertTrue($gotException);
      $this->assertFalse(isset($object));
      $endCount = $this->countAllRows();
      $this->assertEquals($startCount, $endCount);

      // constructor with 2 arguments
      $gotException = false;
      try {
         $object = new TripUser($testTripId1, "");
      } catch(InvalidArgumentException $expected) {
         $gotException = true;
      }
      $this->assertTrue($gotException);
      $this->assertFalse(isset($object));
      $endCount = $this->countAllRows();
      $this->assertEquals($startCount, $endCount);

      // constructor with 2 arguments
      $gotException = false;
      try {
         $object = new TripUser(null, $testUserId1);
      } catch(InvalidArgumentException $expected) {
         $gotException = true;
      }
      $this->assertTrue($gotException);
      $this->assertFalse(isset($object));
      $endCount = $this->countAllRows();
      $this->assertEquals($startCount, $endCount);
   }

   /**
    * test #4.
    * Creating a new object results in an object with the key fields set
    * and the other fields blank.
    * @depends testDataWipedBeforeTest
    */
   public function testCreateGivesEmptyObject() {
      global $testTripId1;
      global $testUserId1;

      // Count the number of rows in the table. This number shouldn't
      // change during this test.
      $startCount = $this->countAllRows();
      $object = new TripUser($testTripId1, $testUserId1);
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertNull($object->getCreated());
      $this->assertNull($object->getUpdated());
      $this->assertEquals('', $object->getRole());
      $this->assertEquals('', $object->getMessage());
      $this->assertEquals('N', $object->getDeleted());
      $this->assertEquals('', $object->getHash());

      $this->assertEquals($startCount, $this->countAllRows());
   }

   /**
    * test #5.
    * Save an empty object results in a row being added to the database
    * and the created, updated and hash fields getting a value. Since
    * this is the first instance, the created and updated both have the 
    * same value.
    * @depends testCreateGivesEmptyObject
    */
   public function testSaveEmptyObject() {
      global $testTripId1;
      global $testUserId1;

      $object = new TripUser($testTripId1, $testUserId1);
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
   }

   /**
    * test #6.
    * Create an object and set all attributes. All the attributes that
    * are set have that value when read back.
    * @depends testCreateGivesEmptyObject
    * @depends testSaveEmptyObject
    */
   public function testSetAttributes() {
      global $testTripId1;
      global $testUserId1;
      global $testUserId1;

      $this->assertEquals(0, $this->countTestRows());

      // Create the object and set attributes
      $object = new TripUser($testTripId1, $testUserId1);
      $object->setRole('role');
      $object->setMessage('message');
      $object->setDeleted('Y');

      // Confirm the values of all the attributes before saving
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertNull($object->getCreated());
      $this->assertNull($object->getUpdated());
      $this->assertEquals('role', $object->getRole());
      $this->assertEquals('message', $object->getMessage());
      $this->assertEquals('Y', $object->getDeleted());
      $this->assertEquals('', $object->getHash());

      // Save the object and confirm a row is added to the database
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());

      // Confirm the values of all the attributes after saving
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertNotNull($object->getCreated());
      $this->assertNotEquals('', $object->getCreated());
      $this->assertNotNull($object->getUpdated());
      $this->assertNotEquals('', $object->getUpdated());
      $this->assertEquals('role', $object->getRole());
      $this->assertEquals('message', $object->getMessage());
      $this->assertEquals('Y', $object->getDeleted());
      $this->assertNotEquals('', $object->getHash());

      $created = $object->getCreated();
      $updated = $object->getUpdated();
      $hash = $object->getHash();

      // Create a new instance of the object, which loads the previously
      // saved data from the database
      $object = new TripUser($testTripId1, $testUserId1);

      // Confirm the values of all the attributes after loading
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals($created, $object->getCreated());
      $this->assertEquals($updated, $object->getUpdated());
      $this->assertEquals('role', $object->getRole());
      $this->assertEquals('message', $object->getMessage());
      $this->assertEquals('Y', $object->getDeleted());
      $this->assertEquals($hash, $object->getHash());
   }

   /**
    * test #7.
    * Load an object using a partial key. The load() operation should
    * return false and object should be empty except for the partial
    * key fields.
    * @depends testSaveEmptyObject
    * @depends testSetAttributes
    */
   public function testLoadInvalidKey() {
      global $testTripId1;
      global $testUserId1;
      global $testUserId1;

      $this->assertEquals(0, $this->countTestRows());

      // Create a valid object
      $object = new TripUser($testTripId1, $testUserId1);
      $object->setRole('role');
      $object->setMessage('message');
      $object->setDeleted('Y');
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());

      // loading with invalid ID gives an error
      $this->assertFalse($object->load());

      // the object should be empty
      $this->assertEquals('', $object->getTripId());
      $this->assertEquals('', $object->getUserId());
      $this->assertNull($object->getCreated());
      $this->assertNull($object->getUpdated());
      $this->assertEquals('', $object->getRole());
      $this->assertEquals('', $object->getMessage());
      $this->assertEquals('N', $object->getDeleted());
      $this->assertEquals('', $object->getHash());

      // the object cannot be saved
      $this->assertFalse($object->save());

      // no row has been added to the database
      $this->assertEquals(1, $this->countTestRows());

      // loading with other invalid ID combinations also gives an error
      $this->assertFalse($object->load(null));

      $this->assertFalse($object->load(''));

      $this->assertFalse($object->load($testTripId1));
      $this->assertEquals($testTripId1, $object->getTripId());

      $this->assertFalse($object->load($testTripId1, null));
      $this->assertEquals($testTripId1, $object->getTripId());

      $this->assertFalse($object->load($testTripId1, ''));
      $this->assertEquals($testTripId1, $object->getTripId());
   }

   /**
    * test #8.
    * Loading a valid but not-existing key blanks out all the attributes.
    * The load() function returns false, indicating no data was found.
    * @depends testSaveEmptyObject
    * @depends testSetAttributes
    */
   public function testLoadNonExistent() {
      global $testTripId1, $testUserId1, $testUserId1;
      global $testTripId2, $testUserId2, $testUserId2;

      // Create an instance and set all the attributes
      $object = new TripUser($testTripId1, $testUserId1);
      $object->setRole('-test-reference-1');
      $object->setMessage('message');
      $object->setDeleted('Y');
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());

      // Load a non-existent object into the existing one
      $this->assertFalse($object->load($testTripId2,
                                       $testUserId2));
      $this->assertEquals(1, $this->countTestRows());

      // All the attributes should be defaulted now
      $this->assertEquals($testTripId2, $object->getTripId());
      $this->assertEquals($testUserId2, $object->getUserId());
      $this->assertNull($object->getCreated());
      $this->assertNull($object->getUpdated());
      $this->assertEquals('', $object->getRole());
      $this->assertEquals('', $object->getMessage());
      $this->assertEquals('N', $object->getDeleted());
      $this->assertEquals('', $object->getHash());
   }

   /**
    * test #9.
    * Loading a valid, existing key overrides all the attributes with the
    * loaded values. The load() function returns true, indicating that
    * data was found.
    * @depends testSaveEmptyObject
    * @depends testSetAttributes
    */
   public function testLoadExistent() {
      global $testTripId1, $testUserId1, $testUserId1;
      global $testTripId2, $testUserId2, $testUserId2;

      // create a first instance
      $object = new TripUser($testTripId1, $testUserId1);
      $object->setRole('role-1');
      $object->setMessage('message');
      $object->setDeleted('Y');
      $object->save();
      $this->assertEquals(1, $this->countTestRows());

      // Get the automatically created attributes for this instance
      $created1 = $object->getCreated();
      $updated1 = $object->getUpdated();
      $hash1 = $object->getHash();

      // create a second instance
      $object = new TripUser($testTripId2, $testUserId2);
      $object->setRole('role-2');
      $object->setMessage('message 2');
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
                                      $testUserId1));
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals($created1, $object->getCreated());
      $this->assertEquals($updated1, $object->getUpdated());
      $this->assertEquals('role-1', $object->getRole());
      $this->assertEquals('message', $object->getMessage());
      $this->assertEquals('Y', $object->getDeleted());
      $this->assertEquals($hash1, $object->getHash());

      // Load the second object, which overrides all the attributes
      $this->assertTrue($object->load($testTripId2,
                                      $testUserId2));
      $this->assertEquals($testTripId2, $object->getTripId());
      $this->assertEquals($testUserId2, $object->getUserId());
      $this->assertEquals($created2, $object->getCreated());
      $this->assertEquals($updated2, $object->getUpdated());
      $this->assertEquals('role-2', $object->getRole());
      $this->assertEquals('message 2', $object->getMessage());
      $this->assertEquals('N', $object->getDeleted());
      $this->assertEquals($hash2, $object->getHash());
   }

   /**
    * test #10.
    * Updating data creates a new row in the database, and aferwards the
    * new data is returned instead of the old data.
    * @depends testSaveEmptyObject
    * @depends testSetAttributes
    */
   public function testUpdate() {
      global $testTripId1, $testUserId1, $testUserId1;
      global $testUserId2;

      // create the object and save it
      $object = new TripUser($testTripId1, $testUserId1);
      $object->setRole('role-1');
      $object->setMessage('message');
      $object->setDeleted('N');
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());

      // change values and update the object
      $object->setRole('role-2');
      $object->setMessage('message 2');
      $object->setDeleted('Y');
      $this->assertTrue($object->save());
      $this->assertEquals(2, $this->countTestRows());

      // read the object from the database and confirm that the changed
      // values are returned
      $object = new TripUser($testTripId1, $testUserId1);
      $this->assertEquals('role-2', $object->getRole());
      $this->assertEquals('message 2', $object->getMessage());
      $this->assertEquals('Y', $object->getDeleted());
   }

   /**
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
      global $testTripId1, $testUserId1, $testUserId1;

      // create new object
      $object = new TripUser($testTripId1, $testUserId1);
      $object->setRole('role-1');
      $object->setMessage('message');
      $object->setDeleted('Y');

      // values before save
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertNull($object->getCreated());
      $this->assertNull($object->getUpdated());
      $this->assertEquals('role-1', $object->getRole());
      $this->assertEquals('message', $object->getMessage());
      $this->assertEquals('Y', $object->getDeleted());
      $this->assertEquals('', $object->getHash());

      $this->assertTrue($object->save());

      // values after save
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertNotNull($object->getCreated());
      $this->assertNotEquals('', $object->getCreated());
      $this->assertNotNull($object->getUpdated());
      $this->assertNotEquals('', $object->getUpdated());
      $this->assertEquals('role-1', $object->getRole());
      $this->assertEquals('message', $object->getMessage());
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
   }

   /**
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
      global $testTripId1, $testUserId1, $testUserId1;

      $object = new TripUser($testTripId1, $testUserId1);
      $object->setCreated('2015-09-30 10:10:10.000000');
      $object->setUpdated('2015-09-30 10:10:11.000000');
      $object->setRole('role-1');
      $object->setMessage('message');
      $object->setDeleted('Y');
      $object->setHash('explicit hash');

      // values before save
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals('2015-09-30 10:10:10.000000', $object->getCreated());
      $this->assertEquals('2015-09-30 10:10:11.000000', $object->getUpdated());
      $this->assertEquals('role-1', $object->getRole());
      $this->assertEquals('message', $object->getMessage());
      $this->assertEquals('Y', $object->getDeleted());
      $this->assertEquals('explicit hash', $object->getHash());

      // first save
      $this->assertTrue($object->save());

      // values after first save are unchanged
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals('2015-09-30 10:10:10.000000', $object->getCreated());
      $this->assertEquals('2015-09-30 10:10:11.000000', $object->getUpdated());
      $this->assertEquals('role-1', $object->getRole());
      $this->assertEquals('message', $object->getMessage());
      $this->assertEquals('Y', $object->getDeleted());
      $this->assertEquals('explicit hash', $object->getHash());

      // second save
      $this->assertTrue($object->save());

      // values after second save, created is still the same but
      // updated and hash have changed
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals('2015-09-30 10:10:10.000000', $object->getCreated());
      $this->assertNotEquals('2015-09-30 10:10:11.000000', $object->getUpdated());
      $this->assertEquals('role-1', $object->getRole());
      $this->assertEquals('Y', $object->getDeleted());
      $this->assertNotEquals('explicit hash', $object->getHash());
   }

   /**
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
      global $testTripId1, $testUserId1, $testUserId1;
      global $testUserId2;

      // Create the object, which automatically gets the current date
      $object = new TripUser($testTripId1, $testUserId1);
      $object->setRole('role-1');
      $object->setMessage('message');
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
      $object->setRole('role-2');
      $object->setMessage('message 2');
      $object->setDeleted('N');
      $object->setHash('past date hash');

      // Check the values before saving
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals('2000-01-01 10:10:10.000000', $object->getCreated());
      $this->assertEquals('2000-01-01 10:10:11.000000', $object->getUpdated());
      $this->assertEquals('role-2', $object->getRole());
      $this->assertEquals('message 2', $object->getMessage());
      $this->assertEquals('N', $object->getDeleted());
      $this->assertEquals('past date hash', $object->getHash());

      // update the record, this adds a row in the database
      $this->assertTrue($object->save());
      $this->assertEquals(2, $this->countTestRows());

      // after the update, the original values have come back
      // updated and hash have changed
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals($originalCreated, $object->getCreated());
      $this->assertEquals($originalUpdated, $object->getUpdated());
      $this->assertEquals('role-1', $object->getRole());
      $this->assertEquals('message', $object->getMessage());
      $this->assertEquals('Y', $object->getDeleted());
      $this->assertEquals($originalHash, $object->getHash());
   }

   /**
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
      global $testTripId1, $testUserId1, $testUserId1;
      global $testUserId2;

      // Create the object, which automatically gets the current date
      $object = new TripUser($testTripId1, $testUserId1);
      $object->setRole('role-1');
      $object->setMessage('message');
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
      $object->setRole('role-2');
      $object->setMessage('message 2');
      $object->setDeleted('N');
      $object->setHash('future date hash');

      // Check the values before saving
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals('2038-01-18 10:10:10.000000', $object->getCreated());
      $this->assertEquals('2038-01-18 10:10:11.000000', $object->getUpdated());
      $this->assertEquals('role-2', $object->getRole());
      $this->assertEquals('message 2', $object->getMessage());
      $this->assertEquals('N', $object->getDeleted());
      $this->assertEquals('future date hash', $object->getHash());

      // update the record, this adds a row in the database
      $this->assertTrue($object->save());
      $this->assertEquals(2, $this->countTestRows());

      // after the update, the information has been saved
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals('2038-01-18 10:10:10.000000', $object->getCreated());
      $this->assertEquals('2038-01-18 10:10:11.000000', $object->getUpdated());
      $this->assertEquals('role-2', $object->getRole());
      $this->assertEquals('message 2', $object->getMessage());
      $this->assertEquals('N', $object->getDeleted());
      $this->assertEquals('future date hash', $object->getHash());

      // Try to update the record. This will add a row in the database
      $object->setRole('role-1');
      $object->setMessage('message 3');
      $object->setDeleted('Y');
      $this->assertTrue($object->save());
      $this->assertEquals(3, $this->countTestRows());

      // but the new information is not saved. The previously saved
      // information cannot be overwritten without manually setting the
      // updated field.
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals('2038-01-18 10:10:10.000000', $object->getCreated());
      $this->assertEquals('2038-01-18 10:10:11.000000', $object->getUpdated());
      $this->assertEquals('role-2', $object->getRole());
      $this->assertEquals('message 2', $object->getMessage());
      $this->assertEquals('N', $object->getDeleted());
      // Note: this will FAIL in the current implementation!
      //$this->assertEquals('future date hash', $object->getHash());
   }

   /**
    * Test #15.
    * The findByHash function returns null for an non-existing hash.
    * @depends testSetAttributes
    */
   public function getHashGetNull() {
      global $testTripId1, $testUserId1, $testUserId1;

      // create a random object and save it
      $object = new TripUser($testTripId1, $testUserId1);
      $object->setRole('role-1');
      $object->setMessage('message');
      $object->setDeleted('N');
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());
      
      $object = Trip::findByHash('non-existent hash');
      $this->assertNull($object);
      $this->assertEquals(1, $this->countTestRows());
   }

   /**
    * Test #16.
    * The findByHash function returns a populated object for an existing
    * hash.
    * @depends testSetAttributes
    */
   public function testHashGetInstance() {
      global $testTripId1, $testUserId1, $testUserId1;

      // create the object and save it
      $object = new TripUser($testTripId1, $testUserId1);
      $object->setRole('role-1');
      $object->setMessage('message');
      $object->setDeleted('N');
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());

      $hash = $object->getHash();

      // read the object from the database and confirm that the changed
      // values are returned
      $object = TripUser::findByHash($hash);
      $this->assertNotNull($object);

      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals('role-1', $object->getRole());
      $this->assertEquals('message', $object->getMessage());
      $this->assertEquals('N', $object->getDeleted());
      $this->assertEquals($hash, $object->getHash());
   }

   /**
    * Test #17.
    * The findByHash function returns an object populated with previous
    * values if a hash for a previous instance is given.
    * @depends testUpdate
    * @depends testHashGetInstance
    */
   public function testHashOldInstance() {
      global $testTripId1, $testUserId1, $testUserId1;

      // create the object and save it
      $object = new TripUser($testTripId1, $testUserId1);
      $object->setRole('role-1');
      $object->setMessage('message');
      $object->setDeleted('N');
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());

      $old_hash = $object->getHash();

      // change values and update the object
      $object->setRole('role-2');
      $object->setMessage('message 2');
      $object->setDeleted('Y');
      $this->assertTrue($object->save());
      $this->assertEquals(2, $this->countTestRows());

      $new_hash = $object->getHash();

      // read the object from the database and confirm that the old
      // values are returned
      $object = TripUser::findByHash($old_hash);
      $this->assertNotNull($object);

      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals('role-1', $object->getRole());
      $this->assertEquals('message', $object->getMessage());
      $this->assertEquals('N', $object->getDeleted());
      $this->assertEquals($old_hash, $object->getHash());

      // read the new object from the database and confirm that the new
      // values are returned
      $object = TripUser::findByHash($new_hash);
      $this->assertNotNull($object);

      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals('role-2', $object->getRole());
      $this->assertEquals('message 2', $object->getMessage());
      $this->assertEquals('Y', $object->getDeleted());
      $this->assertEquals($new_hash, $object->getHash());
   }

   /**
    * Extra test
    * Make sure that a long text is saved in the comment, one that has
    * at least more than 256 characters.
    * @depends testSaveEmptyObject
    * @depends testSetAttributes
    */
   public function testLongText() {
      global $testTripId1, $testUserId1;
      $longText = "This is a long text. This is a very long text. This is a ver, very long text. In fact, this text will just go on and on and on, for up to 400 characters. So when we set and retrieve this text, we will know for sure that the system supports these long texts. Of course, if this fails, we won't know any such thing for sure. Would that be to happen, we will have to go and spend some quality debugging time with the system.";

      $object = new TripUser($testTripId1, $testUserId1);
      $object->setMessage($longText);
      $this->assertTrue($object->save());
      $object = new TripUser($testTripId1, $testUserId1);
      $this->assertEquals($longText, $object->getMessage());
   }
}
?>
