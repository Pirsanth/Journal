const {sendError} = require("./helpers.js");
const {findAndDeleteSession} = require("../model/manageSessions.js");
const sessionIdRegex = /sessionId=([\w]+);?/;
/*Can't use manageSessions.validateSession because it does not differentiate
between sessionId not found in header and sessionId not active.
*/



module.exports = function (req, res) {
  let cookiesString = req.headers.cookie;

  if(sessionIdRegex.test(cookiesString)){
    var [,sessionId] = cookiesString.match(sessionIdRegex);
    findAndDeleteSession(sessionId, function (err, wasDeleted) {
        if(wasDeleted){
          res.writeHead(302, {"Location": "./login.html", "Set-Cookie":
                              ["errorMessage=Successfully logged out; Path=/login.html; HttpOnly",
                              "sessionId=; Path=/; HttpOnly"]});
          res.end();
        }
        else{
          sendError(res, 404, "SessionId to remove was not found in the database");
        }
    });
  }
  else{
    sendError(res, 401, "SessionId not found in the cookie sent");
  }
}
