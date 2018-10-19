(function (window) {
    "use strict"

    let Base = window.Application.Base;
    let TaskForm = window.Application.TaskForm;

    let base = new Base();
    let taskForm = new TaskForm();

    base.addBaseCalendarClickableHandler();
    base.addNewTaskHandler(function () {
      taskForm.toggleVisibility();
    });
    taskForm.addChangeDateHandler();
    taskForm.addTaskFormClickableHandler();

})(window)
