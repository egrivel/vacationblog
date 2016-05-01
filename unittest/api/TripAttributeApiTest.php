<?php
include(dirname(__FILE__) . "/../common.php");
include_once("$gl_site_root/database/Trip.php");
include_once("$gl_site_root/database/TripAttribute.php");

class TripAttributeApiTest extends PHPUnit_Framework_TestCase {
   private $testTripId1;
   private $testTripId2;
   private $testName1;
   private $testName2;

   public static function setUpBeforeClass() {
      global $testTripId1, $testTripId2;
      $testTripId1 = '-test-trip-1';
      $testTripId2 = '-test-trip-2';
      $query = "DELETE FROM blogTrip "
         . " WHERE tripId='$testTripId1'"
         .    " OR tripId='$testTripId2'";
      mysql_query($query);
      $object = new Trip($testTripId1);
      $object = new Trip($testTripId2);
   }

   public static function tearDownAfterClass() {
      global $testTripId1, $testTripId2;
      $query = "DELETE FROM blogTrip "
         . " WHERE tripId='$testTripId1'"
         .    " OR tripId='$testTripId2'";
      mysql_query($query);
   }

   protected function setUp() {
      global $testName1, $testName2;
      $testName1 = '-test-name-1';
      $testName2 = '-test-name-2';
      $query = "DELETE FROM blogTripAttribute "
         . " WHERE name='$testName1'"
         .    " OR name='$testName2'";
      mysql_query($query);
   }

   protected function tearDown() {
      global $testName1, $testName2;
      $query = "DELETE FROM blogTripAttribute "
         . " WHERE name='$testName1'"
         .    " OR name='$testName2'";
      mysql_query($query);
   }

   private function countAllRows() {
      $query = "SELECT COUNT(updated) FROM blogTripAttribute";
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
      global $testName1, $testName2;
      $query = "SELECT COUNT(updated) FROM blogTripAttribute"
         . " WHERE name='$testName1'"
         .   " OR name='$testName2'";
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
    * Make sure data is wiped before each test.
    */
   public function testDataWipedBeforeTest() {
      $this->assertEquals(0, $this->countTestRows());
   }

   /**
    * Test #2. GET request without parameter.
    */
   public function testGetNoParameter() {
      $data = array();
      $result = getApi('getTripAttribute.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);
   }

   /**
    * Test #3. GET request with incomplete parameters.
    */
   public function testGetIncompleteParameter() {
      $data = array('name'=>null);
      $result = getApi('getTripAttribute.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $data = array('name'=>'');
      $result = getApi('getTripAttribute.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);
   }

   /**
    * Test #4. GET request for non-existent object.
    * @depends testDataWipedBeforeTest
    */
   public function testGetNonExistent() {
      global $testTripId1, $testName1;
      $data = array('tripId'=>$testTripId1,
                    'name'=>$testName1);
      $result = getApi('getTripAttribute.php', $data);
      $this->assertEquals(RESPONSE_NOT_FOUND, $result['resultCode']);
   }

   /**
    * Test #5. GET request for an existent object.
    * @depends testDataWipedBeforeTest
    */
   public function testGetExistent() {
      global $testTripId1;
      global $testName1;

      $this->assertEquals(0, $this->countTestRows());

      // Create the object and set Attributes
      $object = new TripAttribute($testTripId1, $testName1);
      $object->setValue('value');
      $object->setDeleted('Y');

      // Save the object and confirm a row is added to the database
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());

      $data = array('tripId'=>$testTripId1,
                    'name'=>$testName1);

      $result = getApi('getTripAttribute.php', $data);
      $this->assertEquals(RESPONSE_SUCCESS, $result['resultCode']);

      $this->assertTrue(isset($result['tripId']));
      $this->assertTrue(isset($result['name']));
      $this->assertTrue(isset($result['created']));
      $this->assertTrue(isset($result['updated']));
      $this->assertTrue(isset($result['value']));
      $this->assertTrue(isset($result['deleted']));
      // hash field is not returned by GET
      $this->assertFalse(isset($result['hash']));

      $this->assertEquals($testTripId1, $result['tripId']);
      $this->assertEquals($testName1, $result['name']);
      $this->assertEquals($object->getCreated(), $result['created']);
      $this->assertEquals($object->getUpdated(), $result['updated']);
      $this->assertEquals('value', $result['value']);
      $this->assertEquals('Y', $result['deleted']);
   }

   /**
    * Test #6. PUT request with no parameters.
    */
   public function testPutNoParameters() {
      $this->assertEquals(0, $this->countTestRows());

      $data = array();
      $result = putApi('putTripAttribute.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);
   }

   /**
    * Test #7. PUT request with invalid parameters.
    */
   public function testPutInvalidParameters() {
      $this->assertEquals(0, $this->countTestRows());

      $data = array('tripId'=>null,
                    'name'=>null);
      $result = putApi('putTripAttribute.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $this->assertEquals(0, $this->countTestRows());

      $data = array('tripId'=>'',
                    'name'=>'');
      $result = putApi('putTripAttribute.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $this->assertEquals(0, $this->countTestRows());
   }

   /**
    * Test #8. PUT request create new object.
    */
   public function testPutCreate() {
      global $testTripId1;
      global $testName1;

      $this->assertEquals(0, $this->countTestRows());

      $data = array('tripId'=>$testTripId1,
                    'name'=>$testName1,
                    'created'=>'2015-10-01',
                    'updated'=>'2015-10-02',
                    'value'=>'value',
                    'deleted'=>'Y',
                    'hash'=>'forced hash');
      $result = putApi('putTripAttribute.php', $data);
      $this->assertEquals(RESPONSE_SUCCESS, $result['resultCode']);

      $this->assertEquals(1, $this->countTestRows());

      $object = new TripAttribute($testTripId1, $testName1);
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testName1, $object->getName());
      // Created and updated fields can NOT be set by the PUT command;
      // the automatic values are set, not the ones passed
      $this->assertNotNull($object->getCreated());
      $this->assertNotEquals('', $object->getCreated());
      $this->assertNotEquals('2015-10-01', $object->getCreated());
      $this->assertNotNull($object->getUpdated());
      $this->assertNotEquals('', $object->getUpdated());
      $this->assertNotEquals('2015-10-02', $object->getUpdated());
      $this->assertEquals('value', $object->getValue());
      $this->assertEquals("Y", $object->getDeleted());
      // Hash field can NOT be set by the PUT command; the hash is
      // computed automatically
      $this->assertNotNull($object->getHash());
      $this->assertNotEquals('', $object->getHash());
      $this->assertNotEquals('forced hash', $object->getHash());
   }

   /**
    * Test #9. PUT request update existing object.
    * @depends testPutCreate
    */
   public function testUpdateTripAttribute() {
      global $testTripId1;
      global $testName1;

      $object = new TripAttribute($testTripId1, $testName1);
      $object->setValue('value');
      $object->setDeleted('N');
      $object->save();

      $this->assertEquals(1, $this->countTestRows());

      $data = array('tripId'=>$testTripId1,
                    'name'=>$testName1,
                    'created'=>'2015-10-01',
                    'updated'=>'2015-10-02',
                    'value'=>'2015-10-01',
                    'deleted'=>'Y',
                    'hash'=>'forced hash');
      $result = putApi('putTripAttribute.php', $data);
      $this->assertEquals(RESPONSE_SUCCESS, $result['resultCode']);

      $this->assertEquals(2, $this->countTestRows());

      $object = new TripAttribute($testTripId1, $testName1);
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testName1, $object->getName());
      $this->assertEquals('2015-10-01', $object->getValue());
      $this->assertEquals('Y', $object->getDeleted());
   }

   /**
    * Test #10. SYNCH get with invalid parameters
    * @depends testDataWipedBeforeTest
    */
   public function testSynchGetInvalid() {
      $data = array();
      $result = getApi('synchTripAttribute.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $data = array('hash'=>'');
      $result = getApi('synchTripAttribute.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $data = array('hash'=>'non-existent');
      $result = getApi('synchTripAttribute.php', $data);
      $this->assertEquals(RESPONSE_NOT_FOUND, $result['resultCode']);
   }

   /**
    * Test #11. SYNCH get an existent object.
    * @depends testDataWipedBeforeTest
    * @depends testGetExistent
    */
   public function testSynchGet() {
      global $testTripId1;
      global $testName1;

      // Create the object and set Attributes
      $object = new TripAttribute($testTripId1, $testName1);
      $object->setValue('value');
      $object->setDeleted('Y');

      // Save the object and confirm a row is added to the database
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());

      $data = array('hash'=>$object->getHash());
      $result = getApi('synchTripAttribute.php', $data);
      $this->assertEquals(RESPONSE_SUCCESS, $result['resultCode']);

      $this->assertTrue(isset($result['tripId']));
      $this->assertTrue(isset($result['name']));
      $this->assertTrue(isset($result['created']));
      $this->assertTrue(isset($result['updated']));
      $this->assertTrue(isset($result['value']));
      $this->assertTrue(isset($result['deleted']));
      $this->assertTrue(isset($result['hash']));

      $this->assertEquals($testTripId1, $result['tripId']);
      $this->assertEquals($testName1, $result['name']);
      $this->assertEquals($object->getCreated(), $result['created']);
      $this->assertEquals($object->getUpdated(), $result['updated']);
      $this->assertEquals('value', $result['value']);
      $this->assertEquals('Y', $result['deleted']);
      $this->assertEquals($object->getHash(), $result['hash']);
   }

   /**
    * Test #12. SYNCH put request without data.
    */
   public function testSynchPutInvalid() {
      global $testTripId1;
      global $testName1;

      $this->assertEquals(0, $this->countTestRows());

      $data = array();
      $result = putApi('synchTripAttribute.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $data = array('tripId'=>'');
      $result = getApi('synchTripAttribute.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $data = array('name'=>'');
      $result = getApi('synchTripAttribute.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $data = array('tripId'=>$testTripId1);
      $result = getApi('synchTripAttribute.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $data = array('name'=>$testName1);
      $result = getApi('synchTripAttribute.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $data = array('tripId'=>$testTripId1,
                    'name'=>'');
      $result = getApi('synchTripAttribute.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $data = array('tripId'=>'',
                    'name'=>$testName1);
      $result = getApi('synchTripAttribute.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $this->assertEquals(0, $this->countTestRows());
   }

   /**
    * Test #13. SYNCH request write new object.
    */
   public function testSynchPut() {
      global $testTripId1, $testName1;

      $this->assertEquals(0, $this->countTestRows());

      $data = array('tripId'=>$testTripId1,
                    'name'=>$testName1,
                    'created'=>'2015-10-01',
                    'updated'=>'2015-10-02',
                    'value'=>'value',
                    'deleted'=>'Y',
                    'hash'=>'forced hash');
      $result = putApi('synchTripAttribute.php', $data);
      $this->assertEquals(RESPONSE_SUCCESS, $result['resultCode']);

      $this->assertEquals(1, $this->countTestRows());

      $object = new TripAttribute($testTripId1, $testName1);
      $this->assertEquals('2015-10-01 00:00:00.000000', $object->getCreated());
      $this->assertEquals('2015-10-02 00:00:00.000000', $object->getUpdated());
      $this->assertEquals("Y", $object->getDeleted());
      $this->assertEquals('forced hash', $object->getHash());
   }
}
?>
