console.log("Script: Buttons");

const svgImg = document.querySelector('.like-animatie');
const heartIcon = document.getElementById("like-btn");


function playHeartbeatAnimation() {
    heartIcon.classList.add("heartBeat");

    setTimeout(function() {
      heartIcon.classList.remove("heartBeat");
    }, 1000); 
  }

function likeButton() {
    console.log("Test like echt");
    event.stopPropagation();
    event.preventDefault();
    playHeartbeatAnimation();
}
