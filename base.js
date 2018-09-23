function appendBaseCalendar(){
     let element = document.querySelector('[data-base="calendar"]')


    var string = "{{#base-calendar this}}<td {{{class}}} {{{data}}} > {{value}}</td>{{/base-calendar}}";

    var compiledFunction = Handlebars.compile(string);

    var context = new monthObject(08, 2018);


    element.innerHTML = compiledFunction(context)

}
appendBaseCalendar();

function monthObject (month, year) {
  let startingDate = new Date(year, month, 1);
  this.startIndex = startingDate.getDay();

  let lastDate = new Date(year, month+1, 0);
  let numberOfDays = lastDate.getDate();
  let dayArray = [];

  for(let i=0; i< numberOfDays; i++){
    let object = {tasks:[]}
    dayArray.push(object);
  }
  this.dayArray = dayArray;
}

const BASE_NEW_TASK_BUTTON_SELECTOR = '[data-base="new-task"]';
const BASE_CALENDAR_DATE_CLICKABLE_SELECTOR = '[data-base-calendar = "clickable"]';
const TASK_FORM_SELECTOR = '[data="task-form"]';

let base_add_task_button = document.querySelector(BASE_NEW_TASK_BUTTON_SELECTOR);
let clickable_Node_List = document.querySelectorAll(BASE_CALENDAR_DATE_CLICKABLE_SELECTOR);
let lastElementClicked = null;

for(let i = 0; i< clickable_Node_List.length; i++){

  clickable_Node_List[i].addEventListener("click", function (event) {
    if(lastElementClicked){
      lastElementClicked.classList.remove("clicked");
    }
    event.target.classList.add("clicked");
    lastElementClicked = event.target;
  })
}
let form = document.querySelector(TASK_FORM_SELECTOR);

base_add_task_button.addEventListener("click", function (event) {
      toggleForm();
})
function toggleForm() {
  form.classList.toggle("slide");
}
