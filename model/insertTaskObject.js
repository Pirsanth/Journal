const sharedDB = require("./sharedDbInstance.js");

module.exports = function (model, fn) {
    sharedDB.getSharedDBInstance(function (db) {

          db.collection("taskObjects", function (err, collection) {
            if(err){
              fn(err);
              return;
            }
              collection.insertOne(model, function (err, resultObject) {
                  if(err){
                    fn(err);
                    return;
                  }
                      fn(null, resultObject);
                });
          })
    })

}
