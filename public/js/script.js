let array = document.querySelectorAll(".item-box");

let currentPath = document.location.pathname;
const menu = document.querySelectorAll("#menu a");
const rootPath = menu[0];
const activePath = menu[1];
const completedPath = menu[2];

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

function setDragger(index, id) {
    elementIndex = index
    elementID = id;
};



for (let i= 1; i < array.length; i++) {
    let status = array[i].querySelector("input").value;
    let button = array[i].querySelector(".btn");
    let img = array[i].querySelector("img");
    let text = array[i].querySelector("p");

    if (status === "true") {
        button.classList.add("btn-check");
        img.src = "images/icon-check.svg";
        text.style.textDecoration = "line-through";
    } else { }
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

//Testing area
let box = document.querySelectorAll(".tasks-wrapper .item-box")
let elementIndex="";
let elementID = "";
let nextIndex = "";

//This is to add the listener and make a POST request to change the index value to db
for (let i = 0; i < box.length; i++) {
    
    box[i].addEventListener('dragenter', function(event) {
        if (event) {
            nextIndex = box[i].querySelector("[name='index']")
            console.log("Next Index :" + nextIndex.value)
        } else {
            console.log("Event ERROR")
        }

    }, false);
    
    box[i].addEventListener('drop', function(event) {  

        post("/drag", {startOnIndex: elementIndex, dropOnIndex: nextIndex.value, id : elementID})
    })
};



