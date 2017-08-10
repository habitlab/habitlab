const $ = require('jquery')

const {
  on_url_change,
  once_available,
} = require('libs_frontend/common_libs')

require_component('habitlab-logo')

//Polymer button
require_component('paper-button')

var intervalID = window.setInterval(removeFeed, 200);

function removeFeed() {
  var re = new RegExp('twitter.com\/\??.*$')
  if (!re.test(window.location.href)) {
    return
  }
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
