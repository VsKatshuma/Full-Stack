const express = require("express");
const router = express.Router();

let Book = require("./bookModel");

// Get all books (GET request)
router.route("/").get((req, res) => {
    Book.find()
        .then(books => res.json(books))
        .catch(err => res.status(400).json("Error: " + err));
});

// Get a single book (GET request)
router.route("/:id").get((req, res) => {
    Book.findById(req.params.id)
        .then(book => res.json(book))
        .catch(err => res.status(400).json("Error: " + err));
});

// Add a new book (POST request)
router.route("/").post((req, res) => {
    const newBook = new Book({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description
    });

    newBook.save()
        .then(() => res.json(newBook))
        .catch(err => res.status(400).json("Error: " + err));
});

// Update a single book (PUT request)
router.route("/:id").put((req, res) => {
    Book.findByIdAndUpdate(req.params.id, req.body)
        .then(() => res.json("Book updated."))
        .catch(err => res.status(400).json("Error: " + err));
});

// Delete a single book (DELETE request)
router.route("/:id").delete((req, res) => {
    Book.findByIdAndDelete(req.params.id)
        .then(() => res.json("Book deleted."))
        .catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;
