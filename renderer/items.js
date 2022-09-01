// Modules
const fs = require("fs");

// DOM nodes
let items = document.getElementById("items");

// Get readerJS content
let readerJS;
fs.readFile(`${__dirname}/readerJS.js`, (err, data) => {
  readerJS = data.toString();
});

// Track items in storage
exports.storage = JSON.parse(localStorage.getItem("readit-item")) || [];

window.addEventListener("message", e => {
  // Check for correct messgae
  if (e.data.action == "delete-reader-item") {
    //Delete item at given index
    this.delete(e.data.itemIndex);

    // Close the reader window
    e.source.close();
  }
});

exports.delete = itemIndex => {
  items.removeChild(items.childNodes[itemIndex]);

  // Remove item from storage
  this.storage.splice(itemIndex, 1);

  this.save();

  // Select previous item or new top item
  if (this.storage.length) {
    // Get new selected item index
    let = newSelectedItemIndex = itemIndex === 0 ? 0 : itemIndex - 1;
    document
      .getElementsByClassName("read-item")
      [newSelectedItemIndex].classList.add("selected");
  }
};

/**
 * 선택된 node와 index를 리턴한다.
 * @returns { object } {node: , index: }
 */
exports.getSelectedItem = () => {
  // Get selected node
  let currentItem = document.getElementsByClassName("read-item selected")[0];

  // Get item index
  let itemIndex = 0;
  let child = currentItem;

  // child의 이전 형제가 없다면 child = null
  // 조건이 false이 되므로 itemIndex는 0으로 멈춘다.
  while ((child = child.previousElementSibling) != null) itemIndex++;

  // Return selected item and index
  return { node: currentItem, index: itemIndex };
};

// Persist storage
exports.save = () => {
  localStorage.setItem("readit-item", JSON.stringify(this.storage));
};

//Set item as selected

exports.select = e => {
  //Remove currently selected item class
  this.getSelectedItem().node.classList.remove("selected");

  //Add to clicked item
  e.currentTarget.classList.add("selected");
};

// Move to newly selected item

/**
 * 키보드로 "ArrowUp", "ArrowDown" 입력 받아 입력된 방향으로 .selected를 변경
 * @param {string} direction - Only "ArrowUp" or "ArrowDown"
 */
exports.changeSelection = direction => {
  let currentItem = this.getSelectedItem();

  // Handle up/down
  if (direction === "ArrowUp" && currentItem.node.previousElementSibling) {
    currentItem.node.classList.remove("selected");
    currentItem.node.previousElementSibling.classList.add("selected");
  } else if (direction === "ArrowDown" && currentItem.node.nextElementSibling) {
    currentItem.node.classList.remove("selected");
    currentItem.node.nextElementSibling.classList.add("selected");
  }
};

/**
 * 현재 선택된 item을 새로운 window로 열음
 *
 */
exports.open = () => {
  // Only if we have items (in case of menu open)
  if (!this.storage.length) return;
  let selectedItem = this.getSelectedItem();

  //Get item's url
  let contentURL = selectedItem.node.dataset.url;

  //Open item in proxy BrowserWindow
  let readerWin = window.open(
    contentURL,
    "",
    `
  maxWidth=2000,
  maxHeight=2000,
  width=1200,
  height=800,
  backgroundColor=#DEDEDE,
  nodeIntegration=0,
  contextIsolation=1
  `
  );

  //Inject JavaScript with specific item index (selectedItem.index)
  readerWin.eval(readerJS.replace("{{index}}", selectedItem.index));
};

// Add new Item
/**
 *
 * @param {object} item - title, screensshot, url
 * @param {boolean} isNew - 기본 false, 새로운 아이템은 true
 */
exports.addItem = (item, isNew = false) => {
  //Create a new DOM node
  let itemNode = document.createElement("div");

  // Assign "read-item" class
  itemNode.setAttribute("class", "read-item");

  // Set item url as data attribute
  itemNode.setAttribute("data-url", item.url);

  // Add inner HTML
  itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`;

  // Append new node to "items"
  items.appendChild(itemNode);

  // Attach click handler to select
  itemNode.addEventListener("click", this.select);

  // Attach doubleclick handler to open
  itemNode.addEventListener("dblclick", this.open);

  // If this is the first item, select it.
  if (document.getElementsByClassName("read-item").length === 1) {
    itemNode.classList.add("selected");
  }

  // Add item to storage and persist
  if (isNew) {
    this.storage.push(item);
    this.save();
  }
};

// Add items from storage when app loads
this.storage.forEach(item => {
  this.addItem(item);
});
