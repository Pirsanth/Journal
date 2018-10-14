const handlebars = require("handlebars");
//simply requires a function and calls it
require("./registerHandlebarHelpers.js")();
const fs = require("fs");
//let html = require("../assets/index.html");

module.exports = function (model, cb) {
    //this reads it asynchronously but buffers the entire file
    fs.readFile("./assets/index.html", "utf-8", (err, file) =>{
        if(err){
          cb(err)
          return;
        }

        let compiledFunction = handlebars.compile(file);
        let result = compiledFunction(model);
        cb(null, result);
    });

}








/*
module.exports = function (model) {

    readFile("./assets/index.html", (file) =>{
        let compiledFunction = handlebars.compile(file);
        return compiledFunction(model);
    })

}

function readFile(path, fn) {
    let readable = fs.createReadStream(path, "utf-8");
    let file = "";

    readable.on("data", function (chunk) {
        file += chunk;
    })
    readable.on("end", function () {
      fn(file);
    })
}
*/
