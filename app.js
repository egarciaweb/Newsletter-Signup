const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const { json } = require("body-parser");
const https = require("https");

const app = express();

app.use(express.static("public"));  // Enables access to public assets when server is run

app.use(bodyParser.urlencoded({ extended: true}));

app.get("/", function(req, res) {
    //res.send("Express server is up and running.");
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    console.log(req.body.firstName);
    console.log(req.body.lastName);
    console.log(req.body.email);

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

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

    var jsonData = JSON.stringify(data);

    console.log(jsonData);

    const url =   "https://us12.api.mailchimp.com/3.0/lists/7d6e8df575"; // US12 comes from the API key
    
    const options = {
        method: "POST",
        auth: "emmanuel:a1cc4bacbd126603b2d7fb6812324f15-us123"
    };

    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            // res.send("Successfully subscribed!");
            res.sendFile(__dirname + "/success.html");
        } else {
            // res.send("There was an error with signing up, please try again!");
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

});

// const client = require("mailchimp-marketing");

// client.setConfig({
//   apiKey: "YOUR_API_KEY",
//   server: "YOUR_SERVER_PREFIX",
// });

// const run = async () => {
//   const response = await client.lists.batchListMembers("list_id", {
//     members: [{}],
//   });
//   console.log(response);
// };

// run();

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


// API Key
// a1cc4bacbd126603b2d7fb6812324f15-us12

// List ID
// 7d6e8df575