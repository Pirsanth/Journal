
module.exports = function (month, year, fn) {
    return new monthObject(month, year);
}

function monthObject (month, year) {
  this.user = "user";
  this.month = month;
  this.year = year;

  let startingDate = new Date(year, month, 1);
  //because it getDay is index from Sunday starting at 0
  let numberOfBlanks = startingDate.getDay()-1;
  //because our calendar starts on Monday and startIndex states the number of days to skip
  this.startIndex = (numberOfBlanks === -1)? 6: numberOfBlanks;

  let lastDate = new Date(year, month+1, 0);
  let numberOfDays = lastDate.getDate();
  let dayArray = [];
  for(let i=0; i< numberOfDays; i++){
    let object = {tasks:[]}
    dayArray.push(object);
  }
  this.dayArray = dayArray;
}
