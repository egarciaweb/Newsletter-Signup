/* 
 * Name:        Newsletter Signup
 * Usage:       Allows users to sign up to MailChimp newsletter database
 * Author:      Emmanuel Garcia
 * Date:        10-03-2022
 */

// Get the API connection URL and authentication key from environment variables file
require("dotenv").config();

// Routing
const express = require("express");

// Parsing of HTML form data
const bodyParser = require("body-parser");

// Module for requesting data from external https sources
const request = require("request");

// For handling of JSON data
const { json } = require("body-parser");

// Node.js built-in HTTPS connection module
const https = require("https");

// Instantiate Express server
const app = express();

// Set Express to use a public route to serve content (stylesheets, images, etc)
app.use(express.static("public"));  // Enables access to public assets when server is run

// Enable Express to use body-parser module for processing HTML form data
app.use(bodyParser.urlencoded({ extended: true}));

// Root route
app.get("/", function(req, res) {
    //res.send("Express server is up and running.");
    console.log(process.env.AUTH_KEY);
    res.sendFile(__dirname + "/signup.html");
});

// Route for submitting form data
app.post("/", function(req, res) {
    // Testing
    // console.log(req.body.firstName);
    // console.log(req.body.lastName);
    // console.log(req.body.email);

    // Parsing variables from form data
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    // Building object to send to MailChimp API
    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    // Converting object to JSON
    var jsonData = JSON.stringify(data);

    // Testing
    // console.log(jsonData);

    // URL for submitting form data (MailChimp API endpoint)
    // SERVER_URL environment variable with full URL expected.
    const url = process.env.SERVER_URL; // "https://SERVER.api.mailchimp.com/3.0/lists/LIST_ID"
    
    // Object with connection options
    // For more info, read MailChimp API documentation
    // AUTH_KEY environment variable with API key expected.
    const options = {
        method: "POST",
        auth: process.env.AUTH_KEY // "USERNAME:API_KEY"
    };

    // Execute request to MailChimp API
    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            // Success. Redirect to success page
            // res.send("Successfully subscribed!");
            res.sendFile(__dirname + "/success.html");
        } else {
            // Failure. Redirect to failure page
            // res.send("There was an error with signing up, please try again!");
            res.sendFile(__dirname + "/failure.html");
        }

        // Testing
        // response.on("data", function(data) {
        //     console.log(JSON.parse(data));
        // })
    })

    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server running on port 3000.");
});

// For Heroku
// app.listen(process.env.PORT, function() {
//     console.log("Server running on port 3000.");
// });