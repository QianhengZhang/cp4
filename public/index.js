/**
 * Name: Joshua Zhang
 * Date: February 25, 2022
 * Section: CSE 154 AB
 *
 * It's the index.js file for the cp4. It implements a virtual
 * bookshelf that allows users to store, edit, and check a book
 * they like whenever they want. ANyone can make a change on the
 * page to list the best loved books. These functions are based on
 * fetching the cp4 api used in this project.
 */

"use strict";

(function() {

  window.addEventListener("load", init);

  /**
   * Initializes the window and sets up the event listners
   * for a button to allow changes within the bookshelf.
   */
  function init() {
    makeRequest("shelf");
    id("search-btn").addEventListener("click", () => {
      makeMove();
    });
  }

  /**
   * This function initializes at the moment window
   * is opened and updates an unique book to the shelf
   * when user request a random book. This function
   * takes in a string of which move is made to make
   * different result. It fetches the status of the
   * bookshelf from the cp4 api in this project
   * @param {string} move - A string of the move the
   * user choose(shelf or random).
   */
  function makeRequest(move) {
    fetch('/load/' + move)
      .then(statusCheck)
      .then(resp => resp.json())
      .then(processData)
      .catch(handleError);
  }

  /**
   * This function deletes a book from the bookshelf when
   * the inputs title and author both exist on one book.
   * The book must match the title and author at the same
   * time. It fetches if the delete action works from the
   * cp4 api in this project.
   * @param {string} title - A string of the title of one book.
   * @param {string} author - A string of the author of one book.
   */
  function makeRequestDelete(title, author) {
    author = author.replace(" ", "_");
    title = title.replace(" ", "_");
    let data = new FormData();
    data.append("author", author);
    data.append("title", title);
    fetch("/delete", {method: "POST", body: data})
      .then(statusCheck)
      .then(resp => resp.text())
      .then(processInfo)
      .catch(handleError);
  }

  /**
   * This function adds a book to the bookshelf when the inputs
   * title and author together not in the bookshelf(title and
   * author can exist without each other). It fetches if the delete
   *  action works from the cp4 api in this project.
   * @param {string} title - A string of the title of one book.
   * @param {string} author - A string of the author of one book.
   */
  function makeRequestAdd(title, author) {
    addBook(title, author);
    author = author.replace(" ", "_");
    title = title.replace(" ", "_");
    let data = new FormData();
    data.append("author", author);
    data.append("title", title);
    fetch("/add", {method: "POST", body: data})
      .then(statusCheck)
      .then(resp => resp.text())
      .then(processInfo)
      .catch(handleError);
  }

  /**
   * This function takes in the ajax response text that is
   * the success information of adding or deleting process.
   * Then it updates the message to the window and clean the
   * input area of the editing section.
   * @param {string} resp - The text message of user's movement is successful
   */
  function processInfo(resp) {
    id("book-title").value = "";
    id("author-name").value = "";
    id("message").textContent = resp;
  }

  /**
   * This function takes in the ajax response text that is
   * the information of one book or all books currently in the
   * bookshelf. Then it updates the books to the bookshelf.
   * If only one book is added, it will also check if the
   * book is in the bookshelf. If the book has already been
   * in the bookshelf, it will request a new book instead.
   * @param {object} resp - The Json object that has information
   * of the books.
   */
  function processData(resp) {
    if (resp["title"]) {
      let title = resp["title"];
      let author = resp["author"];
      let bookId = title.replace(" ", "_") + "-" + author.replace(" ", "_");
      if (!id(bookId)) {
        addBook(title, author);
      } else {
        makeRequest("random");
      }
    } else {
      for (const book of resp) {
        let title = book["title"];
        let author = book["author"];
        addBook(title, author);
      }
    }
  }

  /**
   * This function cleans the message board and checks
   * which move the user make. Depending on users' move,
   * it will make different request to the cp4 api used
   * in this project. Add a book in move 0, delete a
   * book in move 1, and request a random book in move 2.
   */
  function makeMove() {
    id("message").innerHTML = "";
    let move = checkSubmission();
    move = Number(move);
    let title = id("book-title").value;
    let author = id("author-name").value;
    let bookId = title.replace(" ", "_") + "-" + author.replace(" ", "_");
    if (move === 0 && !id(bookId) && title !== "" && author !== "") {
      makeRequestAdd(title, author);
    } else if (move === 1 && id(bookId)) {
      id(bookId).remove();
      makeRequestDelete(title, author);
    } else if (move === 2) {
      makeRequest("random");
    }
  }

  /**
   * This function checks the input values of title and author and
   * which move the user made. Returns a string of number to represent
   * the targeted move. If the input values are empty when add or
   * delete move is made, return null to stop the request.
   * @returns {string} - The string of which movement is made.
   */
  function checkSubmission() {
    let move = qs('input[type="radio"]:checked').value;
    if (move === "2") {
      return move;
    } else if (id('book-title').value === "" || id('author-name').value === "") {
      return null;
    }
    return move;
  }

  /**
   * This functions takes in the strings of book title and author.
   * Then it generates a <div> tag to hold the title, name, and
   * wikepedia link of the book. Finally, it will update the book
   * to the bookshelf.
   * @param {string} titleText - The string of title of the book;
   * @param {string} authorText - The string of author of the book;
   */
  function addBook(titleText, authorText) {
    let book = gen("div");
    let title = gen("p");
    let author = gen("p");
    let link = gen("a");
    title.textContent = titleText;
    author.textContent = authorText;
    link.href = "https://en.wikipedia.org/wiki/" + titleText.replace(" ", "_");
    link.textContent = "Wikipedia Page";
    link.target = "_blank";
    title.classList.add("title");
    author.classList.add("author");
    book.appendChild(title);
    book.appendChild(author);
    book.appendChild(link);
    book.classList.add("book");
    book.addEventListener("dblclick", removeBook);
    book.id = titleText.replace(" ", "_") + "-" + authorText.replace(" ", "_");
    id("shelf").appendChild(book);
  }

  /**
   * Removes the visual view of the book and requests a deleting
   * of this book from the sever.
   * @param {event} event - The event related with the book <div>
   */
  function removeBook(event) {
    let title = event.currentTarget.firstChild.textContent;
    let author = event.currentTarget.firstChild.nextElementSibling.textContent;
    makeRequestDelete(title, author);
    event.currentTarget.remove();
  }

  /**
   * Cleans up the message board and shows the current error message
   * on the message board. It also suggests user what to do right now.
   * @param {error} err - the error message of current fetching process.
   */
  function handleError(err) {
    let display = id("message");
    display.innerHTML = "";
    let error = gen("p");
    error.textContent = "Error happens during fetching, please try again later";
    let message = gen("p");
    message.textContent = "Error reason: " + err;
    display.appendChild(error);
    display.appendChild(message);
  }

  /**
   * This function checks the response's status. If the response's text
   * is valid, it will return the text. Other than that, it will throw
   * an error and cause the promise to be rejected.
   * @param {object} resp - response to be checked.
   * @returns {object} - If the response text is valid, the returned object
   * is the response text. If not valid, will reject the promise.
   */
  async function statusCheck(resp) {
    if (!resp.ok) {
      throw new Error(await resp.text());
    }
    return resp;
  }

  /* --- CSE 154 HELPER FUNCTIONS --- */
  /**
   * Returns the DOM object with the given id attribute.
   * @param {string} name - element ID
   * @returns {object} DOM object associated with id (null if not found).
   */
  function id(name) {
    return document.getElementById(name);
  }

  /**
   * Returns the first DOM object that match the given selector.
   * @param {string} selector - query selector
   * @returns {object} - the DOM object matching the query.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns a new element with the given tag name.
   * @param {string} tagName - HTML tag name for new DOM element.
   * @returns {object} New DOM object for given HTML tag.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }
})();