<?php
include_once(dirname(__FILE__) . "/database.php");

class Media {
   private $tripId;
   private $mediaId;
   private $created;
   private $updated;
   private $latestUpdated;
   private $type;
   private $caption;
   private $timestamp;
   private $location;
   private $width;
   private $height;
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
      $this->mediaId = "";
      $this->created = null;
      $this->updated = null;
      $this->latestUpdated = null;
      $this->type = "";
      $this->caption = "";
      $this->timestamp = "";
      $this->location = "";
      $this->width = "";
      $this->height = "";
      $this->deleted = "N";
      $this->hash = "";
      $this->latestHash = "";
   }

   private static function createMediaTable() {
      $createDefault = db_get_create_default();
      $updateDefault = db_get_update_default();
      $query = "CREATE TABLE IF NOT EXISTS blogMedia("
         . "tripId CHAR(32) NOT NULL, "
         . "mediaId CHAR(32) NOT NULL, "
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
         . "type CHAR(16), "
         . "caption TEXT, "
         . "timestamp CHAR(32), "
         . "location CHAR(48), "
         . "width CHAR(8), "
         . "height CHAR(8), "
         . "deleted CHAR(1), "
         . "hash CHAR(32), "
         . "PRIMARY KEY(mediaId, updated) "
         . ")";
      if (!mysql_query($query)) {
         print $query . "<br/>";
         print "Error: " . mysql_error() . "<br/>";
         return false;
      }
      return true;
   }

   private static function updateMediaTableChangeTypeCaption() {
      $query = "ALTER TABLE blogMedia MODIFY "
         . "type CHAR(16)";
      if (!mysql_query($query)) {
         print $query . "<br/>";
         print "Error: " . mysql_error() . "<br/>";
         return false;
      }
      $query = "ALTER TABLE blogMedia MODIFY "
         . "caption TEXT";
      if (!mysql_query($query)) {
         print $query . "<br/>";
         print "Error: " . mysql_error() . "<br/>";
         return false;
      }
      return true;
   }

   private static function addWidthColumn() {
      $query = "ALTER TABLE blogMedia "
         . "ADD COLUMN width CHAR(8)";
      if (!mysql_query($query)) {
         print $query . "<br/>";
         print "Error: " . mysql_error() . "<br/>";
         return false;
      }
      return true;
   }

   private static function addHeightColumn() {
      $query = "ALTER TABLE blogMedia "
         . "ADD COLUMN height CHAR(8)";
      if (!mysql_query($query)) {
         print $query . "<br/>";
         print "Error: " . mysql_error() . "<br/>";
         return false;
      }
      return true;
   }

   private static function addDeletedColumn() {
      $query = "ALTER TABLE blogMedia "
         . "ADD COLUMN deleted CHAR(1)";
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
    * Constructor. This will load the information for the specified media
    * if a media ID is given and that media ID exists.
    * If no media ID is passed, an empty media object is constructed.
    * If a media ID is passed but no media with that ID exists, the media object
    * will have the media ID set but all other fields will be empty.
    */
   function __construct($tripId = "", $mediaId = "") {
      $this->eraseObject();
      if (!isset($tripId) || ($tripId === "")) {
         throw new InvalidArgumentException("Must provide a trip ID");
      }
      if (!isset($mediaId) || ($mediaId === "")) {
         throw new InvalidArgumentException("Must provide a valid media ID");
      }

      $this->load($tripId, $mediaId);
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
         // No data version yet - create initial table
         if (!Media::createMediaTable()) {
            return false;
         }
         break;
      case "v0.4":
      case "v0.5":
         if (!Media::updateMediaTableChangeTypeCaption()) {
            return false;
         }
      case "v0.6":
      case "v0.7":
      case "v0.8":
      case "v0.9":
      case "v0.10":
         if (!Media::addDeletedColumn()) {
            return false;
         }
      case "v0.11":
      case "v0.12":
         if (!Media::addWidthColumn()) {
            return false;
         }
         if (!Media::addHeightColumn()) {
            return false;
         }
      case "v0.13":
      case "v0.14":
      case "v0.15":
      case "v0.16":
      case "v0.17":
      case "v0.18":
         // current version
         break;
      default:
         // no provision for this version, should not happen
         print "Media::updateTables($dataVersion): don't know this version.\n";
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
      $this->mediaId = db_sql_decode($line["mediaId"]);
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
      $this->type = db_sql_decode($line["type"]);
      $this->caption = db_sql_decode($line["caption"]);
      $this->timestamp = db_sql_decode($line["timestamp"]);
      $this->location = db_sql_decode($line["location"]);
      $this->width = db_sql_decode($line['width']);
      $this->height = db_sql_decode($line['height']);
      $this->deleted = db_sql_decode($line['deleted']);
      $this->hash = db_sql_decode($line["hash"]);
      $this->latestHash = $this->hash;

      return true;
   }

   /**
    * Load the requested media into the current media object. If the media ID
    * exists, the (latest) information in the database for that media ID will
    * be loaded. If the media ID does not exist, all fields except for the
    * media ID field will be blanked.
    * @param $mediaId the media ID to load. This must be a valid non-empty
    * media ID.
    * @return true when data is successfully loaded, false if no media data
    * is loaded (object will be empty except for mediaID).
    */
   public function load($tripId = '', $mediaId = '') {
      $this->eraseObject();

      if (!isset($tripId)  || ($tripId === "")) {
         return false;
      }
      $this->tripId = $tripId;

      if (!isset($mediaId) || ($mediaId === "")) {
         return false;
      }
      $this->mediaId = $mediaId;


      $tripIdValue = db_sql_encode($tripId);
      $mediaIdValue = db_sql_encode($mediaId);
      $query = "SELECT *, "
         . "CONVERT_TZ(`created`, @@session.time_zone, '+00:00') "
         .   "AS `utc_created`, "
         . "CONVERT_TZ(`updated`, @@session.time_zone, '+00:00') "
         .   "AS `utc_updated` "
         . "FROM blogMedia "
         . "WHERE tripId=$tripIdValue "
         .   "AND mediaId=$mediaIdValue "
         . "ORDER BY updated DESC "
         . "LIMIT 1";
      $result = mysql_query($query);
      if (!$result) {
         // Error executing the query
         print $query . "<br/>";
         print " --> error: " . mysql_error() . "<br/>\n";
         $this->eraseObject();
         $this->tripId = $trip->getTripId();
         return false;
      }
      if (mysql_num_rows($result) <= 0) {
         // Media does not exist
         return false;
      }

      return $this->loadFromResult($result);
   }

   public function save() {
      if (!isset($this->tripId) || ($this->tripId === "")) {
         // Need a trip ID before we can save.
         return false;
      }
      if (!isset($this->mediaId) || ($this->mediaId === "")) {
         // Need a journal ID before we can save. Any journal ID is fine.
         return false;
      }

      $query = "INSERT INTO blogMedia SET "
         . "tripId=" . db_sql_encode($this->tripId)
         . ", mediaId=" . db_sql_encode($this->mediaId)
         . db_created($this->created)
         . db_updated($this->updated)
         . ", type=" . db_sql_encode($this->type)
         . ", caption=" . db_sql_encode($this->caption)
         . ", timestamp=" . db_sql_encode($this->timestamp)
         . ", location=" . db_sql_encode($this->location)
         . ", width=" . db_sql_encode($this->width)
         . ", height=" . db_sql_encode($this->height)
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
         if ($this->load($this->tripId, $this->mediaId)) {
            if ($mustUpdateHash) {
               $value = "|"
                  . $this->created . "|"
                  . $this->latestUpdated . "|"
                  . $this->type . "|"
                  . $this->caption . "|"
                  . $this->timestamp . "|"
                  . $this->location . "|"
                  . $this->width ."|"
                  . $this->height . "|"
                  . $this->deleted . "|";
               $this->hash = md5($value);
               $this->latestHash = $this->hash;
               $query = "UPDATE blogMedia SET "
                  . "hash=" . db_sql_encode($this->hash)
                  . " WHERE tripId=" . db_sql_encode($this->tripId)
                  .   " AND mediaId=" . db_sql_encode($this->mediaId)
                  .   " AND updated="
                  . "CONVERT_TZ(" . db_sql_encode($this->latestUpdated)
                  . ",'+00:00','SYSTEM')";
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

   public function getMediaId() {
      return $this->mediaId;
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

   public function getType() {
      return $this->type;
   }

   public function setType($value) {
      $this->type = $value;
   }

   public function getCaption() {
      return $this->caption;
   }

   public function setCaption($value) {
      $this->caption = $value;
   }

   public function getTimestamp() {
      return $this->timestamp;
   }

   public function setTimestamp($value) {
      $this->timestamp = $value;
   }

   public function getLocation() {
      return $this->location;
   }

   public function setLocation($value) {
      $this->location = $value;
   }

   public function getWidth() {
      return $this->width;
   }

   public function setWidth($value) {
      $this->width = $value;
   }

   public function getHeight() {
      return $this->height;
   }

   public function setHeight($value) {
      $this->height = $value;
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
      $query = "SELECT *, "
         . "CONVERT_TZ(`created`, @@session.time_zone, '+00:00') "
         .   "AS `utc_created`, "
         . "CONVERT_TZ(`updated`, @@session.time_zone, '+00:00') "
         .   "AS `utc_updated` "
         . "FROM blogMedia "
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
      $object = new Media('-', '-');
      if ($object->loadFromResult($result)) {
         return $object;
      }
      return null;
   }

   static function getHashList() {
      $query = ""
         . "SELECT blogMedia.mediaId, blogMedia.hash "
         .   "FROM blogMedia "
         .   "INNER JOIN ("
         .     "SELECT "
         .       "MAX(t1.updated) AS updated, "
         .       "t1.mediaId as mediaId "
         .     "FROM blogMedia "
         .     "AS t1 "
         .     "GROUP BY t1.mediaId"
         .   ") AS t2 "
         .   "WHERE blogMedia.mediaId = t2.mediaId "
         .     "AND blogMedia.updated = t2.updated ";

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
            $hash = db_sql_decode($line["hash"]);
            $list[$count++] = $hash;
         }
      }

      return $list;
   }
}
?>
