let mongo = require("mongodb");
let client = mongo.MongoClient;
const connectionString = "mongodb://localhost/journal";

module.exports.findModel = function (user, month, year, fn) {
        getCollection0bject(function (err, coll) {
          if(err){
            fn(err)
            return;
          }
              coll.findOne({user: user, month: month, year: year}, {projection: {_id:0, startIndex:0}},
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
module.exports.saveModel = function (model, fn) {
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
        });
    });
}
