<?php
include(dirname(__FILE__) . "/../common.php");
include_once("$gl_site_root/database/Setting.php");

class SettingTest extends PHPUnit_Framework_TestCase {
   private $settingName1;
   private $settingName2;

   protected function setUp() {
      global $settingName1, $settingName2;
      $settingName1 = '-test-setting-1';
      $settingName2 = '-test-setting-2';
      $query = "DELETE FROM blogSetting "
         . "WHERE name='$settingName1'"
         .    "OR name='$settingName2'";
      mysql_query($query);
   }

   protected function tearDown() {
      global $settingName1, $settingName2;
      $query = "DELETE FROM blogSetting "
         . "WHERE name='$settingName1'"
         .    "OR name='$settingName2'";
      mysql_query($query);
   }

   private function countTestRows() {
      global $settingName1, $settingName2;
      $query = "SELECT COUNT(updated) FROM blogSetting "
         . "WHERE name='$settingName1' "
         .    "OR name='$settingName2'";
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
    * test #2.
    * Make sure data is wiped before each test.
    */
   public function testDataWipedBeforeTest() {
      $this->assertEquals(0, $this->countTestRows());
   }

   /**
    * Get an invalid value.
    */
   public function testInvalidName() {
      $setting = new Setting();

      $this->assertEquals(0, $this->countTestRows());
      $this->assertEquals('', $setting->get(null));
      $this->assertEquals(0, $this->countTestRows());
      $this->assertEquals('', $setting->get(''));
      $this->assertEquals(0, $this->countTestRows());
   }

   /**
    * Set an invalid name
    */
   public function testSetInvalidName() {
      $setting = new Setting();

      $this->assertEquals(0, $this->countTestRows());

      $this->assertFalse($setting->set(null, 'abc'));
      $this->assertEquals(0, $this->countTestRows());
      $this->assertEquals('', $setting->get(null));

      $this->assertFalse($setting->set('', 'abc'));
      $this->assertEquals(0, $this->countTestRows());
      $this->assertEquals('', $setting->get(''));
   }

   /**
    * Set an invalid value
    */
   public function testSetInvalidValue1() {
      global $settingName1;
      $setting = new Setting();

      $this->assertEquals(0, $this->countTestRows());

      $this->assertFalse($setting->set($settingName1, null));
      $this->assertEquals(0, $this->countTestRows());
      $this->assertEquals('', $setting->get($settingName1));

      $this->assertTrue($setting->set($settingName1, 'abc'));
      $this->assertEquals(1, $this->countTestRows());
      $this->assertEquals('abc', $setting->get($settingName1));
      $this->assertFalse($setting->set($settingName1, null));
      $this->assertEquals(1, $this->countTestRows());
      $this->assertEquals('abc', $setting->get($settingName1));
   }

   /**
    * Set a valid value
    */
   public function testSetValue() {
      global $settingName1;

      $setting = new Setting();
      $this->assertEquals(0, $this->countTestRows());

      $value = $setting->get($settingName1);
      $this->assertEquals('', $value);
      $this->assertEquals(0, $this->countTestRows());

      $setting->set($settingName1, 'abcde');
      $this->assertEquals(1, $this->countTestRows());
   }

   /**
    * Get a value.
    * @depends testSetValue
    */
   public function testGetValue() {
      global $settingName1;

      $this->assertEquals(0, $this->countTestRows());

      $setting = new Setting();
      $setting->set($settingName1, 'abcde');
      $this->assertEquals(1, $this->countTestRows());

      $setting = new Setting();
      $value = $setting->get($settingName1);
      $this->assertEquals('abcde', $value);
   }

   /**
    * Change a value.
    * @depends testGetValue
    * @depends testSetValue
    */
   public function testChangeValue() {
      global $settingName1;

      $setting = new Setting();
      $value = $setting->get($settingName1);
      $this->assertEquals("", $value);

      $this->assertTrue($setting->set($settingName1, "abcde"));
      $value = $setting->get($settingName1);
      $this->assertEquals("abcde", $value);
      $this->assertEquals(1, $this->countTestRows());

      $this->assertTrue($setting->set($settingName1, "fghij"));
      $value = $setting->get($settingName1);
      $this->assertEquals("fghij", $value);
      $this->assertEquals(1, $this->countTestRows());
   }

   /**
    * Set an invalid value.
    * @depends testSetInvalidValue1
    * @depends testSetValue
    * @depends testChangeValue
    */
   public function testSetInvalidValue2() {
      global $settingName1;
      $setting = new Setting();

      $this->assertEquals(0, $this->countTestRows());

      $this->assertTrue($setting->set($settingName1, 'abc'));
      $this->assertEquals(1, $this->countTestRows());
      $this->assertEquals('abc', $setting->get($settingName1));

      $this->assertFalse($setting->set($settingName1, null));
      $this->assertEquals(1, $this->countTestRows());
      $this->assertEquals('abc', $setting->get($settingName1));
   }
}

?>
