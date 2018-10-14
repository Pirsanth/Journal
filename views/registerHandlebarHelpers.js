const Handlebars = require("handlebars");

module.exports = function () {

  Handlebars.registerHelper("base-calendar", function (obj, options) {
    let string = "<tr>";
    let totalTally = 0;
    let modifiedDayArray = obj.dayArray.map(function (currentValue, index) {

            if(currentValue.tasks.length === 0){
              return {class: 'class="free"', data: 'data-base-calendar = "clickable"', value: index + 1 + "st"}
            }
            else{
              return {class: 'class="checked"', data: 'data-base-calendar = "clickable"', value: index + 1 + "st"}
            }
    })

  //This is a summary of the logic
  makeBlankCells(obj.startIndex);
  makeDayCells();
  let remaining = 42-totalTally;
  makeBlankCells(remaining);
  return string + "</tr>"


  function makeBlankCells(numberOfBlanks){
    for(i=0; i<numberOfBlanks; i++){
      if(totalTally%7 === 0 && totalTally !== 0){
        string += "</tr><tr>";
      }
      string += options.fn({class: 'class="blank"'})
      totalTally++;
    }
  }

  function makeDayCells(){
    for(i=0; i<modifiedDayArray.length; i++){
        if(totalTally%7 === 0 && totalTally !== 0){
          string += "</tr><tr>";
        }
        string += options.fn(modifiedDayArray[i]);
        totalTally++;
    }
  }
});

  Handlebars.registerHelper("task-form-calendar", function (obj, options) {
    let string = "<tr>";
    let totalTally = 0;
    let modifiedDayArray = obj.dayArray.map(function (currentValue, index) {
              return {data: 'data-task-form-calendar = "clickable"', value: index + 1 + "st"}
    })

  //This is a summary of the logic
  makeBlankCells(obj.startIndex);
  makeDayCells();
  let remaining = 42-totalTally;
  makeBlankCells(remaining);
  return string + "</tr>"


  function makeBlankCells(numberOfBlanks){
    for(i=0; i<numberOfBlanks; i++){
      if(totalTally%7 === 0 && totalTally !== 0){
        string += "</tr><tr>";
      }
      string += options.fn({class: 'class="blank"'})
      totalTally++;
    }
  }

  function makeDayCells(){
    for(i=0; i<modifiedDayArray.length; i++){
          if(totalTally%7 === 0 && totalTally !== 0){
          string += "</tr><tr>";
          }
        string += options.fn(modifiedDayArray[i]);
        totalTally++;
    }
  }
  })

//For the task-list helper include startTime, endTime, taskName

}
