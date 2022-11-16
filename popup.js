const events = {
  BLUR_LIST: "blur_list",
};
const BLUR_LIST = "blur_list"; //storage
const storage = {
  set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
  get: (key) => JSON.parse(localStorage.getItem(key)),
};
const optionsList = [
  {
    identifier: ".message-out > * , .message-in > *",
    type: "messages",
  },
  {
    identifier: "div.lhggkp7q.ln8gz9je.rx9719la",
    type: "chats",
  },
  {
    identifier: "img._8hzr9.M0JmA.i0jNr",
    type: "Profile Picture",
  },
  {
    identifier:
      "span.ggj6brxn.gfz4du6o.r7fjleex.g0rxnol2.lhj4utae.le5p0ye3.l7jjieqr.i0jNr",
    type: "Name",
  },
];

/*
  profile picture
  your picture
  name
*/
const initalBlurList = storage.get(BLUR_LIST) || [];
const initalBlurListMap = initalBlurList.reduce((p, c) => {
  p[c.type] = true;
  return p;
}, {});
const identifiersMap = optionsList.reduce((identifers, currentValue) => {
  identifers[currentValue.type] = currentValue.identifier;
  return identifers;
}, {});

const form = document.createElement("form");

optionsList.forEach(({ type }) => {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.name = type;
  checkbox.value = type;
  checkbox.id = type;
  if (initalBlurListMap[type] === true) {
    checkbox.checked = true;
  }
  const label = document.createElement("label");
  label.innerText = type;
  label.htmlFor = type;

  const br = document.createElement("br");

  const fragment = document.createDocumentFragment();

  fragment.append(checkbox, label, br);

  form.append(fragment);
});

document.body.append(form);

const formChangeHandler = () => {
  const formData = new FormData(form);
  const blurList = [...formData].map(([key, value]) => ({
    type: value,
    identifier: identifiersMap[value],
  }));
  storage.set(BLUR_LIST, blurList);
  const event = {
    type: events.BLUR_LIST,
    data: blurList,
  };
  console.log(blurList);
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, event, console.log);
  });
};

form.addEventListener("change", formChangeHandler);
