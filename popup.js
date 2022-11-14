const optionsList = ["chats", "messages", "all"];
const form = document.createElement("form");
optionsList.forEach((option) => {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.name = option;
  checkbox.value = option;
  checkbox.id = option;

  const label = document.createElement("label");
  label.innerText = option;
  label.htmlFor = option;

  const br = document.createElement("br");

  const fragment = document.createDocumentFragment();

  fragment.append(checkbox, label, br);

  form.append(fragment);
});

document.body.append(form);

const formChangeHandler = () => {
  const formData = new FormData(form);
  const blurList = [...formData].map(([key, value]) => value);
  console.log(blurList);

  blur(blurList);
};

form.addEventListener("change", formChangeHandler);

function blur(blurList) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { blur: true, blurList }, console.log);
  });
}
