(() => {

if (window.block_after_interval_daily) {
  return
}
window.block_after_interval_daily = true

const $ = require('jquery')

require('enable-webcomponents-in-content-scripts')

const {
  get_seconds_spent_on_current_domain_today,
  get_seconds_spent_on_domain_today,
  get_visits_to_current_domain_today,
} = require('libs_common/time_spent_utils')

const {
  log_impression,
  log_action,
} = require('libs_common/log_utils')


function setTime(minutes) {
  //Save the time limit in the database
  localStorage.setItem('timeLimitNoPrompt', minutes * 60) //time limit stored in seconds
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

  if (localStorage.todayNoPrompt === null || localStorage.todayNoPrompt != dateString) {
    setTime(intervention.params.minutes.value)
    localStorage.todayNoPrompt = dateString
    displayCountdownOrBlock()
  } else {
    //same day
    displayCountdownOrBlock()
  }
}

main();

})()