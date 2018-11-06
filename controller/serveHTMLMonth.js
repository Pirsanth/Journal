const createHTMLFromContext = require("../views/createHTMLFromContext.js");
const sendError = require("./helpers.js").handleError;
const createHandlebarsContextObject = require("../views/createHandlebarsContextObject.js")

module.exports = function (user, month, year, res) {

let context = createHandlebarsContextObject(user, month, year)

    createHTMLFromContext(context, function (err, result) {
        if(err){
          console.log(err);
          sendError(res, 500, "Internal server error reading HTML template");
          return;
        }
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(result);
        console.log("got here")
    })

}
