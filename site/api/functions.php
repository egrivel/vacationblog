<?php
include_once(dirname(__FILE__) . '/../database/Media.php');

function fillCommentItem($item, $object) {
   $item['tripId'] = $object->getTripId();
   $item['commentId'] = $object->getCommentId();
   $item['created'] = $object->getCreated();
   $item['updated'] = $object->getUpdated();
   $item['userId'] = $object->getUserId();
   $item['referenceId'] = $object->getReferenceId();
   $item['commentText'] = $object->getCommentText();
   $item['deleted'] = $object->getDeleted();

   return $item;
}

function fillMediaItem($item, $object) {
   $item['tripId'] = $object->getTripId();
   $item['mediaId'] = $object->getMediaId();
   $item['created'] = $object->getCreated();
   $item['updated'] = $object->getUpdated();
   $item['type'] = $object->getType();
   $item['caption'] = $object->getCaption();
   $item['timestamp'] = $object->getTimestamp();
   $item['location'] = $object->getLocation();
   $item['width'] = $object->getWidth();
   $item['height'] = $object->getHeight();
   $item['deleted'] = $object->getDeleted();

   $mediaId = $item['mediaId'];

   $url = "http://photos-egrivel.rhcloud.com/phimg?large=$mediaId";
   if ($item['location'] === 'local') {
     $url = "/cgi-bin/photos/phimg?large=$mediaId";
   } else if ($item['location'] === 'grivel') {
      $url = "http://www.grivel.net/blogphotos/$mediaId.jpg";
      $url = "api/image.php?imageid=$mediaId";
   }
   $item['url'] = $url;

   return $item;
}

function addMediaIfNotExist($tripId, $mediaId) {
   $object = new Media($tripId, $mediaId);
   if (!$object->getCreated()) {
      $setId = substr($mediaId, 0, 8);
      $localFile = "/mnt/lincoln/d1/photos/$setId/large/$mediaId.jpg";
      if (!file_exists($localFile)) {
         $localFile = "/mnt/truman/d1/photos/$setId/large/$mediaId.jpg";
      }
      if (file_exists($localFile)) {
         $object->setLocation('local');
         list($width, $height, $type, $attr) = getimagesize($localFile);
         $object->setWidth($width);
         $object->setHeight($height);
         $object->setType('photo');
      }
      $object->save();
   }
}

function processJournalForMedia($tripId, $journalText) {
   // Extract regular images from the journal text
   $list = explode('[IMG ', $journalText);
   for ($i = 0; isset($list[$i]); $i++) {
      if (preg_match('/^\s*(\d\d\d\d\d\d\d\d-\d\d\d\d\d\d\w?)/', $list[$i], $matches)) {
         addMediaIfNotExist($tripId, $matches[0]);
      }
   }

   // extract panoramas from the journal text
   $list = explode('[PANO ', $journalText);
   for ($i = 0; isset($list[$i]); $i++) {
      if (preg_match('/^\s*(\d\d\d\d\d\d\d\d-\d\d\d\d\d\d\w?)/', $list[$i], $matches)) {
         addMediaIfNotExist($tripId, $matches[0]);
      }
   }
}

?>
