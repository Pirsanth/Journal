
module.exports.sendError = function (res, code, message) {
    res.writeHead(code, {"Content-Type": "application/json"});
    let obj = {error: code, message: message};
    res.end(JSON.stringify(obj));
}

module.exports.consumeReadStream = function (stream, fn) {
    let data = "";

    stream.on("data", function (chunk) {
      data += chunk;
    });
    stream.on("error", function (err) {
      console.log(err);
      fn(err);
    })
    stream.on("end", function () {
      fn(null, data);
    });
}
