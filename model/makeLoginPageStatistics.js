const sharedDB = require("./sharedDbInstance.js");
/*I originally intended to acquire the summary statistics by analyzing the taskObjects collection using the aggregate framework. Even though it would be
ineffiecent as it would have to process every document, I believed that it would serve as a good challenge. Then I dicovered an edge case where a user could have registered
but not have added a task. This user would not show up on a group of the taskObjects by _id username. Thus, I use count documents instead on the users collection.
Since the I would need the result of the first asynchronous aggregate operation to calculate the average tasks per user in the second asynchronous operation,
I have run the operations in series rather than in parallel as I had done with createIndexes.js*/

module.exports = function (fn) {
  sharedDB.getSharedDBInstance(function (db) {
        let output ={};

        db.collection("taskObjects", function (err, coll) {
          if(err){
            fn(err)
            return;
          }
          coll.aggregate([{$group: {_id:null,averageTaskDuration: {$avg: {$subtract: ["$endUTCDate", "$startUTCDate"]}},numberOfTasks: {$sum: 1}}}], function (err, cursor) {
            if(err){
              fn(err)
              return;
            }
            cursor.hasNext(function (err, hasNext) {
              if(err){
                fn(err)
                return;
              }
              if(hasNext){
                cursor.next(function (err, aggregateResult) {
                  if(err){
                    fn(err)
                    return;
                  }
                  output.averageTaskDurationInMinutes = aggregateResult.averageTaskDuration/1000/60;
                  output.numberOfTasks = aggregateResult.numberOfTasks;

                  db.collection("users", function (err, coll) {
                    if(err){
                      fn(err)
                      return;
                    }
                    coll.countDocuments({}, function (err, numberOfUsers) {
                      if(err){
                        fn(err)
                        return;
                      }
                      output.numberOfUsers = numberOfUsers;
                      output.averageTasksPerUser = (output.numberOfTasks/numberOfUsers).toFixed(2);
                      fn(null, output);
                    });
                  });

                });
              }
              else{
                output.averageTaskDurationInMinutes = 0;
                output.numberOfTasks = 0;

                db.collection("users", function (err, coll) {
                  if(err){
                    fn(err)
                    return;
                  }
                  coll.countDocuments({}, function (err, result) {
                    if(err){
                      fn(err)
                      return;
                    }
                    output.numberOfUsers = result;
                    output.averageTasksPerUser = 0;
                    fn(null, output);
                  });
                });
              }
              });
            });
          });


  });
}
