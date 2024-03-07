// JavaScript Document
console.log("hi");


var element = document.querySelector("#grid1");


function naarGrid() {
    console.log("dit werkt?");
    element.classList.toggle("grid1");
    element.classList.toggle("list1");
  }

  function naarList() {
    var element = document.querySelector("#filter_list");
    element.classList.replace("grid1", "list1");
  }















