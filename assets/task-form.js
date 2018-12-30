(function (window) {
  "use strict"

  let Application = window.Application || {};

  //List of selectors used here
  const TASK_FORM_SELECTOR = '[data-task-form]';
  const TASK_FORM_CHANGE_DATE_BUTTONS = '[data-task-form-change-button]';
  const TASK_FORM_CALENDAR_CONTAINERS = '[data-task-form-calendar-container]';
  const DATE_INPUT = '[data-task-form-date]';
  const SUBMIT_BUTTON = '[data-task-form-submit-button]';
  const CANCEL_BUTTON = '[data-task-form-cancel-button]';
  const USER_STATUS_BOX = "[data-task-form-user-input-status-box]";


  function TaskForm () {
    //container refers to the entire div that slides down whereas form refers to the form element
    this.container = document.querySelector(TASK_FORM_SELECTOR);
    this.changeButtonNodeList = document.querySelectorAll(TASK_FORM_CHANGE_DATE_BUTTONS);
    this.calendarContainerNodeList = document.querySelectorAll(TASK_FORM_CALENDAR_CONTAINERS);
    this.dateInputNodeList =  document.querySelectorAll(DATE_INPUT);
    this.form = document.forms[0];
    this.submitButton = document.querySelector(SUBMIT_BUTTON);
    this.cancelButton = document.querySelector(CANCEL_BUTTON);
    this.userInputStatusBoxNodeList = document.querySelectorAll(USER_STATUS_BOX);
    this.clickableDatesInEndDateCalendar = this.calendarContainerNodeList[1].querySelectorAll("td[data-clickable]");
    //using these variables to store the state of the form instead of a data- attributes because the DOM is slow
    this.formMethod;
    this.dayIndex;
    this.taskIndex;
  }

  TaskForm.prototype.addChangeDateButtonHandler = function () {
    this.changeButtonNodeList.forEach(function (element, index) {
          element.addEventListener("click", (event) => {
                  //removing a class that does not exist does not throw an Error
                  if(isStartDateChangeButton(index)){
                    this.ensureDatePickersAreCollapesed();
                    this.calendarContainerNodeList[index].classList.add(`expand${index}`);
                  }
                  else {
                    this.ensureDatePickersAreCollapesed();
                    this.calendarContainerNodeList[index].querySelectorAll("td");
                    this.calendarContainerNodeList[index].classList.add(`expand${index}`);
                    setTimeout(() => {
                      this.calendarContainerNodeList[index].scrollIntoView({behavior: 'smooth'});
                    },400);
                  }
          });
    }, this);
  }

  function isStartDateChangeButton (index) {
    return index === 0;
  }
  TaskForm.prototype.ensureDatePickersAreCollapesed = function () {
    this.calendarContainerNodeList.forEach(function (element, index) {
      element.classList.remove(`expand${index}`);
    });
  }
  TaskForm.prototype.addCalendarClickHandler = function () {
      this.calendarContainerNodeList.forEach(function (element, index) {
            element.addEventListener("click", (event) => {
                  const clickedElement = event.target;

                  if(clickedElement.tagName === "TD" && clickedElement.dataset.clickable !== undefined){
                    if(isStartDateCalendar(index)){
                      element.classList.remove(`expand${index}`);
                      this.dateInputNodeList[index].value = clickedElement.textContent;
                      element.previousElementSibling.classList.remove("showFailure");
                      this.resetEndDateCalendarColour();
                      this.makeDatesInThePastRedForEndDateCalendar();
                      if(this.isStartDateGreaterThanEndDate()){
                        this.clearEndDateInputs();
                      }
                    }
                    else{
                      //if startDate is empty, an endDate can be chosen
                      if(this.isDesirededEndDateGreaterThanStartDate(clickedElement)){
                        element.classList.remove(`expand${index}`);
                        this.dateInputNodeList[index].value = clickedElement.textContent;
                        element.previousElementSibling.classList.remove("showFailure");
                      }
                    }
                  }
            });

      }, this);
  }
  TaskForm.prototype.resetEndDateCalendarColour = function () {
    this.clickableDatesInEndDateCalendar.forEach(function (element) {
        element.style.background = "";
    })
  }
  TaskForm.prototype.makeDatesInThePastRedForEndDateCalendar = function () {
    //choose a simple for loop because you cannot break using forEach
    const startDate = this.dateInputNodeList[0].value
    if(isStartDateFieldEmpty(startDate)){
        return;
    }
    const startDateIndex = getStartDateIndex(startDate);
    const clickableElements = this.clickableDatesInEndDateCalendar;

    for(let i = 0; i<startDateIndex; i++){
      clickableElements[i].style.background = "#a40000";
    }
  }
  function getStartDateIndex(startDateString) {
    return +startDateString - 1;
  }
  function isStartDateFieldEmpty(startDateString) {
    return !startDateString;
  }
  function isStartDateCalendar (index) {
    return index === 0;
  }
  TaskForm.prototype.isStartDateGreaterThanEndDate = function () {
    return +this.dateInputNodeList[0].value > +this.dateInputNodeList[1].value
  }
  TaskForm.prototype.clearEndDateInputs = function () {
    let collection = this.form.elements;
    collection["endDate"].value = "";
    collection["endTimeHours"].value = "";
    collection["endTimeMinutes"].value = "";
  }
  TaskForm.prototype.isDesirededEndDateGreaterThanStartDate = function(clickedElement){
    return +clickedElement.textContent >= +this.dateInputNodeList[0].value;
  }
  //decided not to place the validation code as a callback, there is no need as it does not depend on the other modules
  TaskForm.prototype.addSubmitButtonHandler = function (POSTfunction, PUTfunction) {
    this.submitButton.addEventListener("click", (event) => {
            if(this.form.checkValidity() && this.areAllTheReadOnlyInputsValid()){
            const method = this.formMethod;
            this.formMethod = "";

            if(method === "POST"){
              let formData = new FormData(this.form);
              let startDateString = formData.get("startDate");
              POSTfunction(makeQueryString(formData), makeInternalTaskDataObject(formData), getDayIndex(startDateString));
            }
            else if(method === "PUT"){
              let formData = new FormData(this.form);
              PUTfunction(makeInternalTaskDataObject(formData) , this.dayIndex, this.taskIndex);
            }
          }
          else{
            this.showAppropriateValidationMessages();
          }
    });
  }
  TaskForm.prototype.addCancelButtonHandler = function (fn) {
    this.cancelButton.addEventListener("click", (event) => {
            fn();
    });
  }
  TaskForm.prototype.setInternalState = function (method, dayIndex = '', taskIndex = '') {
    this.formMethod = method
    this.dayIndex = dayIndex
    this.taskIndex = taskIndex;
  }
  TaskForm.prototype.toggleVisibility = function () {
      this.container.classList.toggle("slide");
  }
  TaskForm.prototype.getUserData = function () {
      let collection = this.form.elements;
      let obj = {username: collection["username"].value,
                 month: collection["month"].value,
                 year: collection["year"].value};
      return obj;
  }
  TaskForm.prototype.prefillFormWithObject = function ({taskName, startDateClient, endDateClient}) {
      let collection = this.form.elements;
      collection["taskName"].value = taskName;
      collection["startDate"].value = startDateClient.getDate();
      collection["startTimeHours"].value = startDateClient.getHours();
      collection["startTimeMinutes"].value = startDateClient.getMinutes();
      collection["endDate"].value = endDateClient.getDate();
      collection["endTimeHours"].value = endDateClient.getHours();
      collection["endTimeMinutes"].value = endDateClient.getMinutes();
  }

  TaskForm.prototype.preFillDates = function (taskDate = '') {
       let collection = this.form.elements;
       collection["startDate"].value = taskDate;
       collection["endDate"].value = taskDate;
  }

  TaskForm.prototype.clearInternalStateAndForm = function () {
      this.formMethod = '';
      this.dayIndex = '';
      this.taskIndex = '';
      this.form.reset();
  }
  /*Refactored the code below into more descriptive functions. Allowing access to said functions via
    passing in this (the taskform instance) to forEach and using an arrow function in the event handler
    callback*/
  TaskForm.prototype.showUserInputValidityOnBlur = function () {
      //the blur event does not bubble hence we deal with it in the capture phase
      this.userInputStatusBoxNodeList.forEach(function (statusBox) {
          statusBox.addEventListener("blur", (event) => {
            let blurredElement = event.target;
            if(blurredElement.tagName === "INPUT"){
                if(this.areTheUserInputElementsValid(statusBox)){
                  this.showSuccessValidationMessage(statusBox);
                }
                else{
                  this.showErrorValidationMessage(statusBox);
                }
            }
          },true);
      }, this);
  }
  TaskForm.prototype.areTheUserInputElementsValid = function (statusBox) {
    let htmlCollection = statusBox.getElementsByTagName("INPUT"), overallValidity = true;

    for(let i=0; i<htmlCollection.length; i++){
      if(!htmlCollection[i].validity.valid){
        overallValidity = false;
        break;
      }
    }
    return overallValidity;
  }
  TaskForm.prototype.showReadOnlyInputValidityOnClick = function () {
      this.dateInputNodeList.forEach(function (dateInputElement) {
        dateInputElement.addEventListener("click", (event) => {
          if(!this.isDateInputValid(dateInputElement)){
            let statusBox =  dateInputElement.parentElement.parentElement;
            this.showErrorValidationMessage(statusBox);
          }
        })
      }, this)
  }
  TaskForm.prototype.isDateInputValid = function (dateInputElement) {
        const {value, min, max} = dateInputElement;
        if((+value >= +min) && (+value <= +max)){
          return true;
        }
        else{
          return false;
        }
  }
  TaskForm.prototype.showErrorValidationMessage = function (statusBox) {
      statusBox.classList.remove("showSuccess");
      statusBox.classList.add("showFailure");
  }
  TaskForm.prototype.showSuccessValidationMessage = function (statusBox) {
    statusBox.classList.remove("showFailure");
    statusBox.classList.add("showSuccess");
  }
  TaskForm.prototype.removeValidationMessages = function (statusBox) {
    statusBox.classList.remove("showFailure");
    statusBox.classList.remove("showSuccess");
  }

  TaskForm.prototype.areAllTheReadOnlyInputsValid = function () {
      let overallValidity = true;
      //there is no need for break as there are only 2 date inputs to test. Using forEach because it is preetier
      this.dateInputNodeList.forEach(function (dateInputElement) {
        if(!this.isDateInputValid(dateInputElement)){
            overallValidity = false;
          }
      }, this);
      return overallValidity;
  }
  /*not ignoring the date status box with this on submit. You do not want to mention valid input with
    obvious things like selecting from a calendar*/
  TaskForm.prototype.showAppropriateValidationMessages = function () {
      this.userInputStatusBoxNodeList.forEach(function (statusBox) {
        if(this.areTheUserInputElementsValid(statusBox)){
          this.showSuccessValidationMessage(statusBox);
        }
        else{
          this.showErrorValidationMessage(statusBox);
        }
      }, this);

      this.dateInputNodeList.forEach(function (dateInputElement) {
        if(!this.isDateInputValid(dateInputElement)){
            let statusBox = dateInputElement.parentElement.parentElement;
            this.showErrorValidationMessage(statusBox);
          }
      }, this);
  }
  TaskForm.prototype.clearAllValidationMessages = function () {
    this.userInputStatusBoxNodeList.forEach(function (statusBox) {
        this.removeValidationMessages(statusBox);
    }, this);

    this.dateInputNodeList.forEach(function (dateInputElement) {
          let statusBox = dateInputElement.parentElement.parentElement;
          this.removeValidationMessages(statusBox);
    }, this);
  }
  TaskForm.prototype.giveTaskNameInputFocus = function () {
    this.form.elements["taskName"].focus();
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
  function getDayIndex(actualDate) {
    return actualDate - 1;
  }

  Application.TaskForm = TaskForm;
  window.Application = Application;

})(window);
