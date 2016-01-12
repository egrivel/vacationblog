<?php
include(dirname(__FILE__) . "/../common.php");
include_once("$gl_site_root/common/common.php");

class CommonTest extends PHPUnit_Framework_TestCase {
   public function testGetSystemReturnsWashington() {
      $system = co_get_system();
      $this->assertEquals(CO_SYSTEM_WASHINGTON, $system);
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
