let mongo = require("mongodb");
let MongoClient = mongo.MongoClient;
const connectionString = (!process.env["MONGODB_CONNECTION_STRING"])? "mongodb://localhost/journal" :
                          process.env["MONGODB_CONNECTION_STRING"];
console.log(`MongoDB connection string recieved is ${connectionString}`);

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
