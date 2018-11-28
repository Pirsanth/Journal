const sharedDB = require("./sharedDbInstance.js");

module.exports = function (queryObject, fn) {
    sharedDB.getSharedDBInstance(function (db) {

          db.collection("taskObjects", function (err, collection) {
            if(err){
              fn(err);
              return;
            } //I did not want to include a projection, for the ease of debugging
              collection.findOneAndDelete(queryObject, function (err, resultObject) {
                  if(err){
                    fn(err);
                    return;
                  }
                      fn(null, resultObject);
                });
          })
    })

}
