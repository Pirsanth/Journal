let http = require("http");
let requestHandlerFunction = require("./router.js").requestHandler;
const startConnectionPool = require("./model/sharedDbInstance.js").initializeConnectionPool();


let server = http.createServer(requestHandlerFunction);


server.listen(8080);
