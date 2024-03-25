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


  // URL waar de POST-request naartoe wordt gestuurd
  const url = 'localhost:9000/';

  // De gegevens die je wilt verzenden (in JSON-formaat)
  const data = {
    test: "dit is een testbericht"
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
      return response.json(); // Lees de JSON van de respons
    })
    .then(data => {
      console.log('Response ontvangen:', data);
      // Hier kun je de ontvangen gegevens verwerken
    })
    .catch(error => {
      console.error('Er is een fout opgetreden:', error);
    });
  }


