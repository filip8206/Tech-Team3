console.log("Script: Buttons");

const svgImg = document.querySelector('.like-animatie');



function likeButton(likeId) {
    const likeItem = document.getElementById(likeId);
    likeItem.classList.add('heartBeat'); 
    console.log("Like button werkt");

    event.stopPropagation();
    event.preventDefault();

    likeItem.classList.add("heartBeat");
    setTimeout(function() {
      likeItem.classList.remove("heartBeat");
    }, 1000); 

  }


