const makeHTMLFromModel = require("../views/createHTMLFromModel.js");
const database = require("../model/mongoMonthObjectCollection.js");
const sendError = require("./helpers.js").handleError;

module.exports = function (user, res) {
    let date = new Date()
    let month = date.getMonth();
    let year = date.getFullYear();
    let madeNewModel = false;

database.findModel(user, month, year, function (err, model) {
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
          database.saveModel(model, function (err) {
            if(err){
              console.log(`Problem saving model of user named ${user} for ${month}-${year}`);
              return;
            }
          });
        }
      });

});
}
