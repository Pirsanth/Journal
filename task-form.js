const TASK_FORM_ADD_TASK_BUTTON = '[data-task-form = "add-task"]';
const TASK_FORM_CANCEL_TASK_BUTTON = '[data-task-form = "cancel-task"]';
const TASK_FORM_CALENDAR_CONTAINER = '[data-task-form="calendar-container"]';
const TASK_FORM_CHANGE_DATE_BUTTON = '[data-task-form="change-button"]';


function appendTaskFormCalendar() {
  let element = document.querySelector('[data-task-form="calendar"]');
  let string = "{{#task-form-calendar this}}<td {{{class}}} {{{data}}} > {{value}}</td>{{/task-form-calendar}}"
  let compiledFunction = Handlebars.compile(string);
  let context = new monthObject(08, 2018);
  element.innerHTML = compiledFunction(context)
}
appendTaskFormCalendar();
