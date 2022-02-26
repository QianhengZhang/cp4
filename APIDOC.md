# Bookshelf API Documentation
The Bookshelf API provides information of the current
bookshelf and one piece of information for a random book.
It allows user to freely edit the current bookshelf as
much as they like.

## Get the current list of books or a random book.
**Request Format:** /load/:target

**Request Type:** Get

**Returned Data Format**: JSON

**Description:** If the input target is shelf, returns titles and authors
of the books in the current bookshelf in json format. If the input target
is random, chooses a random book from the book list and return its title
and authors.

**Example Request:** /load/shelf, /load/random

**Example Response:**
```json
[
  {
    "title": "Anna Karenina",
    "author": "Leo Tolstoy"
  },
  {
    "title": "To Kill a Mockingbird",
    "author": "Harper Lee"
  }
]
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If passed in an invalid target name, returns an error with the message:
  `The request is not valid`

## Add a book to the bookshelf
**Request Format:** /add endpoint with POST parameters of `title` and `author`

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** Returns a success message if the book with given author and
title is added to the current list.

**Example Request:** /add endpoint with POST parameters of
`title=The_Great_Gatsby` and `author=F._Scott_Fitzgerald`

**Example Response:**
```
The Great Gatsby by F. Scott Fitzgerald is added!
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If passed title and author is invalid, returns an error with the message:
  `The input for author and reader is invalid!`

## Delete a book from the bookshelf
**Request Format:** /delete endpoint with POST parameters of `title` and `author`

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** Returns a success message if the book with given author and
title is deleted from the current list.

**Example Request:** /add endpoint with POST parameters of
`title=War_and_Peace` and `author=Leo_Tolstoy`

**Example Response:**
```
War and Peace by Leo Tolstoy is added!
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If passed title and author is invalid, returns an error with the message:
  `The input for author and reader is invalid!`