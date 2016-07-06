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
  on_url_change
} = require('libs_frontend/common_libs')

require('enable-webcomponents-in-content-scripts')
//require('components/habitlab-logo-polymer.deps')

function removeFeed() {
  /** Modified from Neal Wu's "Kill News Feed" */
  var feed = $('[id^=topnews_main_stream], [id^=mostrecent_main_stream], [id^=pagelet_home_stream]');
  feed.children().remove();
  $('.ticker_stream').remove();
  $('.ego_column').remove();
  $('#pagelet_games_rhc').remove();
  $('#pagelet_trending_tags_and_topics').remove();
  $('#pagelet_canvas_nav_content').remove();

  var habitlab_logo = $('<habitlab-logo-polymer intervention="facebook/remove_news_feed">');
  var message = $('<h1>')
            .attr('id', 'distracted')
            .text("Don't get distracted by Facebook!")
            .css('font-size', '30px')
            .css('font-family', "'Helvetica Neue', Helvetica, Arial, 'lucida grande', tahoma, verdana, arial, sans-serif")
            .css('position', 'relative')
            .css('top', '75px')
            .css('z-index', '9999999');

  $('[data-location=maincolumn]').append(message);
  //$('[data-location=maincolumn]').append(habitlab_logo);
}

/*
on_url_change(() => {
  console.log(`new url is ${window.location.href}`)
})
*/

log_impression('facebook/remove_news_feed')
window.setInterval(removeFeed, 200);

})()