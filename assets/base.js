(function (window) {
  "use strict";
  //test to see whether the scope of the prototype function is shared
  let Application = window.Application || {};

const NEW_TASK_BUTTON_SELECTOR = '[data-base-new-task-button]';
const TASK_LIST_SELECTOR = '[data-base-task-list]';
const MAIN_MENU_BUTTON_SELECTOR = '[data-base-main-menu-button]';
const MAIN_MENU_CONTAINER_SELECTOR = '[data-main-menu-container]';
const CALENDAR_CONTAINER_SELECTOR = '[data-base-calendar]'

function Base() {
    this.new_task_button = document.querySelector(NEW_TASK_BUTTON_SELECTOR);
    this.taskList = document.querySelector(TASK_LIST_SELECTOR);
    this.mainMenu = document.querySelector(MAIN_MENU_CONTAINER_SELECTOR);
    this.mainMenuButton = document.querySelector(MAIN_MENU_BUTTON_SELECTOR);
    this.calendarContainer = document.querySelector(CALENDAR_CONTAINER_SELECTOR);
    /*did not see the point in creating a new module to include just the
      toggleVisibility method for the main menu
      (for consistency with the naming of taskForm.toggleVisibility)
    */
}

Base.prototype.addNewTaskHandler = function (fn) {
    this.new_task_button.addEventListener("click", function (event) {
            fn();
    });
}

Base.prototype.addCalendarClickEffect = function () {
  let lastElementClicked = null;

  this.calendarContainer.addEventListener("click", (event) => {
        const element = event.target;
        if(element.tagName === "TD" && element.dataset.clickable !== undefined){
          if(lastElementClicked){
            lastElementClicked.classList.remove("clicked");
          }
          element.classList.add("clicked");
          lastElementClicked = element;
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
Base.prototype.addMainMenuHandler =  function () {
    this.mainMenuButton.addEventListener("click", (event) => {
          this.mainMenu.classList.toggle("stretch");
    })
}
Base.prototype.addEditAndDeleteButtonHandler  = function (EditButtonFn, DeleteButtonFn) {
    this.taskList.addEventListener("click", function (event) {
          const clickedButton = event.target;

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
/*using a arrow function because it would be cleaner than bind.
When the code in main.js is run and the addMainMenuHandler function is passed from the prototype
this will be implicitly bound to be base (within addMainMenuHandler) and the arrow function remembers the this value
at the time of its creation (base in this case)*/

function taskListUpdateListener(event) {
  let dayIndex = getDayIndex(event.target.textContent);
  active_day_index = dayIndex;
  task_list_update_callback(dayIndex);
}
function getDayIndex(taskDate) {
  let endPosition = taskDate.indexOf("s")
  let actualDate = taskDate.substring(0, endPosition);
  let dateFromZeroIndex = actualDate - 1;
  return dateFromZeroIndex;
}


  Application.Base = Base;
  window.Application = Application;

})(window);
