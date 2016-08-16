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

require('enable-webcomponents-in-content-scripts')
require('components/habitlab-logo.deps')

//Polymer button
require('bower_components/paper-button/paper-button.deps')

//Removes new feed (modified from 'kill news feed' src code)
function removeFeed() {
  var feed = $('[id^=topnews_main_stream], [id^=mostrecent_main_stream], [id^=pagelet_home_stream]');

  feed.children().hide();
  $('.ticker_stream').hide();
  $('.ego_column').hide();
  $('#pagelet_games_rhc').hide();
  $('#pagelet_trending_tags_and_topics').hide();
  $('#pagelet_canvas_nav_content').hide();
  console.log("removing...")
}

//Shows the news feed
function showFeed(intervalID) {
  $('habitlab-logo').remove()
  $('paper-button').remove()

  var feed = $('[id^=topnews_main_stream], [id^=mostrecent_main_stream], [id^=pagelet_home_stream]');

  feed.children().show();
  $('.ticker_stream').show();
  $('.ego_column').show();
  $('#pagelet_games_rhc').show();
  $('#pagelet_trending_tags_and_topics').show();
  $('#pagelet_canvas_nav_content').show();  

  feedShown = true;
  clearInterval(intervalID) //stop refreshing the page to hide elements
}

//Attaches habitlab button and show news feed button
var intervalID;
function attachButtons() {
  log_impression(intervention.name)
  var habitlab_logo = $('<habitlab-logo intervention="facebook/remove_news_feed" style="text-align: center; margin: 0 auto; position: relative;"></habitlab-logo>')
  var centerDiv = $('<center id=centerdiv></center>')
  var cheatButton = $('<paper-button style="background-color:white; text-align: center; margin: 0 auto; position: relative;" raised>Show My News Feed This One Time</paper-button>')
  cheatButton.click(function(evt) {
    console.log(evt.currentTarget)
    log_action(intervention.name, {'negative': 'Remained on Facebook.'})
    showFeed(intervalID)
  })

  $('#contentArea').append(habitlab_logo)
  $('#contentArea').append(centerDiv)
  $('#centerdiv').append(cheatButton)
}

//Main

on_url_change(() => {
  var re = new RegExp('https?:\/\/www.facebook.com\/\??.*$');
  //If the user didn't click the button to show the news feed, show the "show" button & habitlab icon
  if ($('habitlab-logo').length == 0 && re.test(window.location.href)) {
    attachButtons();
  }
})

attachButtons();
var feedShown = false;
intervalID = window.setInterval(removeFeed, 200);
window.intervalID = intervalID;
document.body.addEventListener('disable_intervention', (intervalID) => {
  console.log(intervalID);
  showFeed(window.intervalID);
});

})()