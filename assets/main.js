(function (window) {
    "use strict"

    let Base = window.Application.Base;
    let TaskForm = window.Application.TaskForm;
    let AjaxCommunication = window.Application.AjaxCommunication;

    let base = new Base();
    let taskForm = new TaskForm();
    let userDataObject = taskForm.getUserData();
    let ajaxCommunication = new AjaxCommunication(userDataObject);


    ajaxCommunication.getModel();
    base.addBaseCalendarClickableHandler();
    base.addNewTaskHandler(function () {
      taskForm.toggleVisibility();
    });
    taskForm.addChangeDateHandler();
    taskForm.addTaskFormClickableHandler();
    taskForm.addFormSubmitHandler(function (queryString) {
        queryString = ajaxCommunication.addTimezonOffsetToQueryString(queryString);
        ajaxCommunication.sendPOST(queryString, function (response) {
          console.log(`Success this is the response: ${response}`);
        });
        taskForm.toggleVisibility();
    });

})(window)
