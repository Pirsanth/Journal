const {URL} = require("url");
const fs = require("fs");
const handlebars = require("handlebars");

const cssFile = /^\/(\w+)\/((styles|task-form|normalize)\.css)$/;
const jsFile = /^\/(\w+)\/((base|task-form|ajaxCommunication|main)\.js)$/
const currrentMonth = /^\/(\w+)\/current$/

//\w means a-z, A-Z, 0-9, including the _ (underscore) character.
//@ and !, etc. does not work
// the + is for 1 or more

module.exports.requestHandler = function (req, res) {
        let url = new URL(req.url, "http://localhost:8080");
        let path = url.pathname;
      if(req.method === "GET"){
          if(jsFile.test(path)|| cssFile.test(path)){
            let fileRequested = path.match(jsFile)? path.match(jsFile)[2]: path.match(cssFile)[2];
            require("./controller/serveStaticFile.js")(fileRequested, res);
          }
          else if(currrentMonth.test(path)){
            let user = path.match(currrentMonth)[1];
            require("./controller/serveCurrentMonth.js")(user, res);
          }
          else if (path === "/favicon.ico" ){
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end();
          }
      }


}
//IN ES6 JUST WRITE user in obj

// GET, POST, DELETE, PUT
//http://localhost:8080/user/current
