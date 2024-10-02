// Import required modules
const dbcon = require("../crowdfunding_db"); // Database connection module
const express = require('express'); // Express framework

// Create a new router instance
const router = express.Router();

// Get a connection to the database
const connection = dbcon.getconnection();
connection.connect(); // Establish the database connection

/**
 * Route to fetch all active fundraisers.
 * GET /fundraiser
 */
router.get("/fundraiser", (req, res) => {
    const sql = `
        SELECT f.FUNDRAISER_ID, f.ORGANIZER, f.CAPTION, f.TARGET_FUNDING, f.CURRENT_FUNDING, f.CITY, f.ACTIVE, c.NAME AS CATEGORY
        FROM FUNDRAISER f
        JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID
        WHERE f.ACTIVE = 1
    `;

    // Execute the SQL query to retrieve active fundraisers
    connection.query(sql, (err, records) => {
        if (err) {
            console.error("Error retrieving active fundraisers:", err);
            return res.status(500).send("Server error"); // Respond with server error
        }
        res.json(records); // Respond with the retrieved records as JSON
    });
});

/**
 * Route to fetch all categories.
 * GET /categorie
 */
router.get("/categorie", (req, res) => {
    const sql = 'SELECT * FROM CATEGORY'; // SQL query to select all categories

    // Execute the SQL query to retrieve categories
    connection.query(sql, (err, records) => {
        if (err) {
            console.error("Error retrieving data:", err);
            return res.status(500).send("Server error"); // Respond with server error
        }
        res.json(records); // Respond with the retrieved records as JSON
    });
});

/**
 * Route to search for fundraisers based on query parameters.
 * GET /search?organizer=value&city=value&category=value
 */
router.get("/search", (req, res) => {
    const { organizer, city, category } = req.query; // Extract query parameters
    let sql = `
        SELECT f.FUNDRAISER_ID, f.ORGANIZER, f.CAPTION, f.TARGET_FUNDING, f.CURRENT_FUNDING, f.CITY, f.ACTIVE, c.NAME AS CATEGORY
        FROM FUNDRAISER f
        JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID
        WHERE f.ACTIVE = 1
    `;
    const params = []; // Array to hold query parameters for SQL

    // Add conditions based on query parameters if they are provided
    if (organizer) {
        sql += ' AND f.ORGANIZER LIKE ?'; // Condition for organizer
        params.push(`%${organizer}%`); // Add to parameters for partial match
    }

    if (city) {
        sql += ' AND f.CITY = ?'; // Condition for city
        params.push(city); // Add to parameters
    }

    if (category) {
        sql += ' AND c.NAME = ?'; // Condition for category
        params.push(category); // Add to parameters
    }

    // Execute the SQL query to retrieve filtered fundraisers
    connection.query(sql, params, (err, records) => {
        if (err) {
            console.error("Error retrieving data:", err);
            return res.status(500).send("Server error"); // Respond with server error
        }
        res.json(records); // Respond with the retrieved records as JSON
    });
});

/**
 * Route to fetch a specific fundraiser by ID.
 * GET /fundraiser/:id
 */
router.get("/fundraiser/:id", (req, res) => {
    const fundraiserId = req.params.id; // Get the fundraiser ID from request parameters
    const sql = `
        SELECT f.FUNDRAISER_ID, f.ORGANIZER, f.CAPTION, f.TARGET_FUNDING, f.CURRENT_FUNDING, f.CITY, f.ACTIVE, c.NAME AS CATEGORY
        FROM FUNDRAISER f
        JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID
        WHERE f.FUNDRAISER_ID = ?
    `;

    // Execute the SQL query to retrieve the specific fundraiser
    connection.query(sql, [fundraiserId], (err, records) => {
        if (err) {
            console.error("Error retrieving data:", err);
            return res.status(500).send("Server error"); // Respond with server error
        } 
        if (records.length === 0) {
            return res.status(404).send("Fundraiser not found"); // Respond with 404 if not found
        }
        res.json(records[0]); // Respond with the retrieved fundraiser record as JSON
    });
});

// Export the router for use in the main application
module.exports = router;
