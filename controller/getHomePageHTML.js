const createHomePageFromContext = require("../views/createHomePageFromContext.js");
const {sendError} = require("./helpers.js");
const createHomePageContextObject = require("../views/createHomePageContextObject.js")

module.exports = function (user, month, year, res) {

let context = createHomePageContextObject(user, month, year)

    createHomePageFromContext(context, function (err, result) {
        if(err){
          console.log(err);
          sendError(res, 500, "Internal server error reading HTML template");
          return;
        }
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(result);
    })

}
