const fs = require("fs");
const handlebars = require("handlebars");

module.exports = function (context, cb) {
  fs.readFile("./assets/login.html", "utf-8", (err, file) =>{
      if(err){
        cb(err);
        return;
      }

      let compiledFunction = handlebars.compile(file);
      let result = compiledFunction(context);
      cb(null, result);
  });


}
