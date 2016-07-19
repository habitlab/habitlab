(() => {

if (window.block_after_interval_daily) {
  return
}
window.block_after_interval_daily = true

const $ = require('jquery')

require('enable-webcomponents-in-content-scripts')

//Polymer Component
require('bower_components/paper-slider/paper-slider.deps')
require('bower_components/paper-input/paper-input.deps')
require('bower_components/paper-button/paper-button.deps')

//Custom Polymer Components
require('components/interstitial-screen.deps')
require('components/timespent-view.deps')

const {
  get_seconds_spent_on_current_domain_today,
  get_seconds_spent_on_domain_today,
} = require('libs_common/time_spent_utils')

const {
  printable_time_spent,
} = require('libs_common/time_utils')

const {
  log_impression,
  log_action,
} = require('libs_common/log_utils')

/*
Local storage constants:
- timeLimitDaily (seconds): The time limit the user chose to spend on facebook daily.
- cheating(date month year as String): The most recent day user pressed the cheating button
- cheatStart (seconds): The amount of time the user had already spent on FB when they pressed the cheat button.
- todayPrompt (date month year as String): The most recent day the user was prompted by the intervention
*/

//Adds a dialog that prompts user for the amount of time they would like to be on Facebook
function addBeginDialog(message) {
  //Adds dialog that covers entire screen
  const $beginBox = $('<div class="beginBox">').css({
              'position': 'fixed',
              'top': '0%',
              'left': '0%',
              'width': '100%',
              'height': '100%',
              'background-color': '#f2fcff',
              'opacity': '0.97',
              'z-index': 350
  });
  $(document.body).append($beginBox)

  //Centered container for text in the white box
  const $contentContainer = $('<div class="contentContainer">').css({
              'position': 'absolute',
              'top': '50%',
              'left': '50%',
              'transform': 'translateX(-50%) translateY(-50%)'
  });

  const $timeText = $('<div class="titleText">').css({
    'font-size': '1.3em'
  });
  $timeText.html(message)

  const $slider = $('<paper-slider id="ratings" pin snaps min="5" max="45" max-markers="30" step="1" value="25" style="width: 500px" editable></paper-slider>')

  const $okButton = $('<paper-button raised style="background-color: #ffffff;">');
  $okButton.text("Restrict My Minutes!");
  $okButton.css({'cursor': 'pointer', 'padding': '5px'});
  $okButton.click(() => {
    var minutes = document.querySelector("paper-slider").value
    log_impression('facebook/block_after_interval_daily')
    //Save time in database
    localStorage.setItem('timeLimitDaily', minutes * 60) //time limit stored in seconds
    $('.beginBox').remove()
    displayCountdownOrBlock()
  })

  const $center = $('<center>')
  $center.append($timeText)
  $center.append($('<p>'))  
  $center.append($slider)
  $center.append($('<p>'))  
  $center.append($okButton)
  $contentContainer.append($center);

  $beginBox.append($contentContainer)
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
              'transform': 'translateX(-50%) translateY(-50%)'
  }); 

  //Time up message displayed to user
  const $timeText = $('<div class="titleText">').css({
    'font-size': '3em',
    'color': 'red'
  });
  $timeText.html(message)
  $contentContainer.append($timeText)
  $contentContainer.append($('<p>'))  

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

  var cheatTimer = setInterval(() => {
    getTimeSpent((timeSpent) => {
      console.log("Cheat start: " + localStorage.cheatStart)
      console.log("Cheat Seconds Allowed: " + intervention.params.cheatminutes.value * 60)
      console.log("Time Cheating Up: " + timeCheatingUp)
      console.log("Time Spent: " + timeSpent)
      if (timeSpent > timeCheatingUp) {
        clearInterval(cheatTimer)
        addEndDialog('Your Cheating Time is Up!')
      }
    })
  }, 1000);
}

//Retrieves the remaining time left for the user to spend on facebook
function getRemainingTimeDaily(callback) {
  getTimeSpent((timeSpent) => {
    const timeLimitDaily = parseInt(localStorage.timeLimitDaily)
    callback(timeLimitDaily - timeSpent)
  })
}

function getTimeSpent(callback) {
  get_seconds_spent_on_current_domain_today((secondsSpent) => {
    callback(secondsSpent)
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
  if (localStorage.todayPrompt === null || localStorage.todayPrompt != dateString) {
    addBeginDialog("How many minutes would you like to spend on Facebook today?")
    localStorage.todayPrompt = dateString
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

main();

})()