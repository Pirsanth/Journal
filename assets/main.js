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
          let responseJSON = JSON.parse(responseText);
          viewAndModel.setModel(responseJSON.data);
          //make the taskList update thereafter
        //  viewAndModel.makeTaskListFromDayIndex(0)
    });
    base.addCalendarClickEffect();
    //move the below to within getModel
    base.makeTaskListUpdateOnCalendarClick(function (dayIndex) {
        let domString = viewAndModel.makeTaskListFromDayIndex(dayIndex);
        base.setDataAttributeOfTaskList(dayIndex);
        base.appendToTaskList(domString);
    });
    base.addNewTaskHandler(function () {
      taskForm.toggleVisibility();
      taskForm.setMethod("POST");
    });
    base.addMainMenuHandler();
    base.addEditAndDeleteButtonHandler();
    taskForm.addChangeDateButtonHandler();
    taskForm.addCalendarClickHandler();
    //using named anonymous functions on both main.js and taskform.js for greater clarity
    taskForm.addSubmitButtonHandler(
      function POSTfunction(queryString, taskDataObject, index) {
          queryString += "&";
          queryString = ajaxCommunication.addTimezonOffsetToQueryString(queryString);
          console.log(queryString);
          ajaxCommunication.sendPOST(queryString, function (response) {
            console.log(`Server successfully saved task ${taskDataObject.taskName}`);
          });
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
