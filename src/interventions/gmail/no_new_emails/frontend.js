const $ = require('jquery')

//Waits until the email page is loaded to begin executing the script
var beginVar = null;
function begin(timeWindow) {
  if (beginVar == null) {
      const wait = setInterval(() => {
      var getEmails = document.querySelector('tr.zA');
      if (getEmails) {
            getMostRecentTime(timeWindow);
            clearInterval(wait);
      }
    }, 250);
  }
}

//Retrieves the most recent time visited, up to timeWindow-hours ago
function getMostRecentTime(timeWindow /* In hours */) {
  //Note: in localStorage everything is stored as strings!
  if (!localStorage.hasOwnProperty("mostRecentTime")) {
    localStorage.mostRecentTime = Math.floor(Date.now() / 1000);
  } else {
    var possibleNewTime = parseInt(Math.floor(Date.now() / 1000), 10);

    //3600 seconds = 1 hour
    if ((parseInt(localStorage.mostRecentTime, 10) + (timeWindow * 3600)) > (possibleNewTime)) {
      //Tells user to come back as they've visited already within the time interval
       displayTimeRemaining(timeWindow);
    } else {
      //replace most recent time visited
      localStorage.mostRecentTime = possibleNewTime;
    }
  }
  return localStorage.mostRecentTime;
}

//Displays time remaining until the next inbox refresh
function displayTimeRemaining(timeWindow) {
  var differenceInSeconds = Math.floor(Date.now() / 1000) - localStorage.mostRecentTime;
  var timeRemainingUntilRefresh = (timeWindow * 3600) - differenceInSeconds;

  //Calculates hours, minutes, and seconds remaining
  var hours = Math.floor(timeRemainingUntilRefresh/3600);

  var minuteDivisor = timeRemainingUntilRefresh % 3600;
  var minutes = Math.floor(minuteDivisor / 60);

  var secondDivisor = minuteDivisor % 60;
  var seconds = Math.ceil(secondDivisor);

  if (minutes < 10) { minutes = "0" + minutes;}
  if (seconds < 10) { seconds = "0" + seconds;}

  //Displays time remaining on the email client
  var appendBox = $('div.Cq.aqL');
  var message = $('<div class="message">').css({'padding-top': '2px', 'color': '#cf000f'});
  message.text(hours + ":" + minutes + ":" + seconds + " until your inbox refreshes.")
  appendBox.append(message);
}

//Processes the emails
var dateArray = null;
function processEmails(callback) {
  if (dateArray == null) {
      const dateRetrieval = setInterval(() => {
      var getEmails = document.querySelector('tr.zA');
      if (getEmails) {
            dateArray = document.querySelectorAll('tr.zA');
            removeEmails();
            clearInterval(dateRetrieval);
          }
      }, 250);
    }
}

//Removes the email depending on whether the time stamp is later than the most recent time visited
function removeEmails() {
  //First counts how many emails to remove
  var amountToRemove = 0;
  for (var i = 0; i < dateArray.length; i++) {
      //Process single email
      var singleEmail = dateArray[i];
      //retrieve date from html
      var date = singleEmail.querySelector('td.xW').querySelector('span').title; //retrieves the date stamp

      //Converts to dateString
      var dateArr = date.split(/[ ,]+/);
      var time = dateArr[5].split(":");
      //Converts AM/PM into 24-hr time
      if (dateArr[6] === "PM" && parseInt(time[0]) >= 1 && parseInt(time[0]) <= 11) {
        var add12 = String(parseInt(time[0]) + 12);
        dateArr[5] = add12 + ":" + time[1];
      } else if (dateArr[6] === "AM" && parseInt(time[0]) === 12) {
        var sub12 = String(parseInt(time[0]) - 12);
        dateArr[5] = sub12 + ":" + time[1];
      }
      if (dateArr[5].length === 4) {
        dateArr[5] = "0" + dateArr[5];
      }

      //Retrieves and formats string for the local timezone
      var offset = Math.floor((new Date).getTimezoneOffset()/60);
      var appendOffset;
      if (offset > 0) {
        if (offset < 10) {
          appendOffset = "-0" + String(offset) + ":00";
        } else {
          appendOffset = "-" + String(offset) + ":00";
        }
      } else {
        if (offset < 10) {
          appendOffset = "0" + String(offset) + ":00";
        } else {
          appendOffset = String(offset) + ":00";
        }
      }

      //Constructs the dateString so that Date.getTime() can correctly parse it
      var dateString = dateArr[0] + " " + dateArr[1] + " " + dateArr[2] + " " + dateArr[3] + " " + dateArr[5] + ":00" + " GMT" + appendOffset;
      //Retrieves the date in unix time
      var unixTime = (new Date(dateString).getTime() / 1000).toFixed(0);

      //Increments the counter if the email datestamp is later than the mostRecentTime
      if (unixTime > parseInt(localStorage.mostRecentTime)) {
        amountToRemove++;
      } else {
        //No need to continue looking at further emails
        break;
      }
    }
    console.log("Amount of Emails to Remove: " + amountToRemove);

    //Repositions the email links within the time frame
    let already_redirected = false;
    for (let outer_i = 0;  outer_i < dateArray.length - amountToRemove; outer_i++) {
      ((i) => {
        dateArray[i].addEventListener('click', (x) => {
          if (already_redirected) {
            already_redirected = false
            return false
          } else {
            already_redirected = true;
            dateArray[i + amountToRemove].click();
            x.stopPropagation();
            return false;
          }
        })
      })(outer_i)
    }

    //Removes the emails
    for (let i = 0; i < amountToRemove; i++) {
      dateArray[i].remove();
    }
}

//Main function
function main() {
  //NOTE: YOU CAN CHANGE THE AMOUNT OF HOURS IN YOUR TIME FRAME HERE
  begin(4);
  processEmails();
}

$(document).ready(main);
