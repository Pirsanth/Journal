(function (window) {
    let Application = window.Application || {};

    const TASK_LIST_HANDLEBARS_STRING = '{{#each this}}<li><div class="time"><div>{{currentTimeString startDateClient}}</div><div>{{currentTimeString endDateClient}}</div></div><div class="name">{{taskName}}</div><div class="edit"><div class="">Edit</div><div class="">Remove</div></div></li>{{/each}}';
    const ISO_STRING_REGEX = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/;
    let HANDLEBARS_COMPILED_FN = null;

    function ViewAndModel() {
        this.model = null;
    }

    ViewAndModel.prototype.setModel = function (model) {
        this.model = model;
    };
    ViewAndModel.prototype.makeTaskListFromDayIndex = function (dayIndex) {
      let tasksArray = this.model.data.dayArray[dayIndex].tasks;

      if(tasksArray.length !== 0){
        if(!isLocalDatePresent(tasksArray)){
          addLocalDateToObjectsInArray(tasksArray);
        }
        return HANDLEBARS_COMPILED_FN(tasksArray);
      }
      else{
        return "<li>No tasks added yet</li>"
      }

    }
    ViewAndModel.prototype.addTaskToInternalModel = function (dayIndex, startDateClient, endDateClient, taskName) {
        addTaskToModel(this.model, dayIndex, startDateClient, endDateClient, taskName);
    };
    ViewAndModel.prototype.initializeHandlebars = function () {
      Handlebars.registerHelper("currentTimeString", function (dateObj) {
        let hours = dateObj.getHours();
        let minutes = dateObj.getMinutes();
        
        minutes = (minutes<10 && minutes>=0)? `0${minutes}`: minutes;
        return `${hours}:${minutes}`
      });

      HANDLEBARS_COMPILED_FN = Handlebars.compile(TASK_LIST_HANDLEBARS_STRING);
    }
    function parseISOStringToDate (ISOstring) {
        let [,year, month, day, hour, minutes] = ISOstring.match(ISO_STRING_REGEX);
        return new Date(Date.UTC(year, month, day, hour, minutes));
    };
    function addLocalDateToObjectsInArray(tasksArray) {
        tasksArray.forEach(function (obj) {
            obj.startDateClient = parseISOStringToDate(obj.startDateServer);
            obj.endDateClient = parseISOStringToDate(obj.endDateServer);
        });
    }
    function isLocalDatePresent(tasksArray) {
      if(tasksArray[0].startDateClient === undefined){
          return false;
      }
      else {
        return true;
      }
    }
    function addTaskToModel(model, dayIndex, startDateClient, endDateClient, taskName) {
        let obj = {startDateClient, endDateClient, taskName},
            taskArray = model.dayArray[dayIndex].tasks;

            if(!isLocalDatePresent(taskArray)){
              addLocalDateToObjectsInArray(taskArray);
            }

            if(taskArray.length === 0){
              taskArray.push(obj);
            }
            else{
                  for(let i=0; i<taskArray.length; i++){
                    if(taskArray[i].startDateClient < obj.startDateClient){
                      taskArray.splice(i+1, 0, obj);
                      break;
                    }
                    else if(taskArray[i].startDateClient.getTime() === obj.startDateClient.getTime()){
                      taskArray.splice(i, 0, obj);
                      break;
                    }
                    else if(i === taskArray.length -1){
                      taskArray.push(obj);
                    }
                  }
            }
    }

    Application.ViewAndModel = ViewAndModel;
    window.Application = Application;

})(window);
