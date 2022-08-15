let showModal = document.getElementById("show-modal"),
  closeModal = document.getElementById("close-modal"),
  modal = document.getElementById("modal"),
  addItem = document.getElementById("add-item"),
  itemUrl = document.getElementById("url");

//show modal
showModal.addEventListener("click", (e) => {
  modal.style.display = "flex";
  itemUrl.focus();
});

//hide modal
closeModal.addEventListener("click", (e) => {
  modal.style.display = "none";
});

//Handle new item
addItem.addEventListener("click", (e) => {
  //Check a url exists
  if (itemUrl.value) {
    //Send new item url to main process
  }
});

//Listen for keyboard event
itemUrl.addEventListener("keyup", (e) => {
  if (e.key === "Enter") addItem.click();
});
