const {
  once_available_fast,
  on_url_change,
  wrap_in_shadow,
} = require('libs_frontend/frontend_libs')

require_component('habitlab-logo-v2')
require_component('paper-button')

const $ = require('jquery')

const {
  run_only_one_at_a_time
} = require('libs_common/common_libs')

const remove_feed_once_available = run_only_one_at_a_time((callback) => {
  if (window.intervention_disabled) {
    return
  }

  const feed_selector = 'ytd-browse[role="main"][page-subtype="home"] #contents'
  once_available_fast(feed_selector, () => {
    show_buttons(feed_selector)
    callback()
  })
})


function show_buttons(feed_selector) {
  if (window.intervention_disabled) {
    return
  }
  if ($('.habitlab_inserted_div').length > 0) {
    return
  }
  let habitlab_div = $('<div style="width: 100%; text-align: center">')
  habitlab_div.append($('<habitlab-logo-v2>'))
  habitlab_div.append($('<br>'))
  let showFeedButton = $('<paper-button style="background-color: #415D67; color: white; -webkit-font-smoothing: antialiased; font-size: 14px; margin-top: 10px; box-shadow: 2px 2px 2px #888888;">Show Feed This One Time</paper-button>')
  showFeedButton.on('click', disable_intervention)
  habitlab_div.append(showFeedButton)
  let habitlab_div_wrapper = $(wrap_in_shadow(habitlab_div))
      .addClass('habitlab_inserted_div').css('margin-top', '20px')
  $('ytd-browse').prepend(habitlab_div_wrapper);
}

remove_feed_once_available()

on_url_change(() => {
  remove_feed_once_available()
})

function disable_intervention() {
  $('.habitlab_inserted_div').remove()
  // Immediately add CSS that hides the feed:
  //  The first rule hides the grey boxes that are visible during loading.
  //  The second rule hides the actual loaded feed items.
  //  That second rule must set visibility instead of display as otherwise
  //  it thinks that the user has scrolled and tries to load
  //  additional feed items repeatedly.
  $('<style class="habitlab_youtube_feeddiet_style">')
    .prop('type', 'text/css')
    .html('\
    ytd-browse[role="main"][page-subtype="home"] #contents {\
      visibility: visible !important;\
    }\
    ')
    .appendTo('head')
  // The thumbnail heights are calculated,
  // so they end up at 0px unless explicitly reset
  // They're surprisingly less tempting without thumbnails,
  // so it wouldn't be a bad bug to comment this next line out :)
  $('ytd-thumbnail.ytd-grid-video-renderer').css('height', '100px')
}

window.on_intervention_disabled = () => {
  disable_intervention()
}