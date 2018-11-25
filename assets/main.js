(function (window) {
    "use strict"

    let Base = window.Application.Base;
    let TaskForm = window.Application.TaskForm;
    let AjaxCommunication = window.Application.AjaxCommunication;
    let ViewAndModel = window.Application.ViewAndModel;

    let base = new Base();
    let taskForm = new TaskForm();
    let userDataObject = taskForm.getUserData();
    let ajaxCommunication = new AjaxCommunication(userDataObject);
    let viewAndModel = new ViewAndModel(userDataObject);
        viewAndModel.initializeHandlebars();

    ajaxCommunication.getModel(function (responseText) {
        //put into a try catch block later
        //the dates have already been sorted on the server so we can just push it onto the index of the array one after the other

          let arrayOfTasksInMonth = JSON.parse(responseText);
          viewAndModel.parseAndAddToModel(arrayOfTasksInMonth);
          //only after we processed the tasks from the server can the task list be shown
          base.makeTaskListUpdateOnCalendarClick(function (dayIndex) {
              let domString = viewAndModel.makeTaskListFromDayIndex(dayIndex);
              base.setDataAttributeOfTaskList(dayIndex);
              base.appendToTaskList(domString);
          });

        //  viewAndModel.makeTaskListFromDayIndex(0)
    });
    base.addCalendarClickEffect();

    base.addNewTaskHandler(function () {
      taskForm.toggleVisibility();
      taskForm.setMethod("POST");
    });
    base.addMainMenuHandler();
    base.addEditAndDeleteButtonHandler(
      function EditButton(dayIndex, taskIndex) {
        const [removedTaskObj] = viewAndModel.removeTaskFromModelAndReturn(dayIndex, taskIndex);
        taskForm.prefillFormWithObject(removedTaskObj);
    },
      function DeleteButton(dayIndex, taskIndex) {
        const [removedTaskObj] = viewAndModel.removeTaskFromModelAndReturn(dayIndex, taskIndex);
        //the below is a reference copy so we do not need to save the returned, modified object in another variable
        ajaxCommunication.addUserToInternalTaskObject(removedTaskObj);
        ajaxCommunication.sendDELETE(removedTaskObj);

        //we have to remake the taskList instead of just using removeChild on the li because of the arrayIndex property
        let domString = viewAndModel.makeTaskListFromDayIndex(dayIndex);
        base.appendToTaskList(domString);
    });
    taskForm.addChangeDateButtonHandler();
    taskForm.addCalendarClickHandler();
    //using named anonymous functions on both main.js and taskform.js for greater clarity
    taskForm.addSubmitButtonHandler(
      function POSTfunction(queryString, taskDataObject, index) {
          queryString += "&";
          queryString = ajaxCommunication.addTimezonOffsetToQueryString(queryString);
          console.log(queryString);
          ajaxCommunication.sendPOST(queryString);
          viewAndModel.pushTaskToModel(index, taskDataObject);
          viewAndModel.sortModelAtIndex(index);
          taskForm.toggleVisibility();
      },
      function PUTfunction() {

      }
    );

    document.getElementById("check").addEventListener("click", function (e) {
      alert("Clicked");
    })
})(window)
