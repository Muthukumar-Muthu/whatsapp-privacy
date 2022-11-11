//By default the content scripts run at After Dom load done. checkout https://developer.chrome.com/docs/extensions/mv3/content_scripts/#capabilities

//attaching style tag to head
(() => {
  const style = document.createElement("style");
  style.textContent = `.blurred{
         filter: blur(4px);
       }
       .blurred:hover{
         filter: blur(0px);
       }`;
  document.head.appendChild(style);
})();

const MESSAGE_IDENTIFIER = ".message-out > * , .message-in > *";
const CHAT_IDENTIFIER = "div.lhggkp7q.ln8gz9je.rx9719la ";

const app = document.querySelector("#app");

let isChatLoaded = false;

function blurChats() {
  console.log("Blurring the left chats");
  const chats = document.querySelectorAll(CHAT_IDENTIFIER);
  chats.forEach((chat) => chat.classList.add("blurred"));
}

function blurMessages() {
  console.log("Blurring the right messages");
  const messages = document.querySelectorAll(MESSAGE_IDENTIFIER);
  console.log(messages);
  messages.forEach((message) => message.classList.add("blurred"));
}
function callback() {
  if (!isChatLoaded) {
    blurChats();
    isChatLoaded = true;
  }
  blurMessages();
}
const config = { attributes: false, childList: true, subtree: true };
const mutationObserver = new MutationObserver(callback);
mutationObserver.observe(app, config);
