const formInput = document.getElementById("item-form");
const itemList = document.getElementById("item-list");
const itemInput = document.getElementById("item-input");
const clearBtn = document.getElementById("clear");
const filterItem = document.getElementById("filter");
const formBtn = formInput.querySelector("button");
let isEditMode = false;

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.forEach((item) => {
    addItemToDOM(document.createTextNode(item));
    // clearUI();
  });
}

const onAddItemSubmit = (e) => {
  e.preventDefault();
  if (itemInput.value === "") {
    alert("Field is empty");
    return;
  }
  const newText = itemInput.value;
  const text = document.createTextNode(
    newText[0].toUpperCase() +
      newText.substring(1, itemInput.value.length).toLowerCase()
  );
  // check for edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector(".edit-mode");
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove("edit-mode");
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(text.textContent)) {
      alert("Item already Exists");
      return;
    }
  }

  addItemToDOM(text);
  addItemToStorage(text);

  clearUI();
};

// Add Item to DOM
function addItemToDOM(item) {
  itemInput.value = "";
  const li = document.createElement("li");
  const button = document.createElement("button");
  const icon = document.createElement("i");
  button.className = "remove-item btn-link text-red";
  icon.className = "fa-solid fa-xmark";

  li.appendChild(item);
  button.appendChild(icon);
  li.appendChild(button);

  itemList.appendChild(li);
  clearUI();
}
// Add Item to Storage
function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.push(item.textContent);
  // Convert to JSON and store in localStorage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}
// Add items to storage
function getItemsFromStorage() {
  let itemsFromStorage;
  if (localStorage.getItem("items") === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem("items"));
  }

  return itemsFromStorage;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}
function setItemToEdit(item) {
  isEditMode = true;
  itemList
    .querySelectorAll("li")
    .forEach((i) => i.classList.remove("edit-mode"));
  item.classList.add("edit-mode");
  formBtn.innerHTML = "<i class = 'fa-solid fa-pen'></i> Update Item";
  formBtn.style.backgroundColor = "#228B22";
  itemInput.value = item.textContent;
}

// remove Item
const removeItem = (item) => {
  if (confirm("Are you sure you want to remove this item")) {
    // Remove item from Dom
    item.remove();
    // Remove item from storage
    removeItemFromStorage(item.textContent);
    clearUI();
  }
};
// removeItemFromStorage
function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();
  // Filter out items to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);
  // Reset to LocalStorage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}
// Clear all items
const clearItems = () => {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  // Clear from Local Storage
  localStorage.removeItem("items");
  clearUI();
};
// Filter Items
const filterItems = () => {
  const listItems = document.querySelectorAll("li");
  const textToFilter = filterItem.value.toLowerCase();
  listItems.forEach((item) => {
    const itemName = item.textContent.toLowerCase();

    if (itemName.includes(textToFilter)) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
};
// Clear UI elements
function clearUI() {
  itemInput.value = "";
  const listItems = document.querySelectorAll("li");
  if (listItems.length === 0) {
    filterItem.style.display = "none";
    clearBtn.style.display = "none";
  } else {
    filterItem.style.display = "block";
    clearBtn.style.display = "block";
  }
  formBtn.innerHTML = "<i class='fa-solid fa-plus'></i> Add Item";
  formBtn.style.backgroundColor = "#333";
  isEditMode = false;
}

// Initialize App
function init() {
  formInput.addEventListener("submit", onAddItemSubmit);
  itemList.addEventListener("click", onClickItem);
  clearBtn.addEventListener("click", clearItems);
  filterItem.addEventListener("input", filterItems);
  document.addEventListener("DOMContentLoaded", displayItems);
  clearUI();
}
init();
