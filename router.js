const {URL} = require("url");
const fs = require("fs");
const handlebars = require("handlebars");

const cssFile = /^\/(\w+)\/((styles|task-form|normalize)\.css)$/;
const jsFile = /^\/(\w+)\/((base|task-form|ajaxCommunication|main)\.js)$/;
const currrentMonthHTML = /^\/(\w+)\/current.html$/;
const getMonthObject = /^\/(\w+)\/monthObject\/(([0-9]|1[0-2])-(19[0-9]{2}|2[0-9]{3})).json$/;
//the day should be indexed from 0 because because in db dateArray starts from 0
//the month should be index from 0 as well because the month index in JS  (for Date objects) starts from 0
const getDayTaskArray =  /^\/(\w+)\/dayTaskArray\/(([0-9]|1[0-2])-(19[0-9]{2}|2[0-9]{3}))\/((1|2)?[0-9]|30).json$/
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
          else if(currrentMonthHTML.test(path)){
            let user = path.match(currrentMonthHTML)[1];
            require("./controller/serveCurrentMonth.js")(user, res);
          }
          else if(getMonthObject.test(path)){
            let match = path.match(getMonthObject);
            let [, user, , month, year] = match;
            require("./controller/getMonthObject.js")(user, parseInt(month), parseInt(year), res);
          }
          else if(getDayTaskArray.test(path)){
            let match = path.match(getDayTaskArray);

            require("./controller/getDayTaskArray.js")(match);
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
