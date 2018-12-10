const {getActiveSessionObject} = require("../model/manageSessions.js");
const createHomePageFromContext = require("../views/createLoginPageFromContext.js");
const {sendError} = require("./helpers.js");

const errorRegex = /errorMessage=([\w\s]+);?/;
const sessionIdRegex = /sessionId=([\w]+);?/;
const offsetRegex = /offset=(-?\w+)/;

module.exports  = function (req, res) {
    let cookiesString = req.headers.cookie;

    if(sessionIdRegex.test(cookiesString)){
        let [,sessionId] = cookiesString.match(sessionIdRegex);

        getActiveSessionObject(sessionId, function (err, resultObject) {
            /*The below checks if the resultObject is null. Even though the typeof operator on null
            results in a value of object and objects are always true, null is still on the falsy list
            and gets coerced to false when used within a boolean context*/
            if(!resultObject){
              createHomePageFromContext({}, function (err, page) {
                if(err){
                  sendError(res, 500, "Internal server error reading HTML template");
                }
                /*Clearing the sessionId cookie because the the session is invalid*/
                res.writeHead(200, {"Content-Type": "text/html", "Set-Cookie": "sessionId="});
                res.end(page);
              });
            }
            else{
              let username = resultObject.username;

              /*Getting the month on the client's end using the offset for those edge cases at the
               start or end of the month */
              let [, offset] = cookiesString.match(offsetRegex);

              /*In the below I am speeding up the time at Greenwich to match the time at the client, given the timezone offset of
                the client in minutes. Hence, I use the getUTC methods to aquire the client's month and year.*/
              let clientTimestamp = (Date.now() - (parseInt(offset)*60*1000));
              let clientDate = new Date(clientTimestamp);
              let getRequest = `${username}/${clientDate.getUTCMonth()}-${clientDate.getUTCFullYear()}.html`;

              res.writeHead(302, {"Location": getRequest});
              res.end();
            }
        })
    }
    else if(errorRegex.test(cookiesString)){
      let [,errorMessage] = cookiesString.match(errorRegex);
      createHomePageFromContext({error: errorMessage}, function (err, page) {
        if(err){
          sendError(res, 500, "Internal server error reading HTML template");
        }
        /*Clearing the errorMessage cookie*/
        res.writeHead(200, {"Content-Type": "text/html", "Set-Cookie": "errorMessage="});
        res.end(page);
      });
    }
    else {
      createHomePageFromContext({}, function (err, page) {
        if(err){
          sendError(res, 500, "Internal server error reading HTML template");
        }

        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(page);
      });
    }

}
