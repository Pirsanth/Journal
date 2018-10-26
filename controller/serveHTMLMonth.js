const makeHTMLFromModel = require("../views/createHTMLFromModel.js");
const database = require("../model/mongoMonthObjectCollection.js");
const sendError = require("./helpers.js").handleError;

module.exports = function (user, month, year, res) {
/*    let date = new Date()
let month = date.getMonth();
let year = date.getFullYear();
*/
//so now month and year are strings
let madeNewModel = false;

database.internalFindModel(user, month, year, function (err, model) {

    if(err){
      console.log(err);
      sendError(res, 500, "Internal server error processing page request");
      return;
    }
    if(model === null){
        model = require("../model/createNewDataModel.js")(user, month, year);
        madeNewModel = true;
    }

    makeHTMLFromModel(model, (err, result) => {
        if(err){
          console.log(err);
          sendError(res, 500, "Internal server error processing page request");
          return;
        }

        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(result);

        if(madeNewModel){
          database.saveNewModel(model, function (err, resultObject) {
            if(err){
              console.log(`Problem saving model of user named ${user} for ${month}-${year}`);
              return;
            }
            console.log(`New model for user: ${user} saved for month-year: ${month}-${year}`);
          });
        }
      });

});
}
