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
  var timelineFeed = $('.content-main.top-timeline-tweetbox').find('.stream-items.js-navigable-stream')
  timelineFeed.hide()
  var spinner = $('.stream-end-inner')
  spinner.hide()
}

function showFeed() {
  clearInterval(intervalID) //stop refreshing the page to hide elements  
  $('#habitlab_container').remove()

  var timelineFeed = $('.content-main.top-timeline-tweetbox').find('.stream-items.js-navigable-stream')
  timelineFeed.show()
  $('.stream-end-inner').show()
}

log_impression()
var container = $('<div style="text-align: center;" id="habitlab_container"></div>')
var habitlab_logo = $('<habitlab-logo></habitlab-logo>')
var cheatButton = $('<paper-button style="color: white; background-color: #415D67; box-shadow: 2px 2px 2px #888888;" raised>Show My Feed This One Time</paper-button></center>')
container.append([cheatButton, '<br><br>', habitlab_logo])
cheatButton.click(function() {
  showFeed()
})

$('.content-main.top-timeline-tweetbox').append(container)

window.on_intervention_disabled = () => {
  showFeed()
}

window.debugeval = x => eval(x);