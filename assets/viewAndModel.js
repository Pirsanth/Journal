(function (window) {
    let Application = window.Application || {};

    const TASK_LIST_HANDLEBARS_STRING = '{{#each this}}<li><div class="time"><div>{{currentTimeString startDateClient}}</div><div>{{currentTimeString endDateClient}}</div></div><div class="name">{{taskName}}</div><div class="edit"><div class="" data-type="edit" data-array-index={{@index}}>Edit</div><div class="" data-type="delete" data-array-index={{@index}}>Remove</div></div></li>{{/each}}';
    const ISO_STRING_REGEX = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/;
    let HANDLEBARS_COMPILED_FN = null;

    function ViewAndModel({user, month, year}) {
        month = +month;
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

    ViewAndModel.prototype.makeTaskListFromDayIndex = function (dayIndex) {
      let tasksArray = this.model[dayIndex].tasks;

      if(tasksArray.length !== 0){
          return HANDLEBARS_COMPILED_FN(tasksArray);
      }
      else{
        return "<li>No tasks added yet</li>"
      }
    }
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
    ViewAndModel.prototype.parseAndAddToModel = function (arrayOfTasksInMonth) {
        arrayOfTasksInMonth.forEach(function (obj) {

          let objectToInsert = {startDateClient: parseISOStringToDate(obj.startUTCDate),
                                endDateClient: parseISOStringToDate(obj.endUTCDate),
                                taskName: obj.taskName}
          let index = objectToInsert.startDateClient.getDate() - 1;
          //no need to sort because it has already been sorted by the server
          this.pushTaskToModel(index, objectToInsert);
        }, this);
    };
    ViewAndModel.prototype.removeTaskFromModelAndReturn = function (dayIndex, taskIndex) {
        return this.model[dayIndex].tasks.splice(taskIndex, 1);
    }
    function parseISOStringToDate (ISOstring) {
        let [,year, month, day, hour, minutes] = ISOstring.match(ISO_STRING_REGEX);
        return new Date(Date.UTC(year, month -1, day, hour, minutes));
    };


    Application.ViewAndModel = ViewAndModel;
    window.Application = Application;

})(window);
