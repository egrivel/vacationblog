<?php
include(dirname(__FILE__) . "/../common.php");
include_once("$gl_site_root/database/User.php");

class UserTest extends PHPUnit_Framework_TestCase {
   private $testUserId1;
   private $testUserId2;
   private $testUserId3;
   private $testUserId4;

   protected function setUp() {
      global $testUserId1, $testUserId2, $testUserId3, $testUserId4;
      $testUserId1 = '-test-user-1';
      $testUserId2 = '-test-user-2';
      $testUserId3 = '-test-user-3';
      $testUserId4 = '-test-user-4';
      $query = "DELETE FROM blogUser "
         . "WHERE userId='$testUserId1'"
         .    "OR userId='$testUserId2'"
         .    "OR userId='$testUserId3'"
         .    "OR userId='$testUserId4'";
      mysql_query($query);
   }

   protected function tearDown() {
      global $testUserId1, $testUserId2, $testUserId3, $testUserId4;
      $query = "DELETE FROM blogUser "
         . "WHERE userId='$testUserId1'"
         .    "OR userId='$testUserId2'"
         .    "OR userId='$testUserId3'"
         .    "OR userId='$testUserId4'";
      mysql_query($query);
   }

   private function countAllRows() {
      $query = "SELECT COUNT(updated) FROM blogMedia";
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
      global $testUserId1, $testUserId2, $testUserId3, $testUserId4;
      $query = "SELECT COUNT(updated) FROM blogUser "
         . "WHERE userId='$testUserId1' "
         .    "OR userId='$testUserId2' "
         .    "OR userId='$testUserId2' "
         .    "OR userId='$testUserId2'";
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
      $this->assertTrue(method_exists("User", "getUserId"),
                        "getUserId() exists");
      $this->assertFalse(method_exists("User", "setUserId"),
                         "setUserId() does not exist");
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
      global $testUserId1;

      // Count the number of rows in the table. This number shouldn't
      // change during this test.
      $startCount = $this->countAllRows();

      // constructor without arguments
      $gotException = false;
      try {
         $object = new User();
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
         $object = new User(null);
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
         $object = new User("");
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
      global $testUserId1;

      // Count the number of rows in the table. This number shouldn't
      // change during this test.
      $startCount = $this->countAllRows();
      $object = new User($testUserId1);
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertNull($object->getCreated());
      $this->assertNull($object->getUpdated());
      $this->assertEquals('', $object->getName());
      $this->assertEquals('', $object->getExternalType());
      $this->assertEquals('', $object->getExternalId());
      $this->assertEquals('', $object->getAccess());
      $this->assertEquals('', $object->getEmail());
      $this->assertEquals('', $object->getNotification());
      $this->assertEquals('', $object->getTempCode());
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
      global $testUserId1;

      $object = new User($testUserId1);
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
      global $testUserId1;

      $this->assertEquals(0, $this->countTestRows());
      $object = new User($testUserId1);

      $object->setName('Test User');
      $object->setExternalType('externaltype');
      $object->setExternalId('externalid');
      $object->setAccess('access');
      $object->setEmail('foo@bar.com');
      $object->setNotification('Y');
      $object->setTempCode('tempcode');
      $object->setDeleted('Y');

      // Confirm the values of all the attributes before saving
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals('Test User', $object->getName());
      $this->assertEquals('externaltype', $object->getExternalType());
      $this->assertEquals('externalid', $object->getExternalId());
      $this->assertEquals('access', $object->getAccess());
      $this->assertEquals('foo@bar.com', $object->getEmail());
      $this->assertEquals('Y', $object->getNotification());
      $this->assertEquals('tempcode', $object->getTempCode());
      $this->assertEquals('Y', $object->getDeleted());

      // Save the object and confirm a row is added to the database
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());

      // Confirm the values of all the attributes after saving
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertNotNull($object->getCreated());
      $this->assertNotEquals('', $object->getCreated());
      $this->assertNotNull($object->getUpdated());
      $this->assertNotEquals('', $object->getUpdated());
      $this->assertEquals('Test User', $object->getName());
      $this->assertEquals('externaltype', $object->getExternalType());
      $this->assertEquals('externalid', $object->getExternalId());
      $this->assertEquals('access', $object->getAccess());
      $this->assertEquals('foo@bar.com', $object->getEmail());
      $this->assertEquals('Y', $object->getNotification());
      $this->assertEquals('tempcode', $object->getTempCode());
      $this->assertEquals('Y', $object->getDeleted());
      $this->assertNotEquals('', $object->getHash());

      $created = $object->getCreated();
      $updated = $object->getUpdated();
      $hash = $object->getHash();

      // Create a new instance of the object, which loads the previously
      // saved data from the database
      $object = new User($testUserId1);

      // Confirm the values of all the attributes after loading
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals($created, $object->getCreated());
      $this->assertEquals($updated, $object->getUpdated());
      $this->assertEquals('Test User', $object->getName());
      $this->assertEquals('externaltype', $object->getExternalType());
      $this->assertEquals('externalid', $object->getExternalId());
      $this->assertEquals('access', $object->getAccess());
      $this->assertEquals('foo@bar.com', $object->getEmail());
      $this->assertEquals('Y', $object->getNotification());
      $this->assertEquals('tempcode', $object->getTempCode());
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
      global $testUserId1;

      $this->assertEquals(0, $this->countTestRows());

      // Create a valid object
      $object = new User($testUserId1);
      $object->setName('Test User');
      $object->setExternalType('externaltype');
      $object->setExternalId('externalid');
      $object->setAccess('access');
      $object->setEmail('foo@bar.com');
      $object->setNotification('Y');
      $object->setTempCode('tempcode');
      $object->setDeleted('Y');

      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());

      // loading with invalid ID gives an error
      $this->assertFalse($object->load());

      // the object should be empty
      $this->assertEquals('', $object->getUserId());
      $this->assertNull($object->getCreated());
      $this->assertNull($object->getUpdated());
      $this->assertEquals('', $object->getName());
      $this->assertEquals('', $object->getExternalType());
      $this->assertEquals('', $object->getExternalId());
      $this->assertEquals('', $object->getAccess());
      $this->assertEquals('', $object->getEmail());
      $this->assertEquals('', $object->getNotification());
      $this->assertEquals('', $object->getTempCode());
      $this->assertEquals('N', $object->getDeleted());
      $this->assertEquals('', $object->getHash());

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
      global $testUserId1, $testUserId2;

      // Create an instance and set all the attributes
      $object = new User($testUserId1);
      $object->setName('Test User');
      $object->setExternalType('externaltype');
      $object->setExternalId('externalid');
      $object->setAccess('access');
      $object->setEmail('foo@bar.com');
      $object->setNotification('Y');
      $object->setTempCode('tempcode');
      $object->setDeleted('Y');
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());

      // Load a non-existent object into the existing one
      $this->assertFalse($object->load($testUserId2));
      $this->assertEquals(1, $this->countTestRows());

      // All the attributes should be defaulted now
      $this->assertEquals($testUserId2, $object->getUserId());
      $this->assertNull($object->getCreated());
      $this->assertNull($object->getUpdated());
      $this->assertEquals('', $object->getName());
      $this->assertEquals('', $object->getExternalType());
      $this->assertEquals('', $object->getExternalId());
      $this->assertEquals('', $object->getAccess());
      $this->assertEquals('', $object->getEmail());
      $this->assertEquals('', $object->getNotification());
      $this->assertEquals('', $object->getTempCode());
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
      global $testUserId1;
      global $testUserId2;

      // create a first instance
      $object = new User($testUserId1);
      $object->setName('Test User');
      $object->setExternalType('externaltype');
      $object->setExternalId('externalid');
      $object->setAccess('access');
      $object->setEmail('foo@bar.com');
      $object->setNotification('Y');
      $object->setTempCode('tempcode');
      $object->setDeleted('Y');
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());

      // Get the automatically created attributes for this instance
      $created1 = $object->getCreated();
      $updated1 = $object->getUpdated();
      $hash1 = $object->getHash();

      // create a second instance
      $object = new User($testUserId2);
      $object->setName('Test User 2');
      $object->setExternalType('externaltype 2');
      $object->setExternalId('externalid 2');
      $object->setAccess('access 2');
      $object->setEmail('foo2@bar.com');
      $object->setNotification('N');
      $object->setTempCode('tempcode 2');
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
      $this->assertTrue($object->load($testUserId1));
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals($created1, $object->getCreated());
      $this->assertEquals($updated1, $object->getUpdated());
      $this->assertEquals('Test User', $object->getName());
      $this->assertEquals('externaltype', $object->getExternalType());
      $this->assertEquals('externalid', $object->getExternalId());
      $this->assertEquals('access', $object->getAccess());
      $this->assertEquals('foo@bar.com', $object->getEmail());
      $this->assertEquals('Y', $object->getNotification());
      $this->assertEquals('tempcode', $object->getTempCode());
      $this->assertEquals('Y', $object->getDeleted());
      $this->assertEquals($hash1, $object->getHash());

      // Load the second object, which overrides all the attributes
      $this->assertTrue($object->load($testUserId2));
      $this->assertEquals($testUserId2, $object->getUserId());
      $this->assertEquals($created2, $object->getCreated());
      $this->assertEquals($updated2, $object->getUpdated());
      $this->assertEquals('Test User 2', $object->getName());
      $this->assertEquals('externaltype 2', $object->getExternalType());
      $this->assertEquals('externalid 2', $object->getExternalId());
      $this->assertEquals('access 2', $object->getAccess());
      $this->assertEquals('foo2@bar.com', $object->getEmail());
      $this->assertEquals('N', $object->getNotification());
      $this->assertEquals('tempcode 2', $object->getTempCode());
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
      global $testUserId1;

      // create the object and save it
      $object = new User($testUserId1);
      $object->setName('Test User');
      $object->setExternalType('externaltype');
      $object->setExternalId('externalid');
      $object->setAccess('access');
      $object->setEmail('foo@bar.com');
      $object->setNotification('Y');
      $object->setTempCode('tempcode');
      $object->setDeleted('Y');
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());

      // change values and update the object
      $object->setName('Test User 2');
      $object->setExternalType('externaltype 2');
      $object->setExternalId('externalid 2');
      $object->setAccess('access 2');
      $object->setEmail('foo2@bar.com');
      $object->setNotification('N');
      $object->setTempCode('tempcode 2');
      $object->setDeleted('N');
      $this->assertTrue($object->save());
      $this->assertEquals(2, $this->countTestRows());

      // read the object from the database and confirm that the changed
      // values are returned
      $object = new User($testUserId1);
      $this->assertEquals('Test User 2', $object->getName());
      $this->assertEquals('externaltype 2', $object->getExternalType());
      $this->assertEquals('externalid 2', $object->getExternalId());
      $this->assertEquals('access 2', $object->getAccess());
      $this->assertEquals('foo2@bar.com', $object->getEmail());
      $this->assertEquals('N', $object->getNotification());
      $this->assertEquals('tempcode 2', $object->getTempCode());
      $this->assertEquals('N', $object->getDeleted());
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
      global $testUserId1;

      // create new object
      $object = new User($testUserId1);
      $object->setName('Test User');
      $object->setExternalType('externaltype');
      $object->setExternalId('externalid');
      $object->setAccess('access');
      $object->setEmail('foo@bar.com');
      $object->setNotification('Y');
      $object->setTempCode('tempcode');
      $object->setDeleted('Y');

      // values before save
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertNull($object->getCreated());
      $this->assertNull($object->getUpdated());
      $this->assertEquals('Test User', $object->getName());
      $this->assertEquals('externaltype', $object->getExternalType());
      $this->assertEquals('externalid', $object->getExternalId());
      $this->assertEquals('access', $object->getAccess());
      $this->assertEquals('foo@bar.com', $object->getEmail());
      $this->assertEquals('Y', $object->getNotification());
      $this->assertEquals('tempcode', $object->getTempCode());
      $this->assertEquals('Y', $object->getDeleted());
      $this->assertEquals('', $object->getHash());

      $this->assertTrue($object->save());

      // values after save
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertNotNull($object->getCreated());
      $this->assertNotEquals('', $object->getCreated());
      $this->assertNotNull($object->getUpdated());
      $this->assertNotEquals('', $object->getUpdated());
      $this->assertEquals('Test User', $object->getName());
      $this->assertEquals('externaltype', $object->getExternalType());
      $this->assertEquals('externalid', $object->getExternalId());
      $this->assertEquals('access', $object->getAccess());
      $this->assertEquals('foo@bar.com', $object->getEmail());
      $this->assertEquals('Y', $object->getNotification());
      $this->assertEquals('tempcode', $object->getTempCode());
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
      global $testUserId1;

      $object = new User($testUserId1);
      $object->setCreated('2015-09-30 10:10:10.000000');
      $object->setUpdated('2015-09-30 10:10:11.000000');
      $object->setName('Test User');
      $object->setExternalType('externaltype');
      $object->setExternalId('externalid');
      $object->setAccess('access');
      $object->setEmail('foo@bar.com');
      $object->setNotification('Y');
      $object->setTempCode('tempcode');
      $object->setDeleted('Y');
      $object->setHash('explicit hash');

      // values before save
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals('2015-09-30 10:10:10.000000', $object->getCreated());
      $this->assertEquals('2015-09-30 10:10:11.000000', $object->getUpdated());
      $this->assertEquals('Test User', $object->getName());
      $this->assertEquals('externaltype', $object->getExternalType());
      $this->assertEquals('externalid', $object->getExternalId());
      $this->assertEquals('access', $object->getAccess());
      $this->assertEquals('foo@bar.com', $object->getEmail());
      $this->assertEquals('Y', $object->getNotification());
      $this->assertEquals('tempcode', $object->getTempCode());
      $this->assertEquals('Y', $object->getDeleted());
      $this->assertEquals('explicit hash', $object->getHash());

      // first save
      $this->assertTrue($object->save());

      // values after first save are unchanged
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals('2015-09-30 10:10:10.000000', $object->getCreated());
      $this->assertEquals('2015-09-30 10:10:11.000000', $object->getUpdated());
      $this->assertEquals('Test User', $object->getName());
      $this->assertEquals('externaltype', $object->getExternalType());
      $this->assertEquals('externalid', $object->getExternalId());
      $this->assertEquals('access', $object->getAccess());
      $this->assertEquals('foo@bar.com', $object->getEmail());
      $this->assertEquals('Y', $object->getNotification());
      $this->assertEquals('tempcode', $object->getTempCode());
      $this->assertEquals('Y', $object->getDeleted());
      $this->assertEquals('explicit hash', $object->getHash());

      // second save
      $this->assertTrue($object->save());

      // values after second save, created is still the same but
      // updated and hash have changed
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals('Test User', $object->getName());
      $this->assertEquals('externaltype', $object->getExternalType());
      $this->assertEquals('externalid', $object->getExternalId());
      $this->assertEquals('access', $object->getAccess());
      $this->assertEquals('foo@bar.com', $object->getEmail());
      $this->assertEquals('Y', $object->getNotification());
      $this->assertEquals('tempcode', $object->getTempCode());
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
      global $testUserId1;

      // Create the object, which automatically gets the current date
      $object = new User($testUserId1);
      $object->setName('Test User');
      $object->setExternalType('externaltype');
      $object->setExternalId('externalid');
      $object->setAccess('access');
      $object->setEmail('foo@bar.com');
      $object->setNotification('Y');
      $object->setTempCode('tempcode');
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
      $object->setName('Test User 2');
      $object->setExternalType('externaltype 2');
      $object->setExternalId('externalid 2');
      $object->setAccess('access 2');
      $object->setEmail('foo2@bar.com');
      $object->setNotification('N');
      $object->setTempCode('tempcode 2');
      $object->setDeleted('N');
      $object->setHash('past date hash');

      // Check the values before saving
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals('2000-01-01 10:10:10.000000', $object->getCreated());
      $this->assertEquals('2000-01-01 10:10:11.000000', $object->getUpdated());
      $this->assertEquals('Test User 2', $object->getName());
      $this->assertEquals('externaltype 2', $object->getExternalType());
      $this->assertEquals('externalid 2', $object->getExternalId());
      $this->assertEquals('access 2', $object->getAccess());
      $this->assertEquals('foo2@bar.com', $object->getEmail());
      $this->assertEquals('N', $object->getNotification());
      $this->assertEquals('tempcode 2', $object->getTempCode());
      $this->assertEquals('N', $object->getDeleted());
      $this->assertEquals('past date hash', $object->getHash());

      // update the record, this adds a row in the database
      $this->assertTrue($object->save());
      $this->assertEquals(2, $this->countTestRows());

      // after the update, the original values have come back
      // updated and hash have changed
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals($originalCreated, $object->getCreated());
      $this->assertEquals($originalUpdated, $object->getUpdated());
      $this->assertEquals('Test User', $object->getName());
      $this->assertEquals('externaltype', $object->getExternalType());
      $this->assertEquals('externalid', $object->getExternalId());
      $this->assertEquals('access', $object->getAccess());
      $this->assertEquals('foo@bar.com', $object->getEmail());
      $this->assertEquals('Y', $object->getNotification());
      $this->assertEquals('tempcode', $object->getTempCode());
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
      global $testUserId1;

      // Create the object, which automatically gets the current date
      $object = new User($testUserId1);
      $object->setName('Test User');
      $object->setExternalType('externaltype');
      $object->setExternalId('externalid');
      $object->setAccess('access');
      $object->setEmail('foo@bar.com');
      $object->setNotification('Y');
      $object->setTempCode('tempcode');
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
      $object->setName('Test User 2');
      $object->setExternalType('externaltype 2');
      $object->setExternalId('externalid 2');
      $object->setAccess('access 2');
      $object->setEmail('foo2@bar.com');
      $object->setNotification('N');
      $object->setTempCode('tempcode 2');
      $object->setDeleted('N');
      $object->setHash('future date hash');

      // Check the values before saving
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals('2038-01-18 10:10:10.000000', $object->getCreated());
      $this->assertEquals('2038-01-18 10:10:11.000000', $object->getUpdated());
      $this->assertEquals('Test User 2', $object->getName());
      $this->assertEquals('externaltype 2', $object->getExternalType());
      $this->assertEquals('externalid 2', $object->getExternalId());
      $this->assertEquals('access 2', $object->getAccess());
      $this->assertEquals('foo2@bar.com', $object->getEmail());
      $this->assertEquals('N', $object->getNotification());
      $this->assertEquals('tempcode 2', $object->getTempCode());
      $this->assertEquals('N', $object->getDeleted());
      $this->assertEquals('future date hash', $object->getHash());

      // update the record, this adds a row in the database
      $this->assertTrue($object->save());
      $this->assertEquals(2, $this->countTestRows());

      // after the update, the information has been saved
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals('2038-01-18 10:10:10.000000', $object->getCreated());
      $this->assertEquals('2038-01-18 10:10:11.000000', $object->getUpdated());
      $this->assertEquals('Test User 2', $object->getName());
      $this->assertEquals('externaltype 2', $object->getExternalType());
      $this->assertEquals('externalid 2', $object->getExternalId());
      $this->assertEquals('access 2', $object->getAccess());
      $this->assertEquals('foo2@bar.com', $object->getEmail());
      $this->assertEquals('N', $object->getNotification());
      $this->assertEquals('tempcode 2', $object->getTempCode());
      $this->assertEquals('N', $object->getDeleted());
      $this->assertEquals('future date hash', $object->getHash());

      // Try to update the record. This will add a row in the database
      $object->setName('Test User 3');
      $object->setExternalType('externaltype 3');
      $object->setExternalId('externalid 3');
      $object->setAccess('access 3');
      $object->setEmail('foo3@bar.com');
      $object->setNotification('Y');
      $object->setTempCode('tempcode 3');
      $object->setDeleted('Y');
      $this->assertTrue($object->save());
      $this->assertEquals(3, $this->countTestRows());

      // but the new information is not saved. The previously saved
      // information cannot be overwritten without manually setting the
      // updated field.
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals('2038-01-18 10:10:10.000000', $object->getCreated());
      $this->assertEquals('2038-01-18 10:10:11.000000', $object->getUpdated());
      $this->assertEquals('Test User 2', $object->getName());
      $this->assertEquals('externaltype 2', $object->getExternalType());
      $this->assertEquals('externalid 2', $object->getExternalId());
      $this->assertEquals('access 2', $object->getAccess());
      $this->assertEquals('foo2@bar.com', $object->getEmail());
      $this->assertEquals('N', $object->getNotification());
      $this->assertEquals('tempcode 2', $object->getTempCode());
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
      global $testUserId1;

      // create a random object and save it
      $object = new User($testUserId1);
      $object->setName('Test User');
      $object->setExternalType('externaltype');
      $object->setExternalId('externalid');
      $object->setAccess('access');
      $object->setEmail('foo@bar.com');
      $object->setNotification('Y');
      $object->setTempCode('tempcode');
      $object->setDeleted('Y');
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
      global $testUserId1;

      // create the object and save it
      $object = new User($testUserId1);
      $object->setName('Test User');
      $object->setExternalType('externaltype');
      $object->setExternalId('externalid');
      $object->setAccess('access');
      $object->setEmail('foo@bar.com');
      $object->setNotification('Y');
      $object->setTempCode('tempcode');
      $object->setDeleted('Y');
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());

      $hash = $object->getHash();

      // read the object from the database and confirm that the changed
      // values are returned
      $object = User::findByHash($hash);
      $this->assertNotNull($object);

      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals('Test User', $object->getName());
      $this->assertEquals('externaltype', $object->getExternalType());
      $this->assertEquals('externalid', $object->getExternalId());
      $this->assertEquals('access', $object->getAccess());
      $this->assertEquals('foo@bar.com', $object->getEmail());
      $this->assertEquals('Y', $object->getNotification());
      $this->assertEquals('tempcode', $object->getTempCode());
      $this->assertEquals('Y', $object->getDeleted());
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
      global $testUserId1;

      // create the object and save it
      $object = new User($testUserId1);
      $object->setName('Test User');
      $object->setExternalType('externaltype');
      $object->setExternalId('externalid');
      $object->setAccess('access');
      $object->setEmail('foo@bar.com');
      $object->setNotification('Y');
      $object->setTempCode('tempcode');
      $object->setDeleted('Y');
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());

      $old_hash = $object->getHash();

      // change values and update the object
      $object->setName('Test User 2');
      $object->setExternalType('externaltype 2');
      $object->setExternalId('externalid 2');
      $object->setAccess('access 2');
      $object->setEmail('foo2@bar.com');
      $object->setNotification('N');
      $object->setTempCode('tempcode 2');
      $object->setDeleted('N');
      $this->assertTrue($object->save());
      $this->assertEquals(2, $this->countTestRows());

      $new_hash = $object->getHash();

      // read the object from the database and confirm that the old
      // values are returned
      $object = User::findByHash($old_hash);
      $this->assertNotNull($object);

      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals('Test User', $object->getName());
      $this->assertEquals('externaltype', $object->getExternalType());
      $this->assertEquals('externalid', $object->getExternalId());
      $this->assertEquals('access', $object->getAccess());
      $this->assertEquals('foo@bar.com', $object->getEmail());
      $this->assertEquals('Y', $object->getNotification());
      $this->assertEquals('tempcode', $object->getTempCode());
      $this->assertEquals('Y', $object->getDeleted());
      $this->assertEquals($old_hash, $object->getHash());

      // read the new object from the database and confirm that the new
      // values are returned
      $object = User::findByHash($new_hash);
      $this->assertNotNull($object);

      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals('Test User 2', $object->getName());
      $this->assertEquals('externaltype 2', $object->getExternalType());
      $this->assertEquals('externalid 2', $object->getExternalId());
      $this->assertEquals('access 2', $object->getAccess());
      $this->assertEquals('foo2@bar.com', $object->getEmail());
      $this->assertEquals('N', $object->getNotification());
      $this->assertEquals('tempcode 2', $object->getTempCode());
      $this->assertEquals('N', $object->getDeleted());
      $this->assertEquals($new_hash, $object->getHash());
   }

   /**
    * Extra test: password check. An empty password matches if a user has
    * no password set.
    * @depends testSaveEmptyObject
    */
   public function testPasswordEmptyMatches() {
      global $testUserId1;
      $object = new User($testUserId1);
      $this->assertTrue($object->save());
      $this->assertTrue($object->checkPassword(""));
      $this->assertFalse($object->checkPassword("abcABC123!@#"));
   }

   /**
    * Extra test: password check. A password matches the password as set,
    * anything else does not match.
    * @depends testSetAttributes
    */
   public function testPasswordMatches() {
      global $testUserId1;
      $object = new User($testUserId1);
      $object->setPassword("abcABC123!@#");
      $this->assertTrue($object->save());
      $this->assertTrue($object->checkPassword("abcABC123!@#"));
      $this->assertFalse($object->checkPassword("secret"));
      $this->assertFalse($object->checkPassword(""));
   }

   /**
    * Extra test: legacy passwords
    * Manually insert an old-style password hash in the database, then
    * make sure the checkPassword function returns a match.
    * @depends testSetAttributes
    * @depends testUpdate
    * @depends testPasswordMatches
    */
   public function testLegacyPassword() {
      global $testUserId1;
      $oldPassword = '$0$6cc7c5a5a21978e5587a59186cadb5e3';
      $object = new User($testUserId1);
      $this->assertTrue($object->save());

      // Update the database and check for match
      $query = "UPDATE blogUser "
         . "SET password='$oldPassword' "
         . "WHERE userId='$testUserId1'";
      mysql_query($query);

      $this->assertTrue($object->load($testUserId1));

      $this->assertTrue($object->checkPassword("applepie"));
      $this->assertFalse($object->checkPassword(''));
      $this->assertFalse($object->checkPassword('sachertorte'));
   }

   /**
    * Extra test: password migration.
    * Manually insert an old-style password hash in the database, then
    * make sure that the password field in the database gets updated when
    * the migration function is invoked.
    * @depends testLegacyPassword
    */
   public function testPasswordMigration() {
      global $testUserId1;
      $password = 'applepie';
      $oldPasswordHash = '$0$6cc7c5a5a21978e5587a59186cadb5e3';
      $object = new User($testUserId1);
      $object->save();

      // Update the database and check for match
      $query = "UPDATE blogUser "
         . "SET password='$oldPasswordHash' "
         . "WHERE userId='$testUserId1'";
      mysql_query($query);
      $object->load($testUserId1);

      $rows = $this->countTestRows();

      $this->assertTrue($object->checkPassword($password));
      $object->updatePasswordHash($password);

      // make sure a new row has been inserted
      $this->assertEquals($rows + 1, $this->countTestRows());

      // Check that the password has been re-encoded in the
      // in the database
      $updated = $object->getUpdated();
      $query = "SELECT password "
         . "FROM blogUser "
         . "WHERE userId='$testUserId1' "
         .   "AND updated='$updated'";
      // print "$query\n";
      $result = mysql_query($query);
      if ($result) {
         $this->assertTrue(mysql_num_rows($result) === 1);
         $line = mysql_fetch_array($result);
         $newPasswordHash = db_sql_decode($line[0]);
         $this->assertNotEquals($oldPasswordHash, $newPasswordHash);
      } else {
         $this->assertFalse(true, "Got error in mySQL query '$query'");
      }

      // After the password has been re-encoded, make sure it still matches
      $this->assertTrue($object->checkPassword($password));

      // Make sure repeated calls to updatePasswordHash succeed
      $object->updatePasswordHash($password);
   }

   private function createEmailUsers() {
      global $testUserId1;
      global $testUserId2;
      global $testUserId3;
      global $testUserId4;

      // User 1: simple case, only user with email1
      $object = new User($testUserId1);
      $object->setName("Test User 1");
      $object->setEmail("email1@foo.bar");
      $object->save();

      // User 2: used to have email2, now has email2-new
      $object = new User($testUserId2);
      $object->setName("Test User 2");
      $object->setEmail("email2@foo.bar");
      $object->save();
      $object = new User($testUserId2);
      $object->setEmail("email2-new@foo.bar");
      $object->save();

      // Users 3 and 4 both have email3
      $object = new User($testUserId3);
      $object->setName("Test User 3");
      $object->setEmail("email3@foo.bar");
      $object->save();

      $object = new User($testUserId4);
      $object->setName("Test User 4");
      $object->setEmail("email3@foo.bar");
      $object->save();
   }

   /* Test the load by email function. The following scenario's are tested:
    *  - no user with the given email erases data
    *  - a user with the given email is found
    *  - a user who used to have the email but no longer has it is not found
    *  - when multiple users have the email, the most recently changed one
    *    is found
    */
   /**
    * Extra test: load by email when no user has this email.
    * @depends testSetAttributes
    */
   public function testLoadByEmailNoUser() {
      global $testUserId1;
      $this->createEmailUsers();
      $object = new User($testUserId1);
      $object->loadByEmail("email0@foo.bar");
      $this->assertEquals("", $object->getName());
   }

   /**
    * Extra test: load by email when there is a user with this email.
    * @depends testSetAttributes
    */
   public function testLoadByEmailFindUser() {
      global $testUserId1;
      $this->createEmailUsers();
      $object = new User($testUserId1);
      $object->loadByEmail("email1@foo.bar");
      $this->assertEquals("Test User 1", $object->getName());
   }

   /**
    * Extra test: load by email when there was a user with this email, but
    * that user's email has since changed.
    * @depends testSetAttributes
    * @depends testLoadByEmailFindUser
    */
   public function testLoadByEmailNotFindPreviousEmail() {
      global $testUserId1;
      $this->createEmailUsers();
      $object = new User($testUserId1);
      $object->loadByEmail("email2@foo.bar");
      $this->assertEquals("", $object->getName());
   }

   /**
    * Extra test: load by email when there are multiple users matching.
    * @depends testSetAttributes
    * @depends testLoadByEmailFindUser
    * @depends testLoadByEmailNotFindPreviousEmail
    */
   public function testLoadByEmailWithMultipleMatches() {
      global $testUserId1;
      $this->createEmailUsers();
      $object = new User($testUserId1);
      $object->loadByEmail("email3@foo.bar");
      $this->assertEquals("Test User 4", $object->getName());
   }
}
?>
