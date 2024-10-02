// Import required modules
var express = require('express'); // Web framework for Node.js
const cors = require("cors"); // Middleware for enabling Cross-Origin Resource Sharing

// Create an instance of the Express application
var app = express();

// Middleware setup
app.use(cors()); // Enable CORS for all routes

// Import the concert API controller
var concertAPI = require("./controllerAPI/api-controller");

// Middleware for parsing request bodies
var bodyparser = require("body-parser");
app.use(bodyparser.json()); // Parses JSON bodies
app.use(bodyparser.urlencoded({ extended: false })); // Parses URL-encoded bodies (form submissions)

// Use the concert API for routes under "/api/concerts"
app.use("/api/concerts", concertAPI);

// Start the server on port 3060
app.listen(3060, () => {
    console.log("Server up and running on port 3060"); // Log a message to the console
});

