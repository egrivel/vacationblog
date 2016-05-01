<?php
include(dirname(__FILE__) . "/../common.php");
include_once("$gl_site_root/database/Trip.php");
include_once("$gl_site_root/database/Media.php");

class MediaApiTest extends PHPUnit_Framework_TestCase {
   private $testTripId1;
   private $testTripId2;
   private $testMediaId1;
   private $testMediaId2;
   private $testMediaId3;
   private $testMediaId4;

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
      global $testMediaId1, $testMediaId2;
      global $testMediaId3, $testMediaId4;
      $testMediaId1 = '-test-media-1';
      $testMediaId2 = '-test-media-2';
      $testMediaId3 = '-test-media-3';
      $testMediaId4 = '-test-media-4';
      $query = "DELETE FROM blogMedia "
         . " WHERE mediaId='$testMediaId1'"
         .    " OR mediaId='$testMediaId2'"
         .    " OR mediaId='$testMediaId3'"
         .    " OR mediaId='$testMediaId4'";
      mysql_query($query);
   }

   protected function tearDown() {
      global $testMediaId1, $testMediaId2;
      global $testMediaId3, $testMediaId4;
      $query = "DELETE FROM blogMedia "
         . " WHERE mediaId='$testMediaId1'"
         .    " OR mediaId='$testMediaId2'"
         .    " OR mediaId='$testMediaId3'"
         .    " OR mediaId='$testMediaId4'";
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
      global $testMediaId1, $testMediaId2;
      global $testMediaId3, $testMediaId4;
      $query = "SELECT COUNT(updated) FROM blogMedia"
         . " WHERE mediaId='$testMediaId1'"
         .   " OR mediaId='$testMediaId2'"
         .   " OR mediaId='$testMediaId3'"
         .   " OR mediaId='$testMediaId4'";
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
      $result = getApi('getMedia.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);
   }

   /**
    * Test #3. GET request with incomplete parameters.
    */
   public function testGetIncompleteParameter() {
      $data = array('mediaId'=>null);
      $result = getApi('getMedia.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $data = array('mediaId'=>'');
      $result = getApi('getMedia.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);
   }

   /**
    * Test #4. GET request for non-existent object.
    * @depends testDataWipedBeforeTest
    */
   public function testGetNonExistent() {
      global $testTripId1, $testMediaId1;
      $data = array('tripId'=>$testTripId1,
                    'mediaId'=>$testMediaId1);
      $result = getApi('getMedia.php', $data);
      $this->assertEquals(RESPONSE_NOT_FOUND, $result['resultCode']);
   }

   /**
    * Test #5. GET request for an existent object.
    * @depends testDataWipedBeforeTest
    */
   public function testGetExistent() {
      global $testTripId1;
      global $testMediaId1;

      $this->assertEquals(0, $this->countTestRows());

      // Create the object and set attributes
      $object = new Media($testTripId1, $testMediaId1);
      $object->setType('photo');
      $object->setCaption('Caption 1');
      $object->setTimestamp('2015-09-30 12:03:45');
      $object->setLocation('location');
      $object->setWidth('900');
      $object->setHeight('600');
      $object->setDeleted('Y');

      // Save the object and confirm a row is added to the database
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());

      $data = array('tripId'=>$testTripId1,
                    'mediaId'=>$testMediaId1);

      $result = getApi('getMedia.php', $data);
      $this->assertEquals(RESPONSE_SUCCESS, $result['resultCode']);

      $this->assertTrue(isset($result['tripId']));
      $this->assertTrue(isset($result['mediaId']));
      $this->assertTrue(isset($result['created']));
      $this->assertTrue(isset($result['updated']));
      $this->assertTrue(isset($result['type']));
      $this->assertTrue(isset($result['caption']));
      $this->assertTrue(isset($result['timestamp']));
      $this->assertTrue(isset($result['location']));
      $this->assertTrue(isset($result['width']));
      $this->assertTrue(isset($result['height']));
      $this->assertTrue(isset($result['deleted']));
      // hash field is not returned by GET
      $this->assertFalse(isset($result['hash']));

      $this->assertEquals($testTripId1, $result['tripId']);
      $this->assertEquals($testMediaId1, $result['mediaId']);
      $this->assertEquals($object->getCreated(), $result['created']);
      $this->assertEquals($object->getUpdated(), $result['updated']);
      $this->assertEquals('photo', $result['type']);
      $this->assertEquals('Caption 1', $result['caption']);
      $this->assertEquals('2015-09-30 12:03:45', $result['timestamp']);
      $this->assertEquals('location', $result['location']);
      $this->assertEquals('900', $result['width']);
      $this->assertEquals('600', $result['height']);
      $this->assertEquals('Y', $result['deleted']);
   }

   /**
    * Extra test: list function to get multiple media items
    * @depends testGetExistent
    */
   public function testGetList() {
      global $testTripId1;
      global $testMediaId1, $testMediaId2;
      global $testMediaId3, $testMediaId4;

      // Create four media items with different properties. Make sure
      // one of them is deleted.
      $object = new Media($testTripId1, $testMediaId1);
      $object->setType('photo');
      $object->setCaption('Caption 0');
      $object->setTimestamp('2015-10-00 12:03:45');
      $object->setLocation('location 0');
      $object->setWidth('900');
      $object->setHeight('600');
      $object->setDeleted('N');
      $this->assertTrue($object->save());

      $object = new Media($testTripId1, $testMediaId2);
      $object->setType('photo');
      $object->setCaption('Caption 1');
      $object->setTimestamp('2015-10-01 12:03:45');
      $object->setLocation('location 1');
      $object->setWidth('901');
      $object->setHeight('601');
      $object->setDeleted('N');
      $this->assertTrue($object->save());

      $object = new Media($testTripId1, $testMediaId3);
      $object->setType('photo');
      $object->setCaption('Caption 2');
      $object->setTimestamp('2015-10-02 12:03:45');
      $object->setLocation('location 2');
      $object->setWidth('902');
      $object->setHeight('602');
      $object->setDeleted('Y');
      $this->assertTrue($object->save());

      $object = new Media($testTripId1, $testMediaId4);
      $object->setType('photo');
      $object->setCaption('Caption 3');
      $object->setTimestamp('2015-10-03 12:03:45');
      $object->setLocation('location 3');
      $object->setWidth('903');
      $object->setHeight('603');
      $object->setDeleted('N');
      $this->assertTrue($object->save());

      $list = $testMediaId1 . ',' . $testMediaId2 . ','
         . $testMediaId3 . ',' . $testMediaId4;

      // list without tripId fails
      $data = array('list'=>$list);
      $result = getApi('getMedia.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      // empty list fails
      $data = array('tripId'=>$testTripId1,
                    'list'=>'');
      $result = getApi('getMedia.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      // try and get all four media items in a list
      $data = array('tripId'=>$testTripId1,
                    'list'=>$list);
      $result = getApi('getMedia.php', $data);
      $this->assertEquals(RESPONSE_SUCCESS, $result['resultCode']);

      $this->assertTrue(isset($result['list']));
      $this->assertTrue(isset($result['count']));
      $this->assertFalse(isset($result['tripId']));
      $this->assertFalse(isset($result['mediaId']));

      for ($i = 0; $i < $result['count']; $i++) {
         $this->assertTrue(isset($result['list'][$i]), "List item $i exists");
         $item = $result['list'][$i];

         $this->assertTrue(isset($item['tripId']), "In list item $i");
         $this->assertTrue(isset($item['mediaId']), "In list item $i");
         $this->assertTrue(isset($item['created']), "In list item $i");
         $this->assertTrue(isset($item['updated']), "In list item $i");
         $this->assertTrue(isset($item['type']), "In list item $i");
         $this->assertTrue(isset($item['caption']), "In list item $i");
         $this->assertTrue(isset($item['timestamp']), "In list item $i");
         $this->assertTrue(isset($item['location']), "In list item $i");
         $this->assertTrue(isset($item['width']), "In list item $i");
         $this->assertTrue(isset($item['height']), "In list item $i");
         $this->assertTrue(isset($item['deleted']), "In list item $i");
         // hash field is not returned by GET
         $this->assertFalse(isset($item['hash']), "In list item $i");

         $this->assertEquals($testTripId1, $item['tripId'], "In list item $i");
         switch ($i) {
         case 0:
            $this->assertEquals($testMediaId1, $item['mediaId'],
                                "In list item $i");
            break;
         case 1:
            $this->assertEquals($testMediaId2, $item['mediaId'],
                                "In list item $i");
            break;
         case 2:
            $this->assertEquals($testMediaId3, $item['mediaId'],
                                "In list item $i");
            break;
         case 3:
            $this->assertEquals($testMediaId4, $item['mediaId'],
                                "In list item $i");
            break;
         }
         $this->assertEquals('photo', $item['type'], "In list item $i");
         $this->assertEquals("Caption $i", $item['caption'],
                             "In list item $i");
         $this->assertEquals("2015-10-0$i 12:03:45", $item['timestamp'],
                             "In list item $i");
         $this->assertEquals("location $i", $item['location'],
                             "In list item $i");
         $this->assertEquals("90$i", $item['width'], "In list item $i");
         $this->assertEquals("60$i", $item['height'], "In list item $i");
         if ($i === 2) {
            $this->assertEquals('Y', $item['deleted'], "In list item $i");
         } else {
            $this->assertEquals('N', $item['deleted'], "In list item $i");
         }
      }
   }

   /**
    * Test #6. PUT request with no parameters.
    */
   public function testPutNoParameters() {
      $this->assertEquals(0, $this->countTestRows());

      $data = array();
      $result = putApi('putMedia.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);
   }

   /**
    * Test #7. PUT request with invalid parameters.
    */
   public function testPutInvalidParameters() {
      $this->assertEquals(0, $this->countTestRows());

      $data = array('tripId'=>null,
                    'mediaId'=>null);
      $result = putApi('putMedia.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $this->assertEquals(0, $this->countTestRows());

      $data = array('tripId'=>'',
                    'mediaId'=>'');
      $result = putApi('putMedia.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $this->assertEquals(0, $this->countTestRows());
   }

   /**
    * Test #8. PUT request create new object.
    */
   public function testPutCreate() {
      global $testTripId1;
      global $testMediaId1;

      $this->assertEquals(0, $this->countTestRows());

      $data = array('tripId'=>$testTripId1,
                    'mediaId'=>$testMediaId1,
                    'created'=>'2015-10-01',
                    'updated'=>'2015-10-02',
                    'type'=>'photo',
                    'caption'=>'Caption Media 1',
                    'timestamp'=>'2015-09-17 12:44:13',
                    'location'=>'95D45M22.333N 32D32M42.195W +12324m',
                    'width'=>'900',
                    'height'=>'600',
                    'deleted'=>'Y',
                    'hash'=>'forced hash');
      $result = putApi('putMedia.php', $data);
      $this->assertEquals(RESPONSE_SUCCESS, $result['resultCode']);

      $this->assertEquals(1, $this->countTestRows());

      $object = new Media($testTripId1, $testMediaId1);
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testMediaId1, $object->getMediaId());
      // Created and updated fields can NOT be set by the PUT command;
      // the automatic values are set, not the ones passed
      $this->assertNotNull($object->getCreated());
      $this->assertNotEquals('', $object->getCreated());
      $this->assertNotEquals('2015-10-01', $object->getCreated());
      $this->assertNotNull($object->getUpdated());
      $this->assertNotEquals('', $object->getUpdated());
      $this->assertNotEquals('2015-10-02', $object->getUpdated());
      $this->assertEquals('photo', $object->getType());
      $this->assertEquals('Caption Media 1', $object->getCaption());
      $this->assertEquals('2015-09-17 12:44:13', $object->getTimestamp());
      $this->assertEquals('95D45M22.333N 32D32M42.195W +12324m',
                          $object->getLocation());
      $this->assertEquals('900', $object->getWidth());
      $this->assertEquals('600', $object->getHeight());
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
   public function testUpdateMedia() {
      global $testTripId1;
      global $testMediaId1;

      $object = new Media($testTripId1, $testMediaId1);
      $object->setType("photo");
      $object->setCaption("Caption Media 1");
      $object->setTimestamp("2015-09-17 12:44:13");
      $object->setLocation("95D45M22.333N 32D32M42.195W +12324m");
      $object->setWidth('900');
      $object->setHeight('600');
      $object->setDeleted('N');
      $object->save();

      $this->assertEquals(1, $this->countTestRows());

      $data = array('tripId'=>$testTripId1,
                    'mediaId'=>$testMediaId1,
                    'created'=>'2015-10-01',
                    'updated'=>'2015-10-02',
                    'type'=>'movie',
                    'caption'=>'Caption Media 2',
                    'timestamp'=>'2015-09-30 12:44:13',
                    'location'=>'88D45M22.333N 32D32M42.195W +12324m',
                    'width'=>'640',
                    'height'=>'480',
                    'deleted'=>'Y',
                    'hash'=>'forced hash');
      $result = putApi('putMedia.php', $data);
      $this->assertEquals(RESPONSE_SUCCESS, $result['resultCode']);

      $this->assertEquals(2, $this->countTestRows());

      $object = new Media($testTripId1, $testMediaId1);
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testMediaId1, $object->getMediaId());
      $this->assertEquals('movie', $object->getType());
      $this->assertEquals('Caption Media 2', $object->getCaption());
      $this->assertEquals('2015-09-30 12:44:13', $object->getTimestamp());
      $this->assertEquals('88D45M22.333N 32D32M42.195W +12324m',
                          $object->getLocation());
      $this->assertEquals('640', $object->getWidth());
      $this->assertEquals('480', $object->getHeight());
      $this->assertEquals('Y', $object->getDeleted());
   }

   /**
    * Test #10. SYNCH get with invalid parameters
    * @depends testDataWipedBeforeTest
    */
   public function testSynchGetInvalid() {
      $data = array();
      $result = getApi('synchMedia.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $data = array('hash'=>'');
      $result = getApi('synchMedia.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $data = array('hash'=>'non-existent');
      $result = getApi('synchMedia.php', $data);
      $this->assertEquals(RESPONSE_NOT_FOUND, $result['resultCode']);
   }

   /**
    * Test #11. SYNCH get an existent object.
    * @depends testDataWipedBeforeTest
    * @depends testGetExistent
    */
   public function testSynchGet() {
      global $testTripId1;
      global $testMediaId1;

      // Create the object and set attributes
      $object = new Media($testTripId1, $testMediaId1);
      $object->setType('photo');
      $object->setCaption('Caption 1');
      $object->setTimestamp('2015-09-30 12:03:45');
      $object->setLocation('location');
      $object->setWidth('900');
      $object->setHeight('600');
      $object->setDeleted('Y');

      // Save the object and confirm a row is added to the database
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());

      $data = array('hash'=>$object->getHash());
      $result = getApi('synchMedia.php', $data);
      $this->assertEquals(RESPONSE_SUCCESS, $result['resultCode']);

      $this->assertTrue(isset($result['tripId']));
      $this->assertTrue(isset($result['mediaId']));
      $this->assertTrue(isset($result['created']));
      $this->assertTrue(isset($result['updated']));
      $this->assertTrue(isset($result['type']));
      $this->assertTrue(isset($result['caption']));
      $this->assertTrue(isset($result['timestamp']));
      $this->assertTrue(isset($result['location']));
      $this->assertTrue(isset($result['width']));
      $this->assertTrue(isset($result['height']));
      $this->assertTrue(isset($result['deleted']));
      $this->assertTrue(isset($result['hash']));

      $this->assertEquals($testTripId1, $result['tripId']);
      $this->assertEquals($testMediaId1, $result['mediaId']);
      $this->assertEquals($object->getCreated(), $result['created']);
      $this->assertEquals($object->getUpdated(), $result['updated']);
      $this->assertEquals('photo', $result['type']);
      $this->assertEquals('Caption 1', $result['caption']);
      $this->assertEquals('2015-09-30 12:03:45', $result['timestamp']);
      $this->assertEquals('location', $result['location']);
      $this->assertEquals('900', $result['width']);
      $this->assertEquals('600', $result['height']);
      $this->assertEquals('Y', $result['deleted']);
      $this->assertEquals($object->getHash(), $result['hash']);
   }

   /**
    * Test #12. SYNCH put request without data.
    */
   public function testSynchPutInvalid() {
      global $testTripId1;
      global $testMediaId1;

      $this->assertEquals(0, $this->countTestRows());

      $data = array();
      $result = putApi('synchMedia.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $data = array('tripId'=>'');
      $result = getApi('synchMedia.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $data = array('mediaId'=>'');
      $result = getApi('synchMedia.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $data = array('tripId'=>$testTripId1);
      $result = getApi('synchMedia.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $data = array('mediaId'=>$testMediaId1);
      $result = getApi('synchMedia.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $data = array('tripId'=>$testTripId1,
                    'mediaId'=>'');
      $result = getApi('synchMedia.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $data = array('tripId'=>'',
                    'mediaId'=>$testMediaId1);
      $result = getApi('synchMedia.php', $data);
      $this->assertEquals(RESPONSE_BAD_REQUEST, $result['resultCode']);

      $this->assertEquals(0, $this->countTestRows());
   }

   /**
    * Test #13. SYNCH request write new object.
    */
   public function testSynchPut() {
      global $testTripId1, $testMediaId1;

      $this->assertEquals(0, $this->countTestRows());

      $data = array('tripId'=>$testTripId1,
                    'mediaId'=>$testMediaId1,
                    'created'=>'2015-10-01',
                    'updated'=>'2015-10-02',
                    'type'=>'photo',
                    'caption'=>'Caption Media 1',
                    'timestamp'=>'2015-09-30 12:03:45',
                    'location'=>'location',
                    'width'=>'900',
                    'height'=>'600',
                    'deleted'=>'Y',
                    'hash'=>'forced hash');
      $result = putApi('synchMedia.php', $data);
      $this->assertEquals(RESPONSE_SUCCESS, $result['resultCode']);

      $this->assertEquals(1, $this->countTestRows());

      $object = new Media($testTripId1, $testMediaId1);
      $this->assertEquals('2015-10-01 00:00:00.000000', $object->getCreated());
      $this->assertEquals('2015-10-02 00:00:00.000000', $object->getUpdated());
      $this->assertEquals('photo', $object->getType());
      $this->assertEquals('Caption Media 1', $object->getCaption());
      $this->assertEquals('2015-09-30 12:03:45', $object->getTimestamp());
      $this->assertEquals('location', $object->getLocation());
      $this->assertEquals('900', $object->getWidth());
      $this->assertEquals('600', $object->getHeight());
      $this->assertEquals("Y", $object->getDeleted());
      $this->assertEquals('forced hash', $object->getHash());
   }
}
?>
