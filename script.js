const title = document.getElementById("todoTitle");
const description = document.getElementById("todoDescription");
const addBtn = document.getElementById("addBtn");
const listContainer = document.querySelector("ul");
const search = document.getElementById("search");
const searchContainer = document.querySelector(".search");

const titlePattern = /^[A-Z][a-z]{3,8}$/;
const descPattern = /.{20,}$/;

let data = [];
let container = ``;
let newIndex = 0;
let isEditMode = false;
let editedId = null;

function isValidInput(text,pattern){
  return text.match(pattern);
}

if(localStorage.getItem("toDoList") !== null){
  data = JSON.parse(localStorage.getItem("toDoList"))
  if(data.length>0){
    newIndex = data[data.length-1].id;
  }
  renderList();
}



function setItemsToLocalStorage(){
  localStorage.setItem("toDoList", JSON.stringify(data));
}

//Create a new object and add it in the data array when clicking the add btn
addBtn.addEventListener("click", function (e) {
  e.preventDefault();

if(title.value == "" && description.value == ""){
  alert("Please fill in all required fields.")
  return;
}
if(!isValidInput(title.value,titlePattern)){
  alert("Title must start with an uppercase letter followed by 3-8 lowercase letters.")
  return;
}

if(!isValidInput(description.value,descPattern)){
  alert("Description must be at least 20 letters long.")
  return;
}
  
// Update the item if edit mode is active
  if(isEditMode){ 
    data.forEach(item => {
      if (item.id === editedId) {
        item.title = title.value;
        item.description = description.value;
      }
    });
    isEditMode = false;
  }
// Normally add the item if edit mode is not active
else{ 
  newIndex++;
  let list = {
    title: title.value,
    description: description.value,
    id: newIndex,
    done: false
  };

  data.push(list);
  console.log(data);
  }

  addBtn.textContent="Add"
  addBtn.classList.remove('editMode');
  setItemsToLocalStorage()
  renderList();
});

//Render the data list items
function renderList(list = data) {
  container = " ";
  list.forEach((item, index) => {
    container += `<li><h3 class="${item.done ? 'done':''}">${item.title}</h3> <div class="icons">
    <i onclick="toggleDone(${item.id})" class="fa-solid fa-check"></i> 
    <i onclick="updateItem(${item.id})" class="fa-solid fa-pen"></i>
    <i onclick="removeItem(${item.id})"  class="fa-solid fa-trash"></i></div></li>`;
  });
  listContainer.innerHTML = container;
  title.value = "";
  description.value = "";

  if (data.length > 0) {
    searchContainer.style.display = "block";
  } else {
    searchContainer.style.display = "none";
  }
}

//Delete an item from the data array
function removeItem(id) {
  data.forEach((item,index)=>{
    if(item.id === id){
      console.log(data[index])
      data.splice(index,1);
    }
  })

  // Reset edit mode if no items left
  if (data.length === 0) {
    isEditMode = false;
    addBtn.textContent = "Add";
    addBtn.classList.remove('editMode');
  }
  
  setItemsToLocalStorage();
  renderList();
  console.log(data);
}

function updateItem(id){
  data.forEach((item,index)=>{
    if(item.id === id){
      title.value = item.title;
      description.value = item.description;
      isEditMode = true;
      editedId = id;
    }
  })
  addBtn.textContent="Update"
  addBtn.classList.add('editMode');
}

// Filter items from the search input
search.addEventListener('input', function(e){
 const text = e.target.value.toLowerCase();
 const filteredItems = [];
 data.forEach((item)=>{
  if(item.title.toLowerCase().includes(text)){
    filteredItems.push(item)
  }
 })
 
 renderList(filteredItems);
})

//Mark an item as done
function toggleDone(id){
  data.forEach((item)=>{
    if(item.id === id){
      item.done = !item.done;
    }
  })
  setItemsToLocalStorage();
  renderList();
}

