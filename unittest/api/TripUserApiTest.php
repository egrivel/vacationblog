<?php
include(dirname(__FILE__) . "/../common.php");
include_once("$gl_site_root/database/Trip.php");
include_once("$gl_site_root/database/TripUser.php");

class TripUserApiTest extends PHPUnit_Framework_TestCase {
   private $testTripId1;
   private $testTripId2;
   private $testUserId1;
   private $testUserId2;

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
      global $testUserId1, $testUserId2;
      $testUserId1 = '-test-tripUser-1';
      $testUserId2 = '-test-tripUser-2';
      $query = "DELETE FROM blogTripUser "
         . " WHERE userId='$testUserId1'"
         .    " OR userId='$testUserId2'";
      mysql_query($query);
   }

   protected function tearDown() {
      global $testUserId1, $testUserId2;
      $query = "DELETE FROM blogTripUser "
         . " WHERE userId='$testUserId1'"
         .    " OR userId='$testUserId2'";
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
      global $testUserId1, $testUserId2;
      $query = "SELECT COUNT(updated) FROM blogTripUser"
         . " WHERE userId='$testUserId1'"
         .   " OR userId='$testUserId2'";
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
      $result = getApi('getTripUser.php', $data);
      $this->assertEquals('401', $result['resultCode']);
   }

   /**
    * Test #3. GET request with incomplete parameters.
    */
   public function testGetIncompleteParameter() {
      global $testTripId1, $testUserId1;

      $data = array('tripId'=>null);
      $result = getApi('getTripUser.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $data = array('tripId'=>'');
      $result = getApi('getTripUser.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $data = array('userId'=>null);
      $result = getApi('getTripUser.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $data = array('userId'=>'');
      $result = getApi('getTripUser.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $data = array('tripId'=>$testTripId1,
                    'userId'=>null);
      $result = getApi('getTripUser.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $data = array('tripId'=>$testTripId1,
                    'userId'=>'');
      $result = getApi('getTripUser.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $data = array('tripId'=>null,
                    'userId'=>$testUserId1);
      $result = getApi('getTripUser.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $data = array('tripId'=>'',
                    'userId'=>$testUserId1);
      $result = getApi('getTripUser.php', $data);
      $this->assertEquals('401', $result['resultCode']);
   }

   /**
    * Test #4. GET request for non-existent object.
    * @depends testDataWipedBeforeTest
    */
   public function testGetNonExistent() {
      global $testTripId1, $testUserId1;
      $data = array('tripId'=>$testTripId1,
                    'userId'=>$testUserId1);
      $result = getApi('getTripUser.php', $data);
      $this->assertEquals('404', $result['resultCode']);
   }

   /**
    * Test #5. GET request for an existent object.
    * @depends testDataWipedBeforeTest
    */
   public function testGetExistent() {
      global $testTripId1;
      global $testUserId1;

      $this->assertEquals(0, $this->countTestRows());

      // Create the object and set attributes
      $object = new TripUser($testTripId1, $testUserId1);
      $object->setRole('maintainer');
      $object->setMessage('Message 1');
      $object->setDeleted('Y');

      // Save the object and confirm a row is added to the database
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());
      
      $data = array('tripId'=>$testTripId1,
                    'userId'=>$testUserId1);

      $result = getApi('getTripUser.php', $data);
      $this->assertEquals('200', $result['resultCode']);

      $this->assertTrue(isset($result['tripId']));
      $this->assertTrue(isset($result['userId']));
      $this->assertTrue(isset($result['created']));
      $this->assertTrue(isset($result['updated']));
      $this->assertTrue(isset($result['role']));
      $this->assertTrue(isset($result['message']));
      $this->assertTrue(isset($result['deleted']));
      // hash field is not returned by GET
      $this->assertFalse(isset($result['hash']));

      $this->assertEquals($testTripId1, $result['tripId']);
      $this->assertEquals($testUserId1, $result['userId']);
      $this->assertEquals($object->getCreated(), $result['created']);
      $this->assertEquals($object->getUpdated(), $result['updated']);
      $this->assertEquals('maintainer', $result['role']);
      $this->assertEquals('Message 1', $result['message']);
      $this->assertEquals('Y', $result['deleted']);
   }

   /**
    * Test #6. PUT request with no parameters.
    */
   public function testPutNoParameters() {
      $this->assertEquals(0, $this->countTestRows());

      $data = array();
      $result = putApi('putTripUser.php', $data);
      $this->assertEquals('401', $result['resultCode']);
   }
      
   /**
    * Test #7. PUT request with invalid parameters.
    */
   public function testPutInvalidParameters() {
      $this->assertEquals(0, $this->countTestRows());

      $data = array('tripId'=>null,
                    'userId'=>null);
      $result = putApi('putTripUser.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $this->assertEquals(0, $this->countTestRows());

      $data = array('tripId'=>'',
                    'userId'=>'');
      $result = putApi('putTripUser.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $this->assertEquals(0, $this->countTestRows());
   }
      
   /**
    * Test #8. PUT request create new object.
    */
   public function testPutCreate() {
      global $testTripId1;
      global $testUserId1;

      $this->assertEquals(0, $this->countTestRows());

      $data = array('tripId'=>$testTripId1,
                    'userId'=>$testUserId1,
                    'created'=>'2015-10-01',
                    'updated'=>'2015-10-02',
                    'role'=>'maintainer',
                    'message'=>'Message TripUser 1',
                    'deleted'=>'Y',
                    'hash'=>'forced hash');
      $result = putApi('putTripUser.php', $data);
      $this->assertEquals('200', $result['resultCode']);

      $this->assertEquals(1, $this->countTestRows());

      $object = new TripUser($testTripId1, $testUserId1);
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testUserId1, $object->getUserId());
      // Created and updated fields can NOT be set by the PUT command;
      // the automatic values are set, not the ones passed
      $this->assertNotNull($object->getCreated());
      $this->assertNotEquals('', $object->getCreated());
      $this->assertNotEquals('2015-10-01', $object->getCreated());
      $this->assertNotNull($object->getUpdated());
      $this->assertNotEquals('', $object->getUpdated());
      $this->assertNotEquals('2015-10-02', $object->getUpdated());
      $this->assertEquals('maintainer', $object->getRole());
      $this->assertEquals('Message TripUser 1', $object->getMessage());
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
   public function testUpdateTripUser() {
      global $testTripId1;
      global $testUserId1;

      $object = new TripUser($testTripId1, $testUserId1);
      $object->setRole("photo");
      $object->setMessage("Message TripUser 1");
      $object->setDeleted('N');
      $object->save();

      $this->assertEquals(1, $this->countTestRows());

      $data = array('tripId'=>$testTripId1,
                    'userId'=>$testUserId1,
                    'created'=>'2015-10-01',
                    'updated'=>'2015-10-02',
                    'role'=>'movie',
                    'message'=>'Message TripUser 2',
                    'deleted'=>'Y',
                    'hash'=>'forced hash');
      $result = putApi('putTripUser.php', $data);
      $this->assertEquals('200', $result['resultCode']);

      $this->assertEquals(2, $this->countTestRows());

      $object = new TripUser($testTripId1, $testUserId1);
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testUserId1, $object->getUserId());
      $this->assertEquals('movie', $object->getRole());
      $this->assertEquals('Message TripUser 2', $object->getMessage());
      $this->assertEquals('Y', $object->getDeleted());
   }

   /**
    * Test #10. SYNCH get with invalid parameters
    * @depends testDataWipedBeforeTest
    */
   public function testSynchGetInvalid() {
      $data = array();
      $result = getApi('synchTripUser.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $data = array('hash'=>'');
      $result = getApi('synchTripUser.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $data = array('hash'=>'non-existent');
      $result = getApi('synchTripUser.php', $data);
      $this->assertEquals('404', $result['resultCode']);
   }

   /**
    * Test #11. SYNCH get an existent object.
    * @depends testDataWipedBeforeTest
    * @depends testGetExistent
    */
   public function testSynchGet() {
      global $testTripId1;
      global $testUserId1;

      // Create the object and set attributes
      $object = new TripUser($testTripId1, $testUserId1);
      $object->setRole('maintainer');
      $object->setMessage('Message 1');
      $object->setDeleted('Y');

      // Save the object and confirm a row is added to the database
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());
      
      $data = array('hash'=>$object->getHash());
      $result = getApi('synchTripUser.php', $data);
      $this->assertEquals('200', $result['resultCode']);

      $this->assertTrue(isset($result['tripId']));
      $this->assertTrue(isset($result['userId']));
      $this->assertTrue(isset($result['created']));
      $this->assertTrue(isset($result['updated']));
      $this->assertTrue(isset($result['role']));
      $this->assertTrue(isset($result['message']));
      $this->assertTrue(isset($result['deleted']));
      $this->assertTrue(isset($result['hash']));

      $this->assertEquals($testTripId1, $result['tripId']);
      $this->assertEquals($testUserId1, $result['userId']);
      $this->assertEquals($object->getCreated(), $result['created']);
      $this->assertEquals($object->getUpdated(), $result['updated']);
      $this->assertEquals('maintainer', $result['role']);
      $this->assertEquals('Message 1', $result['message']);
      $this->assertEquals('Y', $result['deleted']);
      $this->assertEquals($object->getHash(), $result['hash']);
   }

   /**
    * Test #12. SYNCH put request without data.
    */
   public function testSynchPutInvalid() {
      global $testTripId1;
      global $testUserId1;

      $this->assertEquals(0, $this->countTestRows());

      $data = array();
      $result = putApi('synchTripUser.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $data = array('tripId'=>'');
      $result = getApi('synchTripUser.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $data = array('userId'=>'');
      $result = getApi('synchTripUser.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $data = array('tripId'=>$testTripId1);
      $result = getApi('synchTripUser.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $data = array('userId'=>$testUserId1);
      $result = getApi('synchTripUser.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $data = array('tripId'=>$testTripId1,
                    'userId'=>'');
      $result = getApi('synchTripUser.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $data = array('tripId'=>'',
                    'userId'=>$testUserId1);
      $result = getApi('synchTripUser.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $this->assertEquals(0, $this->countTestRows());
   }
      
   /**
    * Test #13. SYNCH request write new object.
    */
   public function testSynchPut() {
      global $testTripId1, $testUserId1;

      $this->assertEquals(0, $this->countTestRows());

      $data = array('tripId'=>$testTripId1,
                    'userId'=>$testUserId1,
                    'created'=>'2015-10-01',
                    'updated'=>'2015-10-02',
                    'role'=>'maintainer',
                    'message'=>'Message TripUser 1',
                    'deleted'=>'Y',
                    'hash'=>'forced hash');
      $result = putApi('synchTripUser.php', $data);
      $this->assertEquals('200', $result['resultCode']);

      $this->assertEquals(1, $this->countTestRows());

      $object = new TripUser($testTripId1, $testUserId1);
      $this->assertEquals('2015-10-01 00:00:00.000000', $object->getCreated());
      $this->assertEquals('2015-10-02 00:00:00.000000', $object->getUpdated());
      $this->assertEquals('maintainer', $object->getRole());
      $this->assertEquals('Message TripUser 1', $object->getMessage());
      $this->assertEquals("Y", $object->getDeleted());
      $this->assertEquals('forced hash', $object->getHash());
   }
}
?>
