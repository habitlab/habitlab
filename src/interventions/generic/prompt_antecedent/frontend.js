const $ = require('jquery')

//Polymer Component
require_component('paper-input')
require_component('paper-button')

require_component('interstitial-screen')
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
  is_on_same_domain_and_same_tab
} = require('libs_common/session_utils')

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

  const $messageText = $('<div class="titleText">').css({
    'font-size': '1.3em'
  });
  $messageText.html(message)

  const $logo = $('<center><habitlab-logo-v2></habitlab-logo-v2></center>').css({
    'margin-bottom': '80px'
  });
  $contentContainer.append($logo);

  const $input = $('<paper-input autofocus></paper-input>')
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
    var antecedent = shadow_root.querySelector("paper-input").value
    if (antecedent === "" || typeof(antecedent) != 'string') {
      if (shadow_div.find('.wrongInputText').length === 0) {
        const $wrongInputText = $('<div class="wrongInputText">').css({
          'color': 'red'
        })
        $wrongInputText.html("If you're in a rush, you can just put 'idk'")
        $wrongInputText.insertAfter($input)
      }
    } else {
      shadow_div.find('.beginBox').remove()
    }
  })

  const $center = $('<center>')
  $center.append($messageText)
  // $center.append($('<p>'))
  $center.append($input)
  $center.append($('<p>'))  
  $center.append($okButton)
  $contentContainer.append($center);

  $whiteDiv.append($contentContainer)
}



function main() {
  addBeginDialog("What antecedent (situation, emotion, or thought) occurred right before you got on " + intervention.sitename_printable + "?");
}

(async function() {
  console.log('prompt for antecedent code')
  const is_new_session = get_is_new_session();
  await once_body_available()
  shadow_div = create_shadow_div_on_body();
  shadow_root = shadow_div.shadow_root;
  shadow_div = $(shadow_div);
  main()
})()

window.on_intervention_disabled = () => {
  shadow_div.remove()
}
