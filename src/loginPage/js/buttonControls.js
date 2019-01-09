(function (window) {
  "use strict";

  let App = (window.App)? window.App : window.App = {};

  const FORM_CONTAINER = '[data-form-container]';
  const START_BUTTON = '[data-start-button]';
  const LOGIN_MODE_BUTTON = '[data-button-mode-login]';
  const REGISTER_MODE_BUTTON = '[data-button-mode-register]';
  const MODE_BAR = '[data-mode-bar]';


  const formContainerElement = document.querySelector(FORM_CONTAINER);
  const loginModeButton = document.querySelector(LOGIN_MODE_BUTTON);
  const registerModeButton = document.querySelector(REGISTER_MODE_BUTTON);
  const startButton = document.querySelector(START_BUTTON);
  const modeBar = document.querySelector(MODE_BAR);

  function ButtonControls() {

  }

  ButtonControls.prototype.addRegisterButtonHandler = function (fn) {
    registerModeButton.addEventListener("click", function (event) {
      modeBar.classList.add("register");
      fn();
    });
  }

  ButtonControls.prototype.addLoginButtonHandler = function (fn) {
    loginModeButton.addEventListener("click", function (event) {
      modeBar.classList.remove("register");
      fn();
    });
  }
  ButtonControls.prototype.addStartButtonHandler = function (fn) {
    startButton.addEventListener("click", function (event) {
      fn();
    })
  }

  App.ButtonControls = ButtonControls;

})(window);
