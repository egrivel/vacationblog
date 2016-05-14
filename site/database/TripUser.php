<?php
include_once(dirname(__FILE__) . "/database.php");

class TripUser {
   private $tripId;
   private $userId;
   private $created;
   private $updated;
   private $latestUpdated;
   private $role;
   private $message;
   private $deleted;
   private $hash;
   private $latestHash;

   /* ============================================================ */
   /* Private functions                                            */
   /* ============================================================ */

   /**
    * Erase the contents of this object (wipe all fields).
    */
   private function eraseObject() {
      $this->tripId = "";
      $this->userId = "";
      $this->created = null;
      $this->updated = null;
      $this->latestUpdated = null;
      $this->role = "";
      $this->message = "";
      $this->deleted = "N";
      $this->hash = "";
      $this->latestHash = "";
   }

   private static function createTable() {
      $createDefault = db_get_create_default();
      $updateDefault = db_get_update_default();
      $query = "CREATE TABLE IF NOT EXISTS blogTripUser ("
         . "tripId CHAR(32) NOT NULL, "
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
         . "role CHAR(32) NOT NULL, "
         . "message TEXT, "
         . "deleted CHAR(1), "
         . "hash CHAR(32), "
         . "PRIMARY KEY(tripId, userId, updated) "
         . ")";
      if (!mysql_query($query)) {
         print $query . "<br/>";
         print "Error: " . mysql_error() . "<br/>";
         return false;
      }
      return true;
   }

   /* ============================================================ */
   /* Constructor / destructor                                     */
   /* ============================================================ */

   /**
    * Constructor. This will load the information for the specified trip
    * user.
    */
   function __construct($tripId = "", $userId = "") {
      $this->eraseObject();
      if (!isset($tripId) || ($tripId === "")) {
         throw new InvalidArgumentException("Must provide a trip ID");
      }
      if (!isset($userId) || ($userId === "")) {
         throw new InvalidArgumentException("Must provide a valid user ID");
      }

      $this->load($tripId, $userId);
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
      case "v0.9":
      case "v0.10":
      case "v0.11":
      case "v0.12":
      case "v0.13":
      case "v0.14":
         // No data version yet - create initial table
         return TripUser::createTable();
         break;
      case "v0.15":
      case "v0.16":
         // current version
         break;
      default:
         // no provision for this version, should not happen
         print "TripUser::updateTables($dataVersion): don't know this version.\n";
         return false;
      }
      return true;
   }

   /**
    * Load the object from the result of a MySQL query.
    */
   protected function loadFromResult($result) {
      $line = mysql_fetch_array($result, MYSQL_ASSOC);
      $this->tripId = db_sql_decode($line["tripId"]);
      $this->userId = db_sql_decode($line["userId"]);
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
      $this->role = db_sql_decode($line["role"]);
      $this->message = db_sql_decode($line["message"]);
      $this->deleted = db_sql_decode($line['deleted']);
      $this->hash = db_sql_decode($line["hash"]);
      $this->latestHash = $this->hash;

      return true;
   }

   /**
    * Load the requested comment into the current comment object. If the comment ID
    * exists, the (latest) information in the database for that comment ID will
    * be loaded. If the comment ID does not exist, all fields except for the
    * comment ID field will be blanked.
    * @param $userId the comment ID to load. This must be a valid non-empty
    * comment ID.
    * @return true when data is successfully loaded, false if no comment data
    * is loaded (object will be empty except for commentID).
    */
   public function load($tripId = "", $userId = "") {
      $this->eraseObject();

      if (!isset($tripId)  || ($tripId === "")) {
         return false;
      }
      $this->tripId = $tripId;

      if (!isset($userId) || ($userId === "")) {
         return false;
      }
      $this->userId = $userId;

      $tripIdValue = db_sql_encode($this->tripId);
      $userIdValue = db_sql_encode($this->userId);
      $query = "SELECT * FROM blogTripUser "
         . "WHERE tripId=$tripIdValue "
         .   "AND userId=$userIdValue "
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
         // Comment does not exist
         return false;
      }

      return $this->loadFromResult($result);
   }

   public function save() {
      if (!isset($this->tripId) || ($this->tripId === "")) {
         // Need a trip ID before we can save.
         return false;
      }
      if (!isset($this->userId) || ($this->userId === "")) {
         // Need a comment ID before we can save. Any comment ID is fine.
         return false;
      }

      $query = "INSERT INTO blogTripUser SET "
         . "tripId=" . db_sql_encode($this->tripId)
         . ", userId=" . db_sql_encode($this->userId)
         . db_created($this->created)
         . db_updated($this->updated)
         . ", role=" . db_sql_encode($this->role)
         . ", message=" . db_sql_encode($this->message)
         . ", deleted=" . db_sql_encode($this->deleted)
         . ", hash=" . db_sql_encode($this->hash);
      // print "Saving to database: $query<br/>\n";
      if (mysql_query($query)) {
         // Saved successfully, now load fresh, including created and
         // updated values, and update the hash value
         $mustUpdateHash = true;
         if ($this->hash !== $this->latestHash) {
            // Hash value was manually set, so don't re-calculate it
            $mustUpdateHash = false;
         }
         if ($this->load($this->tripId, $this->userId)) {
            if ($mustUpdateHash) {
               $value = "|"
                  . $this->created . "|"
                  . $this->latestUpdated . "|"
                  . $this->role . "|"
                  . $this->message . "|"
                  . $this->deleted . "|";
               $this->hash = md5($value);
               $this->latestHash = $this->hash;
               $query = "UPDATE blogTripUser SET "
                  . "hash=" . db_sql_encode($this->hash)
                  . " WHERE tripId=" . db_sql_encode($this->tripId)
                  .   " AND userId=" . db_sql_encode($this->userId)
                  .   " AND updated=" . db_sql_encode($this->latestUpdated);
               if (mysql_query($query)) {
                  return true;
               } else {
                  print $query . "<br/>";
                  print " --> error: " . mysql_error() . "<br/>\n";
                  return false;
               }
            }
            return true;
         } else {
            return false;
         }
      } else {
         print $query . "<br/>";
         print " --> error: " . mysql_error() . "<br/>\n";
         return false;
      }
   }

   public function getTripId() {
      return $this->tripId;
   }

   public function getUserId() {
      return $this->userId;
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

   public function getRole() {
      return $this->role;
   }

   public function setRole($value) {
      $this->role = $value;
   }

   public function getMessage() {
      return $this->message;
   }

   public function setMessage($value) {
      $this->message = $value;
   }

   public function getDeleted() {
      return $this->deleted;
   }

   public function setDeleted($value) {
      $this->deleted = $value;
   }

   public function getHash() {
      return $this->hash;
   }

   public function setHash($value) {
      $this->hash = $value;
   }

   /**
    * Create an instance by the hash value. This function is in support
    * of the synchronization functionality. It takes a hash value and
    * it will return an instance of the object for that hash value
    * if the hash exists. If the hash does not exist, null will be
    * returned, indicating that the object should be created using the
    * normal constructor.
    */
   static public function findByHash($hash = '') {
      if (!isset($hash) || ($hash === '')) {
         return null;
      }
      $hashValue = db_sql_encode($hash);
      $query = "SELECT * FROM blogTripUser "
         . "WHERE hash=$hashValue "
         . "ORDER BY updated DESC "
         . "LIMIT 1";
      $result = mysql_query($query);
      if (!$result) {
         // Error executing the query
         print $query . "<br/>";
         print " --> error: " . mysql_error() . "<br/>\n";
         return null;
      }
      if (mysql_num_rows($result) <= 0) {
         // Object does not exist
         return null;
      }

      // Create an instance with a special ID '-' to bypass the
      // checks on empty ID. The ID value will be overwritten by the
      // value coming back from the database anyway.
      $object = new TripUser('-', '-');
      if ($object->loadFromResult($result)) {
         return $object;
      }
      return null;
   }
}
?>
