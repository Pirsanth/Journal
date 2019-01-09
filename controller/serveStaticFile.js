const fs = require("fs");
const cssFile = /^\.css$/;
const jsFile = /^\.js$/;
const {sendError} = require("./helpers.js");

module.exports = function(path, type, res) {
  //as you are reading it, its getting sent to the client chunk by chunk
  let readStream = fs.createReadStream( "dist/" + path, "utf-8");

  res.writeHead(200, {"Content-Type": getContentType()});
  readStream.pipe(res);

  //when readable error on pipe the writable is not closed automatically
  readStream.on("error", function (err) {
    console.log(err);
    sendError(res, 500, "Internal server error processing file request");
  });


  function getContentType() {

    if(type === "css"){
      return "text/css"
    }
    else if(type === "js"){
      return "application/javascript"
    }
    else if(type === "map"){
      return "application/javascript"
    }
  }
}
