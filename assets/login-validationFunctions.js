(function (window) {
    let App = (window.App)? window.App : window.App = {};

    /*these would be UTLs because they would include the protocol and thus describe HOW to
    get the resource as well as its location */

    const [,baseURL] = window.location.href.match(/(^[\w:]+\/\/[\w:]+)\//);
    const checkUsernameURL = `${baseURL}/doesUserExist`

     function validatePassword(passwordElement) {
          if(passwordElement.validity.valid){
            return {isValid: true};
          }
          else{
            if(passwordElement.value){
              return {isValid: false, message: "Passwords have to be at least 4 characters long"}
            }
            else{
              return {isValid: false, message: "Required"}
            }
          }
     }


     function validateRepeatPassword(passwordElement, repeatPasswordElement) {
       if(!repeatPasswordElement.value){
         return {isValid: false, message: "Required"}
       }
       else if(!repeatPasswordElement.validity.valid){
         return {isValid: false, message: "Passwords have to be at least 4 characters long"}
       }
       else if(passwordElement.value !== repeatPasswordElement.value){
         return {isValid: false, message: "Passwords do not match"};
       }
       else{
         return {isValid: true};
       }
     }
    //although its AJAX it simply validates the username. Did not see the need for a seperate AJAX module
     function sendGETWithProspectiveUsername(username, fn) {
       let xhr = new XMLHttpRequest();
       xhr.open("POST", checkUsernameURL);
       xhr.setRequestHeader("Content-Type", "application/json");

       let outgoingJSON = {username};

       xhr.onload = function () {
           let obj  = JSON.parse(this.responseText);
           //accessing properties on objects that do not exist does not throw an error
           if(!obj.error){
             const userExists = obj.data
             fn(userExists);
           }
           else{
             console.log(`${obj.error} : ${obj.message}`);
           }
         }

       xhr.send(JSON.stringify(outgoingJSON));
     }

    App.ValidationFunctions = {validatePassword, validateRepeatPassword, sendGETWithProspectiveUsername}
})(window);
