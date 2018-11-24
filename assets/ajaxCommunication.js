(function (window) {
  "use strict"

  let Application = window.Application || {};

  let POST_URL;
  let GET_MODEL_URL;
  const hrefRegex = /(^[\w:]+\/\/[\w:]+)\//;

  function AjaxCommunication({user, month, year}) {
      this.user = user;
      this.month = month;
      this.year = year;

      let [,hrefExcludingPath] = window.location.href.match(hrefRegex);

      let getModelURLWithoutQueryString = `${hrefExcludingPath}/${user}/tasksInMonth/${month}-${year}.json?`;
      GET_MODEL_URL = this.addTimezonOffsetToQueryString(getModelURLWithoutQueryString);
      POST_URL = `${hrefExcludingPath}/addTask`;
  }
  AjaxCommunication.prototype.addTimezonOffsetToQueryString = function (queryString) {
      let date = new Date(),
          offset = date.getTimezoneOffset();
        return queryString += `offset=${offset}`;
  };
  AjaxCommunication.prototype.sendPOST = function (queryString, fn) {
      let xhr = new XMLHttpRequest();
      xhr.open("POST", POST_URL);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onload = function () {
        if(this.status === 200){
            fn(this.responseText);
        }
      }
      xhr.send(queryString);
  };
  AjaxCommunication.prototype.getModel = function (fn) {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", GET_MODEL_URL);
      xhr.onload = function () {
        console.log("loaded");
        console.log(this.responseText);
        if(this.status === 200){
          fn(this.responseText);
        }
        else{
          console.log("an error occoured");
        }
      }

      xhr.send();
      console.log("url sent")
  };
  Application.AjaxCommunication = AjaxCommunication;
  window.Application = Application;
})(window);
