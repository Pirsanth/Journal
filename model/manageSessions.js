const sharedDB = require("./sharedDbInstance.js");
const crypto = require("crypto");
const sessionIdRegex = /sessionId=([\w\+\/]+);?/;
const digestRegex = /digest=([\w]+);?/;


module.exports.createSessionAndReturnIdAndDigest = function (username, fn) {
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

                  fn(null, sessionId, createDigest(sessionId));
                });
            });
          });
      });
}
function createDigest (sessionId) {
  const hmac = crypto.createHmac("sha256", require("./manageHMACSecretKey.js").secretKey);
  hmac.update(sessionId)
  return hmac.digest("hex");
}
function validateDigest(sessionId, digest) {
  const hmac = crypto.createHmac("sha256", require("./manageHMACSecretKey.js").secretKey);
  hmac.update(sessionId)
  return hmac.digest("hex") === digest;
}

module.exports.validateSession = function (req, fn) {
      let cookiesString = req.headers.cookie;

      //test does not throw an error on "" and undefined
      if(sessionIdRegex.test(cookiesString) && digestRegex.test(cookiesString)){
        //has to be a var otherwise it is block-scoepr
        const [,sessionId] = cookiesString.match(sessionIdRegex);
        const [,digest] = cookiesString.match(digestRegex);

        if(validateDigest(sessionId, digest)){
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
        else{
          fn(null, false);
        }
      }
      else{
        //if we do not have a sessionid
        fn(null, false);
      }

}
module.exports.findAndDeleteSession = function (sessionId, fn) {
    sharedDB.getSharedDBInstance(function (db) {
      db.collection("sessions", function (err, collection) {
          if(err){
            fn(err);
            return;
          }
          collection.findOneAndDelete({sessionId}, function (err, resultObject) {
            if(err){
              fn(err);
              return;
            }
            //using the double bang operator to convert to boolean. Hence, if resultObject = null, !! will make it false
            //the && retruns null if resultObject is null and resultObject.username if the resulting pnject is truthy
              fn(null, !!resultObject);
          });
      });
    });
}
module.exports.deleteAllSessions = function (fn) {
    sharedDB.getSharedDBInstance(function (db) {
      db.collection("sessions", function (err, collection) {
          if(err){
            fn(err);
            return;
          }
          //collection.drop() throws an ns error if the collection does not exist
          collection.deleteMany({}, function (err, resultObject) {
            if(err){
              fn(err);
              return;
            }
              fn(null);
          });
      });
    });
}
