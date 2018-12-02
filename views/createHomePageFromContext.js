const handlebars = require("handlebars");
//simply requires a function and calls it
require("./registerHandlebarHelpers.js")();
const fs = require("fs");

module.exports = function (context, cb) {
    //this reads it asynchronously but buffers the entire file
    fs.readFile("./assets/index.html", "utf-8", (err, file) =>{
        if(err){
          cb(err)
          return;
        }

        let compiledFunction = handlebars.compile(file);
        let result = compiledFunction(context);
        cb(null, result);
    });

}
