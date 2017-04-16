window.Polymer = window.Polymer || {}
window.Polymer.dom = 'shadow'

const $ = require('jquery')

const {
  log_action,
} = require('libs_frontend/intervention_log_utils')

const {
  wrap_in_shadow
} = require('libs_frontend/common_libs')

const {
  on_url_change,
} = require('libs_frontend/common_libs')

const {
  msg
} = require('libs_common/localization_utils')

require('enable-webcomponents-in-content-scripts')
require('components/habitlab-logo.deps')
require('components/close-tab-button.deps')

//Polymer button
require('bower_components/paper-button/paper-button.deps')

var feedShown = false;
var intervalID = window.setInterval(removeFeed, 200);

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
function showFeed() {
  clearInterval(intervalID) //stop refreshing the page to hide elements
  $('#habitlab_show_feed_div').remove()

  var feed = $('[id^=topnews_main_stream], [id^=mostrecent_main_stream], [id^=pagelet_home_stream]');

  feed.children().css('opacity', 1);
  $('.ticker_stream').css('opacity', 1);
  $('.ego_column').css('opacity', 1);
  $('#pagelet_games_rhc').css('opacity', 1);
  $('#pagelet_trending_tags_and_topics').css('opacity', 1);
  $('#pagelet_canvas_nav_content').css('opacity', 1);

  feedShown = true;
}

//Attaches habitlab button and show news feed button

function attachButtons() {
  var habitlab_logo = $('<habitlab-logo intervention="facebook/remove_news_feed" style="text-align: center; margin: 0 auto; position: relative"></habitlab-logo>')
  var cheatButton = $('<paper-button style="text-align: center; margin: 0 auto; position: relative; background-color: #415D67; color: white; -webkit-font-smoothing: antialiased; height: 38px" raised>Show my News Feed</paper-button>')
  cheatButton.click(function(evt) {
    log_action({'negative': 'Remained on Facebook.'})
    showFeed(intervalID)
  })
  var closeButton = $(`<close-tab-button text="${msg('Close Facebook')}">`)

  var habitlab_show_feed_div = $('<div>')
  .css({
    'text-align': 'center'
  })
  .append([
    closeButton,
    '<br><br>',
    cheatButton,
    '<br><br>',
    habitlab_logo
  ])
  var habitlab_show_feed_div_wrapper = $(wrap_in_shadow(habitlab_show_feed_div)).attr('id', 'habitlab_show_feed_div')
  habitlab_show_feed_div_wrapper.insertAfter($('#pagelet_composer'))
}

on_url_change(() => {
  var re = new RegExp('https?:\/\/www.facebook.com\/\??.*$');
  //If the user didn't click the button to show the news feed, show the "show" button & habitlab icon
  if ($('#habitlab_show_feed_div').length == 0 && !feedShown && re.test(window.location.href)) {
    attachButtons();
  }
})

attachButtons();

window.on_intervention_disabled = () => {
  showFeed();
}

window.debugeval = x => eval(x);
