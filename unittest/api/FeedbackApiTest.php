<?php
include(dirname(__FILE__) . "/../common.php");
include_once("$gl_site_root/database/Trip.php");
include_once("$gl_site_root/database/User.php");
include_once("$gl_site_root/database/Feedback.php");

class FeedbackApiTest extends PHPUnit_Framework_TestCase {
   private $testTripId1;
   private $testTripId2;
   private $testUserId1;
   private $testUserId2;
   private $testReferenceId1;
   private $testReferenceId2;

   public static function setUpBeforeClass() {
      global $testTripId1, $testTripId2;
      global $testUserId1, $testUserId2;
      $testTripId1 = '-test-trip-1';
      $testTripId2 = '-test-trip-2';
      $testUserId1 = '-test-user-1';
      $testUserId2 = '-test-user-2';
      $query = "DELETE FROM blogTrip "
         . " WHERE tripId='$testTripId1'"
         .    " OR tripId='$testTripId2'";
      mysql_query($query);
      $query = "DELETE FROM blogUser "
         . " WHERE userId='$testUserId1'"
         .    " OR userId='$testUserId2'";
      mysql_query($query);
      $object = new Trip($testTripId1);
      $object = new Trip($testTripId2);
      $object = new User($testUserId1);
      $object = new User($testUserId2);

      setupTokens();
   }

   public static function tearDownAfterClass() {
      global $testTripId1, $testTripId2;
      global $testUserId1, $testUserId2;
      $query = "DELETE FROM blogTrip "
         . " WHERE tripId='$testTripId1'"
         .    " OR tripId='$testTripId2'";
      mysql_query($query);
      $query = "DELETE FROM blogUser "
         . " WHERE userId='$testUserId1'"
         .    " OR userId='$testUserId2'";
      mysql_query($query);
   }

   protected function setUp() {
      global $testReferenceId1, $testReferenceId2;
      $testReferenceId1 = '-test-reference-1';
      $testReferenceId2 = '-test-reference-2';
      $query = "DELETE FROM blogFeedback "
         . " WHERE referenceId='$testReferenceId1'"
         .    " OR referenceId='$testReferenceId2'";
      mysql_query($query);
   }

   protected function tearDown() {
      global $testReferenceId1, $testReferenceId2;
      $query = "DELETE FROM blogFeedback "
         . " WHERE referenceId='$testReferenceId1'"
         .    " OR referenceId='$testReferenceId2'";
      mysql_query($query);
   }

   private function countAllRows() {
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
   }

   private function countTestRows() {
      global $testReferenceId1, $testReferenceId2;
      $query = "SELECT COUNT(updated) FROM blogFeedback"
         . " WHERE referenceId='$testReferenceId1'"
         .   " OR referenceId='$testReferenceId2'";
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
      $result = getApi('getFeedback.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);
   }

   /**
    * Test #3. GET request with incomplete parameters.
    */
   public function testGetIncompleteParameter() {
      $data = array('referenceId'=>null);
      $result = getApi('getFeedback.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $data = array('referenceId'=>'');
      $result = getApi('getFeedback.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);
   }

   /**
    * Test #4. GET request for non-existent object.
    * @depends testDataWipedBeforeTest
    */
   public function testGetNonExistent() {
      global $testTripId1, $testReferenceId1, $testUserId1;
      $data = array('tripId'=>$testTripId1,
                    'referenceId'=>$testReferenceId1,
                    'userId'=>$testUserId1);
      $result = getApi('getFeedback.php', $data);
      $this->assertEquals(RESPONSE_NOT_FOUND, $result['resultCode']);
   }

   /**
    * Test #5. GET request for an existent object.
    * @depends testDataWipedBeforeTest
    */
   public function testGetExistent() {
      global $testTripId1;
      global $testReferenceId1;
      global $testUserId1;

      $this->assertEquals(0, $this->countTestRows());

      // Create the object and set attributes
      $object = new Feedback($testTripId1, $testReferenceId1, $testUserId1);
      $object->setType('-type-1');
      $object->setDeleted('Y');

      // Save the object and confirm a row is added to the database
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());

      $data = array('tripId'=>$testTripId1,
                    'referenceId'=>$testReferenceId1,
                    'userId'=>$testUserId1);

      $result = getApi('getFeedback.php', $data);
      $this->assertEquals(RESPONSE_SUCCESS, $result['resultCode']);

      $this->assertTrue(isset($result['tripId']));
      $this->assertTrue(isset($result['referenceId']));
      $this->assertTrue(isset($result['userId']));
      $this->assertTrue(isset($result['created']));
      $this->assertTrue(isset($result['updated']));
      $this->assertTrue(isset($result['type']));
      $this->assertTrue(isset($result['deleted']));
      // hash field is not returned by GET
      $this->assertFalse(isset($result['hash']));

      $this->assertEquals($testTripId1, $result['tripId']);
      $this->assertEquals($testReferenceId1, $result['referenceId']);
      $this->assertEquals($testUserId1, $result['userId']);
      $this->assertEquals($object->getCreated(), $result['created']);
      $this->assertEquals($object->getUpdated(), $result['updated']);
      $this->assertEquals('-type-1', $result['type']);
      $this->assertEquals('Y', $result['deleted']);
   }

   /**
    * Test #5a. GET not allowed
    * @depends testGetExistent
    */
   public function testGetNotAllowed() {
      global $synchAuthToken;
      global $testTripId1;
      global $testReferenceId1;
      global $testUserId1;

      $this->assertEquals(0, $this->countTestRows());

      // Create the object and set attributes
      $object = new Feedback($testTripId1, $testReferenceId1, $testUserId1);
      $object->setType('-type-1');
      $object->setDeleted('Y');

      // Save the object and confirm a row is added to the database
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());

      $data = array('tripId'=>$testTripId1,
                    'referenceId'=>$testReferenceId1,
                    'userId'=>$testUserId1);

      $result = getApi('getFeedback.php', $data, $synchAuthToken);
      $this->assertEquals(RESPONSE_UNAUTHORIZED, $result['resultCode']);
   }

   /**
    * Test #5b. GET with PUT call
    * @depends testGetExistent
    */
   public function testGetWithPutCall() {
      global $testTripId1;
      global $testReferenceId1;
      global $testUserId1;

      $this->assertEquals(0, $this->countTestRows());

      // Create the object and set attributes
      $object = new Feedback($testTripId1, $testReferenceId1, $testUserId1);
      $object->setType('-type-1');
      $object->setDeleted('Y');

      // Save the object and confirm a row is added to the database
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());

      $data = array('tripId'=>$testTripId1,
                    'referenceId'=>$testReferenceId1,
                    'userId'=>$testUserId1);

      $result = putApi('getFeedback.php', $data);
      $this->assertEquals(RESPONSE_METHOD_NOT_ALLOWED, $result['resultCode']);
   }

   /**
    * Test #6. PUT request with no parameters.
    */
   public function testPutNoParameters() {
      $this->assertEquals(0, $this->countTestRows());

      $data = array();
      $result = putApi('putFeedback.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);
   }

   /**
    * Test #7. PUT request with invalid parameters.
    */
   public function testPutInvalidParameters() {
      $this->assertEquals(0, $this->countTestRows());

      $data = array('tripId'=>null,
                    'referenceId'=>null,
                    'userId'=>null);
      $result = putApi('putFeedback.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $this->assertEquals(0, $this->countTestRows());

      $data = array('tripId'=>'',
                    'referenceId'=>'',
                    'userId'=>'');
      $result = putApi('putFeedback.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $this->assertEquals(0, $this->countTestRows());
   }

   /**
    * Test #8. PUT request create new object.
    */
   public function testPutCreate() {
      global $visitorUser, $visitorAuthToken;
      global $testTripId1;
      global $testReferenceId1;

      $this->assertEquals(0, $this->countTestRows());

      $data = array('tripId'=>$testTripId1,
                    'referenceId'=>$testReferenceId1,
                    'created'=>'2015-10-01',
                    'updated'=>'2015-10-02',
                    'type'=>'-type-1',
                    'deleted'=>'Y',
                    'hash'=>'forced hash');
      $result = putApi('putFeedback.php', $data, $visitorAuthToken);
      $this->assertEquals(RESPONSE_SUCCESS, $result['resultCode']);

      $this->assertEquals(1, $this->countTestRows());

      $object = new Feedback($testTripId1, $testReferenceId1, $visitorUser);
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testReferenceId1, $object->getReferenceId());
      $this->assertEquals($visitorUser, $object->getUserId());
      // Created and updated fields can NOT be set by the PUT command;
      // the automatic values are set, not the ones passed
      $this->assertNotNull($object->getCreated());
      $this->assertNotEquals('', $object->getCreated());
      $this->assertNotEquals('2015-10-01', $object->getCreated());
      $this->assertNotNull($object->getUpdated());
      $this->assertNotEquals('', $object->getUpdated());
      $this->assertNotEquals('2015-10-02', $object->getUpdated());
      $this->assertEquals('-type-1', $object->getType());
      $this->assertEquals("Y", $object->getDeleted());
      // Hash field can NOT be set by the PUT command; the hash is
      // computed automatically
      $this->assertNotNull($object->getHash());
      $this->assertNotEquals('', $object->getHash());
      $this->assertNotEquals('forced hash', $object->getHash());
   }

   /**
    * Test 8a. PUT authorization
    * @depends testPutCreate
    */
   public function testPutAuthorization() {
      global $visitorAuthToken, $synchAuthToken;
      global $testTripId1;
      global $testReferenceId1;

      $this->assertEquals(0, $this->countTestRows());

      $data = array('tripId'=>$testTripId1,
                    'referenceId'=>$testReferenceId1,
                    'created'=>'2015-10-01',
                    'updated'=>'2015-10-02',
                    'type'=>'-type-1',
                    'deleted'=>'Y',
                    'hash'=>'forced hash');
      // With auth token this succeeds
      $result = putApi('putFeedback.php', $data, $visitorAuthToken);
      $this->assertEquals(RESPONSE_SUCCESS, $result['resultCode']);

      // Without auth token this fails
      $result = putApi('putFeedback.php', $data);
      $this->assertEquals(RESPONSE_UNAUTHORIZED, $result['resultCode']);

      // Synch user doesn't have access
      $result = putApi('putFeedback.php', $data, $synchAuthToken);
      $this->assertEquals(RESPONSE_UNAUTHORIZED, $result['resultCode']);
   }

   /**
    * Test #9. PUT request update existing object.
    * @depends testPutCreate
    */
   public function testUpdateFeedback() {
      global $visitorUser, $visitorAuthToken;
      global $testTripId1;
      global $testReferenceId1;

      $object = new Feedback($testTripId1, $testReferenceId1, $visitorUser);
      $object->setType("-type-1");
      $object->setDeleted('N');
      $object->save();

      $this->assertEquals(1, $this->countTestRows());

      $data = array('tripId'=>$testTripId1,
                    'referenceId'=>$testReferenceId1,
                    'created'=>'2015-10-01',
                    'updated'=>'2015-10-02',
                    'type'=>'-type-2',
                    'deleted'=>'Y',
                    'hash'=>'forced hash');
      $result = putApi('putFeedback.php', $data, $visitorAuthToken);
      $this->assertEquals(RESPONSE_SUCCESS, $result['resultCode']);

      $this->assertEquals(2, $this->countTestRows());

      $object = new Feedback($testTripId1, $testReferenceId1, $visitorUser);
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testReferenceId1, $object->getReferenceId());
      $this->assertEquals($visitorUser, $object->getUserId());
      $this->assertEquals('-type-2', $object->getType());
      $this->assertEquals('Y', $object->getDeleted());
   }

   /**
    * Test #9a. Calling PUT API with GET method fails
    * @depends testPutCreate
    */
   public function testPutWithGetCall() {
      global $visitorAuthToken, $synchAuthToken;
      global $testTripId1;
      global $testReferenceId1;

      $this->assertEquals(0, $this->countTestRows());

      $data = array('tripId'=>$testTripId1,
                    'referenceId'=>$testReferenceId1,
                    'created'=>'2015-10-01',
                    'updated'=>'2015-10-02',
                    'type'=>'-type-1',
                    'deleted'=>'Y',
                    'hash'=>'forced hash');
      // With auth token this succeeds
      $result = getApi('putFeedback.php', $data, $visitorAuthToken);
      $this->assertEquals(RESPONSE_METHOD_NOT_ALLOWED, $result['resultCode']);
   }

   /**
    * Test #10. SYNCH get with invalid parameters
    * @depends testDataWipedBeforeTest
    */
   public function testSynchGetInvalid() {
      global $testTripId1;
      global $testReferenceId1;
      global $testUserId1;
      global $synchAuthToken;

      $data = array();
      $result = getApi('synchFeedback.php', $data, $synchAuthToken);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $data = array('hash'=>'');
      $result = getApi('synchFeedback.php', $data, $synchAuthToken);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $data = array('hash'=>'non-existent');
      $result = getApi('synchFeedback.php', $data, $synchAuthToken);
      $this->assertEquals(RESPONSE_NOT_FOUND, $result['resultCode']);

      $data = array('tripId'=>'');
      $result = getApi('synchFeedback.php', $data, $synchAuthToken);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $data = array('referenceId'=>'');
      $result = getApi('synchFeedback.php', $data, $synchAuthToken);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $data = array('userId'=>'');
      $result = getApi('synchFeedback.php', $data, $synchAuthToken);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $data = array('tripId'=>$testTripId1);
      $result = getApi('synchFeedback.php', $data, $synchAuthToken);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $data = array('referenceId'=>$testReferenceId1);
      $result = getApi('synchFeedback.php', $data, $synchAuthToken);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $data = array('userId'=>$testUserId1);
      $result = getApi('synchFeedback.php', $data, $synchAuthToken);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $data = array('tripId'=>$testTripId1,
                    'referenceId'=>'',
                    'userId'=>'');
      $result = getApi('synchFeedback.php', $data, $synchAuthToken);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $data = array('tripId'=>'',
                    'referenceId'=>$testReferenceId1,
                    'userId'=>'');
      $result = getApi('synchFeedback.php', $data, $synchAuthToken);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $data = array('tripId'=>'',
                    'referenceId'=>'',
                    'userId'=>$testUserId1);
      $result = getApi('synchFeedback.php', $data, $synchAuthToken);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $data = array('tripId'=>$testTripId1,
                    'referenceId'=>$testReferenceId1,
                    'userId'=>$testUserId1);
      $result = headApi('synchFeedback.php', $data, $synchAuthToken);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);
   }

   /**
    * Test #11. SYNCH get an existent object.
    * @depends testDataWipedBeforeTest
    * @depends testGetExistent
    */
   public function testSynchGet() {
      global $testTripId1;
      global $testReferenceId1;
      global $testUserId1;
      global $synchAuthToken;

      // Create the object and set attributes
      $object = new Feedback($testTripId1, $testReferenceId1, $testUserId1);
      $object->setType('-type-1');
      $object->setDeleted('Y');

      // Save the object and confirm a row is added to the database
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());

      $data = array('hash'=>$object->getHash());
      $result = getApi('synchFeedback.php', $data, $synchAuthToken);
      $this->assertEquals(RESPONSE_SUCCESS, $result['resultCode']);

      $this->assertTrue(isset($result['tripId']));
      $this->assertTrue(isset($result['referenceId']));
      $this->assertTrue(isset($result['userId']));
      $this->assertTrue(isset($result['created']));
      $this->assertTrue(isset($result['updated']));
      $this->assertTrue(isset($result['type']));
      $this->assertTrue(isset($result['deleted']));
      $this->assertTrue(isset($result['hash']));

      $this->assertEquals($testTripId1, $result['tripId']);
      $this->assertEquals($testReferenceId1, $result['referenceId']);
      $this->assertEquals($testUserId1, $result['userId']);
      $this->assertEquals($object->getCreated(), $result['created']);
      $this->assertEquals($object->getUpdated(), $result['updated']);
      $this->assertEquals('-type-1', $result['type']);
      $this->assertEquals('Y', $result['deleted']);
      $this->assertEquals($object->getHash(), $result['hash']);
   }

   /**
    * @depends testSynchGetInvalid
    */
   public function testSynchGetUnauthorized() {
      global $testTripId1;
      global $testReferenceId1;
      global $testUserId1;
      global $adminAuthToken;

      // Create the object and set attributes
      $object = new Feedback($testTripId1, $testReferenceId1, $testUserId1);
      $object->setType('-type-1');
      $object->setDeleted('Y');

      // Save the object and confirm a row is added to the database
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());

      $data = array('hash'=>$object->getHash());
      $result = getApi('synchFeedback.php', $data, $adminAuthToken);
      $this->assertEquals(RESPONSE_UNAUTHORIZED, $result['resultCode']);
   }

   /**
    * Test #12. SYNCH put request without data.
    */
   public function testSynchPutInvalid() {
      global $testTripId1;
      global $testReferenceId1;
      global $testUserId1;
      global $adminAuthToken;
      global $synchAuthToken;

      $this->assertEquals(0, $this->countTestRows());

      $data = array();
      $result = putApi('synchFeedback.php', $data, $synchAuthToken);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $this->assertEquals(0, $this->countTestRows());
    }

   /**
    * Test #13. SYNCH request write new object.
    */
   public function testSynchPut() {
      global $testTripId1, $testReferenceId1, $testUserId1;
      global $synchAuthToken;

      $this->assertEquals(0, $this->countTestRows());

      $data = array('tripId'=>$testTripId1,
                    'referenceId'=>$testReferenceId1,
                    'userId'=>$testUserId1,
                    'created'=>'2015-10-01',
                    'updated'=>'2015-10-02',
                    'type'=>'-type-1',
                    'deleted'=>'Y',
                    'hash'=>'forced hash');
      $result = putApi('synchFeedback.php', $data, $synchAuthToken);
      $this->assertEquals(RESPONSE_SUCCESS, $result['resultCode']);

      $this->assertEquals(1, $this->countTestRows());

      $object = new Feedback($testTripId1, $testReferenceId1, $testUserId1);
      $this->assertEquals('2015-10-01 00:00:00.000000', $object->getCreated());
      $this->assertEquals('2015-10-02 00:00:00.000000', $object->getUpdated());
      $this->assertEquals('-type-1', $object->getType());
      $this->assertEquals("Y", $object->getDeleted());
      $this->assertEquals('forced hash', $object->getHash());
   }
}
?>
