const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const itemFilter = document.getElementById("filter");
const formBtn = itemForm.querySelector("button");
let isEditMode = false;

const displayItems = () => {
  const itemsFromStorage = getItemsFromLocalStorage();

  itemsFromStorage.forEach((item) => {
    addItemToDOM(item);
    checkUI();
  });
};
const onAddItemSubmit = (e) => {
  e.preventDefault();
  const newItem = itemInput.value;

  // validate input
  if (newItem === "") {
    alert("Please enter an item");
    return;
  }

  // check if edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector(".edit-mode");

    removeItemFromLocalStorage(itemToEdit.textContent);
    itemToEdit.classList.remove("edit-mode");
    itemToEdit.remove();
    isEditMode = false;
  } else {
    // check if item already exists
    if (doesItemExist(newItem)) {
      alert("Item already exists");
      return;
    }
  }

  // create item dom element
  addItemToDOM(newItem);

  // add item to local storage
  addItemToLocalStorage(newItem);
  checkUI();

  itemInput.value = "";
};

const addItemToDOM = (item) => {
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item));

  const button = createButton("remove-item btn-link text-red");
  li.appendChild(button);

  // add li to the dom
  checkUI();
  itemList.appendChild(li);
};

const addItemToLocalStorage = (item) => {
  const itemsFromStorage = getItemsFromLocalStorage();

  // add item to array
  itemsFromStorage.push(item);

  // convert to json string and set to local storage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
};

const getItemsFromLocalStorage = () => {
  let itemsFromStorage;
  if (localStorage.getItem("items") === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem("items"));
  }
  return itemsFromStorage;
};

const removeItemFromLocalStorage = (item) => {
  let itemsFromStorage = getItemsFromLocalStorage();

  // filter out item to remove
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  // reset to local storage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
};
const createButton = (classes) => {
  const button = document.createElement("button");
  button.className = classes;
  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
};
const createIcon = (classes) => {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
};
const setItemToEdit = (item) => {
  isEditMode = true;
  itemList.querySelectorAll("li").forEach((item) => {
    item.classList.remove("edit-mode");
  });

  item.classList.add("edit-mode");
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  formBtn.style.backgroundColor = "#f0ad4e";
  itemInput.value = item.textContent;

  itemInput.focus();
};
const onClickItem = (e) => {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
};

const removeItem = (item) => {
  if (confirm("Are you sure?")) {
    item.remove();
    removeItemFromLocalStorage(item.textContent);
    checkUI();
  }
};
const clearAll = (e) => {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  // clear from local storage
  localStorage.removeItem("items");
  checkUI();
};

const doesItemExist = (item) => {
  const itemsFromStorage = getItemsFromLocalStorage();
  return itemsFromStorage.includes(item);
};
const filterItems = (e) => {
  const text = e.target.value.toLowerCase();
  const items = document.querySelectorAll("li");

  items.forEach((item) => {
    const itemText = item.firstChild.textContent;
    if (itemText.toLowerCase().indexOf(text) !== -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
};
const checkUI = () => {
  itemInput.value = "";
  const items = document.querySelectorAll("li");
  if (items.length === 0) {
    clearBtn.style.display = "none";
    itemFilter.style.display = "none";
  } else {
    clearBtn.style.display = "block";
    itemFilter.style.display = "block";
  }
  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  isEditMode = false;
};

// Initalize app
const init = () => {
  // Event Listeners
  itemForm.addEventListener("submit", onAddItemSubmit);
  itemList.addEventListener("click", onClickItem);
  clearBtn.addEventListener("click", clearAll);
  itemFilter.addEventListener("input", filterItems);
  document.addEventListener("DOMContentLoaded", displayItems);

  checkUI();
};
init();
