/**
 * Name: Joshua Zhang
 * Date: February 25, 2022
 * Section: CSE 154 AB
 *
 * It's the app.js file for the cp4. It works as a bookshelf
 * api which allows user to check the current list of books
 * in the bookshelf. It also allows user to get random new
 * books or add and delete any of the books from the bookshelf.
 */

'use strict';

const ERROR_CODE = 400;
const PORT_NUMBER = 8000;

const express = require('express');
const fs = require('fs').promises;
const multer = require('multer');
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());

/**
 * If the input target is shelf, returns titles and authors
 * of the books in the current bookshelf in json format.
 * If the input target is random, chooses a random book
 * from the book list and return its title and authors
 * in json format. Warn users if neither input was given.
 * Save the result to the current list.
 */
app.get('/load/:target', async (req, res) => {
  if (req.params['target'] === 'shelf') {
    res.type = 'json';
    let data = await fs.readFile("current-list.json", "utf8");
    data = JSON.parse(data);
    res.json(data);
  } else if (req.params['target'] === 'random') {
    res.type = 'json';
    let books = await fs.readFile("book-list.json", "utf8");
    books = JSON.parse(books);
    let book = books[Math.floor(Math.random() * books.length)];
    res.json(book);
    let data = await fs.readFile("current-list.json", "utf8");
    data = JSON.parse(data);
    if (checkValue(book["title"], book["author"], data)) {
      data.push(book);
      await fs.writeFile("current-list.json", JSON.stringify(data));
    }
  } else {
    res.type('text');
    res.status(ERROR_CODE).send('The request is not valid');
  }
});

/**
 * Returns a success message if the book with given author and
 * title is deleted from the current list. Warn user if the
 * input title and author is invalid to be removed as a book.
 * Save the result to the current list.
 */
app.post('/delete', async (req, res) => {
  let author = req.body.author;
  author = author.replace("_", " ");
  let title = req.body.title;
  title = title.replace("_", " ");
  if (author && title) {
    let data = await fs.readFile("current-list.json", "utf8");
    data = JSON.parse(data);
    let i = 0;
    for (const book of data) {
      if (book["title"] === title && book["author"] === author) {
        data.splice(i, 1);
      }
      i++;
    }
    await fs.writeFile("current-list.json", JSON.stringify(data));
    res.type('text');
    res.send(title + " by " + author + " is deleted!");
  } else {
    res.type('text');
    res.status(ERROR_CODE).send('The input for author and reader is invalid!');
  }
});

/**
 * Returns a success message if the book with given author and
 * title is added to the current list. Warn user if the
 * input title and author is invalid to be added as a book.
 * Save the result to the current list.
 */
app.post('/add', async (req, res) => {
  let author = req.body.author;
  author = author.replace("_", " ");
  let title = req.body.title;
  title = title.replace("_", " ");
  if (author && title) {
    let data = await fs.readFile("current-list.json", "utf8");
    data = JSON.parse(data);
    let book = {"title": title,
      "author": author};
    data.push(book);
    await fs.writeFile("current-list.json", JSON.stringify(data));
    res.type('text');
    res.send(book["title"] + " by " + book["author"] + " is added!");
  } else {
    res.type('text');
    res.status(ERROR_CODE).send('The input for author and reader is invalid!');
  }
});

/**
 * Takes in a stirng of title, author and an array list. Compares the
 * title and author with each items from the array list. If they match,
 * return false. Other wise, return true.
 * @param {*} title - A string of title of the book.
 * @param {*} author - A string of author of the book.
 * @param {*} data  - An array list of book informations.
 * @returns {boolean} - True if the book with given title and author is
 * not in the data. False if it is in the data.
 */
function checkValue(title, author, data) {
  for (const book of data) {
    if (book["title"] === title && book["author"] === author) {
      return false;
    }
  }
  return true;
}

app.use(express.static('public'));
const PORT = process.env.PORT || PORT_NUMBER;
app.listen(PORT);
