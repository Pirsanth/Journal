const streamTaskObjects = require("../model/streamTaskObjects.js");
const sendError = require("./helpers.js").handleError;

module.exports = function (user, month, year, offset, res) {

      let startBound = new Date(Date.UTC(year, month, 1, 0, offset));
      let endBound = new Date(Date.UTC(year, month+1, 0, 0, offset));

      streamTaskObjects(startBound, endBound, user, res);

}
