const sharedDB = require("./sharedDbInstance.js");
const crypto = require("crypto");

module.exports.getActiveSessionObject = function (sessionId, fn) {
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
                  /*Did not want to use the double bang operator to return a boolean because
                  we would need the returned object in controller if true*/
                  fn(null, resultObject);
              });
          });
      });
}
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
module.exports.validateSession = function (sessionId, username, fn) {
      sharedDB.getSharedDBInstance(function (db) {
          db.collection("sessions", function (err, collection) {
              if(err){
                fn(err);
                return;
              }
              //remeember the index is on sessionId as it is more selective than username
              collection.findOne({sessionId}, function (err, resultObject) {
                if(err){
                  fn(err);
                  return;
                }
                /*In JS and Python the && operator returns the expression on the left if it is false. This is important in this case
                  as accessing a property on a null object will yeield an error. Hence, if the object is null the expression on hte right of the && is never
                  evaluated.*/
                  //A schema would've been good
                if(resultsObject !== null && resultsObject.username === username){
                  fn(null, true);
                }
                else {
                  fn(null, false);
                }

              });
          });
      });
}
