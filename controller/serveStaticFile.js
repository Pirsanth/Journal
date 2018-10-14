const fs = require("fs");
const cssFile = /\.css/;
const jsFile = /\.js/;

module.exports = function(path, res) {

  let readStream = fs.createReadStream( "assets/" + path, "utf-8");

  let type = getContentType(path);
  res.writeHead(200, {"Content-Type": type});
  readStream.pipe(res);

  //when readable error on pipe the writable is not closed automatically
  readStream.on("error", function (err) {
    console.log(err)
    res.writeHead(500, {"Content-Type": "application/json"});
    let obj = {error: 500, message: "Internal server error processing request"}
    res.end(JSON.stringify(obj));
  });

}

function getContentType(path) {
    let position = path.lastIndexOf(".");
    let extension = path.substring(position);

    if(cssFile.test(extension)){
        return "text/css"
    }
    else if(jsFile.test(extension)){
        return "application/javascript"
    }
}




/*  let file = "";

stream.on("data", (chunk) => {
file += chunk;
});
stream.on("end",() =>{

let extension = getFileExtention(path);
//the regex ensures that only requests for css and js files come through
let type = (extension === ".css")? "text/css": "application/javascript";

res.writeHead(200, {"Content-Type": type});
res.end(file, "utf-8");
});
*/
