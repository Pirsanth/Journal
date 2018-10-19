(function (window) {
  "use strict";
  //test to see whether the scope of the prototype function is shared
  let Application = window.Application || {};

const BASE_NEW_TASK_BUTTON_SELECTOR = '[data-base="new-task"]';
const BASE_CALENDAR_DATE_CLICKABLE_SELECTOR = '[data-base-calendar = "clickable"]';
const TASK_FORM_SELECTOR = '[data="task-form"]';

function Base() {
    this.new_task_button = document.querySelector(BASE_NEW_TASK_BUTTON_SELECTOR);
    this.clickable_node_list = document.querySelectorAll(BASE_CALENDAR_DATE_CLICKABLE_SELECTOR);
}

Base.prototype.addNewTaskHandler = function (fn) {
    this.new_task_button.addEventListener("click", function (event) {
            fn();
    });
}

Base.prototype.addBaseCalendarClickableHandler = function () {
    let clickable_node_list = this.clickable_node_list
    let lastElementClicked = null;

        for(let i = 0; i< clickable_node_list.length; i++){

          clickable_node_list[i].addEventListener("click", function (event) {
            if(lastElementClicked){
              lastElementClicked.classList.remove("clicked");
            }
            event.target.classList.add("clicked");
            lastElementClicked = event.target;
          })
        }
}


/*
addBaseClickableHandler()
addNewTaskHandler();

function addBaseClickableHandler() {
      let clickable_node_list = document.querySelectorAll(BASE_CALENDAR_DATE_CLICKABLE_SELECTOR);
      let lastElementClicked = null;

          for(let i = 0; i< clickable_node_list.length; i++){

            clickable_node_list[i].addEventListener("click", function (event) {
              if(lastElementClicked){
                lastElementClicked.classList.remove("clicked");
              }
              event.target.classList.add("clicked");
              lastElementClicked = event.target;
            })
          }
}

function addNewTaskHandler() {
      let base_add_task_button = document.querySelector(BASE_NEW_TASK_BUTTON_SELECTOR);
      let form = document.querySelector(TASK_FORM_SELECTOR);

      base_add_task_button.addEventListener("click", function (event) {
        form.classList.toggle("slide");
      })
}

*/

  Application.Base = Base;
  window.Application = Application;

})(window);
