const PARSE_ISO_STRING_REGEX = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/;
const ENTIRE_ISO_STRING_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/

module.exports = {sendError, consumeReadStream, parseISOStringToDate, getHomePageURI, validateTaskObject}

function sendError(res, code, message) {
    res.writeHead(code, {"Content-Type": "application/json"});
    let obj = {error: code, message: message};
    res.end(JSON.stringify(obj));
}

function consumeReadStream(stream, fn) {
    let data = "";

    stream.on("data", function (chunk) {
      data += chunk;
    });
    stream.on("error", function (err) {
      console.log(err);
      fn(err);
    });
    stream.on("end", function () {
      fn(null, data);
    });
}
function parseISOStringToDate(ISOstring) {
    let [,year, month, day, hour, minutes] = ISOstring.match(PARSE_ISO_STRING_REGEX);
    return new Date(Date.UTC(year, month -1, day, hour, minutes));
};

/*In the below I am speeding up the time at Greenwich to match the time at the client, given the timezone offset of
  the client in minutes. Hence, I use the getUTC methods to aquire the client's month and year.*/
function getHomePageURI (username, offset) {
  let clientTimestamp = (Date.now() - (parseInt(offset)*60*1000));
  let clientDate = new Date(clientTimestamp);
  return `${username}/${clientDate.getUTCMonth()}-${clientDate.getUTCFullYear()}.html`;
}

function isValidISOString (ISOstring) {
    return ENTIRE_ISO_STRING_REGEX.test(ISOstring);
}

function validateTaskObject(obj) {

    const {username, startDateClient, endDateClient, taskName} = obj;

    if(!username || !startDateClient || !endDateClient || !taskName){
      return false;
    }
    else if(username.length>10 || taskName.length>200){
      return false;
    }
    else if(!isValidISOString(startDateClient) || !isValidISOString(endDateClient)){
      return false;
    }
    else if(parseISOStringToDate(startDateClient) > parseISOStringToDate(endDateClient)){
      return false;
    }
    else{
      return true;
    }
}
