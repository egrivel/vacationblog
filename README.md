![banner](site/media/default-banner.png)

# Vacationblog Stuff

This vacation blog is a personal project of mine. The purpose is to create
a custom way for me to keep a blog while I'm traveling on vacation.

The reason standard blogs don't work for me is:

 - I want to run the same blog on multiple servers: my home Linux system, my Linux laptop that I am traveling with, and my public website. I want to be able to synchronize between those different servers.

 - I want to connect the blog directly to my photo archive while writing the blog entries. The typical workflow consists of first uploading the day's photos to the local copy of the photo archive, doing any labelling and post-processing in the photo archive, and then write the blog entry with references to the photos in the archive.

For this vacation blog project, I intend to make the photo archive connection a plugin, so that others will be able to create plugins to other photo repositories.

## Major Parts of the Vacation Blog

The vacation blog consists of three major pieces:

1. Database, which is assumed to be a mySQL database.

2. Server-side functionality, written in PHP. The server-side functionality mostly consists of a series of APIs available to the client-side code.

3. Client-side functionality, written in JavaScript using React.js technology.

## Prerequisites

The following must be installed and running in order to run the vacation blog:

 - Web server (I use Apache's httpd server).

 - PHP enabled on the Web server.

 - A mySQL database.

 - NPM, to build and package the client-side part of the website.

The following are needed to do development work on the website:

 - phpunit to run server-side unit tests.

## Getting Started

To get started using the vacation blog:

 - Obtain the source from GitHub (obviously). The GitHub project contains
   both the server-side and client-side code.

 - Obtain all the NPM modules by running the command

   `vacationblog> npm install`

 - Build the client-side part of the application by running the command

   `vacationblog> npm run browserify`

 - Create a MySQL database that will house the vacation blog. The following
   example creates a database named "blog":

   `mysql> CREATE DATABASE blog;`

 - Create a `vacationblog.ini` file that contains the connection details
   for the database. This file should be placed in a location where it can
   only be read by the web server, not by any other user on the system,
   since it contains the username and password for connecting to the
   database. The following example shows the format of the file:

       `hostname = 'localhost'`
       `username = 'dbuser'`
       `password = 'secret'`
       `dbname = 'blog'`

 - Update the file `site/database/database.php` to point to the location
   that was chosen for the `vacationblog.ini` file. This is the line that
   should be updated:

   `$config = parse_ini_file('./vacationblog.ini');`

 - Make the content of the `site/` folder accessible from the web server.
   This will be the on-line address of the vacation blog.

 - Navigate in a browser to the following location (assuming the `site/`
   folder has been mounted on the website as `.../site/`):

       `http\://.../site/api/CreateTables.php`

   to run the script that creates the tables in the database. The first time
   this script is run, it will show an error that the blogSettings table
   does not exist; this is expected. This script will ask for the information
   of the user who will be the administrator of the vacation blog system.
   The username and password provided here will be used to create a user
   into the vacation blog databases who will be able to administer the
   vacation blog system.

   Note: once the CreateTables script successfully initializes the database,
   it won't ask for the administrator information again. On subsequent
   runs, the script will check if there database structure is up-to-date
   with the application source code, and update the database if needed.

At this point, the vacation blog site has been initialized and is ready for
use. Navigate to the site's URL (`http\://.../site/`) to see the home page.
It should now be possible to login as the user created above and start
creating trips, adding content etc.

## Attributions

Default site banner: Silver Bay, New York. Photographed July 11, 2014 by Eric Grivel. To the extent possible under law, Eric Grivel has waived all copyright and related or neighboring rights to this Photo #20140711-123441. This work is published from: United States.
