
module.exports.handleError = function (res, code, message) {
    res.writeHead(code, {"Content-Type": "application/json"});
    let obj = {error: code, message: message};
    res.end(JSON.stringify(obj));    
}
