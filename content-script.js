//By default the content scripts run at After Dom load done. checkout https://developer.chrome.com/docs/extensions/mv3/content_scripts/#capabilities

//attaching style tag to head
// const CLASS_NAME = "blur-wp"
(() => {
  const style = document.createElement("style");
  style.textContent = `.${CLASS_NAME}{
         filter: blur(4px);
       }
       .${CLASS_NAME}:hover{
         filter: blur(0px);
       }`;
  document.head.appendChild(style);
})();

/*
const identifers = {
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
     id: "name",
   },
 ];
*/

//global declarations

const CLASS_NAME = "blur-wp";
const BLUR_LIST = "blur_list";

const extensionStorage = {
  set: ({ key, value }) => {
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
  get: (key) => {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.get([key], function (result) {
          console.log("Value currently is " + result.key);
          resolve(JSON.parse(result[key]));
        });
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  },
};

function blur(list = []) {
  const identifiers = list.map((value) => value.identifer);
  identifiers.forEach((identifer) => {
    document
      .querySelectorAll(identifer)
      .forEach((node) => node.classList.add(CLASS_NAME));
  });
}

function unBlur(list = []) {
  const identifiers = list.map((value) => value.identifer);
  identifiers.forEach((identifer) => {
    document
      .querySelectorAll(identifer)
      .forEach((node) => node.classList.remove(CLASS_NAME));
  });
}

function diffInBlurList(previous = [], present = []) {
  const unBlurList = previous.filter(
    (previousValue) =>
      !present.find((presentValue) => presentValue.type === previousValue.type)
  );
  const blurList = present.filter((presentValue) =>
    previous.find((previousValue) => previousValue.type === presentValue.type)
  );
  return {
    unBlurList,
    blurList,
  };
}

//after loading the data (after the loader finished)

const style = document.createElement("style");
style.textContent = `.${CLASS_NAME}{
         filter: blur(4px);
       }
       .${CLASS_NAME}:hover{
         filter: blur(0px);
       }`;
document.head.appendChild(style);

extensionStorage
  .get(BLUR_LIST)
  .then((blurList) => {
    const identifiers = blurList.map((value) => value.identifer);
    blur(identifiers);
  })
  .catch(console.error);

//if popup.js sends any event

chrome.runtime.onMessage.addListener(function (request) {
  if (request?.blur) {
    console.log("Blurring", request.blurList);
    if (request?.blurList) {
      const blurListFromEvent = request.blurList;
      extensionStorage
        .get(BLUR_LIST)
        .then((currentList) => {
          const { blurList, unBlurList } = diffInBlurList(
            currentList,
            blurListFromEvent
          );
          blur(blurList);
          unBlur(unBlurList);
        })
        .catch(console.error);
    } else console.error("Blur list absent");
  }
});
