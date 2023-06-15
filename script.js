import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://feedback-response-873b1-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const feedBackInDB = ref(database, "feedback");

const textareaElement = document.getElementById("textarea");
const fromElement = document.getElementById("from_input");
const toElement = document.getElementById("to_input");

const pushButton = document.querySelector(".publish");

const displayFeedback = document.getElementById("display_feedback");

pushButton.addEventListener("click", () => {
  event.preventDefault();

  let messageObject = {
    messageText: textareaElement.value,
    messageFrom: fromElement.value ? fromElement.value : "Anon",
    messageTo: toElement.value,
  };

  if (
    fromElement.value != "" &&
    toElement.value != "" &&
    textareaElement.value != ""
  ) {
    push(feedBackInDB, messageObject);

    textareaElement.style.border = "none";
    textareaElement.placeholder = "Add your thought here...";

    fromElement.style.border = "none";
    toElement.style.border = "none";

    clearTextArea();
  } else {
    textareaElement.style.border = "2px solid #EA3C3E";

    fromElement.style.border = "2px solid #EA3C3E";
    toElement.style.border = "2px solid #EA3C3E";
    textareaElement.placeholder = " ";

    textareaElement.classList.remove("shake");

    window.requestAnimationFrame(() => {
      textareaElement.classList.add("shake");
    });
  }
});

onValue(feedBackInDB, (snapshot) => {
  if (snapshot.exists()) {
    let messageArray = Object.values(snapshot.val());
    displayFeedback.style.fontStyle = "normal";
    displayFeedback.style.color = "black";

    messageArray.reverse();
    clearMessages();

    for (let i = 0; i < messageArray.length; i++) {
      let currentMessages = messageArray[i];
      appaendMessagesList(currentMessages);
    }
  } else {
    displayFeedback.textContent = " - You have no messages... yet - ";
    displayFeedback.style.color = "#FBAC39";
    displayFeedback.style.fontStyle = "italic";
  }
});

function clearMessages() {
  displayFeedback.innerHTML = "";
}

function clearTextArea() {
  textareaElement.value = "";
  fromElement.value = "";
  toElement.value = "";
}

// Like Button____________________________________________________________________

function appaendMessagesList(feedbackValue) {
  displayFeedback.innerHTML += `
     <li class="message">
       <p class = "reciverName"><span class="reciver">To:</span> ${feedbackValue.messageTo}</p>
       <p class="message-text">${feedbackValue.messageText}</p>
       <div class = "flex">
       <p class = "senderName"><span class = "sender">From:</span> ${feedbackValue.messageFrom}</p>
       </div>
     </li>
     `;
}
