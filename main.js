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

Handlebars.registerHelper("calendar", function (obj, options) {
  let string = "<tr>";
  let totalTally = 0;
  let modifiedDayArray = obj.dayArray.map(function (currentValue, index) {

          if(currentValue.tasks.length === 0){
            return {class:"free", value: index + 1 + "st"}
          }
          else{
            return {class:"checked", value: index + 1 + "st"}
          }
  })


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


function appendCalendar(){
     let element = document.querySelector('[data="calendar"]')


    var string = "{{#calendar this}}<td {{{class}}} > {{value}}</td>{{/calendar}}";

    var compiledFunction = Handlebars.compile(string);

    var context = new monthObject(08, 2018);


    element.innerHTML = compiledFunction(context)

/*    x = document.createElement("li");
    x.appendChild(document.createTextNode("NEIGH"));
    element.appendChild(x)

    console.log(element.innerHTML)
*/
}

appendCalendar();
