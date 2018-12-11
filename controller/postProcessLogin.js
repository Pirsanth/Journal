const {sendError, consumeReadStream} = require("./helpers.js");
const {URLSearchParams: Query} = require("url");
const {validateUserCredentials} = require("../model/manageUsers.js");
const {createSessionAndReturnId} = require("../model/manageSessions.js");

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

      if(!validateLoginForm(formData)){
        res.writeHead(302, {"Location": "login.html", "Set-Cookie": "errorMessage=Form sent to server was invalid"});
        res.end();
        return;
      }

      validateUserCredentials(formData.username, formData.password, function (err, isValid) {
            if(err){
              sendError(res, 500, "There was an error thrown while validating user credentials");
              return;
            }

            if(isValid){
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
          }

          else {
              res.writeHead(302, {"Location": "login.html", "Set-Cookie": "errorMessage=Username of password was incorrect"});
              res.end();
          }
      });

  });
}


function validateLoginForm(formData) {
  if(!formData.username || !formData.password || !formData.offset){
    return false;
  }
  else if( (formData.username.length > 10) || (formData.password.length < 4) || (formData.password.length > 40) ){
    return false;
  }
  else{
    return true;
  }
}
