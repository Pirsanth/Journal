(function (window) {
  "use strict"

  let Application = window.Application || {};

  const TASK_FORM_SELECTOR = '[data="task-form"]';
  const TASK_FORM_ADD_TASK_BUTTON = '[data-task-form = "add-task"]';
  const TASK_FORM_CANCEL_TASK_BUTTON = '[data-task-form = "cancel-task"]';
  const TASK_FORM_CHANGE_DATE_BUTTON = '[data-task-form="change-button"]';
  const TASK_FORM_CALENDAR_CLICKABLE = '[data-task-form-calendar="clickable"]';
  const FORM_CONTROLS_COLLECTION = document.forms[0].elements;
  const TASK_FORM_CALENDAR_CONTAINER = '[data-task-form="date-picker"]';

  function TaskForm () {
    //container refers to the entire div that slides down whereas form refers to the form element
    this.container = document.querySelector(TASK_FORM_SELECTOR);
    this.form_calendar = document.querySelector(TASK_FORM_CALENDAR_CONTAINER);
    this.change_button = document.querySelector(TASK_FORM_CHANGE_DATE_BUTTON);
    this.clickable_node_list = document.querySelectorAll(TASK_FORM_CALENDAR_CLICKABLE);
    this.form = document.forms[0];
  }

  TaskForm.prototype.addChangeDateHandler = function () {
    this.change_button.addEventListener("click", (event) => {
          this.form_calendar.classList.toggle("expand");
    });
  }

  TaskForm.prototype.addTaskFormClickableHandler = function () {
      let clickableNodeList = this.clickable_node_list;

      for(let i=0; i<clickableNodeList.length; i++){
            clickableNodeList[i].addEventListener("click", (event) => {
            FORM_CONTROLS_COLLECTION[1].value = event.target.textContent;
            this.form_calendar.classList.toggle("expand");
            });
      }
  }
  TaskForm.prototype.addFormSubmitHandler = function () {

  }
  TaskForm.prototype.toggleVisibility = function () {
      this.container.classList.toggle("slide");
  }

  Application.TaskForm = TaskForm;
  window.Application = Application;

})(window)
//ADD A METHOD FOR VISIBILITY AND LINK IT TO THE BASE

//let formCalendar = document.querySelector(TASK_FORM_CALENDAR_CONTAINER);

/*
addChangeDateHandler();
addTaskFormClickableHandler();
addFormSubmitHandler();


function addChangeDateHandler() {
  //    let changeButton = document.querySelector(TASK_FORM_CHANGE_DATE_BUTTON);

      changeButton.addEventListener("click", function (event) {
          formCalendar.classList.toggle("expand");
      });
}


function addTaskFormClickableHandler(){
    //  let clickableNodeList = document.querySelectorAll(TASK_FORM_CALENDAR_CLICKABLE);

      for(i=0; i<clickableNodeList.length; i++){
            clickableNodeList[i].addEventListener("click", function (event) {
            FORM_CONTROLS_COLLECTION[1].value = event.target.textContent;
            formCalendar.classList.toggle("expand");
            });
      }
}

//chnage it so you are listening for the submit event ON the form element
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
*/
