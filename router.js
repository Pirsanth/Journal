const {URL} = require("url");
const fs = require("fs");
const handlebars = require("handlebars");

let c = console.log;
const cssFile = /^\/styles|task-form.css$/
const handle = /^\/test$/;

module.exports.requestHandler = function (req, res) {
        let url = new URL(req.url, "http://localhost:8080");
        let path = url.pathname;

        if(cssFile.test(path)){
          require("./controller/serveCSSFile.js").run(path, res);
        }

}

function test() {
  string = "{{name}} is a {{occupation}}";
  object = {name: "Pirsanthapus", occupation: "student"};
  const fun = handlebars.compile(string);
  c(fun(object));

}
test();

//do not forget to strinigfy if you are sending JSON over the wire

//dont forget that we have to chain the res after the "end" event
//of the request stream
//using callbacks

//http://localhost:8080/user/current
