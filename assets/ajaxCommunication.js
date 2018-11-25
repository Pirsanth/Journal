(function (window) {
  "use strict"

  let Application = window.Application || {};

  let POST_TASK_URL;
  let GET_MODEL_URL;
  let DELETE_TASK_URL;
  const hrefRegex = /(^[\w:]+\/\/[\w:]+)\//;

  function AjaxCommunication({user, month, year}) {
      this.user = user;
      this.month = month;
      this.year = year;

      let [,hrefExcludingPath] = window.location.href.match(hrefRegex);

      let getModelURLWithoutQueryString = `${hrefExcludingPath}/${user}/tasksInMonth/${month}-${year}.json?`;
      GET_MODEL_URL = this.addTimezonOffsetToQueryString(getModelURLWithoutQueryString);
      POST_TASK_URL = `${hrefExcludingPath}/addTask`;
      DELETE_TASK_URL = `${hrefExcludingPath}/removeTask`;
  }
  AjaxCommunication.prototype.addTimezonOffsetToQueryString = function (queryString) {
      let date = new Date(),
          offset = date.getTimezoneOffset();
        return queryString += `offset=${offset}`;
  };
  AjaxCommunication.prototype.sendPOST = function (queryString) {
      let xhr = new XMLHttpRequest();
      xhr.open("POST", POST_TASK_URL);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onload = function () {
        let obj  = JSON.parse(this.responseText);
        //accessing properties on objects do not throw an error
        if(!obj.error){
            console.log(obj.data);
        }
        else{
          console.log(`${obj.error} : ${obj.message}`);
        }
      }
      xhr.send(queryString);

  };
  AjaxCommunication.prototype.getModel = function (fn) {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", GET_MODEL_URL);
      xhr.onload = function () {
          if(this.status == 200){
              fn(this.responseText);
          }
          else{
            let obj = JSON.parse(this.responseText);
            console.log(`${obj.error} : ${obj.message}`);
          }
      }

      xhr.send();
  };
  AjaxCommunication.prototype.addUserToInternalTaskObject = function (taskObj) {
      taskObj["user"] = this.user;
  }
  AjaxCommunication.prototype.sendDELETE = function (taskObj) {
      let xhr = new XMLHttpRequest();
      xhr.open("DELETE", DELETE_TASK_URL);
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.onload = function () {
          let obj  = JSON.parse(this.responseText);
          //accessing properties on objects do not throw an error
          if(!obj.error){
              console.log(obj.data);
          }
          else{
            console.log(`${obj.error} : ${obj.message}`);
          }
        }

      xhr.send(JSON.stringify(taskObj));
  }



  Application.AjaxCommunication = AjaxCommunication;
  window.Application = Application;
})(window);
