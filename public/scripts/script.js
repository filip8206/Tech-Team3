console.log("Script: Algemeen");

// NAVBAR
let menu = document.querySelector('.menu');

function toggleMenu() {
  menu.classList.toggle('show-menu');
}


// Functie om de huidige scrollpositie op te slaan in de browsergeschiedenis
function saveScrollPosition() {
  var stateObj = { scrollTop: window.pageYOffset };
  history.pushState(stateObj, "", window.location.href);
}

// Functie om de scrollpositie te herstellen wanneer de gebruiker teruggaat naar deze pagina
window.addEventListener('popstate', function(event) {
  if (event.state && event.state.scrollTop) {
    window.scrollTo(0, event.state.scrollTop);
  }
});

// Voeg een eventlistener toe voor scroll gebeurtenissen om de scrollpositie bij te werken
window.addEventListener('scroll', function() {
  saveScrollPosition();
});



