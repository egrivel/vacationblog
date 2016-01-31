<?php
include('common.php');
print pageStart('Text Format');
?>

<p>This page describes how text is stored in the database, with the
  various markup options.</p>
<p>Note: markup is case sensitive.</p>

<h2>Characters</h2>
<ul>
  <li>Markup is done using square brackets.</li>
  <li>When using square brackets in the text, they are stored as the
    &amp;#91; ([) and &amp;#93; (]) entities respectively.</li>
  <li>Literal ampersand character (&amp;) is stored as the &amp;amp;
    entity.</li>
  <li>Paragraphs are separated by an &amp;lf; entity.</li>
  <li>Feet marker (&apos;) is stored as the &amp;apos; entity.</li>
  <li>Inch marker (&quot;) is stored as the &amp;quot; entity.</li>
  <li>All other characters are stored as themselves in Unicode.</li>
</ul>

<h2>Formatting / Styling</h2>

<ul>
  <li>[EM] ... [/EM] surrounds emphasized text (displayed in italics).</li>
  <li>Bold ([B])and underline ([U]) are only supported for legacy journal
    entries.</li>
</ul>

<h2>Media </h2>

<p>Media are allowed in journal entries only, not in comments.</p>

<ul>
  <li>[IMG &lt;image id&gt;] is used to indicate an image.</li>
  <li>[VIDEO &lt;video id&gt;] is used to indicate a video.</li>
</ul>

<h2>Links</h2>

<ul>
  <li>[LINK &lt;link target&gt;]...[/LINK] is used to make the surrounded
    text a link to the indicated target.</li>
</ul>

<h2>Lists</h2>
<p>Lists are not allowed. Lists in legacy entries are replaced by 
  individual paragraphs.</p>

<h2>Paragraphs</h2>

<ul>
  <li>A paragraph can be a text-only paragraph, a text-with-one-image 
    paragraph, an images-only paragraph or a video paragraph. The
    start of the paragraph indicates which type it is.</li>
  <li>[IMGS] at the beginning of the paragraph indicates this is an
    image-only paragraph. The rest of the paragraph consists of one or
    more [IMG] elements.</li>
  <li>[IMG ...] at the beginning of the paragraph indicates that this is
    a text-with-one-image paragraph. The image is at the start; the rest
    of the paragraph does not contain any images or video.</li>
  <li>[VIDEO ...] at the beginning of the paragraph indicates a video
    paragraph. There is nothing else in the paragraph but the video.</li>
  <li>Paragraphs not starting with one of the above are text-only 
    paragraphs.</li>
</ul>

<?php print pageEnd(); ?>
