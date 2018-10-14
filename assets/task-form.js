const TASK_FORM_ADD_TASK_BUTTON = '[data-task-form = "add-task"]';
const TASK_FORM_CANCEL_TASK_BUTTON = '[data-task-form = "cancel-task"]';
const TASK_FORM_CHANGE_DATE_BUTTON = '[data-task-form="change-button"]';
const TASK_FORM_CALENDAR_CLICKABLE = '[data-task-form-calendar="clickable"]';
const FORM_CONTROLS_COLLECTION = document.forms[0].elements;
const TASK_FORM_CALENDAR_CONTAINER = '[data-task-form="date-picker"]';

let formCalendar = document.querySelector(TASK_FORM_CALENDAR_CONTAINER);

addChangeDateHandler();
addTaskFormClickableHandler();
addFormSubmitHandler();


function addChangeDateHandler() {
      let changeButton = document.querySelector(TASK_FORM_CHANGE_DATE_BUTTON);

      changeButton.addEventListener("click", function (event) {
          formCalendar.classList.toggle("expand");
      });
}

function addTaskFormClickableHandler(){
      let clickableNodeList = document.querySelectorAll(TASK_FORM_CALENDAR_CLICKABLE);

      for(i=0; i<clickableNodeList.length; i++){
            clickableNodeList[i].addEventListener("click", function (event) {
            FORM_CONTROLS_COLLECTION[1].value = event.target.textContent;
            formCalendar.classList.toggle("expand");
            });
      }
}

function addFormSubmitHandler(){
      let submitButton = document.querySelector(TASK_FORM_ADD_TASK_BUTTON);

      submitButton.addEventListener("click", function (event) {
        let serializedForm = {};

                for(i=0; i<FORM_CONTROLS_COLLECTION.length; i++){
                      if(i<2){
                      }
                }
        document.forms[0].reset();
      });
}
