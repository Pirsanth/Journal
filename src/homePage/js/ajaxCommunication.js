(function (window) {
  "use strict"

  let Application = window.Application || {};

  let POST_TASK_URL;
  let GET_MODEL_URL;
  let DELETE_TASK_URL;
  let PUT_TASK_URL;

  function AjaxCommunication({username, month, year}) {
      this.username = username;
      this.month = month;
      this.year = year;

      let relativeURIWithoutUsername = ".."

      let getModelURLWithoutQueryString = `./tasksInMonth/${month}-${year}.json?`;
      GET_MODEL_URL = this.addTimezonOffsetToQueryString(getModelURLWithoutQueryString);
      POST_TASK_URL = `${relativeURIWithoutUsername}/addTask`;
      DELETE_TASK_URL = `${relativeURIWithoutUsername}/removeTask`;
      PUT_TASK_URL = `${relativeURIWithoutUsername}/editTask`;
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
      taskObj["username"] = this.username;
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
  AjaxCommunication.prototype.sendPUT = function (oldTaskObject, newTaskObject) {
      let xhr = new XMLHttpRequest();
      xhr.open("PUT", PUT_TASK_URL);
      xhr.setRequestHeader("Content-Type", "application/json");

      let outgoingJSON = {oldTaskObject, newTaskObject};

      xhr.onload = function () {
          let obj  = JSON.parse(this.responseText);
          //accessing properties on objects that do not exist does not throw an error
          if(!obj.error){
              console.log(obj.data);
          }
          else{
            console.log(`${obj.error} : ${obj.message}`);
          }
        }

      xhr.send(JSON.stringify(outgoingJSON));
  }

  Application.AjaxCommunication = AjaxCommunication;
  window.Application = Application;
})(window);
