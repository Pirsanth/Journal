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
      form.changeUsernameIsValidValidityMessage();
      form.ensureCorrectUsernameValidityOnModeChange();
  });

  buttonControls.addLoginButtonHandler(function () {
      form.formElement.action = "processLogin";
      form.repeatPasswordContainer.classList.add("hideRepeat");
      form.disableRepeatPasswordField();
      form.isRegistrationMode = false;
      form.changeUsernameIsValidValidityMessage();
      form.ensureCorrectUsernameValidityOnModeChange();
  });
  buttonControls.addStartButtonHandler(function () {
      form.formContainer.classList.add("expand");
  });
  form.addOffsetToHiddenInput();
  form.addPasswordOnBlurHandler(function (passwordElement) {
    const {isValid, message} = validatePassword(passwordElement);

    if(isValid){
      form.showSuccessMessage(passwordElement);
      form.updateRepeatPasswordValidityInCaseTheyNowDoNotMatch(function (repeatPasswordElement) {
        //only runs if repeatPassword AND passwordElement is valid (not empty and >4 characters)
        //we do not need to worry about password matching if they are not valid in the first place or if repeatPassword is not filled in yet

        repeatPasswordElement.focus();
        repeatPasswordElement.blur();
      });
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
  form.addUsernameOnBlurHandler(function (usernameElement) {
    //no need to send a GET for an empty string
    if(usernameElement.value){
      sendGETWithProspectiveUsername(usernameElement.value, function (userExists) {
        form.doesTheUserExist = userExists;
        form.showUsernameValidityMessageFromInternalState();
      });
    }
    else{
      form.showFailureMessage(usernameElement, "Required");
    }
  });
  form.addSubmitEventHandler();
})(window);
