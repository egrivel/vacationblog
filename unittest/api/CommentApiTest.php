<?php
include(dirname(__FILE__) . "/../common.php");
include_once("$gl_site_root/database/Trip.php");
include_once("$gl_site_root/database/Comment.php");

class CommentApiTest extends PHPUnit_Framework_TestCase {
   private $testTripId1;
   private $testTripId2;
   private $testCommentId1;
   private $testCommentId2;
   private $testCommentId3;
   private $testCommentId4;

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
      global $testCommentId1, $testCommentId2;
      global $testCommentId3, $testCommentId4;
      $testCommentId1 = '-test-comment-1';
      $testCommentId2 = '-test-comment-2';
      $testCommentId3 = '-test-comment-3';
      $testCommentId4 = '-test-comment-4';
      $query = "DELETE FROM blogComment "
         . " WHERE commentId='$testCommentId1'"
         .    " OR commentId='$testCommentId2'"
         .    " OR commentId='$testCommentId3'"
         .    " OR commentId='$testCommentId4'";
      mysql_query($query);
   }

   protected function tearDown() {
      global $testCommentId1, $testCommentId2;
      global $testCommentId3, $testCommentId4;
      $query = "DELETE FROM blogComment "
         . " WHERE commentId='$testCommentId1'"
         .    " OR commentId='$testCommentId2'"
         .    " OR commentId='$testCommentId3'"
         .    " OR commentId='$testCommentId4'";
      mysql_query($query);
   }

   private function countAllRows() {
      $query = "SELECT COUNT(updated) FROM blogComment";
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
      global $testCommentId1, $testCommentId2;
      global $testCommentId3, $testCommentId4;
      $query = "SELECT COUNT(updated) FROM blogComment"
         . " WHERE commentId='$testCommentId1'"
         .   " OR commentId='$testCommentId2'"
         .   " OR commentId='$testCommentId3'"
         .   " OR commentId='$testCommentId4'";
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
      $result = getApi('getComment.php', $data);
      $this->assertEquals('401', $result['resultCode']);
   }

   /**
    * Test #3. GET request with incomplete parameters.
    */
   public function testGetIncompleteParameter() {
      $data = array('commentId'=>null);
      $result = getApi('getComment.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $data = array('commentId'=>'');
      $result = getApi('getComment.php', $data);
      $this->assertEquals('401', $result['resultCode']);
   }

   /**
    * Test #4. GET request for non-existent object.
    * @depends testDataWipedBeforeTest
    */
   public function testGetNonExistent() {
      global $testTripId1, $testCommentId1;
      $data = array('tripId'=>$testTripId1,
                    'commentId'=>$testCommentId1);
      $result = getApi('getComment.php', $data);
      $this->assertEquals('404', $result['resultCode']);
   }

   /**
    * Test #5. GET request for an existent object.
    * @depends testDataWipedBeforeTest
    */
   public function testGetExistent() {
      global $testTripId1;
      global $testCommentId1;

      $this->assertEquals(0, $this->countTestRows());

      // Create the object and set attributes
      $object = new Comment($testTripId1, $testCommentId1);
      $object->setUserId('user');
      $object->setReferenceId('-reference-1');
      $object->setCommentText('Comment Text');
      $object->setDeleted('Y');

      // Save the object and confirm a row is added to the database
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());
      
      $data = array('tripId'=>$testTripId1,
                    'commentId'=>$testCommentId1);

      $result = getApi('getComment.php', $data);
      $this->assertEquals('200', $result['resultCode']);

      $this->assertTrue(isset($result['tripId']));
      $this->assertTrue(isset($result['commentId']));
      $this->assertTrue(isset($result['created']));
      $this->assertTrue(isset($result['updated']));
      $this->assertTrue(isset($result['userId']));
      $this->assertTrue(isset($result['referenceId']));
      $this->assertTrue(isset($result['commentText']));
      $this->assertTrue(isset($result['deleted']));
      // hash field is not returned by GET
      $this->assertFalse(isset($result['hash']));

      $this->assertEquals($testTripId1, $result['tripId']);
      $this->assertEquals($testCommentId1, $result['commentId']);
      $this->assertEquals($object->getCreated(), $result['created']);
      $this->assertEquals($object->getUpdated(), $result['updated']);
      $this->assertEquals('user', $result['userId']);
      $this->assertEquals('-reference-1', $result['referenceId']);
      $this->assertEquals('Comment Text', $result['commentText']);
      $this->assertEquals('Y', $result['deleted']);
   }

   /**
    * Extra test. GET with reference ID.
    * @depends testGetExistent
    */
   public function testGetByReference() {
      global $testTripId1;
      global $testCommentId1;
      global $testCommentId2;
      global $testCommentId3;
      global $testCommentId4;

      $this->assertEquals(0, $this->countTestRows());

      // Blank reference ID gives error
      $data = array('tripId'=>$testTripId1,
                    'referenceId'=>'');

      $result = getApi('getComment.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      // Missing trip ID gives error
      $data = array('tripId'=>'',
                    'referenceId'=>$testCommentId1);

      $result = getApi('getComment.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      // Create a simple structure, starting at comment 1, which comments
      // 2 and three as its children, and comment 4 a child of 3
      $object = new Comment($testTripId1, $testCommentId1);
      $this->assertTrue($object->save());

      $object = new Comment($testTripId1, $testCommentId2);
      $object->setReferenceId($testCommentId1);
      $this->assertTrue($object->save());

      $object = new Comment($testTripId1, $testCommentId3);
      $object->setReferenceId($testCommentId1);
      $this->assertTrue($object->save());

      $object = new Comment($testTripId1, $testCommentId4);
      $object->setReferenceId($testCommentId3);
      $this->assertTrue($object->save());

      $this->assertEquals(4, $this->countTestRows());

      $data = array('tripId'=>$testTripId1,
                    'referenceId'=>$testCommentId1);

      $result = getApi('getComment.php', $data);
      $this->assertEquals('200', $result['resultCode']);

      $this->assertTrue(isset($result['list']));
      $this->assertTrue(isset($result['count']));
      $this->assertFalse(isset($result['tripId']));
      $this->assertFalse(isset($result['commentId']));

      $this->assertEquals(2, $result['count']);
      for ($i = 0; $i < $result['count']; $i++) {
         $this->assertTrue(isset($result['list'][$i]), "List item $i exists");
         $item = $result['list'][$i];

         $this->assertTrue(isset($item['tripId']), "In list item $i");
         $this->assertTrue(isset($item['commentId']), "In list item $i");
         $this->assertTrue(isset($item['created']));
         $this->assertTrue(isset($item['updated']));
         $this->assertTrue(isset($item['userId']));
         $this->assertTrue(isset($item['referenceId']));
         $this->assertTrue(isset($item['commentText']));
         $this->assertTrue(isset($item['deleted']));
         // hash field is not returned by GET
         $this->assertFalse(isset($item['hash']));

         $this->assertEquals($testTripId1, $item['tripId']);
      }
      $this->assertEquals($testCommentId2, $result['list'][0]['commentId']);
      $this->assertEquals($testCommentId3, $result['list'][1]['commentId']);

      $data = array('tripId'=>$testTripId1,
                    'referenceId'=>$testCommentId2);

      $result = getApi('getComment.php', $data);
      $this->assertEquals('200', $result['resultCode']);

      $this->assertTrue(isset($result['list']));
      $this->assertTrue(isset($result['count']));
      $this->assertFalse(isset($result['tripId']));
      $this->assertFalse(isset($result['commentId']));

      $this->assertEquals(0, $result['count']);


      $data = array('tripId'=>$testTripId1,
                    'referenceId'=>$testCommentId3);

      $result = getApi('getComment.php', $data);
      $this->assertEquals('200', $result['resultCode']);

      $this->assertTrue(isset($result['list']));
      $this->assertTrue(isset($result['count']));
      $this->assertFalse(isset($result['tripId']));
      $this->assertFalse(isset($result['commentId']));

      $this->assertEquals(1, $result['count']);
      for ($i = 0; $i < $result['count']; $i++) {
         $this->assertTrue(isset($result['list'][$i]), "List item $i exists");
         $item = $result['list'][$i];

         $this->assertTrue(isset($item['tripId']), "In list item $i");
         $this->assertTrue(isset($item['commentId']), "In list item $i");
         $this->assertTrue(isset($item['created']));
         $this->assertTrue(isset($item['updated']));
         $this->assertTrue(isset($item['userId']));
         $this->assertTrue(isset($item['referenceId']));
         $this->assertTrue(isset($item['commentText']));
         $this->assertTrue(isset($item['deleted']));
         // hash field is not returned by GET
         $this->assertFalse(isset($item['hash']));

         $this->assertEquals($testTripId1, $item['tripId']);
      }
      $this->assertEquals($testCommentId4, $result['list'][0]['commentId']);

      $data = array('tripId'=>$testTripId1,
                    'referenceId'=>$testCommentId4);

      $result = getApi('getComment.php', $data);
      $this->assertEquals('200', $result['resultCode']);

      $this->assertTrue(isset($result['list']));
      $this->assertTrue(isset($result['count']));
      $this->assertFalse(isset($result['tripId']));
      $this->assertFalse(isset($result['commentId']));

      $this->assertEquals(0, $result['count']);
   }

   /**
    * Test #6. PUT request with no parameters.
    */
   public function testPutNoParameters() {
      $this->assertEquals(0, $this->countTestRows());

      $data = array();
      $result = putApi('putComment.php', $data);
      $this->assertEquals('401', $result['resultCode']);
   }
      
   /**
    * Test #7. PUT request with invalid parameters.
    */
   public function testPutInvalidParameters() {
      $this->assertEquals(0, $this->countTestRows());

      $data = array('tripId'=>null,
                    'commentId'=>null);
      $result = putApi('putComment.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $this->assertEquals(0, $this->countTestRows());

      $data = array('tripId'=>'',
                    'commentId'=>'');
      $result = putApi('putComment.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $this->assertEquals(0, $this->countTestRows());
   }
      
   /**
    * Test #8. PUT request create new object.
    */
   public function testPutCreate() {
      global $testTripId1;
      global $testCommentId1;

      $this->assertEquals(0, $this->countTestRows());

      $data = array('tripId'=>$testTripId1,
                    'commentId'=>$testCommentId1,
                    'created'=>'2015-10-01',
                    'updated'=>'2015-10-02',
                    'userId'=>'user',
                    'referenceId'=>'-reference-1',
                    'commentText'=>'Comment Text',
                    'deleted'=>'Y',
                    'hash'=>'forced hash');
      $result = putApi('putComment.php', $data);
      $this->assertEquals('200', $result['resultCode']);

      $this->assertEquals(1, $this->countTestRows());

      $object = new Comment($testTripId1, $testCommentId1);
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testCommentId1, $object->getCommentId());
      // Created and updated fields can NOT be set by the PUT command;
      // the automatic values are set, not the ones passed
      $this->assertNotNull($object->getCreated());
      $this->assertNotEquals('', $object->getCreated());
      $this->assertNotEquals('2015-10-01', $object->getCreated());
      $this->assertNotNull($object->getUpdated());
      $this->assertNotEquals('', $object->getUpdated());
      $this->assertNotEquals('2015-10-02', $object->getUpdated());
      $this->assertEquals('user', $object->getUserId());
      $this->assertEquals('-reference-1', $object->getReferenceId());
      $this->assertEquals('Comment Text', $object->getCommentText());
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
   public function testUpdateComment() {
      global $testTripId1;
      global $testCommentId1;

      $object = new Comment($testTripId1, $testCommentId1);
      $object->setUserId("user");
      $object->setReferenceId("-reference-1");
      $object->setCommentText("Comment Text");
      $object->setDeleted('N');
      $object->save();

      $this->assertEquals(1, $this->countTestRows());

      $data = array('tripId'=>$testTripId1,
                    'commentId'=>$testCommentId1,
                    'created'=>'2015-10-01',
                    'updated'=>'2015-10-02',
                    'userId'=>'user-2',
                    'referenceId'=>'-reference-2',
                    'commentText'=>'Comment Text 2',
                    'deleted'=>'Y',
                    'hash'=>'forced hash');
      $result = putApi('putComment.php', $data);
      $this->assertEquals('200', $result['resultCode']);

      $this->assertEquals(2, $this->countTestRows());

      $object = new Comment($testTripId1, $testCommentId1);
      $this->assertEquals($testTripId1, $object->getTripId());
      $this->assertEquals($testCommentId1, $object->getCommentId());
      $this->assertEquals('user-2', $object->getUserId());
      $this->assertEquals('-reference-2', $object->getReferenceId());
      $this->assertEquals('Comment Text 2', $object->getCommentText());
      $this->assertEquals('Y', $object->getDeleted());
   }

   /**
    * Test #10. SYNCH get with invalid parameters
    * @depends testDataWipedBeforeTest
    */
   public function testSynchGetInvalid() {
      $data = array();
      $result = getApi('synchComment.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $data = array('hash'=>'');
      $result = getApi('synchComment.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $data = array('hash'=>'non-existent');
      $result = getApi('synchComment.php', $data);
      $this->assertEquals('404', $result['resultCode']);
   }

   /**
    * Test #11. SYNCH get an existent object.
    * @depends testDataWipedBeforeTest
    * @depends testGetExistent
    */
   public function testSynchGet() {
      global $testTripId1;
      global $testCommentId1;

      // Create the object and set attributes
      $object = new Comment($testTripId1, $testCommentId1);
      $object->setUserId('user');
      $object->setReferenceId('-reference-1');
      $object->setCommentText('Comment Text');
      $object->setDeleted('Y');

      // Save the object and confirm a row is added to the database
      $this->assertTrue($object->save());
      $this->assertEquals(1, $this->countTestRows());
      
      $data = array('hash'=>$object->getHash());
      $result = getApi('synchComment.php', $data);
      $this->assertEquals('200', $result['resultCode']);

      $this->assertTrue(isset($result['tripId']));
      $this->assertTrue(isset($result['commentId']));
      $this->assertTrue(isset($result['created']));
      $this->assertTrue(isset($result['updated']));
      $this->assertTrue(isset($result['userId']));
      $this->assertTrue(isset($result['referenceId']));
      $this->assertTrue(isset($result['commentText']));
      $this->assertTrue(isset($result['deleted']));
      $this->assertTrue(isset($result['hash']));

      $this->assertEquals($testTripId1, $result['tripId']);
      $this->assertEquals($testCommentId1, $result['commentId']);
      $this->assertEquals($object->getCreated(), $result['created']);
      $this->assertEquals($object->getUpdated(), $result['updated']);
      $this->assertEquals('user', $result['userId']);
      $this->assertEquals('-reference-1', $result['referenceId']);
      $this->assertEquals('Comment Text', $result['commentText']);
      $this->assertEquals('Y', $result['deleted']);
      $this->assertEquals($object->getHash(), $result['hash']);
   }

   /**
    * Test #12. SYNCH put request without data.
    */
   public function testSynchPutInvalid() {
      global $testTripId1;
      global $testCommentId1;

      $this->assertEquals(0, $this->countTestRows());

      $data = array();
      $result = putApi('synchComment.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $data = array('tripId'=>'');
      $result = getApi('synchComment.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $data = array('commentId'=>'');
      $result = getApi('synchComment.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $data = array('tripId'=>$testTripId1);
      $result = getApi('synchComment.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $data = array('commentId'=>$testCommentId1);
      $result = getApi('synchComment.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $data = array('tripId'=>$testTripId1,
                    'commentId'=>'');
      $result = getApi('synchComment.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $data = array('tripId'=>'',
                    'commentId'=>$testCommentId1);
      $result = getApi('synchComment.php', $data);
      $this->assertEquals('401', $result['resultCode']);

      $this->assertEquals(0, $this->countTestRows());
   }
      
   /**
    * Test #13. SYNCH request write new object.
    */
   public function testSynchPut() {
      global $testTripId1, $testCommentId1;

      $this->assertEquals(0, $this->countTestRows());

      $data = array('tripId'=>$testTripId1,
                    'commentId'=>$testCommentId1,
                    'created'=>'2015-10-01',
                    'updated'=>'2015-10-02',
                    'userId'=>'user',
                    'referenceId'=>'-reference-1',
                    'commentText'=>'Comment Text',
                    'deleted'=>'Y',
                    'hash'=>'forced hash');
      $result = putApi('synchComment.php', $data);
      $this->assertEquals('200', $result['resultCode']);

      $this->assertEquals(1, $this->countTestRows());

      $object = new Comment($testTripId1, $testCommentId1);
      $this->assertEquals('2015-10-01 00:00:00.000000', $object->getCreated());
      $this->assertEquals('2015-10-02 00:00:00.000000', $object->getUpdated());
      $this->assertEquals('user', $object->getUserId());
      $this->assertEquals('-reference-1', $object->getReferenceId());
      $this->assertEquals('Comment Text', $object->getCommentText());
      $this->assertEquals("Y", $object->getDeleted());
      $this->assertEquals('forced hash', $object->getHash());
   }
}
?>
