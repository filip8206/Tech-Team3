console.log("Script: Chat");

function sendMessage() {
    var messageInput = document.getElementById("message-input");
    var message = messageInput.value;
    if (message.trim() !== "") {
      displayMessage("You", message, "sent");
      messageInput.value = "";
    }
  }
  
  function displayMessage(sender, message, messageType) {
    var chatBox = document.getElementById("chat-box");
    var messageElement = document.createElement("div");
    messageElement.classList.add("message", messageType);
    if (messageType === "sent") {
      messageElement.innerHTML = message;
    } else {
      messageElement.innerHTML = "<span class='sender-info'>" + sender + "</span>" + message;
    }
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
  }


  
  
  