<?php
include(dirname(__FILE__) . "/../common.php");
include_once("$gl_site_root/database/Trip.php");

class TripApiTest extends PHPUnit_Framework_TestCase {
   private $testTripId1;
   private $testTripId2;

   protected function setUp() {
      global $testTripId1;
      global $testTripId2;
      $testTripId1 = '-test-trip-1';
      $testTripId2 = '-test-trip-2';
      $query = "DELETE FROM blogTrip "
         . "WHERE tripId='$testTripId1' "
         .   "OR tripId='$testTripId2'";
      mysql_query($query);
   }

   protected function tearDown() {
      global $testTripId1;
      global $testTripId2;
      $query = "DELETE FROM blogTrip "
         . "WHERE tripId='$testTripId1' "
         .   "OR tripId='$testTripId2'";
      mysql_query($query);
   }

   private function countAllRows() {
      $query = "SELECT COUNT(updated) FROM blogTrip";
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
      global $testTripId1;
      global $testTripId2;
      $query = "SELECT COUNT(updated) FROM blogTrip"
         . " WHERE tripId='$testTripId1'"
         .   " OR tripId='$testTripId2'";
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
      $result = getApi('getTrip.php', $data);
      $this->assertEquals('401', $result['resultCode']);
   }

   /**
    * Test #3. GET request with incomplete parameters.
    */
   public function testGetIncompleteParameter() {
      $data = array('tripId'=>null);
      $result = getApi('getTrip.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $data = array('tripId'=>'');
      $result = getApi('getTrip.php', $data);
      $this->assertEquals('401', $result['resultCode']);
   }


   /**
    * Test #4. GET request for non-existent object.
    * @depends testDataWipedBeforeTest
    */
   public function testGetNonExistent() {
      global $testTripId1;
      $data = array('tripId'=>$testTripId1);
      $result = getApi('getTrip.php', $data);
      $this->assertEquals('404', $result['resultCode']);
   }

   /**
    * Test #5. GET request for an existent object.
    * @depends testDataWipedBeforeTest
    */
   public function testGetExistent() {
      global $testTripId1;

      $object = new Trip($testTripId1);
      $object->setName("Trip 1");
      $object->setDescription("Description 1");
      $object->setBannerImg("test-01.png");
      $object->setStartDate("2015-09-01");
      $object->setEndDate("2015-09-30");
      $object->setActive("Y");
      $object->setDeleted('Y');
      $object->save();

      $data = array('tripId'=>$testTripId1);
      $result = getApi('getTrip.php', $data);
      $this->assertEquals('200', $result['resultCode']);

      $this->assertTrue(isset($result['tripId']));
      $this->assertTrue(isset($result['created']));
      $this->assertTrue(isset($result['updated']));
      $this->assertTrue(isset($result['name']));
      $this->assertTrue(isset($result['description']));
      $this->assertTrue(isset($result['bannerImg']));
      $this->assertTrue(isset($result['startDate']));
      $this->assertTrue(isset($result['endDate']));
      $this->assertTrue(isset($result['active']));
      $this->assertTrue(isset($result['deleted']));
      // hash field is not returned by GET (use SYNCH for that)
      $this->assertFalse(isset($result['hash']));

      $this->assertEquals($testTripId1, $result['tripId']);
      $this->assertEquals($object->getCreated(), $result['created']);
      $this->assertEquals($object->getUpdated(), $result['updated']);
      $this->assertEquals("Trip 1", $result['name']);
      $this->assertEquals("Description 1", $result['description']);
      $this->assertEquals("test-01.png", $result['bannerImg']);
      $this->assertEquals("2015-09-01", $result['startDate']);
      $this->assertEquals("2015-09-30", $result['endDate']);
      $this->assertEquals("Y", $result['active']);
      $this->assertEquals('Y', $result['deleted']);
   }
      
   /**
    * Test #6. PUT request with no parameters.
    */
   public function testPutNoParameters() {
      $this->assertEquals(0, $this->countTestRows());

      $data = array();
      $result = putApi('putTrip.php', $data);
      $this->assertEquals('401', $result['resultCode']);
   }
      
   /**
    * Test #7. PUT request with invalid parameters.
    */
   public function testPutInvalidParameters() {
      $this->assertEquals(0, $this->countTestRows());

      $data = array('tripId'=>null);
      $result = putApi('putTrip.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $this->assertEquals(0, $this->countTestRows());

      $data = array('tripId'=>'');
      $result = putApi('putTrip.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $this->assertEquals(0, $this->countTestRows());
   }
      
   /**
    * Test #8. PUT request create new object.
    */
   public function testPutCreate() {
      global $testTripId1;

      $this->assertEquals(0, $this->countTestRows());

      $data = array('tripId'=>$testTripId1,
                    'created'=>'2015-10-01',
                    'updated'=>'2015-10-02',
                    'name'=>'Test Trip',
                    'description'=>'Test Description',
                    'bannerImg'=>'test-01.png',
                    'startDate'=>'2015-09-01',
                    'endDate'=>'2015-09-30',
                    'active'=>'Y',
                    'deleted'=>'Y',
                    'hash'=>'forced hash');
      $result = putApi('putTrip.php', $data);
      $this->assertEquals('200', $result['resultCode']);

      $this->assertEquals(1, $this->countTestRows());

      $object = new Trip($testTripId1);
      $this->assertEquals($testTripId1, $object->getTripId());
      // Created and updated fields can NOT be set by the PUT command;
      // the automatic values are set, not the ones passed
      $this->assertNotNull($object->getCreated());
      $this->assertNotEquals('', $object->getCreated());
      $this->assertNotEquals('2015-10-01', $object->getCreated());
      $this->assertNotNull($object->getUpdated());
      $this->assertNotEquals('', $object->getUpdated());
      $this->assertNotEquals('2015-10-02', $object->getUpdated());
      $this->assertEquals("Test Trip", $object->getName());
      $this->assertEquals("Test Description", $object->getDescription());
      $this->assertEquals("test-01.png", $object->getBannerImg());
      $this->assertEquals("2015-09-01", $object->getStartDate());
      $this->assertEquals("2015-09-30", $object->getEndDate());
      $this->assertEquals("Y", $object->getActive());
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
      global $testTripId1;
      $object = new Trip($testTripId1);
      $object->setName("Trip 1");
      $object->setDescription("Description 1");
      $object->setBannerImg("test-01.png");
      $object->setStartDate("2015-09-01");
      $object->setEndDate("2015-09-30");
      $object->setActive("N");
      $object->setDeleted('N');
      $object->save();

      $this->assertEquals(1, $this->countTestRows());

      $data = array('tripId'=>$testTripId1,
         'name'=>'Test Trip 2',
         'description'=>'Test Description 2',
         'bannerImg'=>'test-02.png',
         'startDate'=>'2015-10-01',
         'endDate'=>'2015-10-31',
         'active'=>'Y',
         'deleted'=>'Y');
      $result = putApi('putTrip.php', $data);
      $this->assertEquals('200', $result['resultCode']);

      $this->assertEquals(2, $this->countTestRows());

      $object = new Trip($testTripId1);
      $this->assertEquals("Test Trip 2", $object->getName());
      $this->assertEquals("Test Description 2", $object->getDescription());
      $this->assertEquals("test-02.png", $object->getBannerImg());
      $this->assertEquals("2015-10-01", $object->getStartDate());
      $this->assertEquals("2015-10-31", $object->getEndDate());
      $this->assertEquals("Y", $object->getActive());
      $this->assertEquals("Y", $object->getDeleted());
   }

   /**
    * Test #10. SYNCH get with invalid parameters
    * @depends testDataWipedBeforeTest
    */
   public function testSynchGetInvalid() {
      $data = array();
      $result = getApi('synchTrip.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $data = array('hash'=>'');
      $result = getApi('synchTrip.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $data = array('hash'=>'non-existent');
      $result = getApi('synchTrip.php', $data);
      $this->assertEquals('404', $result['resultCode']);
   }

   /**
    * Test #11. SYNCH get an existent object.
    * @depends testDataWipedBeforeTest
    * @depends testGetExistent
    */
   public function testSynchGet() {
      global $testTripId1;

      $object = new Trip($testTripId1);
      $object->setName("Trip 1");
      $object->setDescription("Description 1");
      $object->setBannerImg("test-01.png");
      $object->setStartDate("2015-09-01");
      $object->setEndDate("2015-09-30");
      $object->setActive("Y");
      $object->setDeleted('Y');
      $object->save();

      $hash = $object->getHash();

      $data = array('hash'=>$hash);
      $result = getApi('synchTrip.php', $data);
      $this->assertEquals('200', $result['resultCode']);

      $this->assertTrue(isset($result['tripId']));
      $this->assertTrue(isset($result['created']));
      $this->assertTrue(isset($result['updated']));
      $this->assertTrue(isset($result['name']));
      $this->assertTrue(isset($result['description']));
      $this->assertTrue(isset($result['bannerImg']));
      $this->assertTrue(isset($result['startDate']));
      $this->assertTrue(isset($result['endDate']));
      $this->assertTrue(isset($result['active']));
      $this->assertTrue(isset($result['deleted']));
      $this->assertTrue(isset($result['hash']));

      $this->assertEquals($testTripId1, $result['tripId']);
      $this->assertEquals($object->getCreated(), $result['created']);
      $this->assertEquals($object->getUpdated(), $result['updated']);
      $this->assertEquals("Trip 1", $result['name']);
      $this->assertEquals("Description 1", $result['description']);
      $this->assertEquals("test-01.png", $result['bannerImg']);
      $this->assertEquals("2015-09-01", $result['startDate']);
      $this->assertEquals("2015-09-30", $result['endDate']);
      $this->assertEquals("Y", $result['active']);
      $this->assertEquals('Y', $result['deleted']);
      $this->assertEquals($hash, $result['hash']);
   }

   /**
    * Test #12. SYNCH put request without data.
    */
   public function testSynchPutInvalid() {
      $this->assertEquals(0, $this->countTestRows());

      $data = array();
      $result = putApi('synchTrip.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $data = array('tripId'=>'');
      $result = getApi('synchTrip.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $this->assertEquals(0, $this->countTestRows());
   }
      
   /**
    * Test #13. SYNCH request write new object.
    */
   public function testSynchPut() {
      global $testTripId1;

      $this->assertEquals(0, $this->countTestRows());

      $data = array('tripId'=>$testTripId1,
                    'created'=>'2015-10-01',
                    'updated'=>'2015-10-02',
                    'name'=>'Test Trip',
                    'description'=>'Test Description',
                    'bannerImg'=>'test-01.png',
                    'startDate'=>'2015-09-01',
                    'endDate'=>'2015-09-30',
                    'active'=>'Y',
                    'deleted'=>'Y',
                    'hash'=>'forced hash');
      $result = putApi('synchTrip.php', $data);
      $this->assertEquals('200', $result['resultCode']);

      $this->assertEquals(1, $this->countTestRows());

      $object = new Trip($testTripId1);
      $this->assertEquals('2015-10-01 00:00:00.000000', $object->getCreated());
      $this->assertEquals('2015-10-02 00:00:00.000000', $object->getUpdated());
      $this->assertEquals("Test Trip", $object->getName());
      $this->assertEquals("Test Description", $object->getDescription());
      $this->assertEquals("test-01.png", $object->getBannerImg());
      $this->assertEquals("2015-09-01", $object->getStartDate());
      $this->assertEquals("2015-09-30", $object->getEndDate());
      $this->assertEquals("Y", $object->getActive());
      $this->assertEquals("Y", $object->getDeleted());
      $this->assertEquals('forced hash', $object->getHash());
   }

   /**
    * Test #14. FIND all trips.
    */
   public function testFindAll() {
      global $testTripId1, $testTripId2;

      $object = new Trip($testTripId1);
      $object->setName("Trip 1");
      $this->assertTrue($object->save());

      $object = new Trip($testTripId2);
      $object->setName("Trip 2");
      $this->assertTrue($object->save());

      $data = array();
      $result = getApi('findTrip.php', $data);
      $this->assertEquals('200', $result['resultCode']);
      $this->assertTrue(isset($result['resultSet']));
      $resultSet = $result['resultSet'];
      $hasTrip1 = false;
      $hasTrip2 = false;
      for ($i = 0; isset($resultSet[$i]); $i++) {
         $this->assertTrue(isset($resultSet[$i]['tripId']));
         $this->assertTrue(isset($resultSet[$i]['name']));
         if ($resultSet[$i]['tripId'] === $testTripId1) {
            $this->assertEquals('Trip 1', $resultSet[$i]['name']);
            $hasTrip1 = true;
         }
         if ($resultSet[$i]['tripId'] === $testTripId2) {
            $this->assertEquals('Trip 2', $resultSet[$i]['name']);
            $hasTrip2 = true;
         }
      }
 
      $this->assertTrue($hasTrip1);
      $this->assertTrue($hasTrip2);
  }

   private function getLargeText($size) {
      $text = '';
      while (strlen($text) < $size) {
         $text .= 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis sollicitudin dolor vitae bibendum. Vivamus gravida erat a metus maximus faucibus in sed magna. Nunc risus ex, aliquam id rutrum vitae, laoreet quis tortor. Nulla justo leo, dapibus vitae congue in, vulputate dignissim neque. Suspendisse massa purus, vestibulum in lacus. ';
      }
      return $text;
   }

   /**
    * Extra test. Make sure a large amount of text can be uploaded by
    * synch.
    * @depends testSynchPut
    */
   public function testSynchPutLarge() {
      global $testTripId1;

      $largeText = $this->getLargeText(15000);

      $this->assertEquals(0, $this->countTestRows());

      $data = array('tripId'=>$testTripId1,
                    'created'=>'2015-10-01',
                    'updated'=>'2015-10-02',
                    'name'=>'Test Trip',
                    'description'=>$largeText,
                    'bannerImg'=>'test-01.png',
                    'startDate'=>'2015-09-01',
                    'endDate'=>'2015-09-30',
                    'active'=>'Y',
                    'deleted'=>'Y',
                    'hash'=>'forced hash');
      $result = putApi('synchTrip.php', $data);
      $this->assertEquals('200', $result['resultCode']);

      $this->assertEquals(1, $this->countTestRows());

      $object = new Trip($testTripId1);
      $this->assertEquals('2015-10-01 00:00:00.000000', $object->getCreated());
      $this->assertEquals('2015-10-02 00:00:00.000000', $object->getUpdated());
      $this->assertEquals("Test Trip", $object->getName());
      $this->assertEquals($largeText, $object->getDescription());
      $this->assertEquals("test-01.png", $object->getBannerImg());
      $this->assertEquals("2015-09-01", $object->getStartDate());
      $this->assertEquals("2015-09-30", $object->getEndDate());
      $this->assertEquals("Y", $object->getActive());
      $this->assertEquals("Y", $object->getDeleted());
      $this->assertEquals('forced hash', $object->getHash());
   }

   /**
    * Extra text. Make sure the get operation works with a "latest"
    * value.
    */
   function testGetLatest() {
      global $testTripId1, $testTripId2;

      // use the timezone where we do our testing :-)
      date_default_timezone_set("America/New_York");

      $now = time();
      $today = date('Y-m-d', $now);
      $yesterday = date('Y-m-d', $now - (24 * 60 * 60));
      $tomorrow = date('Y-m-d', $now + (24 * 60 * 60));
      $past = date('Y-m-d', $now - 5 * (24 * 60 * 60));
      $future = date('Y-m-d', $now + 5 * (24 * 60 * 60));
      $farPast = date('Y-m-d', $now - 10 * (24 * 60 * 60));
      $farFuture = date('Y-m-d', $now + 10 * (24 * 60 * 60));

      $testTrip1 = new Trip($testTripId1);
      $testTrip2 = new Trip($testTripId2);

      $data = array('current'=>'');

      // one past and one future trip
      $testTrip1->setStartDate($past);
      $testTrip1->setEndDate($yesterday);
      $this->assertTrue($testTrip1->save());

      $testTrip2->setStartDate($tomorrow);
      $testTrip2->setEndDate($future);
      $this->assertTrue($testTrip2->save());

      $result = getApi('getTrip.php', $data);
      $this->assertEquals('200', $result['resultCode']);
      $this->assertTrue(isset($result['tripId']));
      $this->assertEquals($testTripId1, $result['tripId']);

      // one past and one current trip
      $testTrip1->setStartDate($past);
      $testTrip1->setEndDate($yesterday);
      $this->assertTrue($testTrip1->save());

      $testTrip2->setStartDate($yesterday);
      $testTrip2->setEndDate($tomorrow);
      $this->assertTrue($testTrip2->save());

      $result = getApi('getTrip.php', $data);
      $this->assertEquals('200', $result['resultCode']);
      $this->assertTrue(isset($result['tripId']));
      $this->assertEquals($testTripId2, $result['tripId']);

      // two past trips
      $testTrip1->setStartDate($past);
      $testTrip1->setEndDate($yesterday);
      $this->assertTrue($testTrip1->save());

      $testTrip2->setStartDate($farPast);
      $testTrip2->setEndDate($past);
      $this->assertTrue($testTrip2->save());

      $result = getApi('getTrip.php', $data);
      $this->assertEquals('200', $result['resultCode']);
      $this->assertTrue(isset($result['tripId']));
      $this->assertEquals($testTripId1, $result['tripId']);

      // one current and one future trip
      $testTrip1->setStartDate($yesterday);
      $testTrip1->setEndDate($tomorrow);
      $this->assertTrue($testTrip1->save());

      $testTrip2->setStartDate($tomorrow);
      $testTrip2->setEndDate($future);
      $this->assertTrue($testTrip2->save());

      $result = getApi('getTrip.php', $data);
      $this->assertEquals('200', $result['resultCode']);
      $this->assertTrue(isset($result['tripId']));
      $this->assertEquals($testTripId1, $result['tripId']);
      
      // two current trips, nested
      $testTrip1->setStartDate($yesterday);
      $testTrip1->setEndDate($tomorrow);
      $this->assertTrue($testTrip1->save());

      $testTrip2->setStartDate($past);
      $testTrip2->setEndDate($future);
      $this->assertTrue($testTrip2->save());

      $result = getApi('getTrip.php', $data);
      $this->assertEquals('200', $result['resultCode']);
      $this->assertTrue(isset($result['tripId']));
      $this->assertEquals($testTripId1, $result['tripId']);

      // two current trips, staggered
      $testTrip1->setStartDate($past);
      $testTrip1->setEndDate($tomorrow);
      $this->assertTrue($testTrip1->save());

      $testTrip2->setStartDate($yesterday);
      $testTrip2->setEndDate($future);
      $this->assertTrue($testTrip2->save());

      $result = getApi('getTrip.php', $data);
      $this->assertEquals('200', $result['resultCode']);
      $this->assertTrue(isset($result['tripId']));
      $this->assertEquals($testTripId2, $result['tripId']);
   }
}
?>
