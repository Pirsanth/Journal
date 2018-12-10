const {sendError, consumeReadStream} = require("./helpers.js");
const {URLSearchParams: Query} = require("url");
const {addNewUser} = require("../model/manageUsers.js");
const {createSessionAndReturnId} = require("../model/manageSessions.js");
//put an index on username


module.exports = function (req, res) {
    consumeReadStream(req, function (err, streamContents) {
        if(err){
          sendError(res, 500, "There was an error thrown while reading the POST stream");
          return;

        }
        let query = new Query(streamContents);
        let formData = {};
        query.forEach(function (value, key) {
          formData[key] = value;
        });

        if(!validateRegistrationForm(formData)){
          res.writeHead(302, {"Location": "login.html", "Set-Cookie": "errorMessage=Form sent to server was invalid"});
          res.end();
          return;
        }

        addNewUser({"username": formData.username, "password": formData.password}, function (err, returnObj) {
            if(err){
              if(err.code === 11000){
                res.writeHead(302, {"Location": "login.html", "Set-Cookie": "errorMessage=Username already in use please select another"});
                res.end();
                return;
              }
              else{
                sendError(res, 500, "Error thrown while adding user to database");
                return;
              }
            }
            /*In the below I am speeding up the time at Greenwich to match the time at the client, given the timezone offset of
              the client in minutes. Hence, I use the getUTC methods to aquire the client's month and year.*/
            let clientTimestamp = (Date.now() - (parseInt(formData.offset)*60*1000));
            let clientDate = new Date(clientTimestamp);
            let getRequest = `${formData.username}/${clientDate.getUTCMonth()}-${clientDate.getUTCFullYear()}.html`;

            createSessionAndReturnId(formData.username, function (err, sessionId) {
              if(err){
                sendError(res, 500, "Error thrown while creating session");
                return;
              }

              res.writeHead(302, {"Set-Cookie": [`sessionId=${sessionId}`, `offset=${formData.offset}`], "Location": getRequest});
              res.end();
            });

        });

    });
}

function validateRegistrationForm(formData) {
    if(formData.username.length < 10 && (formData.password === formData.repeatPassword) && formData.offset && formData.password){
      return true;
    }
    else{
      return false;
    }
}
