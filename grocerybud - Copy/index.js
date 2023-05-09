const $alert = document.querySelector('.alert')
const form = document.querySelector('.grocery-form')
const grocery = document.getElementById('grocery')
const submitBtn = document.querySelector('.submit-btn')
const container = document.querySelector('.grocery-container')
const list = document.querySelector('.grocery-list')
const clearBtn = document.querySelector('.clear-btn')

let editElement;
let editFlag = false
let editID = ''

form.addEventListener('submit', addItem)
clearBtn.addEventListener('click', clearItems)
window.addEventListener('DOMContentLoaded', setupItems)
function addItem(e){
  e.preventDefault()
  const value = grocery.value;
  const id = new Date().getTime().toString()
  if(value && !editFlag){
    createListItems(id, value)
    displayAlert('item have been added to the list', 'success')
    container.classList.add('show-container')
    addToLocalStorage(id, value)
    setBackToDefault()
  }
  else if(value && editFlag){
    editElement.innerHTML = value
    displayAlert('value changed', 'success')
    editLocalStorage(editID, value)
    setBackToDefault()
  }
  else{
    displayAlert('empty value', 'danger')
  }
}
function displayAlert(text, action){
  $alert.textContent = text
  $alert.classList.add(`alert-${action}`)
  setTimeout(()=>{
    $alert.textContent = ""
    $alert.classList.remove(`alert-${action}`)
  }, 1000)
}
function clearItems(){
  const items = document.querySelectorAll('.grocery-item')
  if(items.length > 0){
    items.forEach((item)=>{
      list.removeChild(item)
    })
  }
  container.classList.remove('show-container')
  displayAlert('empty list', 'danger')
  setBackToDefault()
  localStorage.removeItem('list')
}
function createElement(id, value){


}
function addToLocalStorage(id, value){
  const grocery = {id:id, value:value}
  let items = getLocalStorage()
  console.log(items)
  console.log(typeof(items))
  items.push(grocery)
  localStorage.setItem('list', JSON.stringify(items))
}
function removeFromLocalStorage(id){
  let items = getLocalStorage()
  items = items.filter((item)=>{
    if(item.id !== id){
      return item
    }
  })
  localStorage.setItem('list', JSON.stringify(items))
}
function editLocalStorage(id, value){
   let items = getLocalStorage()
   items = items.map((item)=>{
    if(item.id === id){
      item.value = value
    }
    return item
   })
   localStorage.setItem('list', JSON.stringify(items))
}
function getLocalStorage(){
  return localStorage.getItem('list')?JSON.parse(localStorage.getItem('list')) : []
}
function setBackToDefault(){
  grocery.value = ''
  editFlag = false
  editID = ""
  submitBtn.textContent = 'Submit'
}
function deleteItem(e){
   e.preventDefault()
   const element = e.currentTarget.parentElement.parentElement
   const id = element.dataset.apple
   list.removeChild(element)
   if(list.children.length === 0){
    container.classList.remove('show-container')
   }
   displayAlert('item removed', 'danger')
   setBackToDefault()
   removeFromLocalStorage(id)
}
function editItem(e){
  const element = e.currentTarget.parentElement.parentElement
  editElement = e.currentTarget.parentElement.previousElementSibling
  grocery.value = editElement.innerHTML
  editFlag = true
  editID = element.dataset.apple
  submitBtn.textContent = 'edit'
}

function setupItems(){
  let items = getLocalStorage()
  if(items.length > 0){
    items.forEach((item)=>{
      createListItems(item.id, item.value)
    })
  container.classList.add('show-container')
  }
}
function createListItems(id, value){
  const element = document.createElement('article')
  element.classList.add('grocery-item')
  const attr = document.createAttribute('data-apple')
  attr.value = id
  element.setAttributeNode(attr)
  element.innerHTML = `<p class="title">${value}</p>
  <div class="btn-container">
    <button type="button" class="edit-btn">
      <i class="fas fa-edit"></i>
    </button>
    <button type="button" class="delete-btn">
      <i class="fas fa-trash"></i>
    </button>
  </div>`
  const deletebtn = element.querySelector('.delete-btn')
  const editbtn = element.querySelector('.edit-btn')
  deletebtn.addEventListener('click', deleteItem)
  editbtn.addEventListener('click', editItem)
  list.appendChild(element)
}