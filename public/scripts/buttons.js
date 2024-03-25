console.log("Script: Buttons");

const likeImg = document.querySelector('.like-animatie');


function likeButton(likeId) {
    const likeItem = document.getElementById(likeId);
    likeItem.classList.add('liked'); 
    console.log("Like button werkt");

    event.stopPropagation();
    event.preventDefault();

    likeItem.classList.add("heartbeat");
    setTimeout(function() {
      likeItem.classList.remove("heartbeat");
    }, 1000); 

  }


