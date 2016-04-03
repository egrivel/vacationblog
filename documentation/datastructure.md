# Vacation Blog - Data Structure

Data structures on the front-end.

## Comments

A single comment is an object of the following structure:

```
{
  tripId: <trip unique ID>,
  commentId: <unique ID for this comment>,
  referenceId: <unique ID for the object the coment is about>,
  created: <timestamp>,
  updated: <timestamp>,
  userId: <unique ID of the user who made the comment>,
  commentText: <text of the comment, potentially multiple paragraphs>,
  deleted: <Y/N>
}
```

A comment _list_ as returned by `CommentStore.getData()` is an
array of all the comments (comment items) that are comments
to the indicated item.

A _recursive comment_ is a comment object that has an optional
`.childComments` property, which is a list of comments to it.

A comment _tree_ as returned by `CommentStore.getRecursiveData()`
is an array of all the recursive comment items that are comments
to the indicated item.
