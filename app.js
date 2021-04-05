const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static('public'));


app.get("/", function(req, res) {
    res.render('index')
});






app.listen(3000, function() {
    console.log("Server running on port 3000")
});