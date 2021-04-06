
let array = document.querySelectorAll(".item-box");


for (let i= 1; i < array.length; i++) {
    let status = array[i].querySelector("input").value;
    let button = array[i].querySelector(".btn");
    let img = array[i].querySelector("img");
    let text = array[i].querySelector("p");

    if (status === "true") {
        button.classList.add("btn-check");
        img.src = "images/icon-check.svg";
        text.style.textDecoration = "line-through"
    } 
    
}