(() => {

if (window.block_after_interval_daily) {
  return
}
window.block_after_interval_daily = true

const $ = require('jquery')

require('enable-webcomponents-in-content-scripts')

//Polymer component
require('bower_components/paper-button/paper-button.deps')

//Custom polymer component
require('components/timespent-view.deps')
require('components/habitlab-logo.deps')

const {
  get_seconds_spent_on_current_domain_today,
  get_seconds_spent_on_domain_today,
  get_visits_to_current_domain_today,
} = require('libs_common/time_spent_utils')

const {
  log_impression,
  log_action,
} = require('libs_common/log_utils')

const {
  once_document_available
} = require('libs_frontend/common_libs')

/*
Local storage constants:
- timeLimitNoPrompt (seconds): The time limit the user chose to spend on facebook daily.
- cheating(date month year as String): The most recent day user pressed the cheating button
- cheatStart (seconds): The amount of time the user had already spent on FB when they pressed the cheat button.
- todayNoPrompt (date month year as String): The most recent day the intervention was deployed
*/

function setTime(minutes) {
  //Save the time limit in the database
  localStorage.setItem('timeLimitNoPrompt', minutes * 60) //time limit stored in seconds
  displayCountdownOrBlock()
}

function addEndDialog(message) {
  //White dialog box containing time's up messages
  const $dialogBox = $('<div class="dialogBox">').css({
              'position': 'fixed',
              'top': '0%',
              'left': '0%',
              'width': '100%',
              'height': '100%',
              'background-color': 'white',
              'z-index': 350
  });
  $(document.body).append($dialogBox)

  //Centered container for text in the white box
  const $contentContainer = $('<div class="contentContainer">').css({
              'position': 'absolute',
              'top': '50%',
              'left': '50%',
              'transform': 'translateX(-50%) translateY(-50%)',
              'display': 'flex',
              'align-items': 'center',
              'justify-content': 'center',
              'flex-direction': 'column'
  }); 


  //Time up message displayed to user
  const $timeText = $('<div class="titleText">').css({
    'font-size': '3em',
    'color': 'red'
  });
  $timeText.html(message)
  $contentContainer.append($timeText)
  $contentContainer.append($('<p>'))  

  const $logo = $('<center><habitlab-logo></habitlab-logo></center>').css({
    'margin-bottom': '80px'
  });
  $contentContainer.append($logo);

  //Cheat button
  const $cheatButton = $('<paper-button raised style="background-color: #ffffff;">')
  $cheatButton.text("Cheat for " + intervention.params.cheatminutes.value + " Minutes")
  $cheatButton.css({'cursor': 'pointer', 'padding': '5px'});
  $cheatButton.click(() => {
    $dialogBox.remove()
    cheat(intervention.params.cheatminutes.value)
  })

  $contentContainer.append($cheatButton);
  $dialogBox.append($contentContainer);
  log_impression(intervention.name)
}

function cheat(minutes) {
  const myDate = new Date()
  const dateString = myDate.getDate() + " " + myDate.getMonth() + " " + myDate.getYear()
  localStorage.cheating = dateString  
  getTimeSpent((time) => {
    localStorage.cheatStart = time
    cheatCountdown()
  })
}

function cheatCountdown() {
  const timeCheatingUp = (parseInt(intervention.params.cheatminutes.value) * 60) + parseInt(localStorage.cheatStart)

  var display_timespent_div = $('<timespent-view>')
  $('body').append(display_timespent_div)

  var cheatTimer = setInterval(() => {
    getTimeSpent((timeSpent) => {
      console.log("Cheat start: " + localStorage.cheatStart)
      console.log("Cheat Seconds Allowed: " + intervention.params.cheatminutes.value * 60)
      console.log("Time Cheating Up: " + timeCheatingUp)
      console.log("Time Spent: " + timeSpent)

      var minutes = Math.floor((timeCheatingUp - timeSpent)/60)
      var seconds = timeCheatingUp - timeSpent
      display_timespent_div.attr('display-text', minutes + " minute(s) and " + seconds + " seconds left.");

      if (timeSpent > timeCheatingUp) {
        $('.timespent-view').remove();
        addEndDialog('Your Cheating Time is Up!')
        clearInterval(cheatTimer)
      }
    })
  }, 1000);
}

//Retrieves the remaining time left for the user to spend on facebook
function getRemainingTimeDaily(callback) {
  getTimeSpent(function(timeSpent) {
    const timeLimitDaily = parseInt(localStorage.timeLimitNoPrompt)
    callback(timeLimitDaily - timeSpent)
  })
}

function getTimeSpent(callback) {
  get_seconds_spent_on_current_domain_today(function(secondsSpent) {
    callback(secondsSpent)
  })
}

function numTimesVisited(callback) {
  get_visits_to_current_domain_today(function(numVisits) {
    callback(numVisits)
  })
}

function displayCountdownOrBlock() {
  var display_timespent_div = $('<timespent-view>')
  $('body').append(display_timespent_div)
  var countdownTimer = setInterval(() => {
    getRemainingTimeDaily((timeRemaining) => {
      var minutes = Math.floor(timeRemaining / 60);
      var seconds = timeRemaining % 60;
      display_timespent_div.attr('display-text', minutes + " minute(s) and " + seconds + " seconds left.");
      if (timeRemaining < 0) {
        $('.timespent-view').remove();
        addEndDialog("Your time today is up!");
        clearInterval(countdownTimer);
      }
    })    
  }, 1000);
}

function main() {
  var myDate = new Date()
  var dateString = myDate.getDate() + " " + myDate.getMonth() + " " + myDate.getYear()

  //User has not been prompted for the current day
  if (localStorage.todayNoPrompt === null || localStorage.todayNoPrompt != dateString) {
    setTime(intervention.params.minutes.value)
    localStorage.todayNoPrompt = dateString
  //User has been prompted already for the current day
  } else {    
    getTimeSpent((currTimeSpent) => {
      const timesUp = (parseInt(intervention.params.cheatminutes.value) * 60) + parseInt(localStorage.cheatStart);
      //User is currently in "cheat" time
      if (localStorage.cheating === dateString && currTimeSpent < timesUp) {
        cheatCountdown()
      //User has time left or has time up
      } else {
        displayCountdownOrBlock()
      }
    })
  }
}

//main();
once_document_available(main);


})()