const makeHTMLFromModel = require("../views/createHTMLFromModel.js");

module.exports = function (res) {
    let date = new Date()
    let month = date.getMonth();
    let year = date.getFullYear();
    var model = require("../model/createNewDataModel.js")(month, year);
//    console.log(model)

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
}
