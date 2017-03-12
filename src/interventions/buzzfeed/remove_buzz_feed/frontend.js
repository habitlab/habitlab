const $ = require('jquery')

const {
  get_seconds_spent_on_current_domain_today,
  get_seconds_spent_on_domain_today,
} = require('libs_common/time_spent_utils')

const {
  printable_time_spent,
} = require('libs_common/time_utils')

const {
  log_impression,
} = require('libs_frontend/intervention_log_utils')

const {
  on_url_change,
  once_available,
} = require('libs_frontend/common_libs')

require('enable-webcomponents-in-content-scripts')
require('components/habitlab-logo.deps')

//Polymer button
require('bower_components/paper-button/paper-button.deps')

var intervalID = window.setInterval(removeFeed, 200);

function removeFeed() {
  var timelineFeed = $('.grid-posts')
  timelineFeed.hide()
  var loadingButton = $('.feed__load-button')
  loadingButton.hide()
  var splash = $('.splash')
  splash.hide()
}

function showFeed() {  
  clearInterval(intervalID) //stop refreshing the page to hide elements  
  $('habitlab-logo').remove()
  $('paper-button').remove()
  
  $('.grid-posts').show()
  $('.feed__load-button').show()
  $('.splash').show()
}

log_impression()
var $center = $('<center>')
var $habitlab_logo = $('<habitlab-logo>')
var $cheatButton = $('<paper-button style="background-color:white" raised>Show My Feed This One Time</paper-button>')
$cheatButton.click(function() {
  showFeed()
})

$center.append($cheatButton)
$center.append($habitlab_logo)
$('.col1').append($center)

window.debugeval = x => eval(x);
