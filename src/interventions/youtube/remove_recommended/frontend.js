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

  /** 
   * First, use JS to inject CSS to hide the feeds
   * The info.yaml injects CSS to hide the feeds and does it faster,
   * but we do it in JavaScript as well because Youtube is a SPA,
   * so if the user disables the intervention on one video,
   * we need to re-enable the intervention on the next video
   * 
   * The first rule hides the grey boxes that are visible during loading.
   * The second rule hides the actual loaded feed items.
   * That second rule must set visibility instead of display as otherwise
   * it thinks that the user has scrolled and tries to load
   * additional feed items repeatedly.
   */
  $('<style class="habitlab_youtube_feeddiet_style">')
    .prop('type', 'text/css')
    .html('\
    ytd-browse[role="main"][page-subtype="home"] #contents {\
      visibility: hidden !important;\
    }\
    ytd-watch-next-secondary-results-renderer {\
      visibility: hidden !important;\
    }\
    ')
    .appendTo('head')

  // Once the front page feed has loaded, show those buttons
  const front_feed_selector = 'ytd-browse[role="main"][page-subtype="home"] #contents'
  once_available_fast(front_feed_selector, () => {
    show_buttons('ytd-browse')
    callback()
  })

  // Once the sidebar feed has loaded, show those buttons
  const side_feed_selector = 'ytd-watch[video-id] ytd-watch-next-secondary-results-renderer'
  once_available_fast(side_feed_selector, () => {
    show_buttons('#related')
    callback()
  })
})

function show_buttons(target_selector) {
  if (window.intervention_disabled) {
    return
  }
  if ($(target_selector).find('.habitlab_inserted_div').length > 0) {
    return
  }
  let habitlab_div = $('<div style="width: 100%; text-align: center">')
  habitlab_div.append($('<habitlab-logo-v2>'))
  habitlab_div.append($('<br>'))
  let showFeedButton = $('<paper-button style="background-color: #415D67; color: white; -webkit-font-smoothing: antialiased; font-size: 8px; margin-top: 10px; box-shadow: 2px 2px 2px #888888;">Show Feed This One Time</paper-button>')
  showFeedButton.on('click', disable_intervention)
  habitlab_div.append(showFeedButton)
  let habitlab_div_wrapper = $(wrap_in_shadow(habitlab_div))
      .addClass('habitlab_inserted_div').css('margin-top', '100px')
  $(target_selector).prepend(habitlab_div_wrapper)
}

function disable_intervention() {
  // Remove the previously inserted buttons and CSS
  $('.habitlab_inserted_div').remove()
  $('.habitlab_youtube_feeddiet_style').remove();

  // Set the previously hidden items to visible
  $('<style class="habitlab_youtube_feeddiet_style">')
    .prop('type', 'text/css')
    .html('\
    ytd-browse[role="main"][page-subtype="home"] #contents {\
      visibility: visible !important;\
    }\
    ytd-watch-next-secondary-results-renderer {\
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

remove_feed_once_available()

on_url_change(() => {
  remove_feed_once_available()
})

window.on_intervention_disabled = () => {
  disable_intervention()
}