(function (window) {
  "use strict"

  let Application = window.Application || {};

  //List of selectors used here
  const TASK_FORM_SELECTOR = '[data-task-form]';
  const FORM_CONTROLS_COLLECTION = document.forms[0].elements;
  const TASK_FORM_CHANGE_DATE_BUTTONS = '[data-task-form-change-button]';
  const TASK_FORM_CALENDAR_CONTAINERS = '[data-task-form-calendar-container]';
  const DATE_INPUT = '[data-task-form-date]';
  const SUBMIT_BUTTON = '[data-task-form-submit-button]'

  function TaskForm () {
    //container refers to the entire div that slides down whereas form refers to the form element
    this.container = document.querySelector(TASK_FORM_SELECTOR);
    this.changeButtonNodeList = document.querySelectorAll(TASK_FORM_CHANGE_DATE_BUTTONS);
    this.calendarContainerNodeList = document.querySelectorAll(TASK_FORM_CALENDAR_CONTAINERS);
    this.dateInputNodeList =  document.querySelectorAll(DATE_INPUT);
    this.form = document.forms[0];
    this.submitButton = document.querySelector(SUBMIT_BUTTON);
  }

  TaskForm.prototype.addChangeDateButtonHandler = function () {
    this.changeButtonNodeList.forEach(function (element) {
          element.addEventListener("click", (event) => {
                  //removing a class that does not exist does not throw an Error
                  this.calendarContainerNodeList.forEach(function (element) {
                    element.classList.remove("expand");
                  });

                  let index = event.target.dataset.containerIndex;
                  this.calendarContainerNodeList[index].classList.add("expand");
          });
    }, this);
  }
  TaskForm.prototype.addCalendarClickHandler = function () {
      this.calendarContainerNodeList.forEach(function (element) {
            element.addEventListener("click", (event) => {
                  if(event.target.tagName === "TD" && event.target.dataset.clickable !== undefined){
                      let index = element.dataset.containerIndex;
                      this.calendarContainerNodeList[index].classList.remove("expand");
                      this.dateInputNodeList[index].value = event.target.textContent;
                  }
            });

      }, this);
  }
  TaskForm.prototype.addSubmitButtonHandler = function (POSTfunction, PUTfunction) {
    this.submitButton.addEventListener("click", (event) => {
            const method = event.target.dataset.method;
            event.target.dataset.method = "";
            if(method === "POST"){
              let formData = new FormData(this.form);
              let startDateString = formData.get("startDate");
              POSTfunction(makeQueryString(formData), makeInternalTaskDataObject(formData), getDayIndex(startDateString));
            }
            else if(method === "PUT"){

            }
    })
  }
  TaskForm.prototype.setMethod = function (string) {
      this.submitButton.dataset.method = string;
  }
  TaskForm.prototype.addFormSubmitHandler = function (fn) {
      this.form.addEventListener("submit", (event) =>{
          event.preventDefault();
          let formData = new FormData(this.form);
          let startDateString = formData.get("startDate");
        fn(makeQueryString(formData), makeInternalTaskDataObject(formData), getDayIndex(startDateString));
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
  function makeInternalTaskDataObject (formData) {
    let data = {};
    for(let i of formData){
      data[i[0]] = i[1];
    }

    let {startTimeMinutes, startTimeHours, endTimeMinutes, endTimeHours, month, year, endDate, startDate, taskName} = data;
    let startIndex = getDayIndex(startDate);
    let endIndex = getDayIndex(endDate);

    return {
      startDateClient: new Date(year, month, startIndex+1, startTimeHours, startTimeMinutes),
      endDateClient: new Date(year, month, endIndex+1, endTimeHours, endTimeMinutes),
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
