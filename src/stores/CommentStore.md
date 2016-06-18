# Comment Store Documentation

The comment store stores everything related to comments. It can provide:

- Everything anyone ever wants to know about an individual comment
- What the comments to a particular entity are
- Complete comment tree

Note: this page describes the *design* for the comment store, not necessarilly the current implementation.

## Comment

A `comment` object is a representation of a comment that someone has left on the site. A comment has:

- `commentId`: the unique ID of the comment. Comments that have not yet been created in the database (still being edited) do not have a comment ID yet, although they do have the parent information.
- `tripId` and `referenceId`: parent identification, whatever the comment is attached to (this can be a journal entry, a media item, or another comment).
- `userId`: the ID of the user who made the comment.
- `created`: the date/time when the comment was originally created.
- `commentText`: the actual text of the comment (this can be multiple paragraphs with basic markup only).
- `deleted`: flag indicating the comment was deleted. Deleted comments still exist in the database but aren't shown.
- `childComments`: comments to this comment.

## Retrieving Comments from Server

When an object (journal entry, media item) is loaded, the associated comments must be loaded as well.

To load all the comments associated with an object, use the `CommentAction.recursivelyLoadComments()` function. Pass it the `tripId` and `referenceId`. This will load all the comments for the object, including all the comments to comments. This call may result is a number of updates to the comment store, due to the recursive nature.

A non-recursive action is also available, `CommentAction.loadComments()`, which will load just the list of direct comments to the object (again identified by `tripId` and `referenceId`), but not the comments to the comments.

There is currently no function to load a comment based on the comment ID.

Note that the above actions also have as the effect that the user information for the users who made the comments will be loaded.

## Displaying Comments

All display information for comments is retrieved from the comment store. The general function `CommentStore.getComment()`. This function returns a single object with the information of a particular comment, including all the children.

To get the list of comments on an object, use the `CommentStore.getList()` function; for the entire recursive structure, use `CommentStore.getRecursiveList()`.

## Editing Comment

In order to edit a comment, the user must be allowed to edit the comment. The comment store provides the `CommentStore.canEditComment()` function to determine whether a particular comment is editable.

For the actual editing, the comment must first be switched to be in edit mode with `CommentAction.setEditing()` and then the value can be updated with `CommentAction.setValue()`. Both of these actions have no effect if the user is not allowed to edit a comment.

## Saving Comment

To save the comment, use the `CommentAction.postComment()` function.

## New Comments

In order to create a new comment for an item, use the `CommentAction.newComment()` function. This will create a (temporary) comment ID and set the comment to be in-editing.
