//Standard Variables
let boxArray = document.querySelectorAll(".tasks-wrapper .item-box");
let clearCompletedTask = document.querySelector("#clear-Completed");

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
let changeMode = document.querySelector(".toggle-mode")
let background = document.querySelectorAll(".bgr-view")


let currentMode = "";

if (currentMode == "") {
    let today = new Date();
    let hours = today.getHours();
    if (hours >= 7 && hours <= 18 ) {
        currentMode = "light"
        lightMode()
    } else {
        currentMode = "dark"
        darkMode()
    }
}


changeMode.addEventListener('click', function() {
    if (currentMode == "light") {
        currentMode = "dark";
        darkMode()
    } else if (currentMode == "dark") {
        currentMode =  "light"
        lightMode()
    }
})

function lightMode() {
    console.log("lightmode on")
}

function darkMode() {
    console.log("darkmode-on")
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
    };

    task.addEventListener('mouseenter', function() {
        task.querySelector('#deleteTask').classList.remove('hidden-delete-form')
    });

    task.addEventListener('mouseleave', function(){
        task.querySelector('#deleteTask').classList.add('hidden-delete-form')
    });

});

//This execute a "delete" record on DB and refresh
clearCompletedTask.addEventListener('click', function(){
    post("/deleteAllCompleted")
})






