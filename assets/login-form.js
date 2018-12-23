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
  Form.prototype.addUsernameOnBlurHandler = function (fn) {
    usernameElement.addEventListener("blur", () => {
        fn(usernameElement);
    });
  }
  Form.prototype.showUsernameValidityMessageFromInternalState = function () {
    if(this.isRegistrationMode){
      //if you are registering and user exists, it is a failure
      if(!this.doesTheUserExist){
        this.showSuccessMessage(usernameElement);
      }
      else{
        this.showFailureMessage(usernameElement, "Username taken please try another");
      }
    }
    else{
      //this means he is logging in and the user exists (if the username is not taken it is valid)
      if(this.doesTheUserExist){
        this.showSuccessMessage(usernameElement);
      }
      else{
        this.showFailureMessage(usernameElement, "User does not exist");
      }
    }
  }
  Form.prototype.ensureCorrectUsernameValidityOnModeChange = function () {
    //has the user interacted with the form significantly? (empty string on blue does not count)
    if(this.doesTheUserExist !== null){
      this.showUsernameValidityMessageFromInternalState();
    }
  }
  Form.prototype.changeUsernameIsValidValidityMessage = function () {
    const validMessageElement = validusernameElement.nextElementSibling.lastElementChild;

    if(this.isRegistrationMode){
      validMessageElement.textContent = "Username is available"
    }
    else{
      validMessageElement.textContent = "Username is valid"
    }
  }


  App.Form = Form;

})(window);
