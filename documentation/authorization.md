# Vacation Blog - Authorization

This section of the documentation describes the authorization process, including authentication and the determining of access.

## Users

The vacation blog maintains a set of users and their access levels. There are three levels of user access defined:

 - *Guest*: someone visiting the blog but did not identify themselves
   (log in). Guests can view the site but not make any changes.
 - *Normal user*: most users fall in this category. Normal users can
   comment on entries, but can not create entries themselves.
 - *Administrator*: users who can administer the site, including
   administring trips and users. The administrator is *not* automatically
   a contributor on any particular trip.

In addition, each trip identifies one or more users as *contributors*.
The contributor can create new blog entries (for that trip) and can
moderate comments on that trip.

## Public Access

Everyone has read access to most of the vacation blog. Visitors do not have to log in to the site in order to see the blog entries, comments, photos etc.

## User Access

A user who wants to contribute must first _log in_. The vision is that users can either log in with a social media account (e.g. facebook, google) or they can establish an account with a user ID and password specifically for this site.

The discussion here will focus on logging in with a site-specific user ID and password. Logging in with a social media account will be added later. Note: the registration process itself will be discussed later as well.

In order to log in, the user uses the front-end Login function. This function will submit the provided credentials (user ID and password) to the `login.php` API.

The API will match the user ID and password combination against the database. If a match is found, and _authentication token_ is generated. This token is stored in the _Auth_ database, together with the user ID and some administrative data, and then returned to the front-end. The front-end will store the token as a _cookie_ with a far-in-the-future expiration date (the ability to use session cookies or cookies with limited lifespan may be added in the future).

After receiving the authentication token, the front-end will call the API to retrieve the information of the authenticated user, and will be able to display e.g. the user's name, as well as enable or disable front-end functions based on the user's access level.

All subsequent requests from the front-end will have the authentication token included as a cookie. The API function will look up the authentication token in the _Auth_ database and retrieve the authenticated user ID from there. It will then use the user's access level to authorize the use of the requested functionality.

When the user comes back in a new session on the same machine, the authentication token will still be there as a cookie. The front-end will call the API to get the information of the authenticated user at start-up when there is an authentication token present.

The front-end will provide a _logout_ function, which will:
 - call the API to invalidate the current authentication token,
 - remove the authentication token cookie on the browser,
 - remove all information about the user from the front-end.
Note that it is important that the authentication token is invalidated on the server. When a user logs out explicitly, nobody should be able to use that authentication token anymore.
