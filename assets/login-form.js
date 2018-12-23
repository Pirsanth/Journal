(function (window) {
  "use strict";
  let App = (window.App)? window.App : window.App = {};

/*Selectors here */
  const INFO_BOX = '[data-info-box]';
  const REPEAT_PASSWORD_CONTAINER = '[data-repeat-password-container]';
  const FORM_CONTAINER = '[data-form-container]';


  const offsetHiddenElement = document.forms[0]["offset"];
  const passwordElement = document.forms[0]["password"];
  const repeatPasswordElement = document.forms[0]["repeatPassword"];
  const usernameElement = document.forms[0]["username"];

  function Form() {
    this.infoBox = document.querySelector(INFO_BOX);;
    this.formElement = document.forms[0];
    this.repeatPasswordContainer = document.querySelector(REPEAT_PASSWORD_CONTAINER);
    this.formContainer = document.querySelector(FORM_CONTAINER);
    this.isRegistrationMode = false;
    this.doesTheUserExist = null;
  }

  Form.prototype.removeInfoBox = function () {
    this.formElement.removeChild(infoBox);
    infoBox = null;
  }
  Form.prototype.addOffsetToHiddenInput = function () {
    let date = new Date();
    offsetHiddenElement.value = date.getTimezoneOffset();
  }
  Form.prototype.addPasswordOnBlurHandler = function (fn) {
    passwordElement.addEventListener("blur", function (e) {
      fn(passwordElement);
    })
  }
  Form.prototype.addRepeatPasswordOnBlurHandler = function (fn) {
    repeatPasswordElement.addEventListener("blur", function (e) {
      fn(passwordElement, repeatPasswordElement);
    })
  }
  Form.prototype.showFailureMessage = function (element, message) {
     const errorMessageElement = element.nextElementSibling.nextElementSibling.lastElementChild;
     errorMessageElement.textContent = message;
     const container = element.parentElement.parentElement;
     container.classList.remove("showSuccess");
     container.classList.add("showFailure");
  }
  Form.prototype.showSuccessMessage = function (element) {
    const container = element.parentElement.parentElement;
    container.classList.remove("showFailure");
    container.classList.add("showSuccess");
  }
  Form.prototype.enableRepeatPasswordField = function () {
    repeatPasswordElement.disabled = false;
  }
  Form.prototype.disableRepeatPasswordField = function () {
    repeatPasswordElement.disabled = true;
  }
  //would be messy to use EventTarget.removeEventListener() as I could not use an anonymous function
  Form.prototype.addUsernameValidityCheckerOnBlur = function (fn) {
    usernameElement.addEventListener("blur", () => {
        fn(usernameElement);
    });
  }
  Form.prototype.setUsernameIsValidMessage = function (fn) {
    usernameElement.addEventListener("blur", () => {
        fn(usernameElement);
    });
  }

  App.Form = Form;

})(window);
