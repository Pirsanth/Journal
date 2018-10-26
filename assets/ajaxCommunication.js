(function (window) {
  "use strict"

  let Application = window.Application || {};

  const POST_URL = "http://localhost:8080/addTask";
  const BASE_URL = "http://localhost:8080";

  function AjaxCommunication({user, month, year}) {
      this.user = user;
      this.month = month;
      this.year = year;
      this.getModelURL = `${BASE_URL}/${user}/monthObject/${month}-${year}.json`;
  }
  AjaxCommunication.prototype.addTimezonOffsetToQueryString = function (queryString) {
      let date = new Date(),
          offset = date.getTimezoneOffset();
        return queryString += `&offset=${offset}`;
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
  AjaxCommunication.prototype.getModel = function () {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", this.getModelURL);
      xhr.onload = function () {
        if(this.status === 200){
          console.log(this.responseText);
        }
      }
      xhr.send();
  };
  Application.AjaxCommunication = AjaxCommunication;
  window.Application = Application;
})(window);
