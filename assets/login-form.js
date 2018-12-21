(function (window) {
  "use strict";
  let App = (window.App)? window.App : window.App = {};
   
  const INFO_BOX = '[data-info-box]';
  const REPEAT_PASSWORD_CONTAINER = '[data-repeat-password-container]';
  const FORM_CONTAINER = '[data-form-container]';
  const offsetHiddenElement = document.forms[0]["offset"];

  function Form() {
    this.infoBox = document.querySelector(INFO_BOX);;
    this.formElement = document.forms[0];
    this.repeatPasswordContainer = document.querySelector(REPEAT_PASSWORD_CONTAINER);
    this.formContainer = document.querySelector(FORM_CONTAINER);
  }

  Form.prototype.removeInfoBox = function () {
    this.formElement.removeChild(infoBox);
    infoBox = null;
  }
  Form.prototype.addOffsetToHiddenInput = function () {
    let date = new Date();
    offsetHiddenElement.value = date.getTimezoneOffset();
  }

  App.Form = Form;

})(window);
