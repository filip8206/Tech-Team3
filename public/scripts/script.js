console.log("Script: Algemeen");

// NAVBAR
let menu = document.querySelector('.menu');

function toggleMenu() {
  menu.classList.toggle('show-menu');
}


function showPopup() {
  document.getElementById("popupContainer").style.display = "block";
}

function closePopup() {
  document.getElementById("popupContainer").style.display = "none";
}
