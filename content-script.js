// const messageIdentifier = "div._22Msk";
// const chatIdentifier = "div.lhggkp7q.ln8gz9je.rx9719la";
// // document.addEventListener("load", onLoadCallback);

// // function onLoadCallback() {
// //   const messages = document.querySelectorAll(chatIdentifier);
// //   console.log(messages);
// //   messages.forEach((mes) => addFilter(mes));
// // }

// // function addFilter(element) {
// //   element.style.filter = "blur(20px)";
// // }

// function setStyleTagToDom() {
//   const style = document.createElement("style");
//   style.textContent = `.blurred{
//         filter: blur(4px);
//       }
//       .blurred:hover{
//         filter: blur(0px);
//       }`;
//   document.head.appendChild(style);
//   console.log(style);
// }

// function onPageLoadCallback() {
//   setStyleTagToDom();
// }

// //left side chats
// function onChatsLoaded() {
//   const messages = document.querySelectorAll(chatIdentifier);
//   messages.forEach((message) => {
//     message.classList.add("blurred");
//     message.addEventListener("click", (e) => {
//       console.log(e);
//       blurRightSide();
//     });
//   });
// }

// function blurRightSide() {
//   const messages = document.querySelectorAll(messageIdentifier);
//   messages.forEach((message) => {
//     console.log(messages);
//     message.classList.add("blurred");
//   });
// }
// setTimeout(() => {
//   console.log("right side blurring");
//   onChatsLoaded();
// }, 10000);

// onPageLoadCallback();

//by default the content scripts run at After Dom load done. checkout https://developer.chrome.com/docs/extensions/mv3/content_scripts/#capabilities
