const $ = require('jquery')

const selectorsToHide = '.ticker_stream, .ego_column, #pagelet_games_rhc, #pagelet_trending_tags_and_topics, #pagelet_canvas_nav_content';

const {
  log_action,
} = require('libs_frontend/intervention_log_utils')

const {
  wrap_in_shadow
} = require('libs_frontend/frontend_libs')

const {
  on_url_change,
} = require('libs_frontend/frontend_libs')

const {
  msg
} = require('libs_common/localization_utils')

const {
  get_news_feed
}  = require('libs_frontend/facebook_utils')

require_component('habitlab-logo')
require_component('call-to-action-button')
require_component('paper-button')

var feedShown = false;
removeFeed()
var intervalID = window.setInterval(removeFeed, 30);

//Removes new feed (modified from 'kill news feed' src code)
function removeFeed() {
  var feed = get_news_feed();
  hide(feed.children());
  hide($(selectorsToHide));
  feedShown = false;
}

function hide(query) {
  query.css('opacity', 0);
  query.css('pointer-events', 'none');
}

function show(query) {
  query.css('opacity', 1);
  query.css('pointer-events', '');
}

//Shows the news feed
function showFeed() {
  clearInterval(intervalID) //stop refreshing the page to hide elements
  $('#habitlab_show_feed_div').remove()
  var feed = get_news_feed();
  show(feed.children());
  show($(selectorsToHide));
  feedShown = true;
}

//Attaches habitlab button and show news feed button
function attachButtons() {
  var habitlab_logo = $('<habitlab-logo style="text-align: center; margin: 0 auto; position: relative"></habitlab-logo>')
  var cheatButton = $('<paper-button style="text-align: center; margin: 0 auto; position: relative; background-color: #415D67; color: white; -webkit-font-smoothing: antialiased; height: 38px" raised>Show my News Feed</paper-button>')
  cheatButton.click(function(evt) {
    log_action({'negative': 'Remained on Facebook.'})
    showFeed()
  })
  var callToActionButton = $(`<call-to-action-button style="height:38px">`)
  var habitlab_show_feed_div = $('<div>')
  .css({
    'text-align': 'center'
  })
  .append([
    callToActionButton,
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
