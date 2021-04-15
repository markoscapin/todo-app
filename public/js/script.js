//Standard Variables
let boxArray = document.querySelectorAll(".tasks-wrapper .item-box");
let clearCompletedTask = document.querySelector("#clear-Completed");
const body = document.body;

//Variables for posting
let currentPath = document.location.pathname;

//Variables for switching menu ALL, ACTIVE, COMPLETED
const menu = document.querySelectorAll("#menu a");
const rootPath = menu[0];
const activePath = menu[1];
const completedPath = menu[2];

//Variables for Drag and Drop functions
let elementIndex="";
let elementID = "";
let nextIndex = "";


//Variables for Light and Dark Mode
let currentMode = (document.querySelector("[name='mode']").value == null) ? "" : document.querySelector('[name="mode"]').value;
let setMode = ""
//Single
const background = document.querySelector(".bgr-view")
const changeMode = document.querySelector(".toggle-mode")
const createTask = document.querySelector(".create-task")
const taskContainer = document.querySelector(".tasks-container")
const tasksBottom = document.querySelector(".tasks-bottom")
const textInput = document.querySelector('[type="text"]')


//Arrays
const btn = document.querySelectorAll(".btn")
const tasksWrapper = document.querySelectorAll(".tasks-wrapper");
const dropZone = document.querySelectorAll(".drop-zone");
//for #menu a we have already a const

//FUNCTIONS

function lightMode() {
    background.style.backgroundImage = 'url("../images/bg-desktop-light.jpg")';
    body.style.backgroundColor = "hsl(0, 0%, 98%)";
    taskContainer.style.backgroundColor = "white";
    createTask.style.backgroundColor = "white";
    body.querySelectorAll("p").forEach((p)=> p.style.color = "hsl(235, 19%, 35%)");
    textInput.style.color = "hsl(235, 19%, 35%)";
    dropZone.forEach((zone)=> zone.style.backgroundColor = "hsl(235, 21%, 11%)")
    changeMode.querySelector("img").src = "images/icon-moon.svg"
    
    
    

}

function darkMode() {
    background.style.backgroundImage = 'url("../images/bg-desktop-dark.jpg")';
    body.style.backgroundColor = "hsl(235, 21%, 11%)"
    taskContainer.style.backgroundColor = "hsl(235, 24%, 19%)";
    createTask.style.backgroundColor = "hsl(235, 24%, 19%)";
    body.querySelectorAll("p").forEach((p)=> p.style.color = "hsl(234, 39%, 85%)")
    textInput.style.color = "hsl(234, 39%, 85%)"
    dropZone.forEach((zone)=> zone.style.backgroundColor = "white")
    changeMode.querySelector("img").src = "images/icon-sun.svg"
    
    

    
}

//This function allow us to make a POST request
function post(path, params, method='post') {
    // The rest of this code assumes you are not using a library.
    // It can be made less verbose if you use one.
    const form = document.createElement('form');
    form.method = method;
    form.action = path;
  
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const hiddenField = document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.name = key;
        hiddenField.value = params[key];


        form.appendChild(hiddenField);
      }
    }
  
    document.body.appendChild(form);
    form.submit();
};

function setDragger(index, id, e) {
    elementIndex = index
    elementID = id;
};


//SWITCHER FOR THE CURRENT PATH
switch (currentPath) {
    case "/" : 
        rootPath.style.color = "hsl(220, 98%, 61%)"
        break;
    case "/all":
        rootPath.style.color = "hsl(220, 98%, 61%)"
        break;
    case "/active" :
        activePath.style.color = "hsl(220, 98%, 61%)"
        break;
    case "/completed" : 
        completedPath.style.color = "hsl(220, 98%, 61%)"
        break;
};


//DRAG - DROP / HOVERING AND STATUS OF EVERY TASK
//This is to add the listener and make a POST request to change the index value to db
boxArray.forEach(function(task) {
    task.addEventListener('dragenter', function(event) {
        if (event) {
            nextIndex = task.querySelector("[name='index']")
            boxArray.forEach(function(box) {
                box.classList.add('not-selected')
            });
            
        } else {
            console.log("Event ERROR")
        };

    }, false);



    
        task.addEventListener('dragover', function(event) {
            event.target.classList.add('drop-zone')

        });
    
        task.addEventListener('dragleave', function(event){
            event.target.classList.remove('drop-zone')
  
        });




    task.addEventListener('drop', function(event) {  

        post("/drag", {startOnIndex: elementIndex, dropOnIndex: nextIndex.value, id : elementID})
    });

    let status = task.querySelector("[name='status']").value;
    let button = task.querySelector(".btn");
    let img = task.querySelector("img");
    let text = task.querySelector("p");

    if (status == "true") {
        button.classList.add("btn-check");
        img.src = "images/icon-check.svg";
        text.style.textDecoration = "line-through";
        text.classList.add("task-checked");
    };

    task.addEventListener('mouseenter', function() {
        task.querySelector('#deleteTask').classList.remove('hidden-delete-form')
    });

    task.addEventListener('mouseleave', function(){
        task.querySelector('#deleteTask').classList.add('hidden-delete-form')
    });

});


//DELETE ALL COPMLETED TASKS
//This execute a "delete" record on DB and refresh
clearCompletedTask.addEventListener('click', function(){
    post("/deleteAllCompleted")
})



//DARK AND LIGHT MODE 
//Post a change of mode - NEEDED because we always refresh the db and the root from server
changeMode.addEventListener("click", function() {
    (currentMode == "light") ? setMode = "dark" : setMode = "light"
    post("/mode", {setMode : setMode});
})

//Allow to have a default mode and switch in case selected a dark/light mode
if (currentMode == "") {
    let today = new Date();
    let hours = today.getHours();
    if (hours >= 7 && hours <= 18 ) {
        currentMode = "light"
        lightMode();
    } else {
        currentMode = "dark"
        darkMode();
    }
} else if (currentMode == "light") {
    lightMode();
} else if (currentMode == "dark") {
    darkMode();
}

textInput.classList.add('placeholder')



