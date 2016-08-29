(() => {

if (window.remove_news_feed) {
  return
}
window.remove_news_feed = true

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
} = require('libs_frontend/common_libs')

const {
  close_selected_tab
} = require('libs_common/tab_utils')

require('enable-webcomponents-in-content-scripts')
require('components/habitlab-logo.deps')

//Polymer button
require('bower_components/paper-button/paper-button.deps')

//Removes new feed (modified from 'kill news feed' src code)
function removeFeed() {
  var feed = $('[id^=topnews_main_stream], [id^=mostrecent_main_stream], [id^=pagelet_home_stream]');

  feed.children().css('opacity', 0);
  $('.ticker_stream').css('opacity', 0);
  $('.ego_column').css('opacity', 0);
  $('#pagelet_games_rhc').css('opacity', 0);
  $('#pagelet_trending_tags_and_topics').css('opacity', 0);
  $('#pagelet_canvas_nav_content').css('opacity', 0);
}

//Shows the news feed
function showFeed(intervalID) {
  $('habitlab-logo').remove()
  $('paper-button').remove()

  var feed = $('[id^=topnews_main_stream], [id^=mostrecent_main_stream], [id^=pagelet_home_stream]');

  feed.children().css('opacity', 1);
  $('.ticker_stream').css('opacity', 1);
  $('.ego_column').css('opacity', 1);
  $('#pagelet_games_rhc').css('opacity', 1);
  $('#pagelet_trending_tags_and_topics').css('opacity', 1);
  $('#pagelet_canvas_nav_content').css('opacity', 1);

  feedShown = true;
  clearInterval(intervalID) //stop refreshing the page to hide elements
}

//Attaches habitlab button and show news feed button
var intervalID;
function attachButtons() {
  log_impression(intervention.name)
  var habitlab_logo = $('<habitlab-logo intervention="facebook/remove_news_feed" style="text-align: center; margin: 0 auto; position: relative"></habitlab-logo>')
  var centerDiv = $('<center id=centerdiv></center>')
  var cheatButton = $('<paper-button style="background-color:white; text-align: center; margin: 0 auto; position: relative; background-color: red; color: white" raised>Show My News Feed This One Time</paper-button>')
  cheatButton.click(function(evt) {
    log_action(intervention.name, {'negative': 'Remained on Facebook.'})
    showFeed(intervalID)
  })
  var closeButton = $('<paper-button style="background-color:white; text-align: center; margin: 0 auto; position: relative; background-color: #8bc34a" raised>Close Facebook</paper-button>')
  closeButton.click(function(evt) {
    log_action(intervention.name, {'positive': 'Closed Facebook.'})
    close_selected_tab()
  })

  habitlab_logo.insertAfter($('#pagelet_composer'))
  centerDiv.insertAfter($('#pagelet_composer'))

  $('#centerdiv').append(closeButton)
  $('#centerdiv').append('<br><br>')
  $('#centerdiv').append(cheatButton)
  $('#centerdiv').append('<br><br>')
}

on_url_change(() => {
  var re = new RegExp('https?:\/\/www.facebook.com\/\??.*$');
  //If the user didn't click the button to show the news feed, show the "show" button & habitlab icon
  if ($('habitlab-logo').length == 0 && !feedShown && re.test(window.location.href)) {
    attachButtons();
  }
})

var feedShown = false;
attachButtons();
intervalID = window.setInterval(removeFeed, 200);
window.intervalID = intervalID;
document.body.addEventListener('disable_intervention', (intervalID) => {
  showFeed(window.intervalID);
});

})()