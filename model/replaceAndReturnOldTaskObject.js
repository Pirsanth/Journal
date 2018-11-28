const sharedDB = require("./sharedDbInstance.js");

module.exports = function (oldTask, newTask, fn) {
    sharedDB.getSharedDBInstance(function (db) {

          db.collection("taskObjects", function (err, collection) {
            if(err){
              fn(err);
              return;
            }
              collection.findOneAndReplace(oldTask, newTask, {projection:{"_id":0}}, function (err, resultObject) {
                  if(err){
                    fn(err);
                    return;
                  }
                      fn(null, resultObject);
                });
          })
    })

}
