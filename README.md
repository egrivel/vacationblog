![banner](site/media/default-banner.png)

# Vacationblog Stuff

This vacation blog is a personal project of mine. The purpose is to create
a custom way for me to keep a blog while I'm traveling on vacation.

The reason standard blogs don't work for me is:

 - I want to run the same blog on multiple servers: my home Linux system, my Linux laptop that I am traveling with, and my public website. I want to be able to synchronize between those different servers.

 - I want to connect the blog directly to my photo archive while writing the blog entries. The typical workflow consists of first uploading the day's photos to the local copy of the photo archive, doing any labelling and post-processing in the photo archive, and then write the blog entry with references to the photos in the archive.

For this vacation blog project, I intend to make the photo archive connection a plugin, so that others will be able to create plugins to other photo repositories.

## Prerequisites

The following must be installed and running in order to run the vacation blog:

 - Web server (I use Apache's httpd server).

 - PHP enabled on the Web server.

 - A mySQL database.

 - NPM, to build and package the client-side part of the website.

The following are needed to do development work on the website:

 - phpunit to run server-side unit tests.

## Major Parts of the Vacation Blog

The vacation blog consists of three major pieces:

1. Database, which is assumed to be a mySQL database.

2. Server-side functionality, written in PHP. The server-side functionality mostly consists of a series of APIs available to the client-side code.

3. Client-side functionality, written in JavaScript using React.js technology.

## Attributions

Default site banner: Silver Bay, New York. Photographed July 11, 2014 by Eric Grivel. To the extent possible under law, Eric Grivel has waived all copyright and related or neighboring rights to this Photo #20140711-123441. This work is published from: United States.
