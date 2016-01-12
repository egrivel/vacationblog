<?php
include(dirname(__FILE__) . "/../common.php");
include_once("$gl_site_root/database/Trip.php");
include_once("$gl_site_root/database/Journal.php");

class JournalApiTest extends PHPUnit_Framework_TestCase {
   private $testTripId1;
   private $testTripId2;
   private $testJournalId1;
   private $testJournalId2;
   private $testJournalId3;
   private $testJournalId4;

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
      global $testJournalId1, $testJournalId2;
      global $testJournalId3, $testJournalId4;
      $testJournalId1 = '-test-journal-1';
      $testJournalId2 = '-test-journal-2';
      $testJournalId3 = '-test-journal-3';
      $testJournalId4 = '-test-journal-4';
      $query = "DELETE FROM blogJournal "
         . " WHERE journalId='$testJournalId1' "
         .    " OR journalId='$testJournalId2' "
         .    " OR journalId='$testJournalId3' "
         .    " OR journalId='$testJournalId4' ";
      mysql_query($query);
   }

   protected function tearDown() {
      global $testJournalId1, $testJournalId2;
      global $testJournalId3, $testJournalId4;
      $query = "DELETE FROM blogJournal "
         . " WHERE journalId='$testJournalId1' "
         .    " OR journalId='$testJournalId2' "
         .    " OR journalId='$testJournalId3' "
         .    " OR journalId='$testJournalId4' ";
      mysql_query($query);
   }

   private function countAllRows() {
      $query = "SELECT COUNT(updated) FROM blogJournal";
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
      global $testJournalId1, $testJournalId2;
      global $testJournalId3, $testJournalId4;
      $query = "SELECT COUNT(updated) FROM blogJournal"
         . " WHERE journalId='$testJournalId1' "
         .   " OR journalId='$testJournalId2' "
         .   " OR journalId='$testJournalId3' "
         .   " OR journalId='$testJournalId4' ";
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
      $result = getApi('getJournal.php', $data);
      $this->assertEquals('401', $result['resultCode']);
   }

   /**
    * Test #3. GET request with incomplete parameters.
    */
   public function testGetIncompleteParameter() {
      $data = array('journalId'=>null);
      $result = getApi('getJournal.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $data = array('journalId'=>'');
      $result = getApi('getJournal.php', $data);
      $this->assertEquals('401', $result['resultCode']);
   }

   /**
    * Test #4. GET request for non-existent object.
    * @depends testDataWipedBeforeTest
    */
   public function testGetNonExistent() {
      global $testTripId1, $testJournalId1;
      $data = array('tripId'=>$testTripId1,
                    'journalId'=>$testJournalId1);
      $result = getApi('getJournal.php', $data);
      $this->assertEquals('404', $result['resultCode']);
   }

   /**
    * Test #5. GET request for an existent object.
    * @depends testDataWipedBeforeTest
    */
   public function testGetExistent() {
      global $testTripId1;
      global $testJournalId1;

      $this->assertEquals(0, $this->countTestRows());

      // Create the object and set attributes
      $object = new Journal($testTripId1, $testJournalId1);
      $object->setUserId('user');
      $object->setJournalDate('2015-09-30');
      $object->setJournalTitle('Journal Title');
      $object->setJournalText('Journal Text');
      $object->setDeleted('Y');

      // Save the object and confirm a row is added to the database
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());
      
      $data = array('tripId'=>$testTripId1,
                    'journalId'=>$testJournalId1);

      $result = getApi('getJournal.php', $data);
      $this->assertEquals('200', $result['resultCode']);

      $this->assertTrue(isset($result['tripId']));
      $this->assertTrue(isset($result['journalId']));
      $this->assertTrue(isset($result['created']));
      $this->assertTrue(isset($result['updated']));
      $this->assertTrue(isset($result['userId']));
      $this->assertTrue(isset($result['journalDate']));
      $this->assertTrue(isset($result['journalTitle']));
      $this->assertTrue(isset($result['journalText']));
      $this->assertTrue(isset($result['deleted']));
      // hash field is not returned by GET
      $this->assertFalse(isset($result['hash']));

      $this->assertEquals($testTripId1, $result['tripId']);
      $this->assertEquals($testJournalId1, $result['journalId']);
      $this->assertEquals($object->getCreated(), $result['created']);
      $this->assertEquals($object->getUpdated(), $result['updated']);
      $this->assertEquals('user', $result['userId']);
      $this->assertEquals('2015-09-30', $result['journalDate']);
      $this->assertEquals('Journal Title', $result['journalTitle']);
      $this->assertEquals('Journal Text', $result['journalText']);
      $this->assertEquals('Y', $result['deleted']);
   }

   /**
    * Extra test. Get 'prev' and 'next fields.
    * @depends testGetExistent
    */
   public function testGetPrevNext() {
      global $testTripId1;
      global $testJournalId1;
      global $testJournalId2;
      global $testJournalId3;
      global $testJournalId4;

      $this->assertEquals(0, $this->countTestRows());

      // Create the four trip objects
      $object = new Journal($testTripId1, $testJournalId1);
      $object->setUserId('user');
      $object->setJournalDate('2015-10-01');
      $object->setJournalTitle('Journal Title 1');
      $object->setJournalText('Journal Text 1');
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());
      
      $object = new Journal($testTripId1, $testJournalId2);
      $object->setUserId('user');
      $object->setJournalDate('2015-10-02');
      $object->setJournalTitle('Journal Title 2');
      $object->setJournalText('Journal Text 2');
      $this->assertTrue($object->save());
      $this->assertEquals(2, $this->countTestRows());

      $object = new Journal($testTripId1, $testJournalId3);
      $object->setUserId('user');
      $object->setJournalDate('2015-10-03');
      $object->setJournalTitle('Journal Title 3');
      $object->setJournalText('Journal Text 3');
      $this->assertTrue($object->save());
      $this->assertEquals(3, $this->countTestRows());

      $object = new Journal($testTripId1, $testJournalId4);
      $object->setUserId('user');
      $object->setJournalDate('2015-10-04');
      $object->setJournalTitle('Journal Title 4');
      $object->setJournalText('Journal Text 4');
      $this->assertTrue($object->save());
      $this->assertEquals(4, $this->countTestRows());

      // Get item 1 and test result
      $data = array('tripId'=>$testTripId1,
                    'journalId'=>$testJournalId1);

      $result = getApi('getJournal.php', $data);
      $this->assertEquals('200', $result['resultCode']);

      $this->assertTrue(isset($result['journalId']));
      $this->assertFalse(isset($result['prevId']));
      $this->assertTrue(isset($result['nextId']));

      $this->assertEquals($testJournalId1, $result['journalId']);
      //$this->assertNull($result['prevId']);
      $this->assertEquals($testJournalId2, $result['nextId']);

      // Get item 2 and test result
      $data = array('tripId'=>$testTripId1,
                    'journalId'=>$testJournalId2);

      $result = getApi('getJournal.php', $data);
      $this->assertEquals('200', $result['resultCode']);

      $this->assertTrue(isset($result['journalId']));
      $this->assertTrue(isset($result['prevId']));
      $this->assertTrue(isset($result['nextId']));

      $this->assertEquals($testJournalId2, $result['journalId']);
      $this->assertEquals($testJournalId1, $result['prevId']);
      $this->assertEquals($testJournalId3, $result['nextId']);

      // Get item 3 and test result
      $data = array('tripId'=>$testTripId1,
                    'journalId'=>$testJournalId3);

      $result = getApi('getJournal.php', $data);
      $this->assertEquals('200', $result['resultCode']);

      $this->assertTrue(isset($result['journalId']));
      $this->assertTrue(isset($result['prevId']));
      $this->assertTrue(isset($result['nextId']));

      $this->assertEquals($testJournalId3, $result['journalId']);
      $this->assertEquals($testJournalId2, $result['prevId']);
      $this->assertEquals($testJournalId4, $result['nextId']);

      // Get item 4 and test result
      $data = array('tripId'=>$testTripId1,
                    'journalId'=>$testJournalId4);

      $result = getApi('getJournal.php', $data);
      $this->assertEquals('200', $result['resultCode']);

      $this->assertTrue(isset($result['journalId']));
      $this->assertTrue(isset($result['prevId']));
      $this->assertFalse(isset($result['nextId']));

      $this->assertEquals($testJournalId4, $result['journalId']);
      $this->assertEquals($testJournalId3, $result['prevId']);
      //$this->assertEquals('', $result['nextId']);
   }

   /**
    * Test #6. PUT request with no parameters.
    */
   public function testPutNoParameters() {
      $this->assertEquals(0, $this->countTestRows());

      $data = array();
      $result = putApi('putJournal.php', $data);
      $this->assertEquals('401', $result['resultCode']);
   }
      
   /**
    * Test #7. PUT request with invalid parameters.
    */
   public function testPutInvalidParameters() {
      $this->assertEquals(0, $this->countTestRows());

      $data = array('tripId'=>null,
                    'journalId'=>null);
      $result = putApi('putJournal.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $this->assertEquals(0, $this->countTestRows());

      $data = array('tripId'=>'',
                    'journalId'=>'');
      $result = putApi('putJournal.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $this->assertEquals(0, $this->countTestRows());
   }
      
   /**
    * Test #8. PUT request create new object.
    */
   public function testPutCreate() {
      global $testTripId1;
      global $testJournalId1;

      $this->assertEquals(0, $this->countTestRows());

      $data = array('tripId'=>$testTripId1,
                    'journalId'=>$testJournalId1,
                    'created'=>'2015-10-01',
                    'updated'=>'2015-10-02',
                    'userId'=>'user',
                    'journalDate'=>'2015-09-30',
                    'journalTitle'=>'Journal Title',
                    'journalText'=>'Journal Text',
                    'deleted'=>'Y',
                    'hash'=>'forced hash');
      $result = putApi('putJournal.php', $data);
      $this->assertEquals('200', $result['resultCode']);

      $this->assertEquals(1, $this->countTestRows());

      $object = new Journal($testTripId1, $testJournalId1);
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testJournalId1, $object->getJournalId());
      // Created and updated fields can NOT be set by the PUT command;
      // the automatic values are set, not the ones passed
      $this->assertNotNull($object->getCreated());
      $this->assertNotEquals('', $object->getCreated());
      $this->assertNotEquals('2015-10-01', $object->getCreated());
      $this->assertNotNull($object->getUpdated());
      $this->assertNotEquals('', $object->getUpdated());
      $this->assertNotEquals('2015-10-02', $object->getUpdated());
      $this->assertEquals('user', $object->getUserId());
      $this->assertEquals('2015-09-30', $object->getJournalDate());
      $this->assertEquals('Journal Title', $object->getJournalTitle());
      $this->assertEquals('Journal Text', $object->getJournalText());
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
   public function testUpdateJournal() {
      global $testTripId1;
      global $testJournalId1;

      $object = new Journal($testTripId1, $testJournalId1);
      $object->setUserId("user");
      $object->setJournalDate("2015-09-30");
      $object->setJournalTitle("Journal Title");
      $object->setJournalText("Journal Text");
      $object->setDeleted('N');
      $object->save();

      $this->assertEquals(1, $this->countTestRows());

      $data = array('tripId'=>$testTripId1,
                    'journalId'=>$testJournalId1,
                    'created'=>'2015-10-01',
                    'updated'=>'2015-10-02',
                    'userId'=>'user-2',
                    'journalDate'=>'2015-10-01',
                    'journalTitle'=>'Journal Title 2',
                    'journalText'=>'Journal Text 2',
                    'deleted'=>'Y',
                    'hash'=>'forced hash');
      $result = putApi('putJournal.php', $data);
      $this->assertEquals('200', $result['resultCode']);

      $this->assertEquals(2, $this->countTestRows());

      $object = new Journal($testTripId1, $testJournalId1);
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testJournalId1, $object->getJournalId());
      $this->assertEquals('user-2', $object->getUserId());
      $this->assertEquals('2015-10-01', $object->getJournalDate());
      $this->assertEquals('Journal Title 2', $object->getJournalTitle());
      $this->assertEquals('Journal Text 2', $object->getJournalText());
      $this->assertEquals('Y', $object->getDeleted());
   }

   /**
    * Test #10. SYNCH get with invalid parameters
    * @depends testDataWipedBeforeTest
    */
   public function testSynchGetInvalid() {
      $data = array();
      $result = getApi('synchJournal.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $data = array('hash'=>'');
      $result = getApi('synchJournal.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $data = array('hash'=>'non-existent');
      $result = getApi('synchJournal.php', $data);
      $this->assertEquals('404', $result['resultCode']);
   }

   /**
    * Test #11. SYNCH get an existent object.
    * @depends testDataWipedBeforeTest
    * @depends testGetExistent
    */
   public function testSynchGet() {
      global $testTripId1;
      global $testJournalId1;

      // Create the object and set attributes
      $object = new Journal($testTripId1, $testJournalId1);
      $object->setUserId('user');
      $object->setJournalDate('2015-09-30');
      $object->setJournalTitle('Journal Title');
      $object->setJournalText('Journal Text');
      $object->setDeleted('Y');

      // Save the object and confirm a row is added to the database
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());
      
      $data = array('hash'=>$object->getHash());
      $result = getApi('synchJournal.php', $data);
      $this->assertEquals('200', $result['resultCode']);

      $this->assertTrue(isset($result['tripId']));
      $this->assertTrue(isset($result['journalId']));
      $this->assertTrue(isset($result['created']));
      $this->assertTrue(isset($result['updated']));
      $this->assertTrue(isset($result['userId']));
      $this->assertTrue(isset($result['journalDate']));
      $this->assertTrue(isset($result['journalTitle']));
      $this->assertTrue(isset($result['journalText']));
      $this->assertTrue(isset($result['deleted']));
      $this->assertTrue(isset($result['hash']));

      $this->assertEquals($testTripId1, $result['tripId']);
      $this->assertEquals($testJournalId1, $result['journalId']);
      $this->assertEquals($object->getCreated(), $result['created']);
      $this->assertEquals($object->getUpdated(), $result['updated']);
      $this->assertEquals('user', $result['userId']);
      $this->assertEquals('2015-09-30', $result['journalDate']);
      $this->assertEquals('Journal Title', $result['journalTitle']);
      $this->assertEquals('Journal Text', $result['journalText']);
      $this->assertEquals('Y', $result['deleted']);
      $this->assertEquals($object->getHash(), $result['hash']);
   }

   /**
    * Test #12. SYNCH put request without data.
    */
   public function testSynchPutInvalid() {
      global $testTripId1;
      global $testJournalId1;

      $this->assertEquals(0, $this->countTestRows());

      $data = array();
      $result = putApi('synchJournal.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $data = array('tripId'=>'');
      $result = putApi('synchJournal.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $data = array('journalId'=>'');
      $result = putApi('synchJournal.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $data = array('tripId'=>$testTripId1);
      $result = putApi('synchJournal.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $data = array('journalId'=>$testJournalId1);
      $result = putApi('synchJournal.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $data = array('tripId'=>$testTripId1,
                    'journalId'=>'');
      $result = putApi('synchJournal.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $data = array('tripId'=>'',
                    'journalId'=>$testJournalId1);
      $result = putApi('synchJournal.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $this->assertEquals(0, $this->countTestRows());
   }
      
   /**
    * Test #13. SYNCH request write new object.
    */
   public function testSynchPut() {
      global $testTripId1, $testJournalId1;

      $this->assertEquals(0, $this->countTestRows());

      $data = array('tripId'=>$testTripId1,
                    'journalId'=>$testJournalId1,
                    'created'=>'2015-10-01',
                    'updated'=>'2015-10-02',
                    'userId'=>'user',
                    'journalDate'=>'2015-09-30',
                    'journalTitle'=>'Journal Title',
                    'journalText'=>'Journal Text',
                    'deleted'=>'Y',
                    'hash'=>'forced hash');
      $result = putApi('synchJournal.php', $data);
      $this->assertEquals('200', $result['resultCode']);

      $this->assertEquals(1, $this->countTestRows());

      $object = new Journal($testTripId1, $testJournalId1);
      $this->assertEquals('2015-10-01 00:00:00.000000', $object->getCreated());
      $this->assertEquals('2015-10-02 00:00:00.000000', $object->getUpdated());
      $this->assertEquals('user', $object->getUserId());
      $this->assertEquals('2015-09-30', $object->getJournalDate());
      $this->assertEquals('Journal Title', $object->getJournalTitle());
      $this->assertEquals('Journal Text', $object->getJournalText());
      $this->assertEquals("Y", $object->getDeleted());
      $this->assertEquals('forced hash', $object->getHash());
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
      global $testTripId1, $testJournalId1;

      $largeText = $this->getLargeText(15000);

      $this->assertEquals(0, $this->countTestRows());

      $data = array('tripId'=>$testTripId1,
                    'journalId'=>$testJournalId1,
                    'created'=>'2015-10-01',
                    'updated'=>'2015-10-02',
                    'userId'=>'user',
                    'journalDate'=>'2015-09-30',
                    'journalTitle'=>'Journal Title',
                    'journalText'=>$largeText,
                    'deleted'=>'Y',
                    'hash'=>'forced hash');
      $result = putApi('synchJournal.php', $data);
      $this->assertEquals('200', $result['resultCode']);

      $this->assertEquals(1, $this->countTestRows());

      $object = new Journal($testTripId1, $testJournalId1);
      $this->assertEquals('2015-10-01 00:00:00.000000', $object->getCreated());
      $this->assertEquals('2015-10-02 00:00:00.000000', $object->getUpdated());
      $this->assertEquals('user', $object->getUserId());
      $this->assertEquals('2015-09-30', $object->getJournalDate());
      $this->assertEquals('Journal Title', $object->getJournalTitle());
      $this->assertEquals($largeText, $object->getJournalText());
      $this->assertEquals("Y", $object->getDeleted());
      $this->assertEquals('forced hash', $object->getHash());
   }
}
?>
