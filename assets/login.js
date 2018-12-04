(function () {
//so as to not pollute the global namespace

/*Selectors here*/
const FORM_CONTAINER = '[data-form-container]';
const START_BUTTON = '[data-start-button]';
const LOGIN_MODE_BUTTON = '[data-button-mode-login]';
const REGISTER_MODE_BUTTON = '[data-button-mode-register]';
const REPEAT_PASSWORD_CONTAINER = '[data-repeat-password-container]';
const INFO_BOX = '[data-info-box]';


const formContainerElement = document.querySelector(FORM_CONTAINER);
const repeatPasswordContainer = document.querySelector(REPEAT_PASSWORD_CONTAINER);
const formElement = document.forms[0];
const loginModeButton = document.querySelector(LOGIN_MODE_BUTTON);
const registerModeButton = document.querySelector(REGISTER_MODE_BUTTON);
let infoBox = document.querySelector(INFO_BOX);
const startButton = document.querySelector(START_BUTTON);
const offsetHiddenElement = formElement["offset"];


(function addOffsetToHiddenInput() {
    let date = new Date();
    offsetHiddenElement.value = date.getTimezoneOffset();
})();

startButton.addEventListener("click", function (event) {
    formContainerElement.classList.add("expand");
})

registerModeButton.addEventListener("click", function (event) {
      if(infoBox){
        removeInfoBox()
      }
      repeatPasswordContainer.classList.remove("hideRepeat");
      formElement.action = "processRegistration";
});

loginModeButton.addEventListener("click", function (event) {
      repeatPasswordContainer.classList.add("hideRepeat");
      formElement.action = "processLogin";
});

function removeInfoBox() {
    formElement.removeChild(infoBox);
    infoBox = null;
}

})();
