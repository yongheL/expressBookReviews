const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// 6. User registration
public_users.post("/register", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registred. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }

    return res.status(404).json({ message: "Unable to register user." });
});

// 10. Get books by async
let getBooks = async () => {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
}

// 11-13. Get selected books by async
let getSelectedBooks = async ({ isbn, author, title }) => {
    return new Promise((resolve, reject) => {
        var selectedBook;
        if (isbn) {
            selectedBook = books[isbn];
        } else if (author) {
            for (let key in books) {
                if (books[key].author === author) {
                    selectedBook = books[key];
                    break;
                }
            }
        } else if (title) {
            for (let key in books) {
                if (books[key].title === title) {
                    selectedBook = books[key];
                    break;
                }
            }
        }

        resolve(selectedBook);
    });
}

// 1. Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    getBooks().then(res.send(JSON.stringify({ books }, null, 4)))
});

// 2. Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    getSelectedBooks({ isbn: req.params.isbn }).then((selectedBook) => selectedBook ? res.json(selectedBook) : res.status(403).json({
        message: "Unable to locate book with the provided ISBN."
    }));
});

// 3. Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    getSelectedBooks({ author: req.params.author }).then((selectedBook) => selectedBook ? res.json(selectedBook) : res.status(403).json({
        message: "Unable to locate book with the indicated author."
    }));
});

// 4. Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    getSelectedBooks({ title: req.params.title }).then((selectedBook) => selectedBook ? res.json(selectedBook) : res.status(403).json({
        message: "Unable to locate book with the provided title."
    }));
});


// 5. Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const book_isbn = req.params.isbn;
    const book = books[book_isbn];
    res.send(book.reviews);
});

module.exports.general = public_users;
