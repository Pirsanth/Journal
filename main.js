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


    for(i=0; i<obj.startIndex; i++){
        string += options.fn({class: 'class="blank"'})
        totalTally++;
    }

    for(i=0; i<modifiedDayArray.length; i++){
          if(totalTally%7 === 0){
          string += "</tr><tr>";
          }
        string += options.fn(modifiedDayArray[i]);
        totalTally++;
    }

    console.log(totalTally);


  return string;
})

var s = "{{#calendar this}}<td {{{class}}} > {{value}}</td>{{/calendar}}";

var fun = Handlebars.compile(s);

var context = new monthObject(08, 2018);

console.log(fun(context));
//console.log(context)
