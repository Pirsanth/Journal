const {sendError, consumeReadStream, parseISOStringToDate, validateTaskObject} = require("./helpers.js");
const replaceAndReturnOldTaskObject = require("../model/replaceAndReturnOldTaskObject.js");
const {validateSession} = require("../model/manageSessions.js");

module.exports = function (req, res) {
    validateSession(req, function (err, isValid, sessionUsername) {
        if(isValid){
          consumeReadStream(req, function (err, streamData) {
            if(err){
              sendError(res, 500, "There was an error thrown while reading PUT stream");
              return;
            }
            try{
              var data = JSON.parse(streamData);
            }catch(e){
              sendError(res, 400, "Improper JSON object sent, could not process request");
            }

            if(data){
              if((data.oldTaskObject.username===data.newTaskObject.username) && (data.oldTaskObject.username===sessionUsername)){
                if(validateTaskObject(data.oldTaskObject) && validateTaskObject(data.newTaskObject)){

                  let oldTaskObject = {username: data.oldTaskObject.username,
                    startUTCDate: parseISOStringToDate(data.oldTaskObject.startDateClient),
                    endUTCDate: parseISOStringToDate(data.oldTaskObject.endDateClient),
                    taskName: data.oldTaskObject.taskName
                  };

                  let newTaskObject = {username: data.newTaskObject.username,
                    startUTCDate: parseISOStringToDate(data.newTaskObject.startDateClient),
                    endUTCDate: parseISOStringToDate(data.newTaskObject.endDateClient),
                    taskName: data.newTaskObject.taskName
                  };


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

                }
                else{
                    sendError(res, 400, "The fields in the JSON sent was invalid");
                }
              }
              else{
                sendError(res, 403, "You are not authorized to change the user of your task or edit another user's tasks");
              }
            }

          });

        }
        else{
          sendError(res, 401, "You are not logged in access is denied");
        }
    });
}
