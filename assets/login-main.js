(function (window) {
  "use strict";

  const buttonControls = new window.App.ButtonControls();
  const form = new window.App.Form();

  buttonControls.addRegisterButtonHandler(function () {
      if(form.infoBox){
        form.removeInfoBox()
      }
      form.formElement.action = "processRegistration";
      form.repeatPasswordContainer.classList.remove("hideRepeat");
  });

  buttonControls.addLoginButtonHandler(function () {
      form.formElement.action = "processLogin";
      form.repeatPasswordContainer.classList.add("hideRepeat");
  });
  buttonControls.addStartButtonHandler(function () {
      form.formContainer.classList.add("expand");
  });
  form.addOffsetToHiddenInput();

})(window);
