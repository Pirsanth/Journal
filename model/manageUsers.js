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
