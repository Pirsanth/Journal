const BASE_NEW_TASK_BUTTON_SELECTOR = '[data-base="new-task"]';
const BASE_CALENDAR_DATE_CLICKABLE_SELECTOR = '[data-base-calendar = "clickable"]';
const TASK_FORM_SELECTOR = '[data="task-form"]';


addBaseClickableHandler()
addNewTaskHandler();

function addBaseClickableHandler() {
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
}

function addNewTaskHandler() {
      let base_add_task_button = document.querySelector(BASE_NEW_TASK_BUTTON_SELECTOR);
      let form = document.querySelector(TASK_FORM_SELECTOR);


      base_add_task_button.addEventListener("click", function (event) {
        form.classList.toggle("slide");
      })
}
