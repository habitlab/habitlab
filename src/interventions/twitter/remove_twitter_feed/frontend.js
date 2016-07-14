(() => {

if (window.remove_twitter_feed) {
  return
}
window.remove_twitter_feed = true

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
  log_action,
} = require('libs_common/log_utils')

const {
  on_url_change,
  once_available,
} = require('libs_frontend/common_libs')

require('enable-webcomponents-in-content-scripts')
require('components/habitlab-logo.deps')

//Polymer button
require('bower_components/paper-button/paper-button.deps')

function removeFeed() {
  var feed = $('.stream-items.js-navigable-stream')
  feed.hide()
  var spinner = $('.stream-end-inner')
  spinner.hide()
}

function showFeed(intervalID) {
  $('habitlab-logo').remove()
  $('paper-button').remove()

  $('.stream-items.js-navigable-stream').show()
  $('.stream-end-inner').show()
  clearInterval(intervalID) //stop refreshing the page to hide elements  
}

var intervalID;

log_impression('twitter/remove_twitter_feed')
var habitlab_logo = $('<habitlab-logo>')
var cheatButton = $('<center><paper-button style="background-color:white" raised>Show My Feed This One Time</paper-button></center>')
cheatButton.click(function() {
  showFeed(intervalID)
})

$('.content-main.top-timeline-tweetbox').append(cheatButton)
//NOTE: Logo does not show up right now!
$('.content-main.top-timeline-tweetbox').append(habitlab_logo) 

once_available('.stream-items.js-navigable-stream', function() {
  console.log("Hello!")
  removeFeed()
})
//intervalID = window.setInterval(removeFeed, 200);


})()