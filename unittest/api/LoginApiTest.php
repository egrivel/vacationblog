<?php
include(dirname(__FILE__) . "/../common.php");
include_once("$gl_site_root/database/User.php");

class LoginApiTest extends PHPUnit_Framework_Testcase {
  private $testUserId;
  private $testPassword;

  public static function setUpBeforeClass() {
    global $testUserId, $testPassword;
    $testUserId = '-test-user-1';
    $testPassword = '--test-password-1--';

    // Cleanup before starting the test
    // Delete any records from the Auth table for the test user
    $query = "DELETE FROM blogAuth"
      . " WHERE userId='$testUserId'";
    mysql_query($query);

    // Delete any test users
    $query = "DELETE FROM blogUser"
      . " WHERE userId='$testUserId'";
    mysql_query($query);

    // create the test user
    $object = new User($testUserId);
    $object->setPassword($testPassword);
    $object->save();
  }

  public static function tearDownAfterClass() {
    global $testUserId;

    // Cleanup after testing
    // Delete any records from the Auth table for the test user
    $query = "DELETE FROM blogAuth"
      . " WHERE userId='$testUserId'";
    mysql_query($query);

    // Delete any test users
    $query = "DELETE FROM blogUser"
      . " WHERE userId='$testUserId'";
    mysql_query($query);
  }

  // Login without parameters fails
  public function testLoginNoParameter() {
    $result = putApi('login.php', null);
    $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

    $data = array();
    $result = putApi('login.php', $data);
    $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);
  }

  // Login with just user ID fails
  public function testUserOnlyParameter() {
    global $testUserId;

    $data = array('action'=>'login', 'userId'=>$testUserId);
    $result = putApi('login.php', $data);
    $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);
  }

  // Login with just password fails
  public function testPasswordOnlyParameter() {
    global $testPassword;

    $data = array('action'=>'login', 'password'=>$testPassword);
    $result = putApi('login.php', $data);
    $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);
  }

  // Login with wrong user ID and password fails
  public function testWrongUser() {
    $data = array('action'=>'login',
                  'userId'=>'-test-wrong-user',
                  'password'=>'foo');
    $result = putApi('login.php', $data);
    $this->assertEquals(RESPONSE_NOT_FOUND, $result['resultCode']);
  }

  // Login with user ID and wrong password fails
  public function testWrongPassword() {
    global $testUserId;

    $data = array('action'=>'login',
                  'userId'=>$testUserId,
                  'password'=>'foo');
    $result = putApi('login.php', $data);
    $this->assertEquals(RESPONSE_UNAUTHORIZED, $result['resultCode']);
  }

  // Login with user ID and right password succeeds
  public function testLoginSuccess() {
    global $testUserId, $testPassword;

    $data = array('action'=>'login',
                  'userId'=>$testUserId,
                  'password'=>$testPassword);
    $result = putApi('login.php', $data);
    $this->assertEquals(RESPONSE_SUCCESS, $result['resultCode']);
  }

  // correct login returns auth token
  public function testGetAuthToken() {
    global $testUserId, $testPassword;

    $data = array('action'=>'login',
                  'userId'=>$testUserId,
                  'password'=>$testPassword);
    $result = putApi('login.php', $data);
    $this->assertEquals(RESPONSE_SUCCESS, $result['resultCode']);
    $this->assertArrayHasKey('authId', $result);
  }
}

?>
