function monthObject (month, year) {
  let startingDate = new Date(year, month, 1);
  this.startIndex = startingDate.getDay();

  let lastDate = new Date(year, month+1, 0);
  let numberOfDays = lastDate.getDate();
  let dayArray = [];

  for(let i=0; i< numberOfDays; i++){
    let object = {tasks:[]}
    dayArray.push(object);
  }
  this.dayArray = dayArray;
}

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
  if(totalTally%7 === 0 && totalTally !== 0){
    string += "</tr><tr>";
  }

  for(i=0; i<numberOfBlanks; i++){
    string += options.fn({class: 'class="blank"'})
    totalTally++;
  }
}

function makeDayCells(){
  for(i=0; i<modifiedDayArray.length; i++){
        if(totalTally%7 === 0){
        string += "</tr><tr>";
        }
      string += options.fn(modifiedDayArray[i]);
      totalTally++;
  }
}
})

Handlebars.registerHelper("cover-calendar", function (obj, options) {
  let string = "<tr>";
  let totalTally = 0;
  let modifiedDayArray = obj.dayArray.map(function (currentValue, index) {
            return {data: 'data-cover-calendar = "clickable"', value: index + 1 + "st"}
  })

//This is a summary of the logic
makeBlankCells(obj.startIndex);
makeDayCells();
let remaining = 42-totalTally;
makeBlankCells(remaining);

return string + "</tr>"


function makeBlankCells(numberOfBlanks){
  if(totalTally%7 === 0 && totalTally !== 0){
    string += "</tr><tr>";
  }

  for(i=0; i<numberOfBlanks; i++){
    string += options.fn({class: 'class="blank"'})
    totalTally++;
  }
}

function makeDayCells(){
  for(i=0; i<modifiedDayArray.length; i++){
        if(totalTally%7 === 0){
        string += "</tr><tr>";
        }
      string += options.fn(modifiedDayArray[i]);
      totalTally++;
  }
}
})

function appendBaseCalendar(){
     let element = document.querySelector('[data-base="calendar"]')


    var string = "{{#base-calendar this}}<td {{{class}}} {{{data}}} > {{value}}</td>{{/base-calendar}}";

    var compiledFunction = Handlebars.compile(string);

    var context = new monthObject(08, 2018);


    element.innerHTML = compiledFunction(context)

/*    x = document.createElement("li");
    x.appendChild(document.createTextNode("NEIGH"));
    element.appendChild(x)

    console.log(element.innerHTML)
*/
}

appendBaseCalendar();

function appendCoverCalendar() {
  let element = document.querySelector('[data-task-form="calendar"]');
  let string = "{{#cover-calendar this}}<td {{{class}}} {{{data}}} > {{value}}</td>{{/cover-calendar}}"
  let compiledFunction = Handlebars.compile(string);
  let context = new monthObject(08, 2018);
  element.innerHTML = compiledFunction(context)
}
appendCoverCalendar();
