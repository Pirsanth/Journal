const database = require("../model/mongoMonthObjectCollection.js");
const sendError = require("./helpers.js").handleError;

module.exports = function (user, month, year, res) {
    console.log(typeof user, typeof month, typeof year)
    database.findModel(user, month, year, function (err, model) {
        if(err){
          console.log(err);
          sendError(res, 500, "Internal server error processing month object request");
          return;
        }

        if(model !== null){
          res.writeHead(200, {"Content-Type": "application/json"});
          let out = {error: null, data: model};
          res.end(JSON.stringify(out));
        }
        else{
          sendError(res, 404, "Requested month object not found in database");
        }
    })
}
