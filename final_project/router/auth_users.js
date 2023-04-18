const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let userswithsamename = users.filter((user) => {
        return user.username === username
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//7. only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// 8.Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
    const isbn = req.params.isbn;
    let filtered_book = books[isbn]
    if (filtered_book) {
        let review = req.query.review;
        let reviewer = req.session.authorization["username"];
        if (review) {
            filtered_book["reviews"][reviewer] = review;
            books[isbn] = filtered_book;
        }
        res.send("The review for the book with ISBN " + isbn + " has been added/updated.");
    }
    else {
        res.send("Unable to find this ISBN!");
    }
});

// 9.Delete a book review 
regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn
    let usernameAuth = req.session.authorization.username
    if (isbn) {
        delete books[isbn].reviews[usernameAuth]
        res.send("Review was deleted successfully!")
    }
    res.send("Error attempting to delete review.")
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
