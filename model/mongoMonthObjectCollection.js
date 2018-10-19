let mongo = require("mongodb");
let client = mongo.MongoClient;
const connectionString = "mongodb://localhost/journal";
//const month = 9, year = 2018;


module.exports.findModel = function (user, month, year, fn) {
        getCollection0bject(function (err, coll) {
              coll.findOne({user: user, month: month, year: year},
                function(err, obj) {
                    if(err){
                      fn(err);
                    }
                    fn(null, obj)
              })});
};


function getCollection0bject(fn) {
      client.connect(connectionString, function (err, client) {
        db = client.db();
        db.collection("monthObjects", function (err, coll) {
                  if(err){
                    fn(err);
                    return;
                  }
                    fn(null, coll);
          })
        })
}

module.exports.saveModel = function (model) {
    getCollection0bject(function (err, coll) {
        coll.insertOne(model, function (err, resultObject) {
        });
    });
}

//console.log(obj)
