const {sendError, consumeReadStream, getHomePageURI} = require("./helpers.js");
const {URLSearchParams: Query} = require("url");
const {addNewUser} = require("../model/manageUsers.js");
const {createSessionAndReturnIdAndDigest} = require("../model/manageSessions.js");


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
          res.writeHead(302, {"Location": "login.html", "Set-Cookie": ["errorMessage=Form sent to server was invalid; Path=/login.html; HttpOnly", "sessionId=; Path=/; HttpOnly", "digest=; Path=/; HttpOnly"]});
          res.end();
          return;
        }

          addNewUser(formData.username, formData.password, function (err, returnObj) {
            if(err){
              if(err.code === 11000){
                res.writeHead(302, {"Location": "login.html", "Set-Cookie": ["errorMessage=Username already in use please select another; Path=/login.html; HttpOnly", "sessionId=; Path=/; HttpOnly", "digest=; Path=/; HttpOnly"]});
                res.end();
                return;
              }
              else{
                sendError(res, 500, "Error thrown while adding user to database");
                return;
              }
            }

            createSessionAndReturnIdAndDigest(formData.username, function (err, sessionId, digest) {
              if(err){
                sendError(res, 500, "Error thrown while creating session");
                return;
              }

              res.writeHead(302, {"Set-Cookie": [`sessionId=${sessionId}; Path=/; HttpOnly`, `offset=${formData.offset}; Path=/login.html; HttpOnly`, `digest=${digest}; Path=/; HttpOnly`], "Location": getHomePageURI(formData.username, formData.offset)});
              res.end();
            });

          });



    });
}

/*formData.offset is of type string (changed for HTTP transmission) so since "0" is truthy, the below code to check the existance
  of the offset field via if(!formData.offset) with formData.offset = "0" works in the case where the client's timezone is GMT*/

function validateRegistrationForm(formData) {
    //check existance of all fields first if it is undefined or an empty string it fails
    if(!formData.username || !formData.password || !formData.repeatPassword || !formData.offset){
      return false;
    }
    /*formData.password.length > 40 is necessary because JS compares strings character by character amd am attacker could just send an
      arbitarily long password to block Node */
    else if( (formData.username.length > 10) || (formData.password.length < 4) || (formData.password.length > 40) || (formData.password !== formData.repeatPassword) ){
      return false;
    }
    else{
      return true;
    }
}
