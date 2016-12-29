<?php

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

   if ($item['location'] === 'grivel') {
      $item['url'] = 'http://www.grivel.net/blogphotos/' . $item['mediaId'] . '.jpg';
   } else {
      $item['url'] = 'http://photos-egrivel.rhcloud.com/phimg?large=' .$item['mediaId'];
   }
   return $item;
}

?>
