const {sendError, consumeReadStream, parseISOStringToDate, validateTaskObject} = require("./helpers.js");
const findAndReturnDeletedObject = require("../model/deleteAndReturnTaskObject.js");
const {validateSession} = require("../model/manageSessions.js");

module.exports = function (req, res) {

      validateSession(req, function (err, isValid, sessionUsername) {
            if(isValid){
              consumeReadStream(req, function (err, data) {
                if(err){
                  sendError(res, 500, "There was an error thrown while reading DELETE request stream");
                  return;
                }
                //wrap the JSON.parse in a try catch block
                try{
                  var obj = JSON.parse(data);
                }catch(e){
                  sendError(res, 400, "Improper JSON object sent, could not process request");
                }

                if(obj){
                  if(obj.username === sessionUsername){
                    if(validateTaskObject(obj)){
                      let queryObject = {username: obj.username,
                        startUTCDate: parseISOStringToDate(obj.startDateClient),
                        endUTCDate: parseISOStringToDate(obj.endDateClient),
                        taskName: obj.taskName};

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
                    }
                    else{
                      sendError(res, 400, "The fields in the JSON sent was invalid");
                    }
                  }
                  else{
                      sendError(res, 403, "You are not authorized to delete another users' task");
                  }
                }

                });
            }
            else{
              sendError(res, 401, "You are not logged in access is denied");
            }
      });

}
