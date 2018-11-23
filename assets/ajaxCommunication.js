(function (window) {
  "use strict"

  let Application = window.Application || {};

  const POST_URL = "http://localhost:3000/addTask";
  const BASE_URL = "http://localhost:3000";

  function AjaxCommunication({user, month, year}) {
      this.user = user;
      this.month = month;
      this.year = year;

      let baseGetModelURL = `${BASE_URL}/${user}/tasksInMonth/${month}-${year}.json?`;
      this.getModelURL = this.addTimezonOffsetToQueryString(baseGetModelURL);
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
      xhr.open("GET", this.getModelURL);
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
