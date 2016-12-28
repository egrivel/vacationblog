<?php
include_once(dirname(__FILE__) . "/database.php");

class Setting {

   /* ============================================================ */
   /* Private functions                                            */
   /* ============================================================ */

   private static function createSettingTable() {
      $updateDefault = db_get_update_default();
      $query = "CREATE TABLE IF NOT EXISTS blogSetting("
         . "name CHAR(32) NOT NULL, "
         . "value TEXT, "
         . "updated TIMESTAMP(6) DEFAULT $updateDefault, "
         . "PRIMARY KEY(name)"
         .")";
      if (!mysql_query($query)) {
         print $query . "<br/>";
         print "Error: " . mysql_error() . "<br/>";
      }
   }

   private function getCurrentVersion() {
      return "v0.18";
   }

   /* ============================================================ */
   /* Public functions                                             */
   /* ============================================================ */

   /**
    * Update the database structure if needed. This function includes all
    * the incremental steps needed to bring the database up to the latest
    * standard.
    * Basically, this function is a big switch on the data version value
    * with each case falling through to the next one.
    */
   public static function updateTables($dataVersion) {
      switch ($dataVersion) {
      case "":
         // No data version yet - create initial table and set version number
         Setting::createSettingTable();
         Setting::set("DataVersion", Setting::getCurrentVersion());
         break;
      case "v0.1":
      case "v0.2":
      case "v0.3":
      case "v0.4":
      case "v0.5":
      case "v0.6":
      case "v0.7":
      case "v0.8":
      case "v0.9":
      case "v0.10":
      case "v0.11":
      case "v0.12":
      case "v0.13":
      case "v0.14":
      case "v0.15":
      case "v0.16":
      case "v0.17":
         // Update data version to the current version
         Setting::set("DataVersion", Setting::getCurrentVersion());
      case "v0.18":
         // current version
         break;
      default:
         // no provision for this version, should not happen
         print "Setting::updateTables($dataVersion): don't know this version.\n";
         return false;
      }
      return true;
   }

   /**
    * Get the value of the setting with the given name. An empty string
    * is returned if the setting is not found, or no name is given.
    */
   public static function get($name = '') {
      if (!isset($name) || ($name === '')) {
         return '';
      }

      $query = "SELECT value FROM blogSetting "
         . "WHERE name=" . db_sql_encode($name);

      $result = mysql_query($query);
      if (!$result) {
         // Error executing the query
         print $query . "<br/>";
         print " --> error: " . mysql_error() . "<br/>\n";
         return '';
      }

      if (mysql_num_rows($result) <= 0) {
         return '';
      }
      $line = mysql_fetch_array($result, MYSQL_ASSOC);
      return db_sql_decode($line["value"]);
   }

   /* Note: the ON DUPLICATE KEY UPDATE syntax is mySQL-specific! */
   public static function set($name = '', $value = '') {
      if (!isset($name) || ($name === '')) {
         return false;
      }
      if (!isset($value)) {
         return false;
      }
      $query = "INSERT INTO blogSetting SET "
         . "name=" . db_sql_encode($name)
         . ", value=" . db_sql_encode($value)
         . db_updated(null)
         . " ON DUPLICATE KEY UPDATE "
         . "value=" . db_sql_encode($value)
         . db_updated(null);

      if (!mysql_query($query)) {
         // Error executing the query
         print $query . "<br/>";
         print " --> error: " . mysql_error() . "<br/>\n";
         return false;
      }
      return true;
   }

   /* ============================================================ */
   /* Special functions                                            */
   /* ============================================================ */

   public static function getDataVersion() {
      return Setting::get("DataVersion");
   }
}
