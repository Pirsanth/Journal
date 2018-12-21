(function (window) {
  "use strict";
  //test to see whether the scope of the prototype function is shared
  let Application = window.Application || {};

const NEW_TASK_BUTTON_SELECTOR = '[data-base-new-task-button]';
const TASK_LIST_SELECTOR = '[data-base-task-list]';
const MAIN_MENU_BUTTON_SELECTOR = '[data-base-main-menu-button]';
const MAIN_MENU_CONTAINER_SELECTOR = '[data-main-menu-container]';
const CALENDAR_CONTAINER_SELECTOR = '[data-base-calendar]'
const HOME_BUTTON_SELECTOR = "[data-main-menu-home-button]"

function Base() {
    this.new_task_button = document.querySelector(NEW_TASK_BUTTON_SELECTOR);
    this.taskList = document.querySelector(TASK_LIST_SELECTOR);
    this.mainMenu = document.querySelector(MAIN_MENU_CONTAINER_SELECTOR);
    this.mainMenuButton = document.querySelector(MAIN_MENU_BUTTON_SELECTOR);
    this.calendarContainer = document.querySelector(CALENDAR_CONTAINER_SELECTOR);
    this.homeButton = document.querySelector(HOME_BUTTON_SELECTOR);
    this.lastElementClicked;

    /*did not see the point in creating a new module to include just the
      toggleVisibility method for the main menu
      (for consistency with the naming of taskForm.toggleVisibility)
    */
}

Base.prototype.addNewTaskHandler = function (fn) {
    this.new_task_button.addEventListener("click", (event) => {
      let dateString = (this.lastElementClicked)? this.lastElementClicked.textContent : '';
          fn(dateString);
    });
}

Base.prototype.addCalendarClickEffect = function () {
    this.calendarContainer.addEventListener("click", (event) => {
          const element = event.target;
          if(element.tagName === "TD" && element.dataset.clickable !== undefined){
            if(this.lastElementClicked){
              this.lastElementClicked.classList.remove("clicked");
            }
            element.classList.add("clicked");
            this.lastElementClicked = element;
          }
    });
}
Base.prototype.makeTaskListUpdateOnCalendarClick = function (fn) {
  this.calendarContainer.addEventListener("click", (event) => {
        const element = event.target;
        if(element.tagName === "TD" && element.dataset.clickable !== undefined){
            fn(getDayIndex(element.textContent));
        }
  });
}
Base.prototype.appendToTaskList = function (domString) {
  this.taskList.innerHTML = domString;
};
Base.prototype.addMainMenuButtonHandler =  function () {
    this.mainMenuButton.addEventListener("click", (event) => {
          this.mainMenu.classList.add("stretch");
    })
}
Base.prototype.addHomeButtonHandler =  function () {
    this.homeButton.addEventListener("click", (event) => {
          this.mainMenu.classList.remove("stretch");
    });
}

/*Using a arrow function because it would be cleaner than bind.
When the code in main.js is run and the addMainMenuHandler function is passed from the prototype
this will be implicitly bound to be base (within addMainMenuHandler) and the arrow function
remembers the this value at the time of its creation (base in this case)*/

Base.prototype.addEditAndDeleteButtonHandler  = function (EditButtonFn, DeleteButtonFn) {
    this.taskList.addEventListener("click", function (event) {
          const clickedButton = event.target;
          //if it does not have data-type then we are not interested
          if(clickedButton.dataset.type === "edit"){
            const dayIndex = this.dataset.dayIndex;
            const taskIndex = clickedButton.dataset.arrayIndex;

            EditButtonFn(dayIndex, taskIndex);
          }
          else if(clickedButton.dataset.type === "delete"){
            const dayIndex = this.dataset.dayIndex;
            const taskIndex = clickedButton.dataset.arrayIndex;

            DeleteButtonFn(dayIndex, taskIndex);
          }
    })
}
Base.prototype.setDataAttributeOfTaskList = function (dayIndex){
    this.taskList.dataset.dayIndex = dayIndex;
}
Base.prototype.getActiveDayIndex = function () {
  if(this.lastElementClicked){
    return getDayIndex(this.lastElementClicked.textContent);
  }
  else {
    return -1;
  }
}

function getDayIndex(actualDate) {
  return actualDate - 1;
}

  Application.Base = Base;
  window.Application = Application;

})(window);
