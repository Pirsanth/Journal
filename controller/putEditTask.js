const {sendError, consumeReadStream, parseISOStringToDate} = require("./helpers.js");
const replaceAndReturnOldTaskObject = require("../model/replaceAndReturnOldTaskObject.js");

module.exports = function (req, res) {
    consumeReadStream(req, function (err, data) {
        if(err){
          sendError(res, 500, "There was an error thrown while reading PUT stream");
          return;
        }
          //place in a try catch block
          data = JSON.parse(data);

         let oldTaskObject = {startUTCDate: parseISOStringToDate(data.oldTaskObject.startDateClient),
                              endUTCDate: parseISOStringToDate(data.oldTaskObject.endDateClient),
                              taskName: data.oldTaskObject.taskName,
                              user: data.oldTaskObject.user};

        let newTaskObject = {startUTCDate: parseISOStringToDate(data.newTaskObject.startDateClient),
                             endUTCDate: parseISOStringToDate(data.newTaskObject.endDateClient),
                             taskName: data.newTaskObject.taskName,
                             user: data.newTaskObject.user};


         replaceAndReturnOldTaskObject(oldTaskObject, newTaskObject, function (err, resultObject) {
           if(err){
             console.log(err);
             sendError(res, 500, "There was an error thrown while attempting replace in database");
             return;
           }

           if(resultObject.value === null){
             sendError(res, 404, "The requested task to edit was not found in the database");
           }
           else{
             res.writeHead(200, {"Content-Type": "application/json"});
             let out = {error: null, data: `Task object ${JSON.stringify(resultObject.value)}, was successfully change to ${JSON.stringify(newTaskObject)}`};
             res.end(JSON.stringify(out));
           }

         });

    });
}
