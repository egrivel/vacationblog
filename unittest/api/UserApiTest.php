<?php
include(dirname(__FILE__) . "/../common.php");
include_once("$gl_site_root/database/User.php");

class UserApiTest extends PHPUnit_Framework_TestCase {
   private $testUserId1;
   private $testUserId2;

   protected function setUp() {
      global $testUserId1, $testUserId2;
      $testUserId1 = '-test-user-1';
      $testUserId2 = '-test-user-2';
      $query = "DELETE FROM blogUser "
         . "WHERE userId='$testUserId1'"
         .    "OR userId='$testUserId2'";
      mysql_query($query);

      setupTokens();
   }

   protected function tearDown() {
      global $testUserId1, $testUserId2;
      $query = "DELETE FROM blogUser "
         . "WHERE userId='$testUserId1'"
         .    "OR userId='$testUserId2'";
      mysql_query($query);
   }

   private function countAllRows() {
      $query = "SELECT COUNT(updated) FROM blogUser";
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
            print "countRows: got result set but not count\n";
         }
      } else {
         print "countRows: did not get result set\n";
      }
      return 0;
   }

   private function countTestRows() {
      global $testUserId1, $testUserId2;
      $query = "SELECT COUNT(updated) FROM blogUser"
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
      $result = getApi('getUser.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);
   }

   /**
    * Test #3. GET request with incomplete parameters.
    */
   public function testGetIncompleteParameter() {
      $data = array('userId'=>null);
      $result = getApi('getUser.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $data = array('userId'=>'');
      $result = getApi('getUser.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);
   }


   /**
    * Test #4. GET request for non-existent object.
    * @depends testDataWipedBeforeTest
    */
   public function testGetNonExistent() {
      global $testUserId1;
      $data = array('userId'=>$testUserId1);
      $result = getApi('getUser.php', $data);
      $this->assertEquals(RESPONSE_NOT_FOUND, $result['resultCode']);
   }

   /**
    * Test #5. GET request for an existent object.
    * @depends testDataWipedBeforeTest
    */
   public function testGetExistent() {
      global $testUserId1;
      global $adminAuthToken;

      $object = new User($testUserId1);
      $object->setName('Test User');
      $object->setExternalType('externaltype');
      $object->setExternalId('externalid');
      $object->setAccess('access');
      $object->setEmail('foo@bar.com');
      $object->setNotification('Y');
      $object->setTempCode('tempcode');
      $object->setDeleted('Y');
      $object->save();

      $data = array('userId'=>$testUserId1);
      $result = getApi('getUser.php', $data, $adminAuthToken);
      $this->assertEquals(RESPONSE_SUCCESS, $result['resultCode']);

      $this->assertTrue(isset($result['userId']));
      $this->assertTrue(isset($result['created']));
      $this->assertTrue(isset($result['updated']));
      $this->assertTrue(isset($result['name']));
      $this->assertTrue(isset($result['externalType']));
      $this->assertTrue(isset($result['externalId']));
      $this->assertTrue(isset($result['access']));
      $this->assertTrue(isset($result['email']));
      $this->assertTrue(isset($result['notification']));
      $this->assertTrue(isset($result['tempCode']));
      $this->assertTrue(isset($result['deleted']));
      // hash field is not returned by GET (use SYNCH for that)
      $this->assertFalse(isset($result['hash']));

      $this->assertEquals($testUserId1, $result['userId']);
      $this->assertEquals($object->getCreated(), $result['created']);
      $this->assertEquals($object->getUpdated(), $result['updated']);
      $this->assertEquals("Test User", $result['name']);
      $this->assertEquals("externaltype", $result['externalType']);
      $this->assertEquals("externalid", $result['externalId']);
      $this->assertEquals("access", $result['access']);
      $this->assertEquals("foo@bar.com", $result['email']);
      $this->assertEquals("Y", $result['notification']);
      $this->assertEquals("tempcode", $result['tempCode']);
      $this->assertEquals('Y', $result['deleted']);
   }

   /**
    * Test #6. PUT request with no parameters.
    */
   public function testPutNoParameters() {
      $this->assertEquals(0, $this->countTestRows());

      $data = array();
      $result = putApi('putUser.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);
   }

   /**
    * Test #7. PUT request with invalid parameters.
    */
   public function testPutInvalidParameters() {
      $this->assertEquals(0, $this->countTestRows());

      $data = array('userId'=>null);
      $result = putApi('putUser.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $this->assertEquals(0, $this->countTestRows());

      $data = array('userId'=>'');
      $result = putApi('putUser.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $this->assertEquals(0, $this->countTestRows());
   }

   /**
    * Test #8. PUT request create new object.
    */
   public function testPutCreate() {
      global $testUserId1;
      global $adminAuthToken;

      $this->assertEquals(0, $this->countTestRows());

      $data = array('userId'=>$testUserId1,
                    'created'=>'2015-10-01',
                    'updated'=>'2015-10-02',
                    'name'=>'Test User',
                    'externalType'=>'externaltype',
                    'externalId'=>'externalid',
                    'access'=>'Y',
                    'email'=>'foo@bar.com',
                    'notification'=>'Y',
                    'tempCode'=>'tempcode',
                    'deleted'=>'Y',
                    'hash'=>'forced hash');
      $result = putApi('putUser.php', $data, $adminAuthToken);
      $this->assertEquals(RESPONSE_SUCCESS, $result['resultCode']);

      $this->assertEquals(1, $this->countTestRows());

      $object = new User($testUserId1);
      $this->assertEquals($testUserId1, $object->getUserId());
      // Created and updated fields can NOT be set by the PUT command;
      // the automatic values are set, not the ones passed
      $this->assertNotNull($object->getCreated());
      $this->assertNotEquals('', $object->getCreated());
      $this->assertNotEquals('2015-10-01', $object->getCreated());
      $this->assertNotNull($object->getUpdated());
      $this->assertNotEquals('', $object->getUpdated());
      $this->assertNotEquals('2015-10-02', $object->getUpdated());
      $this->assertEquals("Test User", $object->getName());
      $this->assertEquals("externaltype", $object->getExternalType());
      $this->assertEquals("externalid", $object->getExternalId());
      $this->assertEquals("Y", $object->getAccess());
      $this->assertEquals("foo@bar.com", $object->getEmail());
      $this->assertEquals("Y", $object->getNotification());
      $this->assertEquals("tempcode", $object->getTempCode());
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
   public function testPutUpdate() {
      global $testUserId1;
      global $adminAuthToken;

      $object = new User($testUserId1);
      $object->setName("Test User");
      $object->setExternalType("externaltype");
      $object->setExternalId("externalid");
      $object->setAccess("access");
      $object->setEmail("foo@bar.com");
      $object->setNotification("N");
      $object->setTempcode("tempcode");
      $object->setDeleted('N');
      $object->save();

      $this->assertEquals(1, $this->countTestRows());

      $data = array('userId'=>$testUserId1,
         'name'=>'Test User 2',
         'externalType'=>'externaltype2',
         'externalId'=>'externalid2',
         'access'=>'Y',
         'email'=>'foo2@bar.com',
         'notification'=>'Y',
         'tempCode'=>'tempcode2',
         'deleted'=>'Y');
      $result = putApi('putUser.php', $data, $adminAuthToken);
      $this->assertEquals(RESPONSE_SUCCESS, $result['resultCode']);

      $this->assertEquals(2, $this->countTestRows());

      $object = new User($testUserId1);
      $this->assertEquals("Test User 2", $object->getName());
      $this->assertEquals("externaltype2", $object->getExternalType());
      $this->assertEquals("externalid2", $object->getExternalId());
      $this->assertEquals("Y", $object->getAccess());
      $this->assertEquals("foo2@bar.com", $object->getEmail());
      $this->assertEquals("Y", $object->getNotification());
      $this->assertEquals("tempcode2", $object->getTempCode());
      $this->assertEquals("Y", $object->getDeleted());
   }

   /**
    * Test #10. SYNCH get with invalid parameters
    * @depends testDataWipedBeforeTest
    */
   public function testSynchGetInvalid() {
      global $synchAuthToken;
      $data = array();
      $result = getApi('synchUser.php', $data, $synchAuthToken);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $data = array('hash'=>'');
      $result = getApi('synchUser.php', $data, $synchAuthToken);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $data = array('hash'=>'non-existent');
      $result = getApi('synchUser.php', $data, $synchAuthToken);
      $this->assertEquals(RESPONSE_NOT_FOUND, $result['resultCode']);
   }

   /**
    * Test #11. SYNCH get an existent object.
    * @depends testDataWipedBeforeTest
    * @depends testGetExistent
    */
   public function testSynchGet() {
      global $testUserId1;
      global $synchAuthToken;

      $object = new User($testUserId1);
      $object->setName("Test User");
      $object->setExternalType("externaltype");
      $object->setExternalId("externalid");
      $object->setAccess("Y");
      $object->setEmail("foo@bar.com");
      $object->setNotification("Y");
      $object->setTempCode("tempcode");
      $object->setDeleted('Y');
      $object->save();

      $hash = $object->getHash();

      $data = array('hash'=>$hash);
      $result = getApi('synchUser.php', $data, $synchAuthToken);
      $this->assertEquals(RESPONSE_SUCCESS, $result['resultCode']);

      $this->assertTrue(isset($result['userId']));
      $this->assertTrue(isset($result['created']));
      $this->assertTrue(isset($result['updated']));
      $this->assertTrue(isset($result['name']));
      $this->assertTrue(isset($result['externalType']));
      $this->assertTrue(isset($result['externalId']));
      $this->assertTrue(isset($result['access']));
      $this->assertTrue(isset($result['email']));
      $this->assertTrue(isset($result['notification']));
      $this->assertTrue(isset($result['tempCode']));
      $this->assertTrue(isset($result['deleted']));
      $this->assertTrue(isset($result['hash']));

      $this->assertEquals($testUserId1, $result['userId']);
      $this->assertEquals($object->getCreated(), $result['created']);
      $this->assertEquals($object->getUpdated(), $result['updated']);
      $this->assertEquals("Test User", $result['name']);
      $this->assertEquals("externaltype", $result['externalType']);
      $this->assertEquals("externalid", $result['externalId']);
      $this->assertEquals("Y", $result['access']);
      $this->assertEquals("foo@bar.com", $result['email']);
      $this->assertEquals("Y", $result['notification']);
      $this->assertEquals("tempcode", $result['tempCode']);
      $this->assertEquals('Y', $result['deleted']);
      $this->assertEquals($hash, $result['hash']);
   }

   /**
    * Test #12. SYNCH put request without data.
    */
   public function testSynchPutInvalid() {
      global $synchAuthToken;
      $this->assertEquals(0, $this->countTestRows());

      $data = array();
      $result = putApi('synchUser.php', $data, $synchAuthToken);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $data = array('userId'=>'');
      $result = getApi('synchUser.php', $data, $synchAuthToken);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $this->assertEquals(0, $this->countTestRows());
   }

   /**
    * Test #13. SYNCH request write new object.
    */
   public function testSynchPut() {
      global $testUserId1;
      global $synchAuthToken;

      $this->assertEquals(0, $this->countTestRows());

      $data = array('userId'=>$testUserId1,
                    'created'=>'2015-10-01',
                    'updated'=>'2015-10-02',
                    'name'=>'Test User',
                    'externalType'=>'externaltype',
                    'externalId'=>'externalid',
                    'access'=>'Y',
                    'email'=>'foo@bar.com',
                    'notification'=>'Y',
                    'tempCode'=>'tempcode',
                    'deleted'=>'Y',
                    'hash'=>'forced hash');
      $result = putApi('synchUser.php', $data, $synchAuthToken);
      $this->assertEquals(RESPONSE_SUCCESS, $result['resultCode']);

      $this->assertEquals(1, $this->countTestRows());

      $object = new User($testUserId1);
      $this->assertEquals('2015-10-01 00:00:00.000000', $object->getCreated());
      $this->assertEquals('2015-10-02 00:00:00.000000', $object->getUpdated());
      $this->assertEquals("Test User", $object->getName());
      $this->assertEquals("externaltype", $object->getExternalType());
      $this->assertEquals("externalid", $object->getExternalId());
      $this->assertEquals("Y", $object->getAccess());
      $this->assertEquals("foo@bar.com", $object->getEmail());
      $this->assertEquals("Y", $object->getNotification());
      $this->assertEquals("tempcode", $object->getTempCode());
      $this->assertEquals("Y", $object->getDeleted());
      $this->assertEquals('forced hash', $object->getHash());
   }
}
?>
