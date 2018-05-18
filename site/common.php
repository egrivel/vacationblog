<?php
/*
 * Include file for common functionality for static pages.
 */

function pageStart($title = "Vacation Blog") {
  $out = "";

  $out .= "<!DOCTYPE html lang='en'>\n";
  $out .= "<html>\n";
  $out .= "<head>\n";
  $out .= "<title>Vacation Blog</title>\n";
  $out .= "<meta http-equiv='X-UA-Compatible' content='IE=edge'>\n";
  $out .= "<meta charset='utf-8'>\n";
  $out .= "<meta http-equiv='Content-Type' content='text/html;charset=utf-8'>\n";
  $out .= "<meta name='viewport' content='width=device-width,initial-scale=1'>\n";
  $out .= "<meta name='description' content='Vacation Blog'>\n";
  $out .= "<meta name='author' content='Eric Grivel'>\n";
  $out .= "<link rel='shortcut icon' href='./media/favicon.ico'>\n";
  $out .= "<link href='https://fonts.googleapis.com/css?family=Droid+Serif:400,400italic,700,700italic|Merriweather+Sans|Lato:700|Roboto:400,400italic,700,700italic' rel='stylesheet' type='text/css'>\n";
  $out .= "<script src='https://use.fontawesome.com/75a2a1cfb9.js'></script>\n";
  $out .= "<style type='text/css'>\n";
  $out .= "@import url('css/reset.css');\n";
  $out .= "@import url('css/site.css');\n";
  $out .= "</style>\n";
  $out .= "</head>\n";
  $out .= "<body>\n";
  $out .= "<div class='body'>\n";
  $out .= "<div class='header'>\n";
  $out .= "<h1>Vacation Website</h1>\n";
  $out .= "<img src='media/default-banner.png'/>\n";
  $out .= "<div>&nbsp;</div>\n";
  $out .= "</div>\n";
  $out .= "<div class='content'>\n";

  return $out;
}

function pageEnd() {
  $out = "";

  $out .= "</div>\n";
  $out .= "<div class='footer'>\n";
  $out .= "<p>Website design ©2015-18 by Eric Grivel. All rights reserved.</p>\n";
  $out .= "</div>\n";
  $out .= "</div>\n";
  $out .= "</body>\n";
  $out .= "</html>\n";

  return $out;
}
?>
