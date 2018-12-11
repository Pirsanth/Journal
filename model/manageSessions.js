const sharedDB = require("./sharedDbInstance.js");
const crypto = require("crypto");
const sessionIdRegex = /sessionId=([\w]+);?/;

module.exports.createSessionAndReturnId = function (username, fn) {
      sharedDB.getSharedDBInstance(function (db) {
          db.collection("sessions", function (err, collection) {
              if(err){
                fn(err);
                return;
              }
              //by making 6 bytes, we would get exactly 8 ASCII characters in base64 without = (browsers inconsistently parse the cookie header with an = in the value)
            crypto.randomBytes(6, function (err, buffer) {
                if(err){
                  fn(err);
                  return;
                }
                const sessionId = buffer.toString("base64");

                collection.insertOne({username, sessionId, dateLoggedIn: new Date()}, function (err, resultObject) {
                  if(err){
                    fn(err);
                    return;
                  }

                  fn(null, sessionId);
                });
            });
          });
      });
}

module.exports.validateSession = function (req, fn) {
      let cookiesString = req.headers.cookie;

      //test does not throw an error on "" and undefined
      if(sessionIdRegex.test(cookiesString)){
        //has to be a var otherwise it is block-scoepr
        var [,sessionId] = cookiesString.match(sessionIdRegex);
        //continues executing the rest of the code
      }
      else{
        //if wo do not have a sessionid, returns
        fn(null, false);
        return;
      }

          sharedDB.getSharedDBInstance(function (db) {
              db.collection("sessions", function (err, collection) {
                  if(err){
                    fn(err);
                    return;
                  }
                  collection.findOne({sessionId}, function (err, resultObject) {
                    if(err){
                      fn(err);
                      return;
                    }
                    //using the double bang operator to convert to boolean. Hence, if resultObject = null, !! will make it false
                    //the && retruns null if resultObject is null and resultObject.username if the resulting pnject is truthy
                      fn(null, !!resultObject, resultObject && resultObject.username);
                  });
              });
          });
}
