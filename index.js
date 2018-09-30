let http = require("http");
let requestHandlerFunction = require("./router.js").requestHandler;

let server = http.createServer(requestHandlerFunction);

server.listen(8080);
