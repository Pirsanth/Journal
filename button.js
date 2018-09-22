const BASE_NEW_TASK_BUTTON_SELECTOR = '[data-base="new-task"]';
const BASE_CALENDAR_DATE_CLICKABLE_SELECTOR = '[data-base-calendar = "clickable"]';

const TASK_FORM_SELECTOR = '[data="task-form"]';
const TASK_FORM_ADD_TASK_BUTTON = '[data-task-form = "add-task"]';
const TASK_FORM_CANCEL_TASK_BUTTON = '[data-task-form = "cancel-task"]';
const TASK_FORM_CALENDAR_CONTAINER = '[data-task-form="calendar-container"]';
const TASK_FORM_CHANGE_DATE_BUTTON = '[data-task-form="change-button"]';


let base_add_task_button = document.querySelector(BASE_NEW_TASK_BUTTON_SELECTOR);
let clickable_Node_List = document.querySelectorAll(BASE_CALENDAR_DATE_CLICKABLE_SELECTOR);

let form = document.querySelector(TASK_FORM_SELECTOR);
function toggleForm() {
  form.classList.toggle("slide");
}

base_add_task_button.addEventListener("click", function (event) {
      toggleForm();
})

let lastElementClicked = null;

for(let i = 0; i< clickable_Node_List.length; i++){

  clickable_Node_List[i].addEventListener("click", function (event) {
    if(lastElementClicked){
      lastElementClicked.classList.remove("clicked");
    }
    event.target.classList.add("clicked");
    lastElementClicked = event.target;
  })
}

Handlebars.registerHelper("taskList", function (obj, options) {

})
//startTime, endTime, taskName
