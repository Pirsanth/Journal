(function (window) {
  "use strict";

  const buttonControls = new window.App.ButtonControls();
  const form = new window.App.Form();
  const {validatePassword, validateRepeatPassword, sendGETWithProspectiveUsername} = window.App.ValidationFunctions;

  buttonControls.addRegisterButtonHandler(function () {
      if(form.infoBox){
        form.removeInfoBox();
      }
      form.formElement.action = "processRegistration";
      form.repeatPasswordContainer.classList.remove("hideRepeat");
      form.enableRepeatPasswordField();
      form.isRegistrationMode = true;
  });

  buttonControls.addLoginButtonHandler(function () {
      form.formElement.action = "processLogin";
      form.repeatPasswordContainer.classList.add("hideRepeat");
      form.isRegistrationMode = false;
  });
  buttonControls.addStartButtonHandler(function () {
      form.formContainer.classList.add("expand");
  });
  form.addOffsetToHiddenInput();
  form.addPasswordOnBlurHandler(function (passwordElement) {
    const {isValid, message} = validatePassword(passwordElement);

    if(isValid){
      form.showSuccessMessage(passwordElement);
    }
    else{
      form.showFailureMessage(passwordElement, message);
    }
  });
  form.addRepeatPasswordOnBlurHandler(function (passwordElement, repeatPasswordElement) {
     const {isValid, message} = validateRepeatPassword(passwordElement, repeatPasswordElement);

    if(isValid){
        form.showSuccessMessage(repeatPasswordElement);
    }
    else{
        form.showFailureMessage(repeatPasswordElement, message);
    }
  });
  form.addUsernameValidityCheckerOnBlur(function (usernameElement) {
    //no need to send a GET for an empty string
    if(usernameElement.value){
      sendGETWithProspectiveUsername(usernameElement.value, function (isValid) {
        if(form.isRegistrationMode){
          if(isValid){
            form.showSuccessMessage(usernameElement);
          }
          else{
            form.showFailureMessage(usernameElement, "Username taken please try another");
          }
        }
        else{
          //this means he is logging in and the user exists (if the username is not taken it is valid)
          if(!isValid){
            form.showSuccessMessage(usernameElement);
          }
          else{
            form.showFailureMessage(usernameElement, "User does not exist");
          }
        }
      });
    }
    else{
      form.showFailureMessage(usernameElement, "Required");
    }
  });

})(window);
