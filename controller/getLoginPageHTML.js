const {validateSession} = require("../model/manageSessions.js");
const createLoginPageFromContext = require("../views/createLoginPageFromContext.js");
const {sendError, getHomePageURI} = require("./helpers.js");
const makeLoginPageStatistics = require("../model/makeLoginPageStatistics.js");

const errorRegex = /errorMessage=([\w\s]+);?/;
const sessionIdRegex = /sessionId=([\w]+);?/;
const offsetRegex = /offset=(-?\w+)/;

module.exports  = function (req, res) {
    let cookiesString = req.headers.cookie;

    if(sessionIdRegex.test(cookiesString) && offsetRegex.test(cookiesString)) {

        validateSession(req, function (err, isValid, username) {
            if(isValid){
              /*Getting the month on the client's end using the offset for those edge cases at the
              start or end of the month */
              let [, offset] = cookiesString.match(offsetRegex);

              res.writeHead(302, {"Location": getHomePageURI(username, offset)});
              res.end();
            }
            else{
              /*the only way this could not be valid is if either the sessionId has expired/is made up by the client because
                we tested the existance of the sessionId beforehand. We absoulutely need to clear the sessionId
                cookie on the client side*/

              makeLoginPageStatistics(function (err, contextObject) {
                if(err){
                  sendError(res, 500, "Internal server error fetching login page statitics");
                  return;
                }

                contextObject.error = "Session expired, please login again";
                createLoginPageFromContext(contextObject, function (err, page) {
                  if(err){
                    sendError(res, 500, "Internal server error reading HTML template");
                    return;
                  }
                  /*Clearing the sessionId cookie because the the session is invalid*/
                  res.writeHead(200, {"Content-Type": "text/html", "Set-Cookie": ["sessionId=; Path=/; HttpOnly", "digest=; Path=/; HttpOnly"]});
                  res.end(page);
                });
              });
            }
        });
    }
    else if(errorRegex.test(cookiesString)){
      let [,errorMessage] = cookiesString.match(errorRegex);
      makeLoginPageStatistics(function (err, contextObject) {
        if(err){
          sendError(res, 500, "Internal server error fetching login page statitics");
          return;
        }

        contextObject.error = errorMessage;
        createLoginPageFromContext(contextObject, function (err, page) {
          if(err){
            sendError(res, 500, "Internal server error reading HTML template");
            return;
          }
          /*Clearing the errorMessage cookie*/
          res.writeHead(200, {"Content-Type": "text/html", "Set-Cookie": "errorMessage=; Path=/login.html; HttpOnly"});
          res.end(page);
        });
      });
    }
    else {
      makeLoginPageStatistics(function (err, contextObject) {
        if(err){
          sendError(res, 500, "Internal server error fetching login page statitics");
          return;
        }

        createLoginPageFromContext(contextObject, function (err, page) {
          if(err){
            sendError(res, 500, "Internal server error reading HTML template");
            return;
          }

          res.writeHead(200, {"Content-Type": "text/html"});
          res.end(page);
        });
      });
    }

}
