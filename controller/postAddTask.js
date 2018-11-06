const sendError = require("./helpers.js").handleError;
const {URLSearchParams: Query} = require("url");
const database = require("../model/mongoMonthObjectCollection.js");

module.exports = function (req, res) {
  consumeReadStream(req, function (err, queryString) {
      if(err){
        sendError(res, 500, "There was an error thrown while reading POST stream");
        return;
      }

      let query = new Query(queryString);
      //serve-side form validation
      let data = {};
      query.forEach(function (value, key) {
        data[key] = value;
      });
      let {startTimeMinutes, startTimeHours, endTimeMinutes, endTimeHours, offset, user, month, year, taskDate, taskName} = data;

      let startMinutesAfterOffset = getMinutesAfterOffset(startTimeMinutes, offset),
          endMinutesAfterOffset = getMinutesAfterOffset(endTimeMinutes, offset)
          dayIndex = getDayIndex(taskDate);

      let startDateServer = new Date(Date.UTC(year, month, dayIndex + 1, startTimeHours, startMinutesAfterOffset));
      let endDateServer = new Date(Date.UTC(year, month, dayIndex + 1, endTimeHours, endMinutesAfterOffset));

      database.internalFindModel(user, month, year, function (err, model) {
          if(err){
            sendError(res, 500, `Error thrown while trying to access database`);
            return;
          }
          else if(model === null){
            sendError(res, 404, `Data for user (${user}) with given month (${month}) and year (${year}) not found`);
            return;
          }
          //do not need an else because there are return statements after sending errors

          //I do not use a return value because model is an object and it will be passed and modified by reference
          addTaskToModelThenSort(model, dayIndex, startDateServer, endDateServer, taskName);

          database.updateDayArray(user, month, year, dayIndex, model.dayArray[dayIndex].tasks, function (err, resultObject) {
              if(err){
                sendError(res, 500, "Error updating model with POST data");
                return;
              }
              let obj = {error: null, data: "Task successfully saved"};
              res.writeHead(200, {"Content-Type": "application/json"});
              res.end(JSON.stringify(obj));
          });


      });
  });

}

function consumeReadStream(stream, fn) {
  let queryString = "";

  stream.on("data", function (chunk) {
    queryString += chunk;
  });
  stream.on("error", function (err) {
    console.log(err);
    fn(err);
  })
  stream.on("end", function () {
    fn(null, queryString);
  });
}
function getMinutesAfterOffset(minutes, offset) {
    return parseInt(minutes) + parseInt(offset);
}
function getDayIndex(taskDate) {
  let endPosition = taskDate.indexOf("s")
  let actualDate = taskDate.substring(0, endPosition);
  let dateFromZeroIndex = actualDate - 1;
  return dateFromZeroIndex;
}
function addTaskToModelThenSort(model, dayIndex, startDateServer, endDateServer, taskName) {
    let obj = {startDateServer, endDateServer, taskName},
        tasksArray = model.dayArray[dayIndex].tasks;

        tasksArray.push(obj)
        if(tasksArray.length > 1){
          tasksArray.sort(function (a, b) {
              return a.startDateServer.getTime() - b.startDateServer.getTime();
          });
      }
/*
        if(taskArray.length === 0){
          taskArray.push(obj);
        }
        else{
              for(let i=0; i<tasksArray.length; i++){
                if(taskArray[i].startDateServer < obj.startDateServer){
                  taskArray.splice(i+1, 0, obj);
                  break;
                }
                else if(taskArray[i].startDateServer.getTime() === obj.startDateServer.getTime()){
                  taskArray.splice(i, 0, obj);
                  break;
                }
                else if(i === taskArray.length -1){
                  taskArray.push(obj);
                  break;
                }
              }
        }
  */
}
