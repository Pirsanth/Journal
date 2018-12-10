let http = require("http");
let requestHandlerFunction = require("./router.js").requestHandler;
const startConnectionPool = require("./model/sharedDbInstance.js").initializeConnectionPool(function (err) {
    if(err){
      console.log("Node could not connect to mongodb. Server will not start. Please try again")
      return;
    }

    const createIndexes = require("./model/createIndexes.js")
    createIndexes(function (err) {
      if(err){
        console.log("One of the indexes in the database could not be created. Server will not start. Please try again");
        return;
      }
      let server = http.createServer(requestHandlerFunction);
      server.listen(8080);
      console.log("Connection to mongodb established and the http server has been started on port 8080");
    });

});
