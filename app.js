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
app.use(express.static(__dirname + '/public'));


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



//global variable to know the previews path in case of redirect
let previewsURLRequest = "";


//APP --> GET
app.get("/", function(req, res) {

    if (previewsURLRequest == "" || previewsURLRequest == "/") {
        Task.find({}, function(err, taskArray) {

            //.sort() return an orderedArray
            taskArray = taskArray.sort(compareNumbers);
    
            (err) ? console.log(err) : res.render('index', {taskArray: taskArray})
            });
    } else {
        res.redirect("" + previewsURLRequest)
    }
    
});

app.get("/all", function(req, res) {
    previewsURLRequest = req.originalUrl;
    Task.find({}, function(err, taskArray) {

        //.sort() return an orderedArray
        taskArray = taskArray.sort(compareNumbers);

        (err) ? console.log(err) : res.render('index', {taskArray: taskArray})
        });
})


app.get("/active", function(req, res) {
    //This provide path for the next redirect on ("/")
    previewsURLRequest = req.originalUrl;
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
    //This provide path for the next redirect on ("/")
    previewsURLRequest = req.originalUrl;
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

app.post("/deleteAllCompleted", function(req, res) {

    //Find all docs and if the doc has as propery status "true" than remove it.
    Task.find({}, function(err, docs) {
        (err) ? console.log(err) : console.log("goingtoDB");

        docs.forEach(function(task) {
            console.log(task.status)
            
            if (task.status == true) {
                Task.findByIdAndRemove(task._id, function(err){
                    (err) ? console.log(err) : console.log("Successfully delete record")
                })
            }
        })
    })

    res.redirect("/");
})


app.post("/drag", function(req, res) {
    const currentIndex = req.body.startOnIndex;
    const nextIndex = req.body.dropOnIndex;
    const elementID = req.body.id;

    //To tackle the movements of indexes of elements we need to know:
    //1- the RANGE between the currentIndex and the nextIndex
    //2- if the movement is going UP or DOWN 

    //Also we need to know:
    //1- the range change depending on the movement
    //2- we need to update the current value on db to show the differences with sort() 

    Task.find({}, function(err, docs) {
        (err) ? console.log(err) : console.log("goingtoDB");

        //First of all we need to know the minimum and the maximum value of the range
        const rangeMin = Math.min(currentIndex, nextIndex);
        const rangeMax = Math.max(currentIndex, nextIndex);

        docs.forEach(function(task) {

            //If the movement is to going UP 
            if (currentIndex > nextIndex && task.index >= rangeMin && task.index < rangeMax) {

                Task.findByIdAndUpdate(task._id, {index: task.index + 1}, function(err) {
                    (err) ? console.log(err) : console.log("Successfully updated index of " + task.name)
                })

            //If the movement is to going DOWN
            } else if (currentIndex < nextIndex && task.index > rangeMin && task.index <= rangeMax ) {
                Task.findByIdAndUpdate(task._id, {index : task.index -1}, function(err) {
                    (err) ? console.log(err) : console.log("Successfully updated index of " + task.name)
                });
            } 

        })
            

        Task.findByIdAndUpdate(elementID, {index: nextIndex}, function(err) {
            (err) ? console.log(err) : console.log("Was " + currentIndex)
        });
    });


    res.redirect("/");
});



//APP --> LISTEN
app.listen(3000, function() {
    console.log("Server running on port 3000")
});