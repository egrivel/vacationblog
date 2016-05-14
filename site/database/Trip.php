<?php
include_once(dirname(__FILE__) . "/database.php");

class Trip {
   private $tripId;
   private $created;
   private $updated;
   private $latestUpdated;
   private $name;
   private $description;
   private $bannerImg;
   private $startDate;
   private $endDate;
   private $active;
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
      $this->created = null;
      $this->updated = null;
      $this->latestUpdated = null;
      $this->name = "";
      $this->description = "";
      $this->bannerImg = "";
      $this->startDate = "";
      $this->endDate = "";
      $this->active = "";
      $this->deleted = 'N';
      $this->hash = "";
      $this->latestHash = "";
   }

   private static function createTripTable($mysqlVersion) {
      $createDefault = db_get_create_default($mysqlVersion);
      $updateDefault = db_get_update_default($mysqlVersion);
      $query = "CREATE TABLE IF NOT EXISTS blogTrip("
         . "tripId CHAR(32) NOT NULL, "
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
         . "name TEXT, "
         . "description TEXT, "
         . "bannerImg CHAR(64), "
         . "startDate CHAR(10), "
         . "endDate CHAR(10), "
         . "active CHAR(1), "
         . "deleted CHAR(1), "
         . "hash CHAR(32), "
         . "PRIMARY KEY(tripId, updated) "
         . ")";
      if (!mysql_query($query)) {
         print $query . "<br/>";
         print "Error: " . mysql_error() . "<br/>";
         return false;
      }
      return true;
   }

   private static function createTripAttributeTable() {
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
         . "created TIMESTAMP(6) DEFAULT '0000-00-00 00:00:00', "
         . "updated TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP, "
         . "value TEXT, "
         . "deleted CHAR(1), "
         . "hash CHAR(32), "
         . "PRIMARY KEY(tripId, name, updated) "
         . ")";
      if (!mysql_query($query)) {
         print $query . "<br/>";
         print "Error: " . mysql_error() . "<br/>";
         return false;
      }
      return true;
   }

   private static function addDeletedColumn() {
      $query = "ALTER TABLE blogTrip "
         . "ADD COLUMN deleted CHAR(1)";
      if (!mysql_query($query)) {
         print $query . "<br/>";
         print "Error: " . mysql_error() . "<br/>";
         return false;
      }
      $query = "ALTER TABLE blogTripAttribute "
         . "ADD COLUMN deleted CHAR(1)";
      if (!mysql_query($query)) {
         print $query . "<br/>";
         print "Error: " . mysql_error() . "<br/>";
         return false;
      }
      return true;
   }

   private static function addDescriptionColumn() {
      $query = "ALTER TABLE blogTrip "
         . "ADD COLUMN description TEXT";
      if (!mysql_query($query)) {
         print $query . "<br/>";
         print "Error: " . mysql_error() . "<br/>";
         return false;
      }
      return true;
   }

   private static function addBannerImgColumn() {
      $query = "ALTER TABLE blogTrip "
         . "ADD COLUMN bannerImg CHAR(64)";
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
    * if a trip ID is given and that trip ID exists.
    * If no trip ID is passed, an empty trip object is constructed.
    * If a trip ID is passed but no trip with that ID exists, the trip object
    * will have the trip ID set but all other fields will be empty.
    */
   function __construct($tripId = "") {
      if (!isset($tripId) || ($tripId === "")) {
         throw new InvalidArgumentException("Need to provide trip ID");
      }
      $this->load($tripId);
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
   public static function updateTables($dataVersion, $mysqlVersion) {
      switch ($dataVersion) {
      case "":
      case "v0.1":
         // No data version yet - create initial table
         if (!Trip::createTripTable()) {
            return false;
         }
      case "v0.2":
         if (!Trip::createTripAttributeTable($mysqlVersion)) {
            return false;
         }
         break;
      case "v0.3":
      case "v0.4":
      case "v0.5":
      case "v0.6":
      case "v0.7":
      case "v0.8":
      case "v0.9":
      case "v0.10":
         if (!Trip::addDeletedColumn()) {
            return false;
         }
      case "v0.11":
      case "v0.12":
      case "v0.13":
      case "v0.14":
      case "v0.15":
         if (!Trip::addDescriptionColumn()) {
            return false;
         }
         if (!Trip::addBannerImgColumn()) {
            return false;
         }
      case "v0.16":
         // current version
         break;
      default:
         // no provision for this version, should not happen
         print "Trip::updateTables($dataVersion): don't know this version.\n";
         return false;
      }
      return true;
   }

   /**
    * Load the object from the result of a MySQL query.
    */
   protected function loadFromResult($result) {
      $line = mysql_fetch_array($result, MYSQL_ASSOC);
      $this->tripId = db_sql_decode($line['tripId']);
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
      $this->name = db_sql_decode($line["name"]);
      $this->description = db_sql_decode($line["description"]);
      $this->bannerImg = db_sql_decode($line["bannerImg"]);
      $this->startDate = db_sql_decode($line["startDate"]);
      $this->endDate = db_sql_decode($line["endDate"]);
      $this->active = db_sql_decode($line["active"]);
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
   public function load($tripId = "") {
      $this->eraseObject();
      if (!isset($tripId) || ($tripId === "")) {
         return false;
      }
      $this->tripId = $tripId;
      $tripIdValue = db_sql_encode($tripId);
      $query = "SELECT * FROM blogTrip "
         . "WHERE tripId=$tripIdValue "
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
         // Trip does not exist
         return false;
      }

      return $this->loadFromResult($result);
   }

   public function save() {
      if (!isset($this->tripId) || ($this->tripId === "")) {
         // Need a trip ID before we can save. Any trip ID is fine.
         return false;
      }
      $query = "INSERT INTO blogTrip SET "
         . "tripId=" . db_sql_encode($this->tripId)
         . ", created=" . db_sql_encode($this->created)
         . ", updated=" . db_sql_encode($this->updated)
         . ", name=" . db_sql_encode($this->name)
         . ", description=" . db_sql_encode($this->description)
         . ", bannerImg=" . db_sql_encode($this->bannerImg)
         . ", startDate=" . db_sql_encode($this->startDate)
         . ", endDate=" . db_sql_encode($this->endDate)
         . ", active=" . db_sql_encode($this->active)
         . ", deleted=" . db_sql_encode($this->deleted)
         . ", hash=" . db_sql_encode($this->hash);
      if (mysql_query($query)) {
         // Saved successfully, now load fresh, including created and
         // updated values, and update the hash value
         $mustUpdateHash = true;
         if ($this->hash !== $this->latestHash) {
            // Hash value was manually set, so don't re-calculate it
            $mustUpdateHash = false;
         }

         if ($this->load($this->tripId)) {
            if ($mustUpdateHash) {
               $value = "|"
                  . $this->created . "|"
                  . $this->latestUpdated . "|"
                  . $this->name . "|"
                  . $this->description . "|"
                  . $this->bannerImg . "|"
                  . $this->startDate . "|"
                  . $this->endDate . "|"
                  . $this->active . "|"
                  . $this->deleted . "|";
               $this->hash = md5($value);
               $this->latestHash = $this->hash;
               $query = "UPDATE blogTrip SET "
                  . "hash=" . db_sql_encode($this->hash)
                  . " WHERE tripId=" . db_sql_encode($this->tripId)
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

   public function getName() {
      return $this->name;
   }

   public function setName($value) {
      $this->name = $value;
   }

   public function getDescription() {
      return $this->description;
   }

   public function setDescription($value) {
      $this->description = $value;
   }

   public function getBannerImg() {
      return $this->bannerImg;
   }

   public function setBannerImg($value) {
      $this->bannerImg = $value;
   }

   public function getStartDate() {
      return $this->startDate;
   }

   public function setStartDate($value) {
      $this->startDate = $value;
   }

   public function getEndDate() {
      return $this->endDate;
   }

   public function setEndDate($value) {
      $this->endDate = $value;
   }

   public function getActive() {
      return $this->active;
   }

   public function setActive($value) {
      $this->active = $value;
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
      $query = "SELECT * FROM blogTrip "
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
      $object = new Trip('-');
      if ($object->loadFromResult($result)) {
         return $object;
      }
      return null;
   }

   public function getAttribute($name) {
      if ($this->tripId === "") {
         return "";
      }
      $query = "SELECT value FROM blogTripAttribute "
         . "WHERE tripId=" . db_sql_encode($this->tripId)
         .   "AND name=" . db_sql_encode($name)
         . "ORDER BY updated DESC "
         . "LIMIT 1";
      $result = mysql_query($query);
      if (!$result) {
         // Error executing the query
         print $query . "<br/>";
         print " --> error: " . mysql_error() . "<br/>\n";
         return "";
      }
      if (mysql_num_rows($result) <= 0) {
         // attribute does not exist
         return "";
      }

      $line = mysql_fetch_array($result, MYSQL_ASSOC);
      return db_sql_decode($line["value"]);
   }

   public function setAttribute($name, $value) {
      if (($this->tripId === "")
          || ($name === "")) {
         // invalid request
         return;
      }

      // load old values, if any
      $created = null;
      $updated = null;
      $hash = "";
      $query = "SELECT * FROM blogTripAttribute "
         . "WHERE tripId=" . db_sql_encode($this->tripId)
         .   "AND name=" . db_sql_encode($name)
         . "ORDER BY updated DESC "
         . "LIMIT 1";
      $result = mysql_query($query);
      if (!$result) {
         // Error executing the query
         print $query . "<br/>";
         print " --> error: " . mysql_error() . "<br/>\n";
         return;
      }
      if (mysql_num_rows($result) > 0) {
         $line = mysql_fetch_array($result, MYSQL_ASSOC);
         $created = db_sql_decode($line["created"]);
         if ($created === "") {
            $created = null;
         }
      }

      $query = "INSERT INTO blogTripAttribute SET "
         . "tripId=" . db_sql_encode($this->tripId)
         . ", name=" . db_sql_encode($name)
         . ", created=" . db_sql_encode($created)
         . ", updated=null"
         . ", value=" . db_sql_encode($value);
      if (mysql_query($query)) {
         // Saved successfully, now load fresh, including updated values,
         // and update the hash value
         $query = "SELECT * FROM blogTripAttribute "
            . "WHERE tripId=" . db_sql_encode($this->tripId)
            .   "AND name=" . db_sql_encode($name)
            . "ORDER BY updated DESC "
            . "LIMIT 1";

         $result = mysql_query($query);
         if ($result && (mysql_num_rows($result) > 0)) {
            $line = mysql_fetch_array($result, MYSQL_ASSOC);
            $created = db_sql_decode($line["created"]);
            $updated = db_sql_decode($line["updated"]);

            $hash = "|"
               . $this->tripId . "|"
               . $created . "|"
               . $updated . "|"
               . $name . "|"
               . $value . "|";
            $hash = md5($hash);
            $query = "UPDATE blogTripAttribute SET "
               . "hash=" . db_sql_encode($hash)
               . " WHERE tripId=" . db_sql_encode($this->tripId)
               .   " AND name=" . db_sql_encode($name)
               .   " AND updated=" . db_sql_encode($updated);
            mysql_query($query);
         } else {
            print $query . "<br/>";
            print " --> error: " . mysql_error() . "<br/>\n";
         }
      }
      return;
   }

   static function listTrips() {
      $query = ""
         . "SELECT blogTrip.tripId, blogTrip.name, "
         .   "blogTrip.updated, blogTrip.startDate "
         .   "FROM blogTrip "
         .   "INNER JOIN ("
         .     "SELECT "
         .       "MAX(t1.updated) AS updated, "
         .       "t1.tripId as tripId "
         .     "FROM blogTrip "
         .     "AS t1 "
         .     "GROUP BY t1.tripId"
         .   ") AS t2 "
         .   "WHERE blogTrip.tripId = t2.tripId "
         .     "AND blogTrip.updated = t2.updated "
         .     "AND blogTrip.deleted != 'Y' "
         .   "ORDER BY blogTrip.startDate DESC ";

      $result = mysql_query($query);
      if (!$result) {
         // Error executing the query
         print $query . "<br/>";
         print " --> error: " . mysql_error() . "<br/>\n";
         return false;
      }

      $list = array();
      if (mysql_num_rows($result) > 0) {
         $count = 0;
         while ($line = mysql_fetch_array($result, MYSQL_ASSOC)) {
            $tripId = db_sql_decode($line["tripId"]);
            $name = db_sql_decode($line['name']);
            $list[$count++] =
               array('tripId'=>$tripId, 'name'=>$name);
         }
      }

      return $list;
   }

   static function findCurrentTrip() {
      $query = ""
         . "SELECT blogTrip.tripId, blogTrip.updated, blogTrip.startDate "
         .   "FROM blogTrip "
         .   "INNER JOIN ("
         .     "SELECT "
         .       "MAX(t1.updated) AS updated, "
         .       "t1.tripId as tripId "
         .     "FROM blogTrip "
         .     "AS t1 "
         .     "GROUP BY t1.tripId"
         .   ") AS t2 "
         .   "WHERE blogTrip.tripId = t2.tripId "
         .     "AND blogTrip.updated = t2.updated "
         .     "AND blogTrip.deleted != 'Y' "
         .     "AND blogTrip.startDate < now() "
         .   "ORDER BY blogTrip.startDate DESC "
         .   "LIMIT 1";

      $result = mysql_query($query);
      if (!$result) {
         // Error executing the query
         print $query . "<br/>";
         print " --> error: " . mysql_error() . "<br/>\n";
         return false;
      }
      if (mysql_num_rows($result) <= 0) {
         // Trip does not exist
         return false;
      }

      $line = mysql_fetch_array($result, MYSQL_ASSOC);
      $tripId = db_sql_decode($line["tripId"]);
      return $tripId;
   }
}
?>
