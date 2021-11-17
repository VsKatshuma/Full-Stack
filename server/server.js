const express = require("express");
const mongoose = require('mongoose');
const path = require("path");

const app = express();
app.use(express.json());

// Specify the directory from which to serve static assets
// 'npm run build' bundles the React App into the 'build' folder
app.use(express.static(path.join(__dirname, "..", "build")));

// Connect to MongoDB that is running locally
mongoose.connect("mongodb://127.0.0.1:27017/fullstack");
const connection = mongoose.connection;
connection.once("open", function () {
    console.log("MongoDB connection established successfully");
});

// Use a dedicated router for requests that begin with /book
const bookRouter = require("./bookRouter");
app.use("/book", bookRouter);

// Serve the React App for all other paths
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

// Listen to connections
app.listen(3000, () => {
    console.log("Application running at localhost:3000");
});
