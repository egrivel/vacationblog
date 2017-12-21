<?php
include_once(dirname(__FILE__) . "/database.php");

class TripAttribute {
   private $tripId;
   private $name;
   private $created;
   private $updated;
   private $latestUpdated;
   private $value;
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
      $this->name = "";
      $this->created = null;
      $this->updated = null;
      $this->latestUpdated = null;
      $this->value = '';
      $this->deleted = 'N';
      $this->hash = "";
      $this->latestHash = "";
   }

   private static function createTable() {
      $createDefault = db_get_create_default();
      $updateDefault = db_get_update_default();
      $query = "CREATE TABLE IF NOT EXISTS blogTripAttribute("
         . "tripId CHAR(32) NOT NULL, "
         . "name CHAR(32), "
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
         . db_get_created_sql()
         . db_get_updated_sql()
         . "value TEXT, "
         . "deleted CHAR(1), "
         . "hash CHAR(32), "
         . "PRIMARY KEY(tripId, name, updated) "
         . ")";
      if (!db_query($query)) {
         print $query . "<br/>";
         print "Error: " . db_error() . "<br/>";
         return false;
      }
      return true;
   }

   /* ============================================================ */
   /* Constructor / destructor                                     */
   /* ============================================================ */

   /**
    * Constructor. This will load the information for the specified trip
    * if a trip ID is given and that trip ID exists.
    * If no trip ID is passed, an empty trip object is constructed.
    * If a trip ID is passed but no trip with that ID exists, the trip object
    * will have the trip ID set but all other fields will be empty.
    */
   function __construct($tripId = '', $name = '') {
      if (!isset($tripId) || ($tripId === "")) {
         throw new InvalidArgumentException("Need to provide trip ID");
      }
      if (!isset($name) || ($name === "")) {
         throw new InvalidArgumentException("Need to provide name");
      }
      $this->load($tripId, $name);
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
         if (!TripAttribute::createTable()) {
            return false;
         }
         break;
      case "v0.14":
      case "v0.15":
      case "v0.16":
      case "v0.17":
      case "v0.18":
         // current version
         break;
      default:
         // no provision for this version, should not happen
         print "TripAttribute::updateTables($dataVersion): don't know this version.\n";
         return false;
      }
      return true;
   }

   /**
    * Load the object from the result of a MySQL query.
    */
   protected function loadFromResult($result) {
      $line = db_fetch_array($result);
      $this->tripId = db_sql_decode($line['tripId']);
      $this->name = db_sql_decode($line["name"]);
      $this->created = db_sql_decode($line["utc_created"]);
      if (!isset($this->created) || ($this->created === "")) {
         // For timestamp, default is null rather than empty string
         $this->created = null;
      }
      $this->latestUpdated = db_sql_decode($line["utc_updated"]);
      if (!isset($this->latestUpdated) || ($this->latestUpdated === "")) {
         // For timestamp, default is null rather than empty string
         $this->latestUpdated = null;
      }
      $this->updated = null;
      $this->value = db_sql_decode($line["value"]);
      $this->deleted = db_sql_decode($line["deleted"]);
      $this->hash = db_sql_decode($line["hash"]);
      $this->latestHash = $this->hash;
      return true;
   }

   /**
    * Load the requested trip into the current trip object. If the trip ID
    * exists, the (latest) information in the database for that trip ID will
    * be loaded. If the trip ID does not exist, all fields except for the
    * trip ID field will be blanked.
    * @param $tripId the trip ID to load. This must be a valid non-empty
    * trip ID.
    * @return true when data is successfully loaded, false if no trip data
    * is loaded (object will be empty except for tripID).
    */
   public function load($tripId = '', $name = '') {
      $this->eraseObject();
      if (!isset($tripId) || ($tripId === "")) {
         return false;
      }
      $this->tripId = $tripId;
      if (!isset($name) || ($name === "")) {
         return false;
      }
      $this->name = $name;
      $tripIdValue = db_sql_encode($tripId);
      $nameValue = db_sql_encode($name);
      $query = "SELECT *, "
         . "CONVERT_TZ(`created`, @@session.time_zone, '+00:00') "
         .   "AS `utc_created`, "
         . "CONVERT_TZ(`updated`, @@session.time_zone, '+00:00') "
         .   "AS `utc_updated` "
         . "FROM blogTripAttribute "
         . "WHERE tripId=$tripIdValue "
         .   "AND name=$nameValue "
         . "ORDER BY updated DESC "
         . "LIMIT 1";
      $result = db_query($query);
      if (!$result) {
         // Error executing the query
         print $query . "<br/>";
         print " --> error: " . db_error() . "<br/>\n";
         return false;
      }
      if (db_num_rows($result) <= 0) {
         // Trip does not exist
         return false;
      }

      return $this->loadFromResult($result);
   }

   public function save() {
      if (!isset($this->tripId) || ($this->tripId === '')) {
         // Need a trip ID before we can save. Any trip ID is fine.
         return false;
      }
      if (!isset($this->name) || ($this->name === '')) {
         // Need a name before we can save. Any name is fine.
         return false;
      }
      $query = "INSERT INTO blogTripAttribute SET "
         . "tripId=" . db_sql_encode($this->tripId)
         . ", name=" . db_sql_encode($this->name)
         . db_created($this->created)
         . db_updated($this->updated)
         . ", value=" . db_sql_encode($this->value)
         . ", deleted=" . db_sql_encode($this->deleted)
         . ", hash=" . db_sql_encode($this->hash);
      if (db_query($query)) {
         // Saved successfully, now load fresh, including created and
         // updated values, and update the hash value
         $mustUpdateHash = true;
         if ($this->hash !== $this->latestHash) {
            // Hash value was manually set, so don't re-calculate it
            $mustUpdateHash = false;
         }

         if ($this->load($this->tripId, $this->name)) {
            if ($mustUpdateHash) {
               $value = "|"
                  . $this->created . "|"
                  . $this->latestUpdated . "|"
                  . $this->value . "|"
                  . $this->deleted . "|";
               $this->hash = md5($value);
               $this->latestHash = $this->hash;
               $query = "UPDATE blogTripAttribute SET "
                  . "hash=" . db_sql_encode($this->hash)
                  . " WHERE tripId=" . db_sql_encode($this->tripId)
                  .   " AND name=" . db_sql_encode($this->name)
                  .   " AND updated="
                  . "CONVERT_TZ(" . db_sql_encode($this->latestUpdated)
                  . ",'+00:00','SYSTEM')";
               if (db_query($query)) {
                  return true;
               } else {
                  print $query . "<br/>";
                  print " --> error: " . db_error() . "<br/>\n";
                  return false;
               }
            }
            return true;
         } else {
            return false;
         }
      } else {
         print $query . "<br/>";
         print " --> error: " . db_error() . "<br/>\n";
         return false;
      }
   }

   public function getTripId() {
      return $this->tripId;
   }

   public function getName() {
      return $this->name;
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

   public function getValue() {
      return $this->value;
   }

   public function setValue($value) {
      $this->value = $value;
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

   static public function findByHash($hash = '') {
      if (!isset($hash) || ($hash === '')) {
         return null;
      }
      $hashValue = db_sql_encode($hash);
      $query = "SELECT *, "
         . "CONVERT_TZ(`created`, @@session.time_zone, '+00:00') "
         .   "AS `utc_created`, "
         . "CONVERT_TZ(`updated`, @@session.time_zone, '+00:00') "
         .   "AS `utc_updated` "
         . "FROM blogTripAttribute "
         . "WHERE hash=$hashValue "
         . "ORDER BY updated DESC "
         . "LIMIT 1";
      $result = db_query($query);
      if (!$result) {
         // Error executing the query
         print $query . "<br/>";
         print " --> error: " . db_error() . "<br/>\n";
         return null;
      }
      if (db_num_rows($result) <= 0) {
         // Trip does not exist
         return null;
      }

      // Create a Trip object with a special trip ID '-' to bypass the
      // checks on empty ID. The ID value will be overwritten by the
      // value coming back from the database anyway.
      $trip = new TripAttribute('-', '-');
      if ($trip->loadFromResult($result)) {
         return $trip;
      }
      return null;
   }

   static function getHashList() {
      $query = ""
         . "SELECT blogTripAttribute.tripId, blogTripAttribute.name, "
         .   "blogTripAttribute.hash "
         .   "FROM blogTripAttribute "
         .   "INNER JOIN ("
         .     "SELECT "
         .       "MAX(t1.updated) AS updated, "
         .       "t1.tripId as tripId, "
         .       "t1.name as name "
         .     "FROM blogTripAttribute "
         .     "AS t1 "
         .     "GROUP BY t1.tripId, t1.name "
         .   ") AS t2 "
         .   "WHERE blogTripAttribute.tripId = t2.tripId "
         .     "AND blogTripAttribute.name = t2.name "
         .     "AND blogTripAttribute.updated = t2.updated ";

      $result = db_query($query);
      if (!$result) {
         // Error executing the query
         print $query . "<br/>";
         print " --> error: " . db_error() . "<br/>\n";
         return false;
      }

      $list = array();
      if (db_num_rows($result) > 0) {
         $count = 0;
         while ($line = db_fetch_array($result)) {
            $hash = db_sql_decode($line["hash"]);
            $list[$count++] = $hash;
         }
      }

      return $list;
   }
}
?>
