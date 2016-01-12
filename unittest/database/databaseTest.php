<?php
include(dirname(__FILE__) . "/../common.php");
include_once("$gl_site_root/database/database.php");
include_once("$gl_site_root/database/Setting.php");
include_once("$gl_site_root/database/User.php");
include_once("$gl_site_root/database/Trip.php");
include_once("$gl_site_root/database/TripAttribute.php");
include_once("$gl_site_root/database/TripUser.php");
include_once("$gl_site_root/database/Media.php");
include_once("$gl_site_root/database/Journal.php");
include_once("$gl_site_root/database/Comment.php");
include_once("$gl_site_root/database/Feedback.php");
include_once("$gl_site_root/database/Auth.php");

class DatabaseTest extends PHPUnit_Framework_TestCase {
   // Set of pairs to used for the test. Each value is an array, with the
   // first element in the array the raw value and the second element in
   // the array the corresponding encoded value.
   private $values = [
                      // special values (null, blank)
                      [null, "null"],
                      ["", "''"],
                      // single regular character
                      ["a", "'a'"],
                      ["A", "'A'"],
                      [" ", "' '"],
                      // single special character
                      ["&", "'&amp;'"],
                      ["'", "'&apos;'"],
                      ["\"", "'\"'"],
                      ["\r", "'&lf;'"],
                      ["\n", "'&nl;'"],
                      // multiple regular characters
                      ["abc", "'abc'"],
                      ["ABC", "'ABC'"],
                      [" a b c ", "' a b c '"],
                      // multiple special characters
                      ["&&&", "'&amp;&amp;&amp;'"],
                      ["'''", "'&apos;&apos;&apos;'"],
                      ["\"\"\"", "'\"\"\"'"],
                      ["\r\n\r\n", "'&lf;&nl;&lf;&nl;'"]
                      ];
   public function testDbSqlEncode() {
      for ($i = 0; $i < count($this->values); $i++) {
         $this->assertEquals($this->values[$i][1],
                             db_sql_encode($this->values[$i][0]));
      }
   }

   public function testDbSqlDecode() {
      for ($i = 0; $i < count($this->values); $i++) {
         $this->assertEquals($this->values[$i][0],
                             db_sql_decode($this->values[$i][1]));
      }
   }

   public function testDbSqlRecode() {
      for ($i = 0; $i < count($this->values); $i++) {
         $this->assertEquals($this->values[$i][1],
                             db_sql_recode($this->values[$i][1]));
      }
   }

   // make sure that the decode handles invalid values properly
   public function testDbSqlDecodeInvalidValues() {
      // unquoted string
      $this->assertEquals("abc", db_sql_decode("abc"));
      // single quote
      $this->assertEquals("", db_sql_decode("'"));
      // missing start quote
      $this->assertEquals("abc", db_sql_decode("abc'"));
      // missing end quote
      $this->assertEquals("abc", db_sql_decode("'abc"));
      // containing unencoded values
      $this->assertEquals("a&bc", db_sql_decode("a&bc"));
      $this->assertEquals("a'bc", db_sql_decode("a'bc"));
      $this->assertEquals("a\rbc", db_sql_decode("a\rbc"));
      $this->assertEquals("a\nbc", db_sql_decode("a\nbc"));
      $this->assertEquals("a&amp ;bc", db_sql_decode("a&amp ;bc"));
   }

   public function testUpdateDatabase() {
      $version = Setting::getDataVersion();
      $this->assertTrue(Auth::updateTables($version));
      $this->assertTrue(Comment::updateTables($version));
      $this->assertTrue(Feedback::updateTables($version));
      $this->assertTrue(Journal::updateTables($version));
      $this->assertTrue(Media::updateTables($version));
      $this->assertTrue(Trip::updateTables($version));
      $this->assertTrue(TripAttribute::updateTables($version));
      $this->assertTrue(TripUser::updateTables($version));
      $this->assertTrue(User::updateTables($version));
      // Note: make sure the Settings::updateTables is last: when any of the
      // above fail, the data version in the database should NOT be updated!
      $this->assertTrue(Setting::updateTables($version));
   }     
}

?>
