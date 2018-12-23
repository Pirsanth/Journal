const {sendError, consumeReadStream} = require("./helpers.js");
const {doesTheUsernameExist} = require("../model/manageUsers.js")


module.exports = function (req, res) {
    consumeReadStream(req, function (err, streamData) {
      if(err){
        sendError(res, 500, "There was an error thrown while consuming hte POST stream");
        return;
      }

      let data;

      try{
        data = JSON.parse(streamData)
      }
      catch(e){
        sendError(res, 400, "Improper JSON object sent, could not process request");
      }

      if(data){
        if(data.username){
          doesTheUsernameExist(data.username, function (err, exists) {

            if(err){
              sendError(res, 500, "Error thrown while accessing database");
              return;
            }
            //if the username is already taken, it is not a valid username
            if(exists){
              let output = {error: null, data: false};
              res.writeHead(200, {"Content-Type": "application/json"});
              res.end(JSON.stringify(output));
            }
            else{
              let output = {error: null, data: true};
              res.writeHead(200, {"Content-Type": "application/json"});
              res.end(JSON.stringify(output));
            }
          })
        }
        else{
          sendError(res, 400, "The JSON object sent did not have a valid username field");
        }
      }

    });
}
