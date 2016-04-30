<?php
include(dirname(__FILE__) . "/../common.php");
include_once("$gl_site_root/common/common.php");

class CommonTest extends PHPUnit_Framework_TestCase {
   public function testGetSystemReturnsActualSystem() {
      // Note: this tests reproduces much of the co_get_system()
      // functionality. Not sure if there's any point in this any more
      $actualSystem = '';
      if (file_exists("/etc/system/jefferson")) {
         // On the "Jefferson" laptop
         $actualSystem = CO_SYSTEM_JEFFERSON;
      } else if (file_exists("/etc/system/washington")) {
         // On the "Washington" server at home
         $actualSystem = CO_SYSTEM_WASHINGTON;
      } else if (file_exists("/etc/system/lincoln")) {
         // On the "Lincoln" laptop
         $actualSystem = CO_SYSTEM_LINCOLN;
      } else {
         // Connect to the database on the public system
         $actualSystem = CO_SYSTEM_PUBLIC;
      }

      $system = co_get_system();
      $this->assertEquals($actualSystem, $system);
   }

   public function testGetUid() {
      $uid1 = co_get_uid();
      $uid2 = co_get_uid();
      $uid3 = co_get_uid();

      $this->assertNotNull($uid1);
      $this->assertNotNull($uid2);
      $this->assertNotNull($uid3);

      $this->assertNotEquals('', $uid1);
      $this->assertNotEquals('', $uid2);
      $this->assertNotEquals('', $uid3);

      $this->assertNotEquals($uid1, $uid2);
      $this->assertNotEquals($uid1, $uid3);
      $this->assertNotEquals($uid2, $uid3);

      $this->assertLessThanOrEqual(32, strlen($uid1));
      $this->assertLessThanOrEqual(32, strlen($uid2));
      $this->assertLessThanOrEqual(32, strlen($uid3));
   }
}
?>
