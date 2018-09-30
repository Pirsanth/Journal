const fs = require("fs");

exports.run = function(path, res) {
  let stream = fs.createReadStream( "assets" + path, "utf-8");
  let file = null;

  stream.on("data", (chunk) => {
      file += chunk;
  });
  stream.on("end",() =>{
      res.writeHead(200, {"Content-Type": "text/css"});
      res.end(file, "utf-8");
  });
}
