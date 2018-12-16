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
    });
    base.addCalendarClickEffect();
    base.addNewTaskHandler(function (taskDate) {
      taskForm.toggleVisibility();
      taskForm.preFillDates(taskDate)
      taskForm.setInternalState("POST");
    });
    base.addMainMenuHandler();
    base.addEditAndDeleteButtonHandler(
      function EditButton(dayIndex, taskIndex) {
        const taskObject = viewAndModel.getTaskFromModel(dayIndex, taskIndex);
        taskForm.prefillFormWithObject(taskObject);
        taskForm.setInternalState("PUT", dayIndex, taskIndex);
        taskForm.toggleVisibility();
    },
      function DeleteButton(dayIndex, taskIndex) {
        const [removedTaskObj] = viewAndModel.removeTaskFromModelAndReturn(dayIndex, taskIndex);
        //the below is a reference copy so we do not need to save the returned, modified object in another variable
        ajaxCommunication.addUserToInternalTaskObject(removedTaskObj);
        ajaxCommunication.sendDELETE(removedTaskObj);

        //we have to remake the taskList instead of just using removeChild on the li because of the arrayIndex dataset property
        let domString = viewAndModel.makeTaskListFromDayIndex(dayIndex);
        base.appendToTaskList(domString);
    });
    taskForm.addChangeDateButtonHandler();
    taskForm.addCalendarClickHandler();
    //using named anonymous functions on both main.js and taskform.js for greater clarity
    /*I repeated the code to clean up the form in both callbacks because I decided that it would be better to
    eliminate the unseen side-effects of function calls rather than being a bit more DRY*/
    taskForm.addSubmitButtonHandler(
      function POSTfunction(queryString, taskDataObject, index) {
          queryString += "&";
          queryString = ajaxCommunication.addTimezonOffsetToQueryString(queryString);
          ajaxCommunication.sendPOST(queryString);
          viewAndModel.pushTaskToModel(index, taskDataObject);
          viewAndModel.sortModelAtIndex(index);
          taskForm.toggleVisibility();
          taskForm.clearInternalStateAndForm();

          //we can't reuse index because we cannot assume that the task has been added on the same date as is selected in the base calendar
          let baseDayIndex = base.getActiveDayIndex();
          //user could've just hit add new task immediately. The empty string is implicitly coerced to false

          //I made base.getActiveDayIndex() return -1 in the case of false and used ~ in the if statement so that baseDayIndex 0 (day 1) would be considered truthy
          if(~baseDayIndex){
            let domString = viewAndModel.makeTaskListFromDayIndex(baseDayIndex);
            base.setDataAttributeOfTaskList(baseDayIndex);
            base.appendToTaskList(domString);
          }
      },
      function PUTfunction(newTaskObject, dayIndex, taskIndex) {
          let [oldTaskObject] = viewAndModel.removeTaskFromModelAndReturn(dayIndex, taskIndex);
          let indexOfNewTask = newTaskObject.startDateClient.getDate() -1;
          viewAndModel.pushTaskToModel(indexOfNewTask, newTaskObject);
          viewAndModel.sortModelAtIndex(indexOfNewTask);

          ajaxCommunication.addUserToInternalTaskObject(oldTaskObject);
          ajaxCommunication.addUserToInternalTaskObject(newTaskObject);
          ajaxCommunication.sendPUT(oldTaskObject, newTaskObject);
          taskForm.toggleVisibility();
          taskForm.clearInternalStateAndForm();

          /*the if statement will always be true in this case. Indeed I could just the dayIndex
            because it would be equal to baseDayIndex. I have however decided to repeat myself
            because I might want to abstract the below away in the future */
          let baseDayIndex = base.getActiveDayIndex();
          if(~baseDayIndex){
            let domString = viewAndModel.makeTaskListFromDayIndex(baseDayIndex);
            base.setDataAttributeOfTaskList(baseDayIndex);
            base.appendToTaskList(domString);
          }
      }
    );
    taskForm.addCancelButtonHandler(function () {
      taskForm.toggleVisibility();
      taskForm.clearInternalStateAndForm();
    });

})(window)
