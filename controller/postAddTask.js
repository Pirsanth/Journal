const {sendError, consumeReadStream} = require("./helpers.js");
const {URLSearchParams: Query} = require("url");
const {insertTaskObject: insertTaskIntoDatabase} = require("../model/manageTasks.js");
const {validateSession} = require("../model/manageSessions.js");

module.exports = function (req, res) {
  validateSession(req, function (err, isValid, sessionUsername) {
      if(err){
        sendError(res, 500, "Error while trying to validate user session");
        return;
      }
      if(isValid){
        consumeReadStream(req, function (err, queryString) {
          if(err){
            sendError(res, 500, "There was an error thrown while reading POST stream");
            return;
          }

          let query = new Query(queryString);
          //add serve-side form validation
          let data = {};
          query.forEach(function (value, key) {
            data[key] = value;
          });

          if(data.username === sessionUsername){
              if(validateAddTaskForm(data)){
                let {startTimeMinutes, startTimeHours, endTimeMinutes, endTimeHours, offset, username, month, year, startDate, endDate, taskName} = data;

                let startMinutesAfterOffset = getMinutesAfterOffset(startTimeMinutes, offset),
                endMinutesAfterOffset = getMinutesAfterOffset(endTimeMinutes, offset);

                let startUTCDate = new Date(Date.UTC(year, month, startDate, startTimeHours, startMinutesAfterOffset));
                let endUTCDate = new Date(Date.UTC(year, month, endDate, endTimeHours, endMinutesAfterOffset));

                let taskObject = {username, startUTCDate, endUTCDate, taskName};

                insertTaskIntoDatabase(taskObject, function (err, resultObject) {
                  if(err){
                    sendError(res, 503, "There was an error thrown while saving taskObject to database");
                    return;
                  }
                  res.writeHead(200, {"Content-Type": "application/json"});
                  let out = {error: null, data: "Task successfully saved"};
                  res.end(JSON.stringify(out));
                });
              }
              else{
                sendError(res, 400, "The form data send to the server was invalid");
              }

          }

          else{
              sendError(res, 403, "You are not authorized to add a task to this user's account");
          }
        });

      }

      else{
        sendError(res, 401, "You need to be logged in to add a task to the database");
      }

  });

}

function getMinutesAfterOffset(minutes, offset) {
    return parseInt(minutes) + parseInt(offset);
}

function validateAddTaskForm(data) {
  //if it can't find the named property within the data object, it will remain undefined;
  let {startTimeMinutes, startTimeHours, endTimeMinutes, endTimeHours, offset, username, month, year, startDate, endDate, taskName} = data;
  let {isInteger} = Number;

    //I repeat checking for username (!username) because I wanted the validation function to be able to be used as a stand alone and not so tightly coupled with the application logic
    if(!startTimeMinutes || !startTimeHours || !endTimeMinutes || !endTimeHours || !offset || !username || !month || !year || !startDate || !endDate || !taskName){
      return false;
    }
    else if (!isInteger(+startTimeMinutes) || !isInteger(+endTimeMinutes) || !isInteger(+startTimeHours) || !isInteger(+endTimeHours) ||
    !isInteger(+startDate) || !isInteger(+endDate) || !isInteger(+month) || !isInteger(+year)) {
      return false;
    }
    else if(+startTimeMinutes>60 || +startTimeMinutes<0 || +endTimeMinutes>60 || +endTimeMinutes<0 ){
      return false;
    }
    else if(+startTimeHours>24 || +startTimeHours<0 || +endTimeHours>24 || +endTimeHours<0 ){
      return false;
    }
    else if(+month>11 || +month<0 || +year<1900){
      return false;
    }
    else if(+startDate<0 || +startDate>maximumPossibleDays(month, year) || +endDate<0 || +endDate>maximumPossibleDays(month, year)){
      return  false;
    }
    else if(new Date(year, month, startDate, startTimeHours, startTimeMinutes) > new Date(year, month, endDate, endTimeHours, endTimeMinutes)){
      return false;
    }
    else{
      return true;
    }
}
function maximumPossibleDays(month, year) {
      +month;
      return new Date(year, month+1, 0).getDate();
}
