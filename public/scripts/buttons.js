console.log("Script: Buttons");



function likeButton(likeId) {
    const likeItem = document.getElementById(likeId);
    likeItem.classList.add('liked'); 
    console.log("Like button werkt");

    event.stopPropagation();
    event.preventDefault();

    likeItem.classList.add("heartbeat");
    likeItem.src = "./images/iconen/hart_filled.svg";
    setTimeout(function() {
      likeItem.classList.remove("heartbeat");
    }, 1000); 

  }


