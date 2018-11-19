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
    let viewAndModel = new ViewAndModel();
        viewAndModel.initializeHandlebars();

    ajaxCommunication.getModel(function (responseText) {
          let responseJSON = JSON.parse(responseText);
          viewAndModel.setModel(responseJSON.data);
          base.makeTaskListUpdateOnCalendarClick(function (dayIndex) {
              let domString = viewAndModel.makeTaskListFromDayIndex(dayIndex);
              base.apppendToTaskList(domString);
          });
        //  viewAndModel.makeTaskListFromDayIndex(0)
    });
    base.addCalendarClickEffect();
    base.addNewTaskHandler(function () {
      taskForm.toggleVisibility();
    });
    base.addMainMenuHandler();
    taskForm.addChangeDateHandler();
    taskForm.addTaskFormClickableHandler();
    taskForm.addFormSubmitHandler(function (queryString, taskDataObject) {
        queryString = ajaxCommunication.addTimezonOffsetToQueryString(queryString);
        ajaxCommunication.sendPOST(queryString, function (response) {
          console.log(`Server successfully saved task ${taskDataObject.taskName}`);
        });
        viewAndModel.addTaskToInternalModel(taskDataObject);
        taskForm.toggleVisibility();
    });

    document.getElementById("check").addEventListener("click", function (e) {
      alert("Clicked");
    })
})(window)
