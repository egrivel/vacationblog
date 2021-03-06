<?php
include_once(dirname(__FILE__) . "/database.php");

class Journal {
   private $tripId;
   private $journalId;
   private $created;
   private $updated;
   private $latestUpdated;
   private $userId;
   private $journalDate;
   private $journalTitle;
   private $journalText;
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
      $this->journalId = "";
      $this->created = null;
      $this->updated = null;
      $this->latestUpdated = null;
      $this->userId = "";
      $this->journalDate = "";
      $this->journalTitle = "";
      $this->journalText = "";
      $this->deleted = "N";
      $this->hash = "";
      $this->latestHash = "";
   }

   private static function createJournalTable() {
      $createDefault = db_get_create_default();
      $updateDefault = db_get_update_default();
      $query = "CREATE TABLE IF NOT EXISTS blogJournal("
         . "tripId CHAR(32) NOT NULL, "
         . "journalId CHAR(32) NOT NULL, "
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
         . "userId CHAR(32) NOT NULL, "
         . "journalDate char(10), "
         . "journalTitle VARCHAR(128), "
         . "journalText TEXT, "
         . "deleted CHAR(1), "
         . "hash CHAR(32), "
         . "PRIMARY KEY(journalId, updated) "
         . ")";
      if (!db_query($query)) {
         print $query . "<br/>";
         print "Error: " . db_error() . "<br/>";
         return false;
      }
      return true;
   }

   private static function addDeletedColumn() {
      $query = "ALTER TABLE blogJournal "
         . "ADD COLUMN deleted CHAR(1)";
      if (!db_query($query)) {
         print $query . "<br/>";
         print "Error: " . db_error() . "<br/>";
         return false;
      }
      return true;
   }

   private static function addTitleColumn() {
      $query = "ALTER TABLE blogJournal "
         . "ADD COLUMN journalTitle VARCHAR(128)";
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
    * Constructor. This will load the information for the specified journal
    * if a journal ID is given and that journal ID exists.
    * If no journal ID is passed, an empty journal object is constructed.
    * If a journal ID is passed but no journal with that ID exists, the journal object
    * will have the journal ID set but all other fields will be empty.
    */
   function __construct($tripId = "", $journalId = "") {
      $this->eraseObject();
      if (!isset($tripId) || ($tripId === "")) {
         throw new InvalidArgumentException("Must provide a trip ID");
      }
      if (!isset($journalId) || ($journalId === "")) {
         throw new InvalidArgumentException("Must provide a journal ID");
      }

      $this->load($tripId, $journalId);
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
         // No data version yet - create initial table
         if (!Journal::createJournalTable()) {
            return false;
         }
         break;
      case "v0.5":
      case "v0.6":
      case "v0.7":
      case "v0.8":
      case "v0.9":
      case "v0.10":
         if (!Journal::addDeletedColumn()) {
            return false;
         }
      case "v0.11":
         if (!Journal::addTitleColumn()) {
            return false;
         }
      case "v0.12":
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
         print "Journal::updateTables($dataVersion): don't know this version.\n";
         return false;
      }
      return true;
   }

   /**
    * Load the object from the result of a MySQL query.
    */
   protected function loadFromResult($result) {
      $line = db_fetch_array($result);
      $this->tripId = db_sql_decode($line["tripId"]);
      $this->journalId = db_sql_decode($line["journalId"]);
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
      $this->userId = db_sql_decode($line["userId"]);
      $this->journalDate = db_sql_decode($line["journalDate"]);
      $this->journalTitle = db_sql_decode($line["journalTitle"]);
      $this->journalText = db_sql_decode($line["journalText"]);
      $this->deleted = db_sql_decode($line['deleted']);
      $this->hash = db_sql_decode($line["hash"]);
      $this->latestHash = $this->hash;

      return true;
   }

   /**
    * Load the requested journal into the current journal object. If the journal ID
    * exists, the (latest) information in the database for that journal ID will
    * be loaded. If the journal ID does not exist, all fields except for the
    * journal ID field will be blanked.
    * @param $journalId the journal ID to load. This must be a valid non-empty
    * journal ID.
    * @return true when data is successfully loaded, false if no journal data
    * is loaded (object will be empty except for journalID).
    */
   public function load($tripId = "", $journalId = "") {
      $this->eraseObject();

      if (!isset($tripId)  || ($tripId === "")) {
         return false;
      }
      $this->tripId = $tripId;

      if (!isset($journalId) || ($journalId === "")) {
         return false;
      }
      $this->journalId = $journalId;

      $tripIdValue = db_sql_encode($tripId);
      $journalIdValue = db_sql_encode($journalId);
      $query = "SELECT *, "
         . "CONVERT_TZ(`created`, @@session.time_zone, '+00:00') "
         .   "AS `utc_created`, "
         . "CONVERT_TZ(`updated`, @@session.time_zone, '+00:00') "
         .   "AS `utc_updated` "
         . "FROM blogJournal "
         . "WHERE tripId=$tripIdValue "
         .   "AND journalId=$journalIdValue "
         . "ORDER BY updated DESC "
         . "LIMIT 1";
      $result = db_query($query);
      if (!$result) {
         // Error executing the query
         print $query . "<br/>";
         print " --> error: " . db_error() . "<br/>\n";
         $this->eraseObject();
         $this->tripId = $trip->getTripId();
         return false;
      }
      if (db_num_rows($result) <= 0) {
         // Journal does not exist
         return false;
      }

      return $this->loadFromResult($result);
   }

   public function save() {
      if (!isset($this->tripId) || ($this->tripId === "")) {
         // Need a trip ID before we can save.
         return false;
      }
      if (!isset($this->journalId) || ($this->journalId === "")) {
         // Need a journal ID before we can save. Any journal ID is fine.
         return false;
      }

      $query = "INSERT INTO blogJournal SET "
         . "tripId=" . db_sql_encode($this->tripId)
         . ", journalId=" . db_sql_encode($this->journalId)
         . db_created($this->created)
         . db_updated($this->updated)
         . ", userId=" . db_sql_encode($this->userId)
         . ", journalDate=" . db_sql_encode($this->journalDate)
         . ", journalTitle=" . db_sql_encode($this->journalTitle)
         . ", journalText=" . db_sql_encode($this->journalText)
         . ", deleted=" . db_sql_encode($this->deleted)
         . ", hash=" . db_sql_encode($this->hash);
      // print "Saving to database: $query<br/>\n";
      if (db_query($query)) {
         // Saved successfully, now load fresh, including created and
         // updated values, and update the hash value
         $mustUpdateHash = true;
         if ($this->hash !== $this->latestHash) {
            // Hash value was manually set, so don't re-calculate it
            $mustUpdateHash = false;
         }
         if ($this->load($this->tripId, $this->journalId)) {
            if ($mustUpdateHash) {
               $value = "|"
                  . $this->created . "|"
                  . $this->latestUpdated . "|"
                  . $this->userId . "|"
                  . $this->journalDate . "|"
                  . $this->journalTitle . "|"
                  . $this->journalText . "|"
                  . $this->deleted . "|";
               $this->hash = md5($value);
               $this->latestHash = $this->hash;
               $query = "UPDATE blogJournal SET "
                  . "hash=" . db_sql_encode($this->hash)
                  . " WHERE tripId=" . db_sql_encode($this->tripId)
                  .   " AND journalId=" . db_sql_encode($this->journalId)
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

   public function getJournalId() {
      return $this->journalId;
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

   public function getJournalDate() {
      return $this->journalDate;
   }

   public function setJournalDate($value) {
      $this->journalDate = $value;
   }

   public function getJournalTitle() {
      return $this->journalTitle;
   }

   public function setJournalTitle($value) {
      $this->journalTitle = $value;
   }

   public function getJournalText() {
      return $this->journalText;
   }

   public function setJournalText($value) {
      $this->journalText = $value;
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
         . "FROM blogJournal "
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
         // Object does not exist
         return null;
      }

      // Create an instance with a special ID '-' to bypass the
      // checks on empty ID. The ID value will be overwritten by the
      // value coming back from the database anyway.
      $object = new Journal('-', '-');
      if ($object->loadFromResult($result)) {
         return $object;
      }
      return null;
   }

   static public function getFirstJournalId($tripId = '') {
      $query = ""
         . "SELECT * "
         .   "FROM blogJournal "
         .   "INNER JOIN ("
         .     "SELECT "
         .       "MAX(t1.updated) AS updated, "
         .       "t1.tripId as tripId, "
         .       "t1.journalId as journalId "
         .     "FROM blogJournal "
         .     "AS t1 "
         .     "GROUP BY t1.tripId, t1.journalId "
         .     "HAVING t1.tripId=" . db_sql_encode($tripId) . " "
         .   ") AS t2 "
         .   "WHERE blogJournal.tripId = t2.tripId "
         .     "AND blogJournal.journalId = t2.journalId "
         .     "AND blogJournal.updated = t2.updated "
         .     "AND blogJournal.deleted != 'Y' "
         .   "ORDER BY blogJournal.journalDate ASC, "
         .     "blogJournal.created ASC "
         .   "LIMIT 1";
      // print $query . "\n";
      $result = db_query($query);
      if (!$result) {
         // Error executing the query
         print $query . "<br/>";
         print " --> error: " . db_error() . "<br/>\n";
         return null;
      }
      if (db_num_rows($result) <= 0) {
         // Object does not exist
         return null;
      }

      $line = db_fetch_array($result);
      return db_sql_decode($line["journalId"]);
   }

   static public function getLastJournalId($tripId = '') {
      $query = ""
         . "SELECT * "
         .   "FROM blogJournal "
         .   "INNER JOIN ("
         .     "SELECT "
         .       "MAX(t1.updated) AS updated, "
         .       "t1.tripId as tripId, "
         .       "t1.journalId as journalId "
         .     "FROM blogJournal "
         .     "AS t1 "
         .     "GROUP BY t1.tripId, t1.journalId "
         .     "HAVING t1.tripId=" . db_sql_encode($tripId) . " "
         .   ") AS t2 "
         .   "WHERE blogJournal.tripId = t2.tripId "
         .     "AND blogJournal.journalId = t2.journalId "
         .     "AND blogJournal.updated = t2.updated "
         .     "AND blogJournal.deleted != 'Y' "
         .   "ORDER BY blogJournal.journalDate DESC, "
         .     "blogJournal.created DESC "
         .   "LIMIT 1";
      // print $query . "\n";
      $result = db_query($query);
      if (!$result) {
         // Error executing the query
         print $query . "<br/>";
         print " --> error: " . db_error() . "<br/>\n";
         return null;
      }
      if (db_num_rows($result) <= 0) {
         // Object does not exist
         return null;
      }

      $line = db_fetch_array($result);
      return db_sql_decode($line["journalId"]);
   }

   public function getPreviousJournalId() {
      $tripId = db_sql_encode($this->tripId);
      $journalId = db_sql_encode($this->journalId);
      $journalDate = db_sql_encode($this->journalDate);
      if ($this->created && ($this->created !== '0000-00-00 00:00:00')) {
         $created = "CONVERT_TZ(" .db_sql_encode($this->created)
            . ",'+00:00','SYSTEM')";
      } else {
         $created = db_sql_encode($this->created);
      }

      $query = ""
         . "SELECT * "
         .   "FROM blogJournal "
         .   "INNER JOIN ("
         .     "SELECT "
         .       "MAX(t1.updated) AS updated, "
         .       "t1.tripId as tripId, "
         .       "t1.journalId as journalId "
         .     "FROM blogJournal "
         .     "AS t1 "
         .     "GROUP BY t1.tripId, t1.journalId "
         .     "HAVING t1.tripId = $tripId "
         .   ") AS t2 "
         .   "WHERE blogJournal.tripId = t2.tripId "
         .     "AND blogJournal.journalId = t2.journalId "
         .     "AND blogJournal.updated = t2.updated "
         .     "AND blogJournal.deleted != 'Y' "
         .     "AND ( "
         .       "( "
         .         "blogJournal.journalDate = $journalDate "
         .         "AND blogJournal.created < $created "
         .       ") "
         .       "OR "
         .       "( "
         .         "blogJournal.journalDate < $journalDate "
         .       ") "
         .     ") "
         .   "ORDER BY blogJournal.journalDate DESC, "
         .     "blogJournal.created DESC "
         .   "LIMIT 1";
      // print $query . "\n";
      $result = db_query($query);
      if (!$result) {
         // Error executing the query
         print $query . "<br/>";
         print " --> error: " . db_error() . "<br/>\n";
         return null;
      }
      if (db_num_rows($result) <= 0) {
         // Object does not exist
         return null;
      }

      $line = db_fetch_array($result);
      return db_sql_decode($line["journalId"]);
   }

   /*
    * This should only retrieve the ID of the next journal item. Journal items
    * are ordered by their _journal date_ and, within a date, by their
    * _create_ timestamp
    *
    * The t1 table is a list of all the journal entries for this trip with,
    * for each entry, the latest update date.
    */
   public function getNextJournalId() {
      $tripId = db_sql_encode($this->tripId);
      $journalId = db_sql_encode($this->journalId);
      $journalDate = db_sql_encode($this->journalDate);
      if ($this->created && ($this->created !== '0000-00-00 00:00:00')) {
         $created = "CONVERT_TZ(" .db_sql_encode($this->created)
            . ",'+00:00','SYSTEM')";
      } else {
         $created = db_sql_encode($this->created);
      }

      $query = ""
         . "SELECT * "
         .   "FROM blogJournal "
         .   "INNER JOIN ("
         .     "SELECT "
         .       "MAX(t1.updated) AS updated, "
         .       "t1.tripId as tripId, "
         .       "t1.journalId as journalId "
         .     "FROM blogJournal "
         .     "AS t1 "
         .     "GROUP BY t1.tripId, t1.journalId "
         .     "HAVING t1.tripId = $tripId "
         .   ") AS t2 "
         .   "WHERE blogJournal.tripId = t2.tripId "
         .     "AND blogJournal.journalId = t2.journalId "
         .     "AND blogJournal.updated = t2.updated "
         .     "AND blogJournal.deleted != 'Y' "
         .     "AND ( "
         .       "( "
         .         "blogJournal.journalDate = $journalDate "
         .         "AND blogJournal.created > $created "
         .       ") "
         .       "OR "
         .       "( "
         .         "blogJournal.journalDate > $journalDate "
         .       ") "
         .     ") "
         .   "ORDER BY blogJournal.journalDate ASC, "
         .     "blogJournal.created ASC "
         .   "LIMIT 1";
      // print $query . "\n";
      $result = db_query($query);
      if (!$result) {
         // Error executing the query
         print $query . "<br/>";
         print " --> error: " . db_error() . "<br/>\n";
         return null;
      }
      if (db_num_rows($result) <= 0) {
         // Object does not exist
         return null;
      }

      $line = db_fetch_array($result);
      return db_sql_decode($line["journalId"]);
   }

   static function listTripJournalDates($tripId) {
      $tripId = db_sql_encode($tripId);
      $query = ""
         . "SELECT blogJournal.journalId, blogJournal.journalDate, "
         .   "blogJournal.userId, blogJournal.journalTitle, "
         .   "blogJournal.created, blogJournal.updated "
         .   "FROM blogJournal "
         .   "INNER JOIN ("
         .     "SELECT "
         .       "MAX(t1.updated) AS updated, "
         .       "t1.tripId AS tripId, "
         .       "t1.journalId AS journalId "
         .     "FROM blogJournal "
         .     "AS t1 "
         .     "WHERE t1.tripId = $tripId "
         .     "GROUP BY t1.journalId "
         .   ") AS t2 "
         .   "WHERE blogJournal.tripId = t2.tripId "
         .     "AND blogJournal.journalId = t2.journalId "
         .     "AND blogJournal.updated = t2.updated "
         .     "AND blogJournal.deleted != 'Y' "
         .   "ORDER BY blogJournal.journalDate DESC, blogJournal.created DESC";

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
            $journalId = db_sql_decode($line["journalId"]);
            $journalDate = db_sql_decode($line['journalDate']);
            $journalTitle = db_sql_decode($line['journalTitle']);
            $userId = db_sql_decode($line['userId']);
            $list[$count++] =
               array('journalId'=>$journalId,
                  'journalDate'=>$journalDate,
                  'journalTitle'=>$journalTitle,
                  'userId'=>$userId);
         }
      }

      return $list;
   }

   /**
    * generate a unique journal ID. The unique ID is a base-64 encoding
    * of a random value. Since the journal IDs are at most 32 chars
    * long, the random value is 24 characters long
    */
   public static function generateJournalId() {
    $value = random_bytes(24);

    $data = substr(base64_encode($value), 0, 32);
    $data = str_replace(array('+','/','='), array('-','_',''), $data);
    return $data;
   }

   static function getHashList() {
      $query = ""
         . "SELECT blogJournal.journalId, blogJournal.hash "
         .   "FROM blogJournal "
         .   "INNER JOIN ("
         .     "SELECT "
         .       "MAX(t1.updated) AS updated, "
         .       "t1.journalId as journalId "
         .     "FROM blogJournal "
         .     "AS t1 "
         .     "GROUP BY t1.journalId"
         .   ") AS t2 "
         .   "WHERE blogJournal.journalId = t2.journalId "
         .     "AND blogJournal.updated = t2.updated ";

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
