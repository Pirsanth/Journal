const createHomePageFromContext = require("../views/createHomePageFromContext.js");
const {sendError} = require("./helpers.js");
const createHomePageContextObject = require("../views/createHomePageContextObject.js")
const {validateSession} = require("../model/manageSessions.js");

module.exports = function (req, username, month, year, res) {

    validateSession(req, function (err, isValid, sessionUsername) {
      if(err){
        sendError(res, 500, "Error while trying to validate user session");
        return;
      }

      if(isValid){

        if(username === sessionUsername){
            let context = createHomePageContextObject(username, month, year)

            createHomePageFromContext(context, function (err, result) {
              if(err){
                console.log(err);
                sendError(res, 500, "Internal server error reading HTML template");
                return;
              }
              res.writeHead(200, {"Content-Type": "text/html"});
              res.end(result);
            });
        }
        else{
            sendError(res, 403, "You are not authorized to view the requested resource");
            return;
        }
      }

      else{
        /*not valid if either there is no sessionId cookie with the request or the id has expired (no document
          on the database). We clear cookie on the client side just incase it is the latter case */
        res.writeHead(302, {"Location": "../login.html", "Set-Cookie": ["errorMessage=Not logged in please login to view resource; Path=/login.html; HttpOnly", "sessionId=; Path=/; HttpOnly"]});
        res.end();
      }
    });

}
