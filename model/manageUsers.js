const sharedDB = require("./sharedDbInstance.js");
const crypto = require('crypto');

module.exports.addNewUser = function (username, password, fn) {
  crypto.randomBytes(16, function (err, saltyBuffer) {
    if(err){
      fn(err);
      return
    }
    //its easier for me to visualise bytes as hexadecimal
    const salt = saltyBuffer.toString("hex");

    crypto.pbkdf2(password, salt, 1000, 32, "sha256", function (err, hashPasswordBuffer) {
      if(err){
        fn(err);
        return;
      }
      const hashedPassword = hashPasswordBuffer.toString("hex");
      const userObject = {username, hashedPassword, salt};

      sharedDB.getSharedDBInstance(function (db) {
        db.collection("users", function (err, collection) {
          if(err){
            fn(err);
            return;
          }
          collection.insertOne(userObject, function (err, result) {
            if(err){
              fn(err);
              return;
            }
            fn(null, result);
          });
        });
      });
    });
  });

}

module.exports.validateUserCredentials = function (username, probablePassword, fn) {
      sharedDB.getSharedDBInstance(function (db) {
          db.collection("users", function (err, collection) {
              if(err){
                fn(err);
                return;
              }
              //it is only indexed on username
              collection.findOne({username}, function (err, userObject) {
                if(err){
                  fn(err);
                  return;
                }
                if(!userObject){
                  fn(null, false);
                }
                else{
                  //do not want to waste resources hashing the given probablePassword if the user does not exist
                  crypto.pbkdf2(probablePassword, userObject.salt, 1000, 32, "sha256", function (err, keyBuffer) {
                      let hashedProbablePassword = keyBuffer.toString("hex");
                      fn(null, hashedProbablePassword === userObject.hashedPassword);
                  });
                }
              });

          });
      });
}

module.exports.doesTheUsernameExist = function (username, fn) {
      sharedDB.getSharedDBInstance(function (db) {
          db.collection("users", function (err, collection) {
              if(err){
                fn(err);
                return;
              }
              //covered query so it is extra efficient
              collection.findOne({username},{projection:{_id:0, password:0}}, function (err, result) {
                if(err){
                  fn(err);
                  return;
                }
                //if its null its false, if its an object (user exists) it is true
                fn(null, !!result)
              });

          });
      });
}
