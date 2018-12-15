const {sendError, consumeReadStream, getHomePageURI} = require("./helpers.js");
const {URLSearchParams: Query} = require("url");
const {validateUserCredentials} = require("../model/manageUsers.js");
const {createSessionAndReturnId} = require("../model/manageSessions.js");
/*I clear the sessionId cookie on invalid username/password and invalid form data to ensure that the error else if block in controller/getLoginPage is
 run (and the error message is shown on the login page) instead of the if(sessionIdRegex.test(cookiesString) && offsetRegex.test(cookiesString)) block. If you are
 logged in, (with a valid sessionId cookie) accessing the
 login page URI will redirect you to your home page. If you are logged in (have a valid sessionId cookie) and send a post request to this URI (perhaps with Postman or
 Curl, it impossible if you follow the UI and not try to be sneaky due to the redirection at the login page as described above) with invalid form data or invalid
 username credentials you will be logged out (valid sessionId cookie will be deleted). It is not a problem for legitimate users and needs to occur as a result of how I coded controller\getLoginPageHTML.js
 This applies to controller/postProcessRegistration as well otherwise the guy using curl would have no way of knowing the result of his post and would simply be redirected to the home page of his current valid sessionId.
*/

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
        res.writeHead(302, {"Location": "login.html", "Set-Cookie": ["errorMessage=Form sent to server was invalid; Path=/login.html; HttpOnly", "sessionId=; Path=/; HttpOnly"]});
        res.end();
        return;
      }

      validateUserCredentials(formData.username, formData.password, function (err, isValid) {
            if(err){
              sendError(res, 500, "There was an error thrown while validating user credentials");
              return;
            }

            if(isValid){
                createSessionAndReturnId(formData.username, function (err, sessionId) {
                  if(err){
                    sendError(res, 500, "Error thrown while creating session");
                    return;
                  }

                  res.writeHead(302, {"Set-Cookie": [`sessionId=${sessionId}; Path=/; HttpOnly`, `offset=${formData.offset}; Path=/login.html; HttpOnly`], "Location": getHomePageURI(formData.username, formData.offset)});
                  res.end();
                });
          }

          else {
              res.writeHead(302, {"Location": "login.html", "Set-Cookie": ["errorMessage=Username of password was incorrect; Path=/login.html; HttpOnly", "sessionId=; Path=/; HttpOnly"]});
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
