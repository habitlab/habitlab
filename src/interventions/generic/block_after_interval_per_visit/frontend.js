window.Polymer = window.Polymer || {}
window.Polymer.dom = 'shadow'

if (typeof(window.wrap) != 'function')
  window.wrap = null

const $ = require('jquery')

require('enable-webcomponents-in-content-scripts')

/*
window.Polymer = {
  dom: 'shadow',
  lazyRegister: true,
  useNativeCSSProperties: true,
}
*/

//Polymer Component
require('bower_components/paper-slider/paper-slider.deps')
require('bower_components/paper-input/paper-input.deps')
require('bower_components/paper-button/paper-button.deps')

require('components/interstitial-screen.deps')
require('components/timespent-view.deps')
require('components/habitlab-logo.deps')

const {
  once_body_available,
  create_shadow_div_on_body
} = require('libs_frontend/common_libs')

const {
  get_seconds_spent_on_current_domain_today
} = require('libs_common/time_spent_utils')

const {
  is_on_same_domain_and_same_tab
} = require('libs_common/session_utils')

var shadow_root;
var shadow_div;

(async function() {
  //const on_same_domain_and_same_tab = await is_on_same_domain_and_same_tab(tab_id)
  //if (on_same_domain_and_same_tab) {
  //  return
  //}

  await once_body_available()
  shadow_div = create_shadow_div_on_body();
  shadow_root = shadow_div.shadow_root;
  shadow_div = $(shadow_div);

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
                'opacity': 1,
                'z-index': Number.MAX_SAFE_INTEGER
    });
    shadow_div.append($whiteDiv)

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

    //const $okButton = $('<button>');
    const $okButton = $('<paper-button>');
    $okButton.text("Restrict My Minutes!");
    $okButton.css({'cursor': 'pointer', 'padding': '10px', 'background-color': '#415D67', 'color': 'white', 'font-weight': 'normal', 'box-shadow': '2px 2px 2px #888888'});
    //$okButton.click(() => {
    $okButton.on('click', () => {
      var minutes = shadow_root.querySelector("paper-slider").value
      if (minutes === "") {
        if (shadow_div.find('.wrongInputText').length === 0) {
          const $wrongInputText = $('<div class="wrongInputText">').css({
            'color': 'red'
          })
          $wrongInputText.html("You must input a number.")
          $wrongInputText.insertAfter($slider)
        }
      } else {
        timeBegun = Math.floor(Date.now() / 1000)
        timeLimitThisVisit = minutes * 60

        shadow_div.find('.beginBox').remove()
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
    shadow_div.append($dialogBox)

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
    get_seconds_spent_on_current_domain_today().then((secondsSpent) => {
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
    shadow_div.append(display_timespent_div)
    var update_countdown = () => {
      const timeRemaining = getRemainingTimeThisVisit();
      var minutes = Math.floor(timeRemaining / 60);
      var seconds = timeRemaining % 60;
      display_timespent_div.attr('display-text', minutes + " minute(s) and " + seconds + " seconds left.");
      if (timeRemaining < 0) {
        shadow_div.find('.timespent-view').remove();
        addEndDialog("Your time this visit is up!");
        clearInterval(countdownTimer);
      }
    }
    update_countdown();
    var countdownTimer = setInterval(update_countdown, 1000);
  }

  function main() {
    addBeginDialog("How many minutes would you like to spend on " + intervention.sitename_printable + " this visit?");
  }

  once_body_available(main);

})()

window.on_intervention_disabled = () => {
  shadow_div.remove()
}

window.debugeval = x => eval(x);
