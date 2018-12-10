const sharedDB = require("./sharedDbInstance.js");

//I know I could use Pormise.all which would be cleaner but I wanted to make this entire project using only callbacks
//Hence, I use a rather messy gate here

//The callback is only called after both indexes are created. If there is an error on either callback, the server would not be started
module.exports = function (fn) {
    sharedDB.getSharedDBInstance(function (db) {
    let indexA, indexB, indexC, indexD;

          db.collection("users", function (err, collection) {
            if(err){
              fn(err);
              return;
            }
            //usernames are unique
            collection.createIndex({username: 1}, {unique: true}, function (err, result) {
              if(err){
                fn(err);
                return;
              }
              indexA = true;

              if(indexA && indexB && indexC && indexD){
                fn(null);
              }
            });
          });

          db.collection("taskObjects", function (err, collection) {
            if(err){
              fn(err);
              return;
            }
            collection.createIndex({username: 1, startUTCDate: 1, endUTCDate: 1, taskName: 1}, function (err, result) {
                if(err){
                  fn(err);
                  return;
                }
                indexB = true;

                if(indexA && indexB && indexC && indexD){
                  fn(null);
                }
            });
          })

          db.collection("sessions", function (err, collection) {
            if(err){
              fn(err);
              return;
            }
            //usernames are unique
            collection.createIndex({username: 1}, {unique: true}, function (err, result) {
              if(err){
                fn(err);
                return;
              }
              indexC = true;

              if(indexA && indexB && indexC && indexD){
                fn(null);
              }
            });


            const threeHourExpiration = 60*60*3
            collection.createIndex({dateLoggedIn: 1}, {expireAfterSeconds: threeHourExpiration}, function (err, result) {
              if(err){
                fn(err);
                return;
              }
              indexD = true;
              
              if(indexA && indexB && indexC && indexD){
                fn(null);
              }
            });
          });
    });

}
