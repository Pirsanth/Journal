const sharedDB = require("./sharedDbInstance.js");
const sendError = require("./helpers.js").handleError;

module.exports = function (startBound, endBound, user, res) {
    sharedDB.getSharedDBInstance(function (db) {
      db.collection("taskObjects", function (err, collection) {
          if(err){
            sendError(res, 503, "There was an error thrown while accessing database collection");
            return;
          }
            let cursor = collection.find({startUTCDate: {$gte: startBound}, endUTCDate: {$lte: endBound}, user});

            cursor.count(function (err, count) {
              if(err){
                sendError(res, 503, "There was an error counting relevant objects in database in the database");
                return;
              }

              res.writeHead(200, {"Content-Type": "application/json"});
              res.write("[");
              var chunkCount = 0;

              /*I choose not to use the readable event because at the very end (right before the end event) it will be fired even though stream.read() would yield
                null. Thus using the reabale event would complicate the syntax. Likewise if the stream is empty, the data event does not get fired at all but the
                readable event would be fired once. The data event fires once for each document as per the mongo documentation*/
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
