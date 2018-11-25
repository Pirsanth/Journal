const streamTaskObjects = require("../model/streamTaskObjects.js");
const {sendError} = require("./helpers.js");

module.exports = function (user, month, year, offset, res) {
      month = +month; //explicitly converting the string to a number is needed otherwise the month+1 expression is interpreted as string concatenation

      let startBound = new Date(Date.UTC(year, month, 1, 0, offset));
      let endBound = new Date(Date.UTC(year, month+1, 0, 0, offset));

      //moved error handling to the model because we are already passing the response object into it
      streamTaskObjects(startBound, endBound, user, res);
}
