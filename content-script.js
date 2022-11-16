//By default the content scripts run at After Dom load done. checkout https://developer.chrome.com/docs/extensions/mv3/content_scripts/#capabilities

/*
const identifiers = {
  messages: ".message-out > * , .message-in > *",
  chats: "div.lhggkp7q.ln8gz9je.rx9719la",
};


 const app = document.querySelector("#app");
 let isChatLoaded = false;
 const config = { attributes: false, childList: true, subtree: true };
 const mutationObserver = new MutationObserver(c);
 mutationObserver.observe(app, config);

stucture of blurlist from event (from popup.js event)
 [
   {
     identifier: "d",
     type: "name",
    
   },
 ];
*/

//global declarations

const CLASS_NAME = "blur-wp";
const BLUR_LIST = "blur_list"; //for storage
const events = {
  BLUR_LIST: "blur_list",
};
const extensionStorage = {
  set: (key, value) => {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.set({ [key]: JSON.stringify(value) }, function () {
          console.log("Value is set to " + value);
        });
        resolve({ key, value });
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  },
  get: (key, defaultReturn) => {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.get([key], function (result) {
          console.log("Value currently is " + result[key]);
          if (defaultReturn === undefined && result[key] === undefined)
            throw new Error(
              "No key presented in local storage and no default return"
            );
          resolve(JSON.parse(result[key] || JSON.stringify(defaultReturn)));
        });
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  },
};

function blur(list = []) {
  console.log();
  const identifiers = list.map((value) => value.identifier);
  identifiers.forEach((identifier) => {
    document
      .querySelectorAll(identifier)
      .forEach((node) => node.classList.add(CLASS_NAME));
  });
}

function unBlur(list = []) {
  const identifiers = list.map((value) => value.identifier);
  identifiers.forEach((identifier) => {
    document
      .querySelectorAll(identifier)
      .forEach((node) => node.classList.remove(CLASS_NAME));
  });
}

function diffInBlurList(previous = [], present = []) {
  const unBlurList = previous.filter(
    (previousValue) =>
      !present.find((presentValue) => presentValue.type === previousValue.type)
  );
  const blurList = present.filter(
    (presentValue) =>
      !previous.find(
        (previousValue) => previousValue.type === presentValue.type
      )
  );
  console.log("blur List", blurList);
  console.log("unblur List", unBlurList);
  return {
    unBlurList,
    blurList,
  };
}

function blurListEvent(blurListFromEvent = []) {
  console.log(blurListFromEvent);
  extensionStorage
    .get(BLUR_LIST, [])
    .then((currentList) => {
      const { blurList, unBlurList } = diffInBlurList(
        currentList,
        blurListFromEvent
      );

      extensionStorage.set(BLUR_LIST, blurListFromEvent);
      blur(blurList);
      unBlur(unBlurList);
    })
    .catch(console.error);
}

function isChildHasThisParent(parent, child) {
  let currentParent = child.parentElement;
  while (currentParent) {
    if (currentParent === parent) return true;
    currentParent = currentParent.parentElement;
  }
  return false;
}
//after loading the data (after the loader finished)

//attaching style tag to head
const style = document.createElement("style");
style.textContent = `.${CLASS_NAME}{
         filter: blur(4px);
       }
       .${CLASS_NAME}:hover{
         filter: blur(0px);
       }`;
document.head.appendChild(style);

const app = document.querySelector("#app");
const config = { attributes: false, childList: true, subtree: true };

function callback(mutationList) {
  extensionStorage
    .get(BLUR_LIST, [])
    .then((list) => {
      const identifiers = list.map((value) => value.identifier);
      for (let mutation of mutationList) {
        const { target } = mutation;
        identifiers.forEach((identifier) => {
          document.querySelectorAll(identifier).forEach((node) => {
            if (isChildHasThisParent(target, node)) {
              node.classList.add(CLASS_NAME);
            }
          });
        });
      }
    })
    .catch(console.error);
}

const mutationObserver = new MutationObserver(callback);
mutationObserver.observe(app, config);

//if popup.js sends any event

chrome.runtime.onMessage.addListener(function (request) {
  if (request?.type) {
    if (request.type === events.BLUR_LIST) {
      if (request?.data) {
        blurListEvent(request.data);
      } else console.error("No data");
    }
  } else {
    console.error("No type on request object");
  }
});
