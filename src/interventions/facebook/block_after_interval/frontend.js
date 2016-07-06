(() => {

if (window.block_after_interval) {
  return
}
window.block_after_interval = true

const $ = require('jquery')

require('enable-webcomponents-in-content-scripts')

require('bower_components/paper-slider/paper-slider.deps')
require('bower_components/paper-input/paper-input.deps')


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

function addDialog() {
  //Adds dialog that covers entire screen
  const $whiteDiv = $('<div class="whiteOverlay">').css({
              'position': 'fixed',
              'top': '0%',
              'left': '0%',
              'width': '100%',
              'height': '100%',
              'background-color': '#ccf3ff',
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
  $timeText.html("How many minutes do you want to spend on Facebook today?")
  $contentContainer.append($timeText)
  $contentContainer.append($('<p>'))

  const $slider = $('<paper-input label="minutes" auto-validate allowed-pattern="[0-9]" style="background-color: #33cfff"></paper-input>')
  $contentContainer.append($slider)
  $contentContainer.append($('<p>'))

  const $okButton = $('<button>');
  $okButton.text("Restrict My Minutes!");
  $okButton.css({'cursor': 'pointer', 'padding': '5px'});
  $okButton.click(() => {
    $('.whiteOverlay').remove()
  })

  const $center = $('<center>')
  $center.append($okButton)

  $contentContainer.append($center);

  $whiteDiv.append($contentContainer)
}

function firstTimeOnly() {

}

function everyTime() {

}

function noPrompting() {

}

function isVisited() {
  get_seconds_spent_on_current_domain_today(function(secondsSpent) {
    return secondsSpent < 2 ? true : false;
  })
}

function main() {
  console.log('in block_after_interval method')
  addDialog()
}

$(document).ready(main);

})()