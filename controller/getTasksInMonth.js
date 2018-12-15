const streamTaskObjects = require("../model/streamTaskObjects.js");
const {sendError} = require("./helpers.js");
const {validateSession} = require("../model/manageSessions.js");

module.exports = function (req, username, month, year, offset, res) {
      validateSession(req, function (err, isValid, sessionUsername) {
          if(isValid){
              if(username === sessionUsername){
                month = +month; //explicitly converting the string to a number is needed otherwise the month+1 expression is interpreted as string concatenation

                let startBound = new Date(Date.UTC(year, month, 1, 0, offset));
                let endBound = new Date(Date.UTC(year, month+1, 0, 0, offset));

                //moved error handling to the model because we are already passing the response object into it
                streamTaskObjects(username, startBound, endBound, res);
              }
              else{
                sendError(res, 403, "You are not authorized to access this users' tasks");
              }
          }
          else{
            sendError(res, 401, "You are not currently logged in access is denied");
          }
      });
}
