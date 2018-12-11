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
