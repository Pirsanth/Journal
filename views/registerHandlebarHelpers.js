const Handlebars = require("handlebars");

//For the task-list helper include startTime, endTime, taskName
//{class: 'class="free"', data: 'data-base-calendar = "clickable"', value: index + 1 + "st"}
//for day cells
//this.numberOfDays this.startIndex

module.exports = function () {

  Handlebars.registerHelper("base-calendar", function ({startIndex, numberOfDays}, options) {
              let string = "<tr>";
              let totalTally = 0;

            //This is a summary of the logic
            makeBlankCells(startIndex);
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
              for(i=0; i<numberOfDays; i++){
                  if(totalTally%7 === 0 && totalTally !== 0){
                    string += "</tr><tr>";
                  }
                  string += options.fn({data: 'data-clickable', value: `${i+1}st`});
                  totalTally++;
              }
            }
});
//{data: 'data-task-form-calendar = "clickable"', value: index + 1 + "st"}
  Handlebars.registerHelper("task-form-calendar", function ({startIndex, numberOfDays}, options) {
            let string = "<tr>";
            let totalTally = 0;

          //This is a summary of the logic
          makeBlankCells(startIndex);
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
            for(i=0; i<numberOfDays; i++){
                  if(totalTally%7 === 0 && totalTally !== 0){
                  string += "</tr><tr>";
                  }
                string += options.fn({data: 'data-clickable', value: `${i+1}st`});
                totalTally++;
            }
          }
  })
//gives us more control if we want to change links
  Handlebars.registerHelper("getPreviousMonthLink", function (month, year, username) {
          return `./${month-1}-${year}.html`;
  });
  Handlebars.registerHelper("getNextMonthLink", function (month, year, username) {
          return `./${month+1}-${year}.html`;
  });
};
