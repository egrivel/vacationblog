<?php
if (isset($_GET['imageid'])) {
  $id = $_GET['imageid'];
  header("Location: /vacationblog/site/blogphotos/$id.jpg");
  # $image = file_get_contents("http://egrivel.net/blogphotos/$id.jpg");
  # header('Content-Type: image/jpeg');
  # echo $image;
}
?>
