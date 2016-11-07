<?php
include_once(dirname(__FILE__) . "/database.php");
require_once(dirname(__FILE__) . "/../lib/random/random.php");

class Auth {
   private $authId;
   private $created;
   private $updated;
   private $latestUpdated;
   private $userId;
   private $expiration;

   /* ============================================================ */
   /* Private functions                                            */
   /* ============================================================ */

   /**
    * Erase the contents of this object (wipe all fields).
    */
   private function eraseObject() {
      $this->authId = "";
      $this->userId = "";
      $this->created = null;
      $this->updated = null;
      $this->latestUpdated = null;
      $this->expiration = "";
   }

   private static function createAuthTable() {
      $createDefault = db_get_create_default();
      $updateDefault = db_get_update_default();
      $query = "CREATE TABLE IF NOT EXISTS blogAuth("
         . "authId CHAR(64) NOT NULL, "
         . "userId CHAR(32) NOT NULL, "
         // Note 1: there can be only a single TIMESTAMP field that defaults
         // to CURRENT_TIMESTAMP, which should logically be the "updated"
         // field, since that should always be the "now()" when inserting a
         // row. However, by defining the "created" field with a default value
         // of zero time, and pasing null in when creating the first row,
         // it automatically gets set to the current time as well. Obviously,
         // when creating subsequent rows, the originally created timestamp
         // has to be passed in anyway.
         // Note 2: use TIMESTAMP(6) rather than TIMESTAMP to get a
         // microsecond-precision for the timestamp. This will allow the
         // distinction of multiple inserts within the same second (unlikely,
         // but can happen, especially in testing).
         . "created TIMESTAMP(6) DEFAULT $createDefault, "
         . "updated TIMESTAMP(6) DEFAULT $updateDefault, "
         . "expiration CHAR(16), "
         . "PRIMARY KEY(authId, updated) "
         . ")";
      if (!mysql_query($query)) {
         print $query . "<br/>";
         print "Error: " . mysql_error() . "<br/>";
      }
   }

   /* ============================================================ */
   /* Constructor / destructor                                     */
   /* ============================================================ */

   /**
    * Constructor. This will load the information for the specified auth
    * if it exists.
    * If no auth exists, an empty auth object is constructed.
    */
   function __construct($authId = "") {
      $this->eraseObject();
      if (!isset($authId) || ($authId === "")) {
         throw new InvalidArgumentException("must pass a non-empty authId");
      }
      $this->load($authId);
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
      case "v0.1":
      case "v0.2":
      case "v0.3":
      case "v0.4":
      case "v0.5":
      case "v0.6":
      case "v0.7":
      case "v0.8":
         // No data version yet - create initial table
         Auth::createAuthTable();
         break;
      case "v0.9":
      case "v0.10":
      case "v0.11":
      case "v0.12":
      case "v0.13":
      case "v0.14":
      case "v0.15":
      case "v0.16":
      case "v0.17":
         // current version
         break;
      default:
         // no provision for this version, should not happen
         print "Auth::updateTables($dataVersion): don't know this version.\n";
         return false;
      }
      return true;
   }

   /**
    * Load the object from the result of a MySQL query.
    */
   protected function loadFromResult($result) {
      $line = mysql_fetch_array($result, MYSQL_ASSOC);
      $this->authId = db_sql_decode($line['authId']);
      $this->created = db_sql_decode($line["created"]);
      if (!isset($this->created) || ($this->created === "")) {
         // For timestamp, default is null rather than empty string
         $this->created = null;
      }
      $this->latestUpdated = db_sql_decode($line["updated"]);
      if (!isset($this->latestUpdated) || ($this->latestUpdated === "")) {
         // For timestamp, default is null rather than empty string
         $this->latestUpdated = null;
      }
      $this->updated = null;
      $this->userId = db_sql_decode($line['userId']);
      $this->expiration = db_sql_decode($line["expiration"]);
      return true;
    }

   /**
    * Load the requested auth into the current auth object. If the auth ID
    * exists, the (latest) information in the database for that auth ID will
    * be loaded. If the auth ID does not exist, all fields except for the
    * auth ID field will be blanked.
    * @param $referenceId the auth ID to load. This must be a valid non-empty
    * auth ID.
    * @return true when data is successfully loaded, false if no auth data
    * is loaded (object will be empty except for authID).
    */
   public function load($authId = '') {
      $this->eraseObject();
      if (!isset($authId) || ($authId === "")) {
         return false;
      }

      $this->authId = $authId;

      $authIdValue = db_sql_encode($authId);
      $query = "SELECT * FROM blogAuth "
         . "WHERE authId=$authIdValue "
         . "ORDER BY updated DESC "
         . "LIMIT 1";
      $result = mysql_query($query);
      if (!$result) {
         // Error executing the query
         print $query . "<br/>";
         print " --> error: " . mysql_error() . "<br/>\n";
         return false;
      }
      if (mysql_num_rows($result) <= 0) {
         // Auth does not exist
         $this->eraseObject();
         $this->authId = $authId;
         return false;
      }

      return $this->loadFromResult($result);
   }

   public function save() {
      if ($this->authId === "") {
         // Need an auth ID before we can save.
         return false;
      }
      $query = "INSERT INTO blogAuth SET "
         . "authId=" . db_sql_encode($this->authId)
         . db_created($this->created)
         . db_updated($this->updated)
         . ", userId=" . db_sql_encode($this->userId)
         . ", expiration=" . db_sql_encode($this->expiration);
      // print "Saving to database: $query<br/>\n";
      if (!mysql_query($query)) {
         print $query . "<br/>";
         print " --> error: " . mysql_error() . "<br/>\n";
         return false;
      }
      // load object to get the new values for created and updated
      Auth::load($this->authId);
      return true;
   }

   /**
    * generate a unique auth ID. The unique ID is a base-64 encoding
    * of a random value. Since the auth IDs are at most 64 chars
    * long, the random value is 48 characters long
    */
   public static function generateAuthId() {
    $value = random_bytes(48);

    return substr(base64_encode($value), 0, 64);
   }

   public function getAuthId() {
      return $this->authId;
   }

   public function getCreated() {
      return $this->created;
   }

   public function setCreated($value) {
      $this->created = $value;
   }

   public function getUpdated() {
      return $this->updated ? $this->updated : $this->latestUpdated;
   }

   public function setUpdated($value) {
      $this->updated = $value;
   }

   public function getUserId() {
      return $this->userId;
   }

   public function setUserId($value) {
      $this->userId = $value;
   }

   public function getExpiration() {
      return $this->expiration;
   }

   public function setExpiration($value) {
      $this->expiration = $value;
   }

   public function delete() {
      if (isset($this->authId) && ($this->authId !== '')) {
        $authIdValue = db_sql_encode($this->authId);
        $query = "DELETE FROM blogAuth "
         . "WHERE authId=$authIdValue";
         mysql_query($query);
      }
   }
}
?>
