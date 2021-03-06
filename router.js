const fs = require("fs");
const handlebars = require("handlebars");
const {sendError} = require("./controller/helpers.js");

const cssFile = /^\/((homePage|loginPage)\.min\.css)$/;
const jsFile = /^\/((homePage|loginPage)\.min\.js)$/;
const mapFiles = /^\/((homePage|loginPage)\.min\.(js|css)\.map)$/;
const getHomePageHTML = /^\/(\w+)\/(([0-9]|1[0-2])-(19[0-9]{2}|2[0-9]{3})).html$/;
const getLoginPageHTML = /^\/login\.html/;
const getTasksInMonth = /^\/(\w+)\/tasksInMonth\/([0-9]|1[0-2])-(19[0-9]{2}|2[0-9]{3})\.json\?offset=(-?\d{0,3})$/;
//the month should be index from 0 as well because the month index in JS  (for Date objects) starts from 0

//\w means a-z, A-Z, 0-9, including the _ (underscore) character.
//@ and !, etc. does not work
// the + is for 1 or more

const postAddTask = /^\/addTask$/;
const deleteRemoveTask = /^\/removeTask$/;
const putEditTask = /^\/editTask$/;
const postProcessRegistration = /\/processRegistration/;
const postProcessLogin = /\/processLogin/;
const getProcessLogout = /\/logout/;
const postDoesUserExist = /\/doesUserExist/;

module.exports.requestHandler = function (req, res) {
        let path = req.url;
      //my meager attempt at preventing regexDOS attacks
      if(req.url.length > 52){
        sendError(res, 414, "The requested URI is longer than the server is willing to interpret");
        return;
      }
      if(req.method === "GET"){
          if(jsFile.test(path)){
            let fileRequested = path.match(jsFile)[1];
            require("./controller/serveStaticFile.js")(fileRequested, "js", res);
          }
          else if(cssFile.test(path)){
            let fileRequested = path.match(cssFile)[1];
            require("./controller/serveStaticFile.js")(fileRequested, "css", res);
          }
          else if(mapFiles.test(path)){
            let fileRequested = path.match(mapFiles)[1];
            require("./controller/serveStaticFile.js")(fileRequested, "map", res);
          }
          else if(getHomePageHTML.test(path)){
            let match = path.match(getHomePageHTML);
            let [,username,,month,year] = match;
            require("./controller/getHomePageHTML.js")(req, username, month, year, res);
          }
          else if(getTasksInMonth.test(path)){
            //the url.pathname does not include the query STRING
            let match = path.match(getTasksInMonth);
            let [, username, month, year,offset] = match;

            require("./controller/getTasksInMonth.js")(req, username, month, year, offset, res);
          }
          else if(getLoginPageHTML.test(path)){
            require("./controller/getLoginPageHTML.js")(req, res);
          }
          else if(getProcessLogout.test(path)){
            require("./controller/getProcessLogout.js")(req, res);
          }
          else if (path === "/favicon.ico" ){
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end();
          }
          else{
            sendError(res, 404, "Requested resource not found");
          }
      }

      else if(req.method === "POST"){
        if(postAddTask.test(path)){
          require("./controller/postAddTask.js")(req, res);
        }
        else if(postProcessRegistration.test(path)){
          require("./controller/postProcessRegistration.js")(req, res);
        }
        else if(postProcessLogin.test(path)){
          require("./controller/postProcessLogin.js")(req, res);
        }
        else if(postDoesUserExist.test(path)){
          require("./controller/postDoesUserExist.js")(req, res);
        }
        else{
          sendError(res, 404, "Requested resource not found");
        }
      }

      else if(req.method === "DELETE"){
        if(deleteRemoveTask.test(path)){
          require("./controller/deleteRemoveTask.js")(req, res);
        }
        else{
          sendError(res, 404, "Requested resource not found");
        }
      }

      else if(req.method === "PUT"){
        if(putEditTask.test(path)){
          require("./controller/putEditTask.js")(req, res);
        }
        else{
          sendError(res, 404, "Requested resource not found");
        }
      }
      else{
        sendError(res, 404, "Requested resource not found");
      }
}
