//REQUIRE NPM
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");
const { functionsIn } = require("lodash");

const app = express();

//SETUP AND USE 
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static('public'));


//MONGOOSE SECTION
mongoose.connect('mongodb://localhost:27017/todoAppDB', {useNewUrlParser: true, useUnifiedTopology: true});

const tasksSchema = {
    name: String,
    index: Number,
    status: Boolean //It'll be used to switch between Active (false) or Completed (true)
}

const Task = mongoose.model("Task", tasksSchema);

//Functions
function toggle (mongooseObject) {
    if (mongooseObject.status) {
        Task.findByIdAndUpdate(mongooseObject._id, {status: false}, (err) => console.log("New status is " + mongooseObject.status));
    } else {
        Task.findByIdAndUpdate(mongooseObject._id, {status: true}, (err) => console.log("New status is " + mongooseObject.status));
    }
};

//This func allow us to order the tasks with index parameter
function compareNumbers(a, b) {
    return a.index - b.index;
}



//APP --> GET
app.get("/", function(req, res) {
    Task.find({}, function(err, taskArray) {

        //.sort() return an orderedArray
        taskArray = taskArray.sort(compareNumbers);

        (err) ? console.log(err) : res.render('index', {taskArray: taskArray})
        });
});

app.get("/active", function(req, res) {
    Task.find({}, function(err, allTaskArray) {

        let taskArray = [];
        allTaskArray.forEach(function(singleTask){
            if (singleTask.status === false) {
                taskArray.push(singleTask)
            }
        });

        taskArray = taskArray.sort(compareNumbers);

        (err) ? console.log(err) : res.render('index', {taskArray: taskArray})
    });
});


app.get("/completed", function(req, res) {
    Task.find({}, function(err, allTaskArray) {

        let taskArray = [];
        allTaskArray.forEach(function(singleTask){
            if (singleTask.status === true) {
                taskArray.push(singleTask)
            }
        });

        taskArray = taskArray.sort(compareNumbers);

        (err) ? console.log(err) : res.render('index', {taskArray: taskArray})
    });
})


//APP --> POST
app.post("/", function(req, res) {
    const newTaskToAdd = req.body.newItem;

    Task.find({}, function(err, taskArray) {
        const newTask = new Task({name:newTaskToAdd, index: taskArray.length, status: false});
        newTask.save();
    });
    
     res.redirect("/");

})

app.post("/taskCompleted", function(req, res) {
    const taskCompletedID = req.body.checkbox;

    Task.findById(taskCompletedID, function(err, task) {
        (err) ? console.log(err) : toggle(task);
        } 
    );

    res.redirect("/");
});

app.post("/deleteTask", function(req, res) {
    const taskToDeleteID = req.body.deleteBox;

    //this delete the selected item by id
    Task.deleteOne({_id: taskToDeleteID}, function(err){
        (err) ? console.log(err) : 
        console.log("Deleted");

        res.redirect("/");
    });
});



//APP --> LISTEN
app.listen(3000, function() {
    console.log("Server running on port 3000")
});