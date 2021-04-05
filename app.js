//REQUIRE NPM
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();

//SETUP AND USE 
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static('public'));


//MONGOOSE SECTION
mongoose.connect('mongodb://localhost:27017/todoAppDB', {useNewUrlParser: true, useUnifiedTopology: true});

const tasksSchema = {
    name: String,
    index: Number
}

const Task = mongoose.model("Task", tasksSchema);




//APP --> GET
app.get("/", function(req, res) {
    Task.find({}, function(err, taskArray) {

        //This func allow us to order the tasks with index parameter
        function compareNumbers(a, b) {
            return a.index - b.index;
          }
        //.sort() return an orderedArray
        taskArray = taskArray.sort(compareNumbers);

        (err) ? console.log(err) : res.render('index', {taskArray: taskArray})
        });
});


//APP --> POST
app.post("/", function(req, res) {
    const newTaskToAdd = req.body.newItem;

    Task.find({}, function(err, taskArray) {
        const newTask = new Task({name:newTaskToAdd, index: taskArray.length});
        newTask.save();
    });

    res.redirect("/");

})

app.post("/delete", function(req, res) {
    const taskToDeleteID = req.body.checkbox;
    
    //this delete the selected item by id
    Task.deleteOne({_id: taskToDeleteID}, function(err){
        (err) ? console.log(err) : 
        console.log("Deleted");

        res.redirect("/");
    })

})




//APP --> LISTEN
app.listen(3000, function() {
    console.log("Server running on port 3000")
});