const sendError = require("./helpers.js").handleError;
const {URLSearchParams: Query} = require("url");
const insertTaskIntoDatabase = require("../model/insertTaskObject.js");


module.exports = function (req, res) {
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
      let {startTimeMinutes, startTimeHours, endTimeMinutes, endTimeHours, offset, user, month, year, startDate, endDate, taskName} = data;

      let startMinutesAfterOffset = getMinutesAfterOffset(startTimeMinutes, offset),
          endMinutesAfterOffset = getMinutesAfterOffset(endTimeMinutes, offset),
          startIndex = getDayIndex(startDate),
          endIndex = getDayIndex(endDate);

      let startUTCDate = new Date(Date.UTC(year, month, startIndex + 1, startTimeHours, startMinutesAfterOffset));
      let endUTCDate = new Date(Date.UTC(year, month, endIndex + 1, endTimeHours, endMinutesAfterOffset));

      let taskObject = {user, startUTCDate, endUTCDate, taskName};

      insertTaskIntoDatabase(taskObject, function (err, resultObject) {
          if(err){
            sendError(res, 503, "There was an error thrown while saving taskObject to database");
            return;
          }
          res.writeHead(200, {"Content-Type": "application/json"});
          let out = {error: null, data: "task successfully saved"};
          res.end(JSON.stringify(out));
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
