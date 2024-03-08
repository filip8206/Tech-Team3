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
    const toggleButton = document.getElementById('grid_toggle');
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
 
















