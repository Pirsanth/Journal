const sharedDB = require("./sharedDbInstance.js");
const sendError = require("../controller/helpers.js").handleError;

module.exports = function (username, startBound, endBound, res) {
    sharedDB.getSharedDBInstance(function (db) {
      db.collection("taskObjects", function (err, collection) {
          if(err){
            sendError(res, 503, "There was an error thrown while accessing database collection");
            return;
          }
            //exclude username when sending data to reduce size
            //made this a covered query (via excluding _id) to make it even more efficient
            //the sort on startUTCDate uses the compound index because the field username before it uses an equality
            let cursor = collection.find({username, startUTCDate: {$gte: startBound, $lte: endBound}}, {projection:{"_id": 0, "startUTCDate": 1, "endUTCDate": 1, "taskName": 1}, sort:[["startUTCDate", 1]]});

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
