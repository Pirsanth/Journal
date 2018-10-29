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

    ajaxCommunication.getModel(function (model) {
          model = JSON.parse(model);
          viewAndModel.setModel(model);
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
