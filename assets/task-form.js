(function (window) {
  "use strict"

  let Application = window.Application || {};

  const TASK_FORM_SELECTOR = '[data="task-form"]';
  const TASK_FORM_ADD_TASK_BUTTON = '[data-task-form = "add-task"]';
  const TASK_FORM_CANCEL_TASK_BUTTON = '[data-task-form = "cancel-task"]';
  const TASK_FORM_CHANGE_DATE_BUTTON1 = '[data-task-form="change-button1"]';
  const TASK_FORM_CALENDAR_CLICKABLE = '[data-task-form-calendar="clickable"]';
  const FORM_CONTROLS_COLLECTION = document.forms[0].elements;
  const TASK_FORM_CALENDAR_CONTAINER = '[data-task-form="date-picker"]';

  function TaskForm () {
    //container refers to the entire div that slides down whereas form refers to the form element
    this.container = document.querySelector(TASK_FORM_SELECTOR);
    this.form_calendar = document.querySelector(TASK_FORM_CALENDAR_CONTAINER);
    this.change_button = document.querySelector(TASK_FORM_CHANGE_DATE_BUTTON1);
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
  TaskForm.prototype.addFormSubmitHandler = function (fn) {
      this.form.addEventListener("submit", (event) =>{
          event.preventDefault();
          let formData = new FormData(this.form);
        fn(makeQueryString(formData), makeTaskDataObject(formData));
    });
    }

  TaskForm.prototype.toggleVisibility = function () {
      this.container.classList.toggle("slide");
  }
  TaskForm.prototype.getUserData = function () {
      let obj = {};

      for(let i=7; i<10; i++){
        obj[FORM_CONTROLS_COLLECTION[i].name] = FORM_CONTROLS_COLLECTION[i].value;
        //this is fine because the the output of the name property is a string
      }
      return obj
  }
  function makeQueryString(formData) {
      let queryString = "";

      for(let i of formData){
         let key = i[0],
             value = encodeURIComponent(i[1]).replace(/%20/g, "+");

             queryString += `${key}=${value}`;
          if(key !== "year"){
             queryString += "&";
          }
      }
      return queryString;
  }
  function makeTaskDataObject (formData) {
    let data = {};
    for(let i of formData){
      data[i[0]] = i[1];
    }

    let {startTimeMinutes, startTimeHours, endTimeMinutes, endTimeHours, month, year, taskDate, taskName} = data;
    let dayIndex = getDayIndex(taskDate);

    return {
      startDateClient: new Date(year, month, dayIndex+1, startTimeHours, startTimeMinutes),
      endDateClient: new Date(year, month, dayIndex+1, endTimeHours, endTimeMinutes),
      dayIndex,
      taskName
    }
  }
  function getDayIndex(taskDate) {
    let endPosition = taskDate.indexOf("s")
    let actualDate = taskDate.substring(0, endPosition);
    let dateFromZeroIndex = actualDate - 1;
    return dateFromZeroIndex;
  }
  Application.TaskForm = TaskForm;
  window.Application = Application;

})(window);
