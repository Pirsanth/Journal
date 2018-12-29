const fs = require('fs');
const crypto = require('crypto');
const {deleteAllSessions} = require("./manageSessions.js");

module.exports.secretKey = null;

module.exports.loadKeyOrCreateNewKey = function (fn) {
  fs.readFile("./HMACsecretKey.txt","utf-8", function (err, keyString) {
    //unexpected error, not a case of the file simply not existing

    if(err && err.code !== "ENOENT"){
      fn(err);
      return;
    }

    if((err && err.code === "ENOENT") || keyString.length !== 64){
      crypto.randomBytes(32, function (err, buff) {
        if(err){
          fn(err);
          return;
        }
          const keyString = buff.toString("hex");
          module.exports.secretKey = keyString;
          fs.writeFile("./HMACsecretKey.txt", keyString, "utf-8", function (err) {
            if(err){
              fn(err);
              return;
            }
            deleteAllSessions(function (err) {
              if(err){
                fn(err);
                return;
              }
              console.log("Could not find HMAC key or key was invalid. New key saved to file system and previous sessions deleted");
              fn(null);
            });
          });
      });
    }
    else{
      module.exports.secretKey = keyString;
      console.log("Successfully loaded HMAC key from cwd");
      fn(null);
    }

  });
}
