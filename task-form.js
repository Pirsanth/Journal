const TASK_FORM_ADD_TASK_BUTTON = '[data-task-form = "add-task"]';
const TASK_FORM_CANCEL_TASK_BUTTON = '[data-task-form = "cancel-task"]';
const TASK_FORM_CALENDAR_CONTAINER = '[data-task-form="calendar-container"]';
const TASK_FORM_CHANGE_DATE_BUTTON = '[data-task-form="change-button"]';

const TASK_FORM_CALENDAR_CLICKABLE = '[data-task-form-calendar="clickable"]';
const FORM_CONTROLS_COLLECTION = document.forms[0].elements;

let formCalendar = document.querySelector(TASK_FORM_CALENDAR_CONTAINER);

appendTaskFormCalendar();
addChangeDateHandler();
addClickableHandler();
addFormSubmitHandler();

function appendTaskFormCalendar() {
  let element = document.querySelector('[data-task-form="calendar"]');
  let string = "{{#task-form-calendar this}}<td {{{class}}} {{{data}}} > {{value}}</td>{{/task-form-calendar}}"
  let compiledFunction = Handlebars.compile(string);
  let context = new monthObject(08, 2018);
  element.innerHTML = compiledFunction(context)
}


function addChangeDateHandler() {
  let changeButton = document.querySelector(TASK_FORM_CHANGE_DATE_BUTTON);

changeButton.addEventListener("click", function (event) {
      formCalendar.classList.toggle("expand");
});
}

function addClickableHandler(){
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
