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

const identifers = {
  messages: ".message-out > * , .message-in > *",
  chats: "div.lhggkp7q.ln8gz9je.rx9719la",
};

const app = document.querySelector("#app");

let isChatLoaded = false;

function blurChats() {
  console.log("Blurring the left chats");
  const chats = document.querySelectorAll(identifers.chats);
  chats.forEach((chat) => chat.classList.add("blurred"));
}

function blurMessages() {
  console.log("Blurring the right messages");
  const messages = document.querySelectorAll(identifers.messages);
  console.log(messages);
  messages.forEach((message) => message.classList.add("blurred"));
}
function startBlur() {
  if (!isChatLoaded) {
    blurChats();
    isChatLoaded = true;
  }
  blurMessages();
}

chrome.runtime.onMessage.addListener(function (request) {
  if (request?.blur) {
    console.log("Blurring", request.blurList);
    if (request?.blurList) {
      const { blurList } = request;
      console.log(blurList, "before setting localstorage");
      extensionStorage.set({ key: "blur", value: JSON.stringify(blurList) });
      blurThings(blurList);
    } else console.error("Blur list absent");
  }
});

function blurThings(blurList) {
  console.log(blurList);
  const blurIdentifiers = blurList
    .map((blur) => (identifers[blur] !== "undefined" ? identifers[blur] : null))
    .filter((value) => value !== null);
  console.log(blurIdentifiers);
  blurIdentifiers.forEach((identifier) => {
    const nodes = document.querySelectorAll(identifier);
    nodes.forEach((node) => {
      node.classList.add("blurred");
    });
  });
}

const extensionStorage = {
  set: ({ key, value }) => {
    console.log(key, value, { [key]: value });
    chrome.storage.local.set({ [key]: value }, function () {
      console.log("Value is set to " + value);
    });
  },
  get: (key) => {
    chrome.storage.local.get([key], function (result) {
      console.log("Value currently is " + result.key);
    });
  },
};

const config = { attributes: false, childList: true, subtree: true };
const mutationObserver = new MutationObserver(c);
mutationObserver.observe(app, config);

//modeify code and at start state and pop state sync
