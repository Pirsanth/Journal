let mongo = require("mongodb");
let client = mongo.MongoClient;
const connectionString = "mongodb://localhost/journal";

module.exports.externalFindModel = function (user, month, year, fn) {
        getCollection0bject(function (err, coll) {
          if(err){
            fn(err);
            return;
          }
              coll.findOne({user, month, year}, {projection: {_id:0, startIndex:0}},
                function(err, obj) {
                    if(err){
                      fn(err);
                      return;
                    }
                    fn(null, obj);
              })});
};

module.exports.internalFindModel = function (user, month, year, fn) {
        getCollection0bject(function (err, coll) {
          if(err){
            fn(err)
            return;
          }
              coll.findOne({user, month, year},
                function(err, obj) {
                    if(err){
                      fn(err);
                      return;
                    }
                    fn(null, obj)
              })});
};

function getCollection0bject(fn) {
      client.connect(connectionString, function (err, client) {
        if(err){
          fn(err);
          return;
        }
        db = client.db();
        db.collection("monthObjects", function (err, coll) {
                  if(err){
                    fn(err);
                    return;
                  }
                    fn(null, coll);
          });
        });
}

//I dont think i need the resultsObject yet
module.exports.saveNewModel = function (model, fn) {
    getCollection0bject(function (err, coll) {
        if(err){
          console.log(err);
          fn(err);
          return;
        }
        coll.insertOne(model, function (err, resultObject) {
          if(err){
            console.log(err);
            fn(err)
            return;
          }
          //if you do not include this, the callback will not be run at all in the case of a success
          fn(null, resultObject);
        });
    });
}
module.exports.updateDayArray = function (user, month, year, dayIndex, taskArray, fn) {
    getCollection0bject(function (err, coll) {
        if(err){
          console.log(err);
          fn(err);
          return;
        }
        let propertyInDotNotation = `dayArray.${dayIndex}.tasks`
        let obj = {};
        obj[propertyInDotNotation] = taskArray;

        coll.updateOne({user, month, year}, {$set: obj}, function (err, resultObject) {
          if(err){
            console.log(err);
            fn(err);
            return;
          }
          fn(null, resultObject);
        });
    })
}
