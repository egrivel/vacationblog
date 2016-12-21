<?php
include_once(dirname(__FILE__) . "/database.php");

class Comment {
   private $tripId;
   private $commentId;
   private $created;
   private $updated;
   private $latestUpdated;
   private $userId;
   private $referenceId;
   private $commentText;
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
      $this->commentId = "";
      $this->created = null;
      $this->updated = null;
      $this->latestUpdated = null;
      $this->userId = "";
      $this->referenceId = "";
      $this->commentText = "";
      $this->deleted = "N";
      $this->hash = "";
      $this->latestHash = "";
   }

   private static function createCommentTable() {
      $createDefault = db_get_create_default();
      $updateDefault = db_get_update_default();
      $query = "CREATE TABLE IF NOT EXISTS blogComment("
         . "tripId CHAR(32) NOT NULL, "
         . "commentId CHAR(32) NOT NULL, "
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
         . "userId CHAR(32) NOT NULL, "
         . "referenceId char(32), "
         . "commentText TEXT, "
         . "deleted CHAR(1), "
         . "hash CHAR(32), "
         . "PRIMARY KEY(tripId, commentId, updated), "
         . "KEY(tripId, referenceId, updated) "
         . ")";
      if (!mysql_query($query)) {
         print $query . "<br/>";
         print "Error: " . mysql_error() . "<br/>";
         return false;
      }
      return true;
   }

   private static function addDeletedColumn() {
      $query = "ALTER TABLE blogComment "
         . "ADD COLUMN deleted CHAR(1)";
      if (!mysql_query($query)) {
         print $query . "<br/>";
         print "Error: " . mysql_error() . "<br/>";
         return false;
      }
      return true;
   }

   private static function addTripCommentKey() {
      $query = "ALTER TABLE blogComment "
         . "DROP PRIMARY KEY";
      if (!mysql_query($query)) {
         print $query . "<br/>";
         print "Error: " . mysql_error() . "<br/>";
         return false;
      }
      $query = "ALTER TABLE blogComment "
         . "ADD PRIMARY KEY(tripId, commentId, updated)";
      if (!mysql_query($query)) {
         print $query . "<br/>";
         print "Error: " . mysql_error() . "<br/>";
         return false;
      }
      return true;
   }

   private static function addTripReferenceKey() {
      $query = "ALTER TABLE blogComment "
         . "ADD KEY(tripId, referenceId, updated)";
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
    * Constructor. This will load the information for the specified comment
    * if a comment ID is given and that comment ID exists.
    * If no comment ID is passed, an empty comment object is constructed.
    * If a comment ID is passed but no comment with that ID exists, the comment object
    * will have the comment ID set but all other fields will be empty.
    */
   function __construct($tripId = "", $commentId = "") {
      $this->eraseObject();
      if (!isset($tripId) || ($tripId === "")) {
         throw new InvalidArgumentException("Must provide a trip ID");
      }
      if (!isset($commentId) || ($commentId === "")) {
         throw new InvalidArgumentException("Must provide a valid comment ID");
      }

      $this->load($tripId, $commentId);
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
         // No data version yet - create initial table
         return Comment::createCommentTable();
         break;
      case "v0.7":
      case "v0.8":
      case "v0.9":
         if (!Comment::addDeletedColumn()
             || !Comment::addTripCommentKey()
             || !Comment::addTripReferenceKey()
             ) {
            // on any errors, return false
            return false;
         }
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
         print "Comment::updateTables($dataVersion): don't know this version.\n";
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
      $this->commentId = db_sql_decode($line['commentId']);
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
      $this->referenceId = db_sql_decode($line["referenceId"]);
      $this->commentText = db_sql_decode($line["commentText"]);
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
    * @param $commentId the comment ID to load. This must be a valid non-empty
    * comment ID.
    * @return true when data is successfully loaded, false if no comment data
    * is loaded (object will be empty except for commentID).
    */
   public function load($tripId = "", $commentId = "") {
      $this->eraseObject();

      if (!isset($tripId)  || ($tripId === "")) {
         return false;
      }
      $this->tripId = $tripId;

      if (!isset($commentId) || ($commentId === "")) {
         return false;
      }
      $this->commentId = $commentId;

      $tripIdValue = db_sql_encode($this->tripId);
      $commentIdValue = db_sql_encode($commentId);
      $query = "SELECT *, "
         . "CONVERT_TZ(`created`, @@session.time_zone, '+00:00') "
         .   "AS `utc_created`, "
         . "CONVERT_TZ(`updated`, @@session.time_zone, '+00:00') "
         .   "AS `utc_updated` "
         . "FROM blogComment "
         . "WHERE tripId=$tripIdValue "
         .   "AND commentId=$commentIdValue "
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
      if (!isset($this->commentId) || ($this->commentId === "")) {
         // Need a comment ID before we can save. Any comment ID is fine.
         return false;
      }

      $query = "INSERT INTO blogComment SET "
         . "tripId=" . db_sql_encode($this->tripId)
         . ", commentId=" . db_sql_encode($this->commentId)
         . db_created($this->created)
         . db_updated($this->updated)
         . ", userId=" . db_sql_encode($this->userId)
         . ", referenceId=" . db_sql_encode($this->referenceId)
         . ", commentText=" . db_sql_encode($this->commentText)
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
         if ($this->load($this->tripId, $this->commentId)) {
            if ($mustUpdateHash) {
               $value = "|"
                  . $this->created . "|"
                  . $this->latestUpdated . "|"
                  . $this->userId . "|"
                  . $this->referenceId . "|"
                  . $this->commentText . "|"
                  . $this->deleted . "|";
               $this->hash = md5($value);
               $this->latestHash = $this->hash;
               $query = "UPDATE blogComment SET "
                  . "hash=" . db_sql_encode($this->hash)
                  . " WHERE tripId=" . db_sql_encode($this->tripId)
                  .   " AND commentId=" . db_sql_encode($this->commentId)
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

   /**
    * generate a unique comment ID. The unique ID is a base-64 encoding
    * of a random value. Since the comment IDs are at most 32 chars
    * long, the random value is 24 characters long
    */
   public static function generateCommentId() {
    $value = random_bytes(24);

    return substr(base64_encode($value), 0, 32);
   }

   public function getTripId() {
      return $this->tripId;
   }

   public function getCommentId() {
      return $this->commentId;
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

   public function getReferenceId() {
      return $this->referenceId;
   }

   public function setReferenceId($value) {
      $this->referenceId = $value;
   }

   public function getCommentText() {
      return $this->commentText;
   }

   public function setCommentText($value) {
      $this->commentText = $value;
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
         . "FROM blogComment "
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
      $object = new Comment('-', '-');
      if ($object->loadFromResult($result)) {
         return $object;
      }
      return null;
   }

   static public function findByReferenceId($tripId = '', $referenceId = '') {
      if (!$tripId || !$referenceId) {
         return null;
      }
      $tripIdValue = db_sql_encode($tripId);
      $referenceIdValue = db_sql_encode($referenceId);
      $query = ""
         . "SELECT t2.commentId "
         .   "FROM blogComment "
         .   "INNER JOIN ("
         .     "SELECT "
         .       "MAX(t1.updated) AS updated, "
         .       "t1.tripId as tripId, "
         .       "t1.commentId as commentId "
         .     "FROM blogComment "
         .     "AS t1 "
         .     "GROUP BY t1.tripId, t1.commentId "
         .     "HAVING t1.tripId = $tripIdValue "
         .   ") AS t2 "
         .   "WHERE blogComment.tripId = t2.tripId "
         .     "AND blogComment.commentId = t2.commentId "
         .     "AND blogComment.updated = t2.updated "
         .     "AND blogComment.deleted != 'Y' "
         .     "AND blogComment.referenceId = $referenceIdValue "
         .   "ORDER BY blogComment.created ASC ";
      // print $query . "\n";
      $result = mysql_query($query);
      if (!$result) {
         // Error executing the query
         print $query . "<br/>";
         print " --> error: " . mysql_error() . "<br/>\n";
         return null;
      }
      if (mysql_num_rows($result) <= 0) {
         // Comment does not exist
         return null;
      }

      $list = Array();
      $count = 0;
      while ($line = mysql_fetch_array($result, MYSQL_ASSOC)) {
         $list[$count++] = db_sql_decode($line['commentId']);
      }
      return $list;
   }

   static function getHashList() {
      $query = ""
         . "SELECT blogComment.commentId, blogComment.hash "
         .   "FROM blogComment "
         .   "INNER JOIN ("
         .     "SELECT "
         .       "MAX(t1.updated) AS updated, "
         .       "t1.commentId as commentId "
         .     "FROM blogComment "
         .     "AS t1 "
         .     "GROUP BY t1.commentId"
         .   ") AS t2 "
         .   "WHERE blogComment.commentId = t2.commentId "
         .     "AND blogComment.updated = t2.updated ";

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
