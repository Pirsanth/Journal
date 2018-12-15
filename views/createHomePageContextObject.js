
module.exports = function (username, month, year) {
    return new contextObject(username, month, year);
}

function contextObject (username, month, year) {
  month = +month;
  this.username = username
  this.month = month;
  this.year = year;
  this.monthString = getMonthString(month, year);

  let startingDate = new Date(year, month, 1);
  //because it getDay is index from Sunday starting at 0
  let numberOfBlanks = startingDate.getDay()-1;
  //because our calendar starts on Monday and startIndex states the number of days to skip

  this.startIndex = (numberOfBlanks === -1)? 6: numberOfBlanks;

  let lastDate = new Date(year, month+1, 0);
  let numberOfDays = lastDate.getDate();

  this.numberOfDays = numberOfDays;

}

function getMonthString(month, year) {
  var output = "";

    switch(month){
      case 0:
        output += "January";
        break;
      case 1:
        output += "February";
        break;
      case 2:
        output += "March";
        break;
      case 3:
        output += "April";
        break;
      case 4:
        output += "May";
        break;
      case 5:
        output += "June";
        break;
      case 6:
        output += "July";
        break;
      case 7:
        output += "August";
        break;
      case 8:
        output += "September";
        break;
      case 9:
        output += "October";
        break;
      case 10:
        output += "November";
        break;
      case 11:
        output += "December";
    }

    return `${output} ${year}`;
}
