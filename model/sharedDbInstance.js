let mongo = require("mongodb");
let MongoClient = mongo.MongoClient;
const connectionString = "mongodb://localhost/journal";
const EventEmitter = require('events');

let db = null;
const eventEmitter = new EventEmitter();

module.exports.initializeConnectionPool = function () {
  MongoClient.connect(connectionString, function (err, connectedClient) {
    if(err){
      console.log(err);
      return;
    }
    db = connectedClient.db();
    eventEmitter.emit("databaseConnected", db);
  });

}

module.exports.getSharedDBInstance = function (fn) {
      if(!db){
        eventEmitter.once("databaseConnected", fn);
        console.log("added to events")
      }
      else{
        fn(db);
      }
}
