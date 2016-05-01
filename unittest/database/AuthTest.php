<?php
include(dirname(__FILE__) . "/../common.php");
include_once("$gl_site_root/database/Auth.php");

class AuthTest extends PHPUnit_Framework_TestCase {
   private $testAuthId1;
   private $testAuthId2;
   private $testUserId1;
   private $testUserId2;

   protected function setUp() {
      global $testAuthId1, $testAuthId2;
      global $testUserId1, $testUserId2;

      $testAuthId1 = '-test-auth-1';
      $testAuthId2 = '-test-auth-2';
      $query = "DELETE FROM blogAuth "
         . "WHERE authId='$testAuthId1'"
         .    "OR authId='$testAuthId2'";
      mysql_query($query);

      $testUserId1 = '-test-user-1';
      $testUserId2 = '-test-user-2';
   }

   protected function tearDown() {
      global $testAuthId1, $testAuthId2;
      global $testUserId1, $testUserId2;

      $query = "DELETE FROM blogAuth "
         . "WHERE authId='$testAuthId1'"
         .    "OR authId='$testAuthId2'";
      mysql_query($query);
   }

   private function countAllRows() {
      $query = "SELECT COUNT(updated) FROM blogAuth";
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
      global $testAuthId1, $testAuthId2;
      $query = "SELECT COUNT(updated) FROM blogAuth "
         . "WHERE authId='$testAuthId1' "
         .    "OR authId='$testAuthId2'";
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
      $this->assertTrue(method_exists("Auth", "getAuthId"),
                        "getAuthId() exists");
      $this->assertFalse(method_exists("Auth", "setAuthId"),
                         "setAuthId() does not exist");
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
      global $testAuthId1;

      // Count the number of rows in the table. This number shouldn't
      // change during this test.
      $startCount = $this->countAllRows();

      // constructor without arguments
      $gotException = false;
      try {
         $object = new Auth();
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
         $object = new Auth(null);
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
         $object = new Auth("");
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
      global $testAuthId1;

      // Count the number of rows in the table. This number shouldn't
      // change during this test.
      $startCount = $this->countAllRows();
      $object = new Auth($testAuthId1);
      $this->assertEquals($testAuthId1, $object->getAuthId());
      $this->assertNull($object->getCreated());
      $this->assertNull($object->getUpdated());
      $this->assertEquals('', $object->getUserId());
      $this->assertEquals('', $object->getExpiration());

      $this->assertEquals($startCount, $this->countAllRows());
   }

   /**
    * test #5.
    * Save an empty object results in a row being added to the database
    * and the created and updated fields getting a value. Since
    * this is the first instance, the created and updated both have the
    * same value.
    * @depends testCreateGivesEmptyObject
    */
   public function testSaveEmptyObject() {
      global $testAuthId1;

      $object = new Auth($testAuthId1);
      $this->assertEquals(0, $this->countTestRows());

      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());

      $this->assertNotNull($object->getCreated());
      $this->assertNotEquals('', $object->getCreated());
      $this->assertNotNull($object->getUpdated());
      $this->assertNotEquals('', $object->getUpdated());

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
      global $testAuthId1;
      global $testUserId1;

      $this->assertEquals(0, $this->countTestRows());

      // Create the object and set attributes
      $object = new Auth($testAuthId1);
      $object->setUserId($testUserId1);
      $object->setExpiration('2015-09-30');

      // Confirm the values of all the attributes before saving
      $this->assertEquals($testAuthId1, $object->getAuthId());
      $this->assertNull($object->getCreated());
      $this->assertNull($object->getUpdated());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals('2015-09-30', $object->getExpiration());

      // Save the object and confirm a row is added to the database
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());

      // Confirm the values of all the attributes after saving
      $this->assertEquals($testAuthId1, $object->getAuthId());
      $this->assertNotNull($object->getCreated());
      $this->assertNotEquals('', $object->getCreated());
      $this->assertNotNull($object->getUpdated());
      $this->assertNotEquals('', $object->getUpdated());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals('2015-09-30', $object->getExpiration());

      $created = $object->getCreated();
      $updated = $object->getUpdated();

      // Create a new instance of the object, which loads the previously
      // saved data from the database
      $object = new Auth($testAuthId1);

      // Confirm the values of all the attributes after loading
      $this->assertEquals($testAuthId1, $object->getAuthId());
      $this->assertEquals($created, $object->getCreated());
      $this->assertEquals($updated, $object->getUpdated());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals('2015-09-30', $object->getExpiration());
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
      global $testAuthId1;
      global $testUserId1;

      $this->assertEquals(0, $this->countTestRows());

      // Create a valid object
      $object = new Auth($testAuthId1);
      $object->setExpiration('2015-09-30');
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());

      // loading with invalid ID gives an error
      $this->assertFalse($object->load());

      // the object should be empty
      $this->assertEquals('', $object->getAuthId());
      $this->assertEquals('', $object->getAuthId());
      $this->assertNull($object->getCreated());
      $this->assertNull($object->getUpdated());
      $this->assertEquals('', $object->getUserId());
      $this->assertEquals('', $object->getExpiration());

      // the object cannot be saved
      $this->assertFalse($object->save());

      // no row has been added to the database
      $this->assertEquals(1, $this->countTestRows());

      // loading with other invalid ID combinations also gives an error
      $this->assertFalse($object->load(null));

      $this->assertFalse($object->load(''));
   }

   /**
    * test #8.
    * Loading a valid but not-existing key blanks out all the attributes.
    * The load() function returns false, indicating no data was found.
    * @depends testSaveEmptyObject
    * @depends testSetAttributes
    */
   public function testLoadNonExistent() {
      global $testAuthId1, $testUserId1;
      global $testAuthId2, $testUserId2;

      // Create an instance and set all the attributes
      $object = new Auth($testAuthId1);
      $object->setUserId($testUserId1);
      $object->setExpiration('2015-09-30');
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());

      // Load a non-existent object into the existing one
      $this->assertFalse($object->load($testAuthId2));
      $this->assertEquals(1, $this->countTestRows());

      // All the attributes should be defaulted now
      $this->assertEquals($testAuthId2, $object->getAuthId());
      $this->assertNull($object->getCreated());
      $this->assertNull($object->getUpdated());
      $this->assertEquals('', $object->getUserId());
      $this->assertEquals('', $object->getExpiration());
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
      global $testAuthId1, $testUserId1;
      global $testAuthId2, $testUserId2;

      // create a first instance
      $object = new Auth($testAuthId1);
      $object->setUserId($testUserId1);
      $object->setExpiration('2015-09-30');
      $object->save();
      $this->assertEquals(1, $this->countTestRows());

      // Get the automatically created attributes for this instance
      $created1 = $object->getCreated();
      $updated1 = $object->getUpdated();

      // create a second instance
      $object = new Auth($testAuthId2);
      $object->setUserId($testUserId2);
      $object->setExpiration('2015-10-01');
      $object->save();
      $this->assertEquals(2, $this->countTestRows());

      // Get the automatically created attributes for this instance, and
      // make sure they are different from those of the first instance.
      $created2 = $object->getCreated();
      $updated2 = $object->getUpdated();
      $this->assertNotEquals($created1, $created2);
      $this->assertNotEquals($updated1, $updated2);

      // Load the first object, which overrides all the attributes
      $this->assertTrue($object->load($testAuthId1));
      $this->assertEquals($testAuthId1, $object->getAuthId());
      $this->assertEquals($created1, $object->getCreated());
      $this->assertEquals($updated1, $object->getUpdated());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals('2015-09-30', $object->getExpiration());

      // Load the second object, which overrides all the attributes
      $this->assertTrue($object->load($testAuthId2));
      $this->assertEquals($testAuthId2, $object->getAuthId());
      $this->assertEquals($created2, $object->getCreated());
      $this->assertEquals($updated2, $object->getUpdated());
      $this->assertEquals($testUserId2, $object->getUserId());
      $this->assertEquals('2015-10-01', $object->getExpiration());
   }

   /**
    * test #10.
    * Updating data creates a new row in the database, and aferwards the
    * new data is returned instead of the old data.
    * @depends testSaveEmptyObject
    * @depends testSetAttributes
    */
   public function testUpdate() {
      global $testAuthId1, $testUserId1;
      global $testUserId2;

      // create the object and save it
      $object = new Auth($testAuthId1);
      $object->setUserId($testUserId1);
      $object->setExpiration('2015-09-30');
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());

      // change values and update the object
      $object->setUserId($testUserId2);
      $object->setExpiration('2015-10-01');
      $this->assertTrue($object->save());
      $this->assertEquals(2, $this->countTestRows());

      // read the object from the database and confirm that the changed
      // values are returned
      $object = new Auth($testAuthId1);
      $this->assertEquals($testUserId2, $object->getUserId());
      $this->assertEquals('2015-10-01', $object->getExpiration());
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
      global $testAuthId1, $testUserId1;

      // create new object
      $object = new Auth($testAuthId1);
      $object->setUserId($testUserId1);
      $object->setExpiration('2015-09-30');

      // values before save
      $this->assertEquals($testAuthId1, $object->getAuthId());
      $this->assertNull($object->getCreated());
      $this->assertNull($object->getUpdated());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals('2015-09-30', $object->getExpiration());

      $this->assertTrue($object->save());

      // values after save
      $this->assertEquals($testAuthId1, $object->getAuthId());
      $this->assertEquals($testAuthId1, $object->getAuthId());
      $this->assertNotNull($object->getCreated());
      $this->assertNotEquals('', $object->getCreated());
      $this->assertNotNull($object->getUpdated());
      $this->assertNotEquals('', $object->getUpdated());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals('2015-09-30', $object->getExpiration());

      // after initial save, created and updated are the same
      $created = $object->getCreated();
      $updated = $object->getUpdated();
      $this->assertEquals($created, $updated);

      // save again without changing any data
      $this->assertTrue($object->save());

      // after second save, created is still the same but updated
      // and hash are different
      $this->assertEquals($created, $object->getCreated());
      $this->assertNotEquals($updated, $object->getUpdated());
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
      global $testAuthId1, $testUserId1;

      $object = new Auth($testAuthId1);
      $object->setCreated('2015-09-30 10:10:10.000000');
      $object->setUpdated('2015-09-30 10:10:11.000000');
      $object->setUserId($testUserId1);
      $object->setExpiration('2015-09-30');

      // values before save
      $this->assertEquals($testAuthId1, $object->getAuthId());
      $this->assertEquals('2015-09-30 10:10:10.000000', $object->getCreated());
      $this->assertEquals('2015-09-30 10:10:11.000000', $object->getUpdated());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals('2015-09-30', $object->getExpiration());

      // first save
      $this->assertTrue($object->save());

      // values after first save are unchanged
      $this->assertEquals($testAuthId1, $object->getAuthId());
      $this->assertEquals('2015-09-30 10:10:10.000000', $object->getCreated());
      $this->assertEquals('2015-09-30 10:10:11.000000', $object->getUpdated());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals('2015-09-30', $object->getExpiration());

      // second save
      $this->assertTrue($object->save());

      // values after second save, created is still the same but
      // updated and hash have changed
      $this->assertEquals($testAuthId1, $object->getAuthId());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals('2015-09-30 10:10:10.000000', $object->getCreated());
      $this->assertNotEquals('2015-09-30 10:10:11.000000', $object->getUpdated());
      $this->assertEquals('2015-09-30', $object->getExpiration());
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
      global $testAuthId1, $testUserId1;
      global $testUserId2;

      // Create the object, which automatically gets the current date
      $object = new Auth($testAuthId1);
      $object->setUserId($testUserId1);
      $object->setExpiration('2015-09-30');
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());

      $originalCreated = $object->getCreated();
      $originalUpdated = $object->getUpdated();

      // Change the object with different values, using a guaranteed
      // past date for the Created and Updated fields.
      // values after first save are unchanged
      $object->setCreated('2000-01-01 10:10:10.000000');
      $object->setUpdated('2000-01-01 10:10:11.000000');
      $object->setUserId($testUserId2);
      $object->setExpiration('2015-10-01');

      // Check the values before saving
      $this->assertEquals($testAuthId1, $object->getAuthId());
      $this->assertEquals('2000-01-01 10:10:10.000000', $object->getCreated());
      $this->assertEquals('2000-01-01 10:10:11.000000', $object->getUpdated());
      $this->assertEquals($testUserId2, $object->getUserId());
      $this->assertEquals('2015-10-01', $object->getExpiration());

      // update the record, this adds a row in the database
      $this->assertTrue($object->save());
      $this->assertEquals(2, $this->countTestRows());

      // after the update, the original values have come back
      // updated and hash have changed
      $this->assertEquals($testAuthId1, $object->getAuthId());
      $this->assertEquals($originalCreated, $object->getCreated());
      $this->assertEquals($originalUpdated, $object->getUpdated());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals('2015-09-30', $object->getExpiration());
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
      global $testAuthId1, $testUserId1;
      global $testUserId2;

      // Create the object, which automatically gets the current date
      $object = new Auth($testAuthId1);
      $object->setUserId($testUserId1);
      $object->setExpiration('2015-09-30');
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());

      $originalCreated = $object->getCreated();
      $originalUpdated = $object->getUpdated();

      // Change the object with different values, using a guaranteed
      // future date for the Created and Updated fields. Note that
      // the mySQL timestamp values allow for dates up to January 19,
      // 2038. Select as the future date for this test January 18, 2038
      // values after first save are unchanged
      $object->setCreated('2038-01-18 10:10:10.000000');
      $object->setUpdated('2038-01-18 10:10:11.000000');
      $object->setUserId($testUserId2);
      $object->setExpiration('2015-10-01');

      // Check the values before saving
      $this->assertEquals($testAuthId1, $object->getAuthId());
      $this->assertEquals('2038-01-18 10:10:10.000000', $object->getCreated());
      $this->assertEquals('2038-01-18 10:10:11.000000', $object->getUpdated());
      $this->assertEquals($testUserId2, $object->getUserId());
      $this->assertEquals('2015-10-01', $object->getExpiration());

      // update the record, this adds a row in the database
      $this->assertTrue($object->save());
      $this->assertEquals(2, $this->countTestRows());

      // after the update, the information has been saved
      $this->assertEquals($testAuthId1, $object->getAuthId());
      $this->assertEquals('2038-01-18 10:10:10.000000', $object->getCreated());
      $this->assertEquals('2038-01-18 10:10:11.000000', $object->getUpdated());
      $this->assertEquals($testUserId2, $object->getUserId());
      $this->assertEquals('2015-10-01', $object->getExpiration());

      // Try to update the record. This will add a row in the database
      $object->setExpiration('2015-09-30');
      $object->setUserId($testUserId1);
      $this->assertTrue($object->save());
      $this->assertEquals(3, $this->countTestRows());

      // but the new information is not saved. The previously saved
      // information cannot be overwritten without manually setting the
      // updated field.
      $this->assertEquals($testAuthId1, $object->getAuthId());
      $this->assertEquals('2038-01-18 10:10:10.000000', $object->getCreated());
      $this->assertEquals('2038-01-18 10:10:11.000000', $object->getUpdated());
      $this->assertEquals($testUserId2, $object->getUserId());
      $this->assertEquals('2015-10-01', $object->getExpiration());
      // Note: this will FAIL in the current implementation!
      //$this->assertEquals('future date hash', $object->getHash());
   }

   /**
    * Extra test. Generate auth ID gives unique ID.
    */
   public function testGenerateAuthId() {
      // Try the tests here a whole bunch of times
      for ($i = 0; $i < 100; $i++) {
        $firstId = Auth::generateAuthId();
        $secondId = Auth::generateAuthId();
        $this->assertTrue(strlen($firstId) > 60,
          'first auth ID at least 60 chars');
        $this->assertTrue(strlen($firstId) <= 64,
          'first auth ID at most 64 chars');
        $this->assertTrue(strlen($secondId) > 60,
          'second auth ID at least 60 chars');
        $this->assertTrue(strlen($secondId) <= 64,
          'second auth ID at most 60 chars');
        $this->assertNotEquals($firstId, $secondId);
      }
   }
}
?>
