set_default_parameters({
  cheatseconds: 30 // Seconds to cheat for after time is up
})

const $ = require('jquery')

//Polymer Component
require_component('paper-slider')
require_component('paper-input')
require_component('paper-button')
require_component('paper-card')

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

define_component(`
  <style>
    .beginBox{
      position: fixed;
      top: 0%;
      left: 0%;
      width: 100vw;
      height: 100vw;
      background-color: #f2fcff;
      opacity: 1;
      z-index: 2147483646;
    }
    .contentContainer {
      margin: auto; 
    }
    .titleText {
      margin-bottom: 10px;
      margin-top: 40vh;
    }
    .timeSelect {
      font-size: 1.3em;
      width: 80%;
    }
    .timeOption {
      display: inline-block;
      width: 20px;
      background-color: #415D67;
      color: white;
    }
    .customButton{
      display: inline-block;
      background-color: #415D67;
      color: white;
    }
    .customBox {
      display: inline-block;
      color: white;
    }
    .okButton {
      cursor: pointer;
      padding: 10px;
      background-color: #415D67;
      color: white;
      font-weight: normal;
      box-shadow: 2px 2px 2px #888888;
      margin-top: 30px;
    }
    .logo {

    }
  </style>
  <template>
    <div class="beginBox">
      <div class="contentContainer">
        
        <center class="logo"></center>
        <center>
          
          <div class="titleText">How many minutes would you like to spend on {{message}} this visit?</div>
          <p>
          <div class="timeSelect">
            <paper-button on-click="minutes_one" class="timeOption" raised>1</paper-button>
            <paper-button on-click="minutes_two" class="timeOption" raised>2</paper-button>
            <paper-button on-click="minutes_three" class="timeOption" raised>3</paper-button>
            <paper-button on-click="minutes_four" class="timeOption" raised>4</paper-button>
            <paper-button on-click="minutes_five" class="timeOption" raised>5</paper-button>
            <paper-input on-input="setCustomMinutes" auto-validate allowed-pattern="[0-9]" label="custom time" class="customBox" id="custom_time_value"></paper-input>
          </div>
          <p>
          <paper-button class="okButton" on-click="okClick"> Restrict me to {{time}} minutes!</paper-button><div class="logo"><habitlab-logo-v2 class="logo"></habitlab-logo-v2></ddiv>
        </center>
      </div>
    </div>
  </template>
`, {
  is: 'begin-dialog',
  properties: {
    time: {
      type: Number,
      value: 3
    },
    message: {
      type: String,
      value: intervention.sitename_printable
    },
    test: {
      type: Number,
      value: 7
    }
  },
  ready: function() {  
  },
  minutes_one: function() {
    this.time = 1
    this.$$('#custom_time_value').value = 0
  },
  minutes_two: function() {
    this.time = 2
    this.$$('#custom_time_value').value = 0
  },
  minutes_three: function() {
    this.time = 3
    this.$$('#custom_time_value').value = 0
  },
  minutes_four: function() {
    this.time = 4
    this.$$('#custom_time_value').value = 0
  },
  minutes_five: function() {
    this.time = 5
    this.$$('#custom_time_value').value = 0
  },
  setCustomMinutes: function() {
    let custom_time = this.$$('#custom_time_value').value
    if(custom_time != 0){
      this.time = custom_time
    }
  },
  okClick: async function() {
    this.remove()
    let current_time_spent = await get_seconds_spent_on_current_domain_in_current_session()
    set_intervention_session_var('seconds_spent_at_most_recent_start', current_time_spent)
    set_intervention_session_var('seconds_selected', this.time*60)
    displayCountdown(this.time * 60, current_time_spent)
  }
});

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

function main() {
  //addBeginDialog("How many minutes would you like to spend on " + intervention.sitename_printable + " this visit?");
  var custom_component = $('<begin-dialog>');
  shadow_div.append(custom_component);
  //shadow_div.append(custom_component);
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
    let seconds_spent_at_most_recent_start = await get_intervention_session_var('seconds_spent_at_most_recent_start')
    if (!isFinite(seconds_spent_at_most_recent_start)) {
      seconds_spent_at_most_recent_start = 0
    }
    let seconds_selected = await get_intervention_session_var('seconds_selected')
    if (!isFinite(seconds_selected)) {
      seconds_selected = 3*60
    }
    displayCountdown(seconds_selected, seconds_spent_at_most_recent_start) // todo get this from actual amount input by user
  } else {
    main()
  }
})()

window.on_intervention_disabled = () => {
  shadow_div.remove()
}
