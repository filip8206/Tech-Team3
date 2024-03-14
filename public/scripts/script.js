// JavaScript Document
console.log("hi");


const element = document.querySelector("#grid1");
// const grid_icon = document.querySelector("#grid_icon");

// function naarGrid() {
//     console.log("dit werkt?");
//     element.classList.toggle("grid1");
//     element.classList.toggle("list1");
//     grid_icon.src = "./images/iconen/grid.svg";
//   }

  document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('slide');
    const toggleButton = document.getElementById('toggle_grid');
    const toggleIcon = document.getElementById('toggleIcon');
 
    toggleButton.addEventListener('click', function () {
        container.classList.toggle('list-view');
        updateButtonIcon();
        element.classList.toggle("grid1");
        element.classList.toggle("list1");
    });
 
    function updateButtonIcon() {
        const isListView = container.classList.contains('list-view');
        const iconPath = isListView ? './images/iconen/grid.svg' : './images/iconen/list.svg';
 
        toggleIcon.src = iconPath;
    }
 });



const toggle_sorteer = document.querySelector("#toggle_sorteer");
// const grid_icon = document.querySelector("#grid_icon");


  toggle_sorteer.addEventListener('click', function () {
    toggle_sorteer.classList.toggle("toggle_icon_arrow_draai");
    element.classList.toggle("toggle_icon_arrow_draai");

});




$ = function(id) {
  return document.getElementById(id);
}

var show = function(id) {
	$(id).style.display ='block';
  console.log("click ja");
}
var hide = function(id) {
	$(id).style.display ='none';
}

 
















