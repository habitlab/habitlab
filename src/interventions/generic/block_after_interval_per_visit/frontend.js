set_default_parameters({
  cheatseconds: 30 // Seconds to cheat for after time is up
})

const $ = require('jquery')

//Polymer Component
require_component('paper-slider')
require_component('paper-input')
require_component('paper-button')

require_component('interstitial-screen')
require_component('timespent-view')
require_component('habitlab-logo-v2')

const {
  get_is_new_session
} = require('libs_common/intervention_info')

const {
  once_body_available,
  create_shadow_div_on_body
} = require('libs_frontend/frontend_libs')

const {
  get_seconds_spent_on_current_domain_in_current_session
} = require('libs_common/time_spent_utils')

const {
  is_on_same_domain_and_same_tab
} = require('libs_common/session_utils')

const {
  printable_time_spent_long
} = require('libs_common/time_utils')

const {
  get_intervention_session_var,
  set_intervention_session_var,
} = require('libs_frontend/intervention_session_vars')

var shadow_root;
var shadow_div;

//Adds a dialog that prompts user for the amount of time they would like to be on Facebook
function addBeginDialog(message) {
  if (window.intervention_disabled) {
    return
  }
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

  const $logo = $('<center><habitlab-logo-v2></habitlab-logo-v2></center>').css({
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
      shadow_div.find('.beginBox').remove()
      set_intervention_session_var('seconds_selected', minutes*60)
      displayCountdown(minutes * 60)
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
  if (window.intervention_disabled) {
    return
  }
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
  const $cheatButton = $('<paper-button raised>')
  $cheatButton.text("Cheat for " + parameters.cheatseconds + " Seconds")
  $cheatButton.css({
    cursor: 'pointer',
    color: 'white',
    'font-size': '14px',
    'background-color': '#415D67',
    margin: '0 auto',
    height: '38px',
    'box-shadow': '2px 2px 2px #888888',
  })
  $cheatButton.click(() => {
    $dialogBox.remove()
    cheat(parameters.cheatseconds)
  })

  $contentContainer.append($('<habitlab-logo-v2>'));
  $contentContainer.append($('<p>'));
  $contentContainer.append($('<close-tab-button>'));
  $contentContainer.append($('<p>'));
  $contentContainer.append($cheatButton);
  $dialogBox.append($contentContainer);
}

function cheat(seconds) {
  var display_timespent_div = document.createElement('timespent-view')
  display_timespent_div.className = 'timespent-view'
  shadow_div.append(display_timespent_div)
  display_timespent_div.addEventListener('timer-finished', function() {
    shadow_div.find('.timespent-view').remove();
    addEndDialog("Your Cheating Time is Up!");
  })
  display_timespent_div.startTimer(seconds)
}

//Displays the countdown on the bottom left corner of the Facebook page
function displayCountdown(timeLimitThisVisit) {
  var display_timespent_div = document.createElement('timespent-view')
  display_timespent_div.className = 'timespent-view'
  shadow_div.append(display_timespent_div)
  display_timespent_div.addEventListener('timer-finished', function() {
    shadow_div.find('.timespent-view').remove();
    addEndDialog("Your time this visit is up!");
  })
  display_timespent_div.startTimer(timeLimitThisVisit)
}

function main() {
  addBeginDialog("How many minutes would you like to spend on " + intervention.sitename_printable + " this visit?");
}

(async function() {
  //const on_same_domain_and_same_tab = await is_on_same_domain_and_same_tab(tab_id)
  //if (on_same_domain_and_same_tab) {
  //  return
  //}
  const is_new_session = get_is_new_session();
  await once_body_available()
  shadow_div = create_shadow_div_on_body();
  shadow_root = shadow_div.shadow_root;
  shadow_div = $(shadow_div);
  if (!is_new_session) {
    let seconds_selected = await get_intervention_session_var('seconds_selected')
    if (!isFinite(seconds_selected)) {
      seconds_selected = 3*60
    }
    displayCountdown(seconds_selected) // todo get this from actual amount input by user
  } else {
    main()
  }
})()

window.on_intervention_disabled = () => {
  shadow_div.remove()
}
