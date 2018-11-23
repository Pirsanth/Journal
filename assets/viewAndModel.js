(function (window) {
    let Application = window.Application || {};

    const TASK_LIST_HANDLEBARS_STRING = '{{#each this}}<li><div class="time"><div>{{currentTimeString startDateClient}}</div><div>{{currentTimeString endDateClient}}</div></div><div class="name">{{taskName}}</div><div class="edit"><div class="" data-type="edit" data-array-index={{@index}}>Edit</div><div class="" data-type="delete" data-array-index={{@index}}>Remove</div></div></li>{{/each}}';
    const ISO_STRING_REGEX = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/;
    let HANDLEBARS_COMPILED_FN = null;

    function ViewAndModel({user, month, year}) {
        let lastDate = new Date(year, month+1, 0);
        let numberOfDays = lastDate.getDate();
        const arr = [];

        /*this is to avoid a sparse array because an array that has empty elements behaves oddly
        eg. different than when compared to explicitly setting a value of undefined at the specified index */

        for(let i=0; i<numberOfDays; i++){
            arr.push({tasks: []});
        }
        this.model = arr;
        window.z = arr;
    }

    ViewAndModel.prototype.setModel = function (model) {
        this.model = model;
    };
    ViewAndModel.prototype.makeTaskListFromDayIndex = function (dayIndex) {
      let tasksArray = this.model[dayIndex].tasks;

      if(tasksArray.length !== 0){
          return HANDLEBARS_COMPILED_FN(tasksArray);
      }
      else{
        return "<li>No tasks added yet</li>"
      }
    }
    ViewAndModel.prototype.addTaskToInternalModel = function (taskDataObject) {
        addTaskToModelThenSort(this.model, taskDataObject);
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
    ViewAndModel.prototype.sortModelAtIndex = function (dayIndex) {
        let tasksArray = this.model[dayIndex].tasks;
        if(tasksArray.length === 1){return;}

        tasksArray.sort(function (a, b) {
            return a.startDateClient.getTime() - b.startDateClient.getTime();
        });

    }
    ViewAndModel.prototype.pushTaskToModel = function (index, taskDataObject) {
        this.model[index].tasks.push(taskDataObject);
    };
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

  /*
    function addTaskToModelThenSort(model, {dayIndex, startDateClient, endDateClient, taskName}) {
        let obj = {startDateClient, endDateClient, taskName},
            //decided to forgo the 2-D array for an internal tasks object containing an array of tasks, seemes much clearer
            tasksArray = model[dayIndex].tasks;

            if(tasksArray.length !==0){
              if(!isLocalDatePresent(tasksArray)){
                addLocalDateToObjectsInArray(tasksArray);
              }
              tasksArray.push(obj);
              tasksArray.sort(function (a, b) {
                  return a.startDateClient.getTime() - b.startDateClient.getTime();
              });
            }
            else {
              tasksArray.push(obj);
            }
    }
    */

    Application.ViewAndModel = ViewAndModel;
    window.Application = Application;

})(window);
