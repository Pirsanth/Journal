const {sendError, consumeReadStream} = require("./helpers.js");
const ISO_STRING_REGEX = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/;
const findAndReturnDeletedObject = require("../model/deleteTaskObject.js");


module.exports = function (req, res) {

  consumeReadStream(req, function (err, data) {
      if(err){
        sendError(res, 500, "There was an error thrown while reading DELETE request stream");
        return;
      }
      //wrap the JSON.parse in a try catch block
      let obj = JSON.parse(data);
    /*  let queryObject = {startUTCDate: parseISOStringToDate(obj.startDateClient),
                         endUTCDate: parseISOStringToDate(obj.endDateClient),
                         taskName: obj.taskName,
                         user: obj.user};
*/
let queryObject = {startUTCDate: parseISOStringToDate(obj.startDateClient),
                     endUTCDate: parseISOStringToDate(obj.endDateClient),
                     taskName: obj.taskName,
                     user: obj.user};
    findAndReturnDeletedObject(queryObject, function (err, resultObject) {
          if(err){
            sendError(res, 500, "There was an error thrown while attempting delete in database");
            return;
          }

          if(resultObject.value === null){
            sendError(res, 404, "The requested task to delete was not found in the database");
          }
          else{
            res.writeHead(200, {"Content-Type": "application/json"});
            let out = {error: null, data: `Task ${resultObject.value.taskName} was successfully deleted from the server`};
            res.end(JSON.stringify(out));
          }
    });
  });

}

function parseISOStringToDate (ISOstring) {
    let [,year, month, day, hour, minutes] = ISOstring.match(ISO_STRING_REGEX);
    return new Date(Date.UTC(year, month -1, day, hour, minutes));
};
