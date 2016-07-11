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

//SkateJS Component
require('components_skate/time-spent-display')

require('components/interstitial-screen-polymer.deps')

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

//Adds a dialog that prompts user for the amount of time they would like to be on Facebook
function addBeginDialog(message) {
  //Adds dialog that covers entire screen
  const $whiteDiv = $('<div class="whiteOverlay">').css({
              'position': 'fixed',
              'top': '0%',
              'left': '0%',
              'width': '100%',
              'height': '100%',
              'background-color': '#f2fcff',
              'opacity': '0.97',
              'z-index': 350
  });
  $(document.body).append($whiteDiv)

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

  //const $slider = $('<paper-input label="minutes" auto-validate allowed-pattern="[0-9]" style="background-color: #94e6ff"></paper-input>')
  const $slider = $('<paper-slider id="ratings" pin snaps min="5" max="45" max-markers="30" step="1" value="25" style="width: 500px"></paper-slider>')


  const $okButton = $('<button>');
  $okButton.text("Restrict My Minutes!");
  $okButton.css({'cursor': 'pointer', 'padding': '5px'});
  $okButton.click(() => {
    var minutes = document.querySelector("paper-slider").value
    if (minutes === "") {
      if ($('.wrongInputText').length === 0) {
        const $wrongInputText = $('<div class="wrongInputText">').css({
          'color': 'red'
        })
        $wrongInputText.html("You must input a number.")
        $wrongInputText.insertAfter($slider)          
      }
    } else {
      log_impression('facebook/block_after_interval_daily')
      //Save time in database
      localStorage.setItem('timeLimitDaily', minutes * 60) //time limit stored in seconds
      $('.whiteOverlay').remove()
      displayCountdownOrBlock()
    }
  })

  const $center = $('<center>')
  $center.append($timeText)
  $center.append($('<p>'))  
  $center.append($slider)
  $center.append($('<p>'))  
  $center.append($okButton)
  $contentContainer.append($center);

  $whiteDiv.append($contentContainer)
}

function addEndDialog(message) {
  const $whiteDiv = $('<div class="whiteOverlay">').css({
              'position': 'fixed',
              'top': '0%',
              'left': '0%',
              'width': '100%',
              'height': '100%',
              'background-color': 'white',
              'z-index': 350
  });
  $(document.body).append($whiteDiv)

  //Centered container for text in the white box
  const $contentContainer = $('<div class="contentContainer">').css({
              'position': 'absolute',
              'top': '50%',
              'left': '50%',
              'transform': 'translateX(-50%) translateY(-50%)'
  });  
  const $timeText = $('<div class="titleText">').css({
    'font-size': '3em',
    'color': 'red'
  });
  $timeText.html(message)
  $contentContainer.append($timeText)
  $contentContainer.append($('<p>'))  

  $whiteDiv.append($contentContainer)  
}

//Retrieves the remaining time left for the user to spend on facebook
function getRemainingTimeDaily(callback) {
  getTimeSpent(function(timeSpent) {
    const timeLimitDaily = parseInt(localStorage.timeLimitDaily)
    callback(timeLimitDaily - timeSpent)
  })
}

function getTimeSpent(callback) {
  get_seconds_spent_on_current_domain_today(function(secondsSpent) {
    callback(secondsSpent)
  })
}

function displayCountdownOrBlock() {
  const display_timespent_div = $('<div class="timeSpent" style="background-color: #3B5998; position: fixed; color: white; width: 150px; height: 50px; bottom: 0px; left: 0px; z-index: 99999">')
  $('body').append(display_timespent_div)

  const countdownTimer = setInterval(() => {
    getRemainingTimeDaily(function(timeRemaining) {
      display_timespent_div.text("You have " + Math.floor(timeRemaining/60) + " minute(s) and " + timeRemaining%60 + " seconds left on Facebook")
      if (timeRemaining < 0) {
        $('.timeSpent').remove()
        addEndDialog("Your time today is up!")
        clearInterval(countdownTimer)
      }
    })
  }, 1000);
}

function main() {
  var myDate = new Date()
  var dateString = myDate.getDate() + " " + myDate.getMonth() + " " + myDate.getYear()

  if (localStorage.todayPrompt === null || localStorage.todayPrompt != dateString) {
    addBeginDialog("How many minutes would you like to spend on Facebook today?")
    localStorage.todayPrompt = dateString
  } else {
    displayCountdownOrBlock()
  }
}

main();

})()