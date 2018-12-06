const {sendError, consumeReadStream, parseISOStringToDate} = require("./helpers.js");
const findAndReturnDeletedObject = require("../model/deleteAndReturnTaskObject.js");


module.exports = function (req, res) {

  consumeReadStream(req, function (err, data) {
      if(err){
        sendError(res, 500, "There was an error thrown while reading DELETE request stream");
        return;
      }
      //wrap the JSON.parse in a try catch block
      let obj = JSON.parse(data);

      let queryObject = {startUTCDate: parseISOStringToDate(obj.startDateClient),
                         endUTCDate: parseISOStringToDate(obj.endDateClient),
                         taskName: obj.taskName,
                         username: obj.username};

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
