let array = document.querySelectorAll(".item-box");

let currentPath = document.location.pathname;
const menu = document.querySelectorAll("#menu a");
const rootPath = menu[0];
const activePath = menu[1];
const completedPath = menu[2];



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

}

switch (currentPath) {
    case "/" : 
        rootPath.style.color = "hsl(220, 98%, 61%)"
        break;
    case "/active" :
        activePath.style.color = "hsl(220, 98%, 61%)"
        break;
    case "/completed" : 
        completedPath.style.color = "hsl(220, 98%, 61%)"
        break;
}

