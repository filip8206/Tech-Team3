console.log("Script: Buttons");



function likeButton(likeId) {
  const likeItem = document.getElementById(likeId);

  // Controleer of de class "liked" nog niet is toegevoegd aan likeItem
  if (!likeItem.classList.contains('liked')) {
    likeItem.classList.add('liked');
    console.log("Like button werkt");

    event.stopPropagation();
    event.preventDefault();

    likeItem.classList.add("heartbeat");
    likeItem.src = "./images/iconen/hart_filled.svg";
    setTimeout(function () {
      likeItem.classList.remove("heartbeat");
    }, 1000);

    // URL waar de POST-request naartoe wordt gestuurd
    const url = 'http://localhost:9000/likePost';

    // De gegevens die je wilt verzenden (in JSON-formaat)
    const data = {
      songID: likeId,
      userID: "65f85a70bc8844d354d4b8f2"
    };

    // Instellingen voor het POST-verzoek
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };

    // Stuur het POST-verzoek met behulp van fetch
    fetch(url, requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error('Netwerkrespons was niet ok');
        }
        return response.text(); // Lees de JSON van de respons
      })
      .then(data => {
        console.log('Response ontvangen:', data);
        // Hier kun je de ontvangen gegevens verwerken
      })
      .catch(error => {
        console.error('Er is een fout opgetreden:', error);
      });
  } 
  
  
  else {
    likeItem.classList.remove('liked');
    console.log("Unlike button werkt");

    event.stopPropagation();
    event.preventDefault();

    likeItem.classList.add("heartbeat-remove");
    likeItem.src = "./images/iconen/hart.svg";
    setTimeout(function () {
      likeItem.classList.remove("heartbeat-remove");
    }, 1000);

    // URL waar de POST-request naartoe wordt gestuurd
    const url = 'http://localhost:9000/unlikePost';

    // De gegevens die je wilt verzenden (in JSON-formaat)
    const data = {
      songID: likeId,
      userID: "65f85a70bc8844d354d4b8f2"
    };

    // Instellingen voor het POST-verzoek
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };

    // Stuur het POST-verzoek met behulp van fetch
    fetch(url, requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error('Netwerkrespons was niet ok');
        }
        return response.text(); // Lees de JSON van de respons
      })
      .then(data => {
        console.log('unliked');
        // Hier kun je de ontvangen gegevens verwerken
      })
      .catch(error => {
        console.error('Er is een fout opgetreden:', error);
      });
  }
}

