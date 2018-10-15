const makeHTMLFromModel = require("../views/createHTMLFromModel.js");

module.exports = function (user, res) {
    let date = new Date()
    let month = date.getMonth();
    let year = date.getFullYear();

require("../model/mongoMonthObjectCollection.js").findModel("user2", month, year, function (err, model) {
    if(err){
      console.log(err);
      return;
    }

    if(model === null){
        model = require("../model/createNewDataModel.js")(month, year);
    }

      makeHTMLFromModel(model, (err, result) => {
        if(err){
          console.log(err);
          res.writeHead(500, {"Content-Type": "application/json"});
          let obj = {error: 500, message: "Internal server error processing request"}
          res.end(JSON.stringify(obj))
          return;
        }

        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(result);

      });

});
}
