const {URL} = require("url");
const fs = require("fs");
const handlebars = require("handlebars");

const cssFile = /^\/user\/((styles|task-form|normalize)\.css)$/;
const jsFile = /^\/user\/((base|task-form)\.js)$/
const currrentMonth = /^\/(user)\/current$/

module.exports.requestHandler = function (req, res) {
        let url = new URL(req.url, "http://localhost:8080");
        let path = url.pathname;
      if(req.method === "GET"){
          if(path.match(jsFile)|| path.match(cssFile)){
              let fileRequested = path.match(jsFile)? path.match(jsFile)[1]: path.match(cssFile)[1];
              require("./controller/serveStaticFile.js")(fileRequested, res);
          }
          else if(path.match(currrentMonth)){
            let user = path.match(currrentMonth)[1];
            require("./controller/serveCurrentMonth.js")(user, res);
          }
          /*
          else if(currrentMonth.test(path)){
          require("./controller/serveCurrentMonth.js")(res);
          }
          */
          else if (path === "/favicon.ico" ){
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end();
          }
      }


}


// GET, POST, DELETE, PUT
/*
fun();

function fun() {
  require("./views/registerHandlebarHelpers.js").run();
  var constructorFunction = require("./model/createNewDataModel.js").run
  var obj = new constructorFunction(7, 2018);
  var strang = "{{#task-form-calendar this}}<td {{{class}}} {{{data}}} > {{value}}</td>{{/task-form-calendar}}";
  var funny = handlebars.compile(strang);
  c(funny(obj));
}

*/
//    var e = new Error(msg);

//do not forget to strinigfy if you are sending JSON over the wire

//dont forget that we have to chain the res after the "end" event
//of the request stream
//using callbacks

//http://localhost:8080/user/current
