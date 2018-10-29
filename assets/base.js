(function (window) {
  "use strict";
  //test to see whether the scope of the prototype function is shared
  let Application = window.Application || {};

const BASE_NEW_TASK_BUTTON_SELECTOR = '[data-base="new-task"]';
const BASE_CALENDAR_DATE_CLICKABLE_SELECTOR = '[data-base-calendar = "clickable"]';
const TASK_FORM_SELECTOR = '[data="task-form"]';
const BASE_TASK_LIST_SELECTOR = '[data-base="task-list"]';
let lastElementClicked = null;
let active_day_index = null;
let task_list_update_callback = null;

function Base() {
    this.new_task_button = document.querySelector(BASE_NEW_TASK_BUTTON_SELECTOR);
    this.clickable_node_list = document.querySelectorAll(BASE_CALENDAR_DATE_CLICKABLE_SELECTOR);
    this.taskList = document.querySelector(BASE_TASK_LIST_SELECTOR);
}

Base.prototype.addNewTaskHandler = function (fn) {
    this.new_task_button.addEventListener("click", function (event) {
            fn();
    });
}

Base.prototype.addCalendarClickEffect = function () {
    let clickable_node_list = this.clickable_node_list

        for(let i = 0; i< clickable_node_list.length; i++){
          clickable_node_list[i].addEventListener("click", toggleClickedClass);
        }
}
Base.prototype.makeTaskListUpdateOnCalendarClick = function (fn) {
    let nodeList = this.clickable_node_list
    task_list_update_callback = fn;

    nodeList.forEach(function (element) {
      element.addEventListener("click",  taskListUpdateListener);
    });
}
Base.prototype.apppendToTaskList = function (domString) {
  this.taskList.innerHTML = domString;
};

function toggleClickedClass(event) {
  if(lastElementClicked){
    lastElementClicked.classList.remove("clicked");
  }
  event.target.classList.add("clicked");
  lastElementClicked = event.target;
}
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
