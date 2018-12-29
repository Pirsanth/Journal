let mongo = require("mongodb");
let MongoClient = mongo.MongoClient;
const connectionString = "mongodb://localhost/journal";

let db = null;

module.exports.initializeConnectionPool = function (fn) {
  MongoClient.connect(connectionString, function (err, connectedClient) {
    if(err){
      fn(err);
      return;
    }
    db = connectedClient.db();
    fn(null);
  });

}

module.exports.getSharedDBInstance = function (fn) {
        fn(db);
}
