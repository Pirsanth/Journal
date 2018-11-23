const sharedDB = require("./sharedDbInstance.js");

module.exports = function (startBound, endBound, user, res) {
    sharedDB.getSharedDBInstance(function (db) {
      db.collection("taskObjects", function (err, collection) {
            let cursor = collection.find({startUTCDate: {$gte: startBound}, endUTCDate: {$lte: endBound}, user});

            cursor.count(function (err, count) {
              res.write("[");
              var chunkCount = 0;

              /*I choose not to use the readable event because at the very end (right before the end event) it will be fired even though stream.read() would yield
                null. Thus using the reabale event would complicate the syntax*/
              cursor.on("data", function (chunk) {
                  res.write(JSON.stringify(chunk));
                  chunkCount++;
                  //because data fires once for each document
                  if(chunkCount !== count){
                    res.write(",")
                  }
              });

              cursor.on("end", function () {
                res.end("]");
              })


            });
      });
    });
}
