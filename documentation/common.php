<?php
include("../../../site-common.php");

$gl_root_dir = "../../..";
$gl_home_link = "index.php";

gl_set_subsite_css("local.css");

/* ============================================================ */
/* Basic page functions                                         */
/* ============================================================ */

function pageStart($title, $columns="one") {
   /* Enable the two-column printing feature. The default (for  */
   /* short pages) is to use only the first to two columns.     */
   /* Pass a column parameter "two" for larger pages, so that   */
   /* printing starts out in two columns. On the last page, it  */
   /* may be necessary to manually print the last part in a     */
   /* single column.                                            */
   gl_set_columns($columns);
   return gl_page_start($title);
}

function pageEnd() {
   return gl_page_end();
}
?>
