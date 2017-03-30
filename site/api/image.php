<?php
if (isset($_GET['imageid'])) {
  $id = $_GET['imageid'];
  $image = file_get_contents("http://www.grivel.net/blogphotos/$id.jpg");
  header('Content-Type: image/jpeg');
  echo $image;
}
?>
