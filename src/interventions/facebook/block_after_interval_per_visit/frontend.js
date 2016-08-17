(() => {

if (window.block_after_interval_per_visit) {
  return
}
window.block_after_interval_per_visit = true

const $ = require('jquery')

require('enable-webcomponents-in-content-scripts')

//Polymer Component
require('bower_components/paper-slider/paper-slider.deps')
require('bower_components/paper-input/paper-input.deps')

//SkateJS Component
require('components_skate/time-spent-display')

require('components/interstitial-screen.deps')
require('components/timespent-view.deps')
require('components/habitlab-logo.deps')

const {
  once_document_available
} = require('libs_frontend/common_libs')

const {
  get_seconds_spent_on_current_domain_today,
  get_seconds_spent_on_domain_today,
} = require('libs_common/time_spent_utils')

const {
  log_impression,
  log_action,
} = require('libs_common/log_utils')

var timeLimitThisVisit;
var timeBegun;

//Adds a dialog that prompts user for the amount of time they would like to be on Facebook
function addBeginDialog(message) {
  //Adds dialog that covers entire screen
  const $whiteDiv = $('<div class="beginBox">').css({
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

  const $logo = $('<center><habitlab-logo></habitlab-logo></center>').css({
    'margin-bottom': '80px'
  });
  $contentContainer.append($logo);

  const $slider = $('<paper-slider id="ratings" pin snaps min="1" max="5" max-markers="5" step="1" value="3" style="width: 500px" editable></paper-slider>')

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
      log_impression(intervention.name)
      timeBegun = Math.floor(Date.now() / 1000)
      timeLimitThisVisit = minutes * 60

      $('.beginBox').remove()
      displayCountdown()
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

//End message displayed after time spent
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

  //Cheat button
  const $cheatButton = $('<paper-button raised style="background-color: #ffffff;">')
  $cheatButton.text("Cheat for " + intervention.params.cheatseconds.value + " Seconds")
  $cheatButton.css({'cursor': 'pointer', 'padding': '5px'});
  $cheatButton.click(() => {
    $dialogBox.remove()
    cheat(intervention.params.cheatseconds.value)
  })

  $contentContainer.append($cheatButton);
  $dialogBox.append($contentContainer);
}

function cheat(minutes) {
  getTimeSpent((time) => {
    localStorage.cheatStart = time
    cheatCountdown()
  })
}

function cheatCountdown() {
  const timeCheatingUp = parseInt(intervention.params.cheatseconds.value) + parseInt(localStorage.cheatStart)

  var cheatTimer = setInterval(() => {
    getTimeSpent((timeSpent) => {
      console.log("Cheat start: " + localStorage.cheatStart)
      console.log("Cheat Seconds Allowed: " + intervention.params.cheatseconds.value)
      console.log("Time Cheating Up: " + timeCheatingUp)
      console.log("Time Spent: " + timeSpent)
      if (timeSpent > timeCheatingUp) {
        clearInterval(cheatTimer)
        addEndDialog('Your Cheating Time is Up!')
      }
    })
  }, 1000);
}

function getTimeSpent(callback) {
  get_seconds_spent_on_current_domain_today((secondsSpent) => {
    callback(secondsSpent)
  })
}

//Retrieves the remaining time left for the user to spend on facebook
function getRemainingTimeThisVisit() {
  const timeSpent = Math.floor(Date.now() / 1000) - timeBegun 
  return timeLimitThisVisit - timeSpent
}

//Displays the countdown on the bottom left corner of the Facebook page
function displayCountdown() {
  var display_timespent_div = $('<timespent-view>')
  $('body').append(display_timespent_div)
  var countdownTimer = setInterval(() => {
    const timeRemaining = getRemainingTimeThisVisit();
    var minutes = Math.floor(timeRemaining / 60);
    var seconds = timeRemaining % 60;
    display_timespent_div.attr('display-text', minutes + " minute(s) and " + seconds + " seconds left.");
    if (timeRemaining < 0) {
      $('.timespent-view').remove();
      addEndDialog("Your time this visit is up!");
      clearInterval(countdownTimer);
    }
  }, 1000);
}

function main() {
  addBeginDialog("How many minutes would you like to spend on Facebook this visit?");
}

once_document_available(main);

})()