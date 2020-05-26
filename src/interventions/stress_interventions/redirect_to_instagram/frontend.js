set_default_parameters({
  cheatseconds: 30 // Seconds to cheat for after time is up
})

const $ = require('jquery')

//Polymer Component
require_component('paper-slider')
require_component('paper-input')
require_component('paper-button')
require_component('purpose-banner')

require_component('interstitial-screen')
require_component('timespent-view')
require_component('habitlab-logo-v2')

const {
  get_is_new_session
} = require('libs_common/intervention_info')

const {
  once_body_available,
  create_shadow_div_on_body,
  append_to_body_shadow
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

function addBeginDialog(message) {
  console.log('addBeginDialog called')
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
              'z-index': 2147483646
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

  const $input = $('<paper-input autofocus label="objective"></paper-input>')
  const $okButton = $('<paper-button>');
  $input.on('keydown', function(evt) {
    evt.stopImmediatePropagation();
    if (evt.which == 13) { // enter key
      $okButton.click()
    }
  })
  $input.on('keyup', function(evt) {
    evt.stopImmediatePropagation();
  })
  $input.on('keypress', function(evt) {
    evt.stopImmediatePropagation();
  })

  //const $okButton = $('<button>');
  $okButton.text("Continue");
  $okButton.css({'cursor': 'pointer', 'padding': '10px', 'background-color': '#415D67', 'color': 'white', 'font-weight': 'normal', 'box-shadow': '2px 2px 2px #888888'});
  //$okButton.click(() => {
  $okButton.on('click', async function(evt) {
    evt.stopImmediatePropagation()
    var purpose = shadow_root.querySelector("paper-input").value
    if (purpose === "" || typeof(purpose) != 'string') {
      if (shadow_div.find('.wrongInputText').length === 0) {
        const $wrongInputText = $('<div class="wrongInputText">').css({
          'color': 'red'
        })
        $wrongInputText.html("You must input a purpose - something short is fine!")
        $wrongInputText.insertAfter($input)
      }
    } else {
      set_intervention_session_var('purpose', purpose)
      shadow_div.find('.beginBox').remove()
      displayPurpose(purpose)
    }
  })

  const $center = $('<center>')
  $center.append($timeText)
  // $center.append($('<p>'))
  $center.append($input)
  $center.append($('<p>'))  
  $center.append($okButton)
  $contentContainer.append($center);

  $whiteDiv.append($contentContainer)
}



// Keeping this in case we add a time question to it as well (for a "I'll do this for this long" type thing)
function addBeginDialogWithSlider(message) {
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
              'z-index': 2147483646
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
  $okButton.on('click', async function() {
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
      let current_time_spent = await get_seconds_spent_on_current_domain_in_current_session()
      set_intervention_session_var('seconds_spent_at_most_recent_start', current_time_spent)
      set_intervention_session_var('seconds_selected', minutes*60)
      displayCountdown(minutes * 60, current_time_spent)
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

async function cheat(seconds) {
  var display_timespent_div = document.createElement('timespent-view')
  display_timespent_div.className = 'timespent-view'
  shadow_div.append(display_timespent_div)
  display_timespent_div.addEventListener('timer-finished', function() {
    shadow_div.find('.timespent-view').remove();
    addEndDialog("Your Cheating Time is Up!");
  })
  let current_time_spent = await get_seconds_spent_on_current_domain_in_current_session()
  set_intervention_session_var('seconds_spent_at_most_recent_start', current_time_spent)
  set_intervention_session_var('seconds_selected', 30)
  display_timespent_div.startTimer(seconds, current_time_spent)
}

//Displays the countdown on the bottom left corner of the Facebook page
function displayCountdown(timeLimitThisVisit, seconds_spent_at_most_recent_start) {
  var display_timespent_div = document.createElement('timespent-view')
  display_timespent_div.className = 'timespent-view'
  shadow_div.append(display_timespent_div)
  display_timespent_div.addEventListener('timer-finished', function() {
    shadow_div.find('.timespent-view').remove();
    addEndDialog("Your time this visit is up!");
  })
  display_timespent_div.startTimer(timeLimitThisVisit, seconds_spent_at_most_recent_start)
}

require_component('show-timer-banner')

let purpose_banner;

function displayPurpose(purpose) {
  let purpose_banner_display = $('<purpose-banner>');
  purpose_banner_display.attr('purpose', purpose)
  shadow_div.append(purpose_banner_display)
  // purpose_banner = append_to_body_shadow(purpose_banner_display);
  console.log('Displaying it: ' + purpose)
}


function main() {
  addBeginDialog("I am visiting " + intervention.sitename_printable + " in order to");
  // addBeginDialog("How many minutes would you like to spend on " + intervention.sitename_printable + " this visit?");
}

(async function() {
  //const on_same_domain_and_same_tab = await is_on_same_domain_and_same_tab(tab_id)
  //if (on_same_domain_and_same_tab) {
  //  return
  //}
  console.log('prompt for purpose code')
  const is_new_session = get_is_new_session();
  await once_body_available()
  shadow_div = create_shadow_div_on_body();
  shadow_root = shadow_div.shadow_root;
  shadow_div = $(shadow_div);
  if (!is_new_session) {
    let purpose = await get_intervention_session_var('purpose')
    if (purpose != null) {
      displayPurpose(purpose)
      return
    }
  }
  main()
})()

window.on_intervention_disabled = () => {
  shadow_div.remove()
}
