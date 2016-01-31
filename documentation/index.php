<?php
include("common.php");
$gl_home_link = "";
print pageStart("Vacation Website Redesign");
?>

<h2>To Do</h2>

<p>The following should be done before starting out on the presentation
  layer. With the following in place (including the appropriate unit
  tests), development of the presentation layer can start focusing on
  the presentation layer only.</p>
<ol>
  <li>Business layer: move password verification to business layer.</li>
  <li>Service layer: add basic get, put and synch services for all
    objects.</li>
</ol>

<h2>Sections</h2>

<ul>
<li><a href='database.php'>Database Layer</a></li>
<li><a href='business.php'>Business Layer</a></li>
<li><a href='services.php'>Service Layer (API)</a></li>
<li><a href='textformat.php'>Text Format</a></li>
<li><a href='presentation.php'>Presentation Layer</a></li>
<li><a href='unittest.php'>Unit Testing</a></li>
</ul>

<h2>Additional Features</h2>

<p>Site-wide search: do a full text search of all journal entries, media
  captions and comments.</p>

<h2>Sample Sites</h2>

<ul>
<li><a href='../site/'>Site under construction</a>.</li>
<li><a href='../coverage/lcov-report/'>Code coverage report</a>.</li>
<li><a href='../site/index-static.php'>Static example</a> of trip and journal
    page.</li>
<li><a href='../site/#/journal/vak2007/200705310001'>post with the most
    comments (9).</a></li>
<li><a href='../site/#/journal/vak2007/200706230002'>post with the deepest
    comment nesting level (4).</a></li>
</ul>

<?php print pageEnd(); ?>
