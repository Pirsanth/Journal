const sharedDB = require("./sharedDbInstance.js");


module.exports.addNewUser = function (userObject, fn) {
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
}

module.exports.validateUserCredentials = function (username, password, fn) {
      sharedDB.getSharedDBInstance(function (db) {
          db.collection("users", function (err, collection) {
              if(err){
                fn(err);
                return;
              }
              //it is only indexed on username
              collection.findOne({username}, function (err, result) {
                if(err){
                  fn(err);
                  return;
                }
                if(!result){
                  fn(null, false);
                }
                else if(result.password === password){
                  fn(null, true);
                }
                else{
                  fn(null, false);
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
