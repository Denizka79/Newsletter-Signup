const express = require("express");
const https = require("https");
const app = express();
const bodyParser = require("body-parser");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var eMail = req.body.eMail;
    //res.send(firstName + " " + lastName + " " + eMail);
    var member = {
        email_address: eMail,
        status: "subscribed",
        merge_fields: {
            FNAME: firstName,
            LNAME: lastName
        }
    };
    var jsonData = JSON.stringify(member);
    var url = "https://us20.api.mailchimp.com/3.0/lists/fd5111be4f/members";
    var options = {
        method: "POST",
        auth: "key:4c6005b3205335dd705fece1ed2ad667-us20"
    }
    var request = https.request(url, options, function(response) {
        response.on("data", function(data) {
            //console.log(JSON.parse(data));
            var resultResponse = JSON.parse(data);
            var statusCode = resultResponse.status;
            console.log(statusCode);
            if (statusCode === "subscribed") {
                //res.write("<p>Success!</p>");
                res.sendFile(__dirname + "/success.html");
            } else {
                //res.write("<p>Sorry. Something went wrong...</p>");
                res.sendFile(__dirname + "/failure.html");
            }
        });
    });
    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res) {
    res.redirect("/");
});

app.listen(3000, function() {
    console.log("Server is running on port 3000.");
});

//4c6005b3205335dd705fece1ed2ad667-us20
//fd5111be4f