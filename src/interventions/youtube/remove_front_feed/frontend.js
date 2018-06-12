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

const removeFeedOnceAvailable = run_only_one_at_a_time((callback) => {
  if (window.intervention_disabled) {
    return
  }
  // Immediately add CSS that hides the feed:
  //  The first rule hides the grey boxes that are visible during loading.
  //  The second rule hides the actual loaded feed items.
  //  That second rule must set visibility instead of display as otherwise
  //  it thinks that the user has scrolled and tries to load
  //  additional feed items repeatedly.
  $('<style class="habitlab_youtube_feeddiet_style">')
    .prop('type', 'text/css')
    .html('\
    #home-page-skeleton {\
      display: none !important;\
    }\
    ytd-browse[role="main"][page-subtype="home"] #contents {\
      visibility: hidden !important;\
    }\
    ')
    .appendTo('head')

  const feedSelector = 'ytd-browse[role="main"][page-subtype="home"] #contents'
  once_available_fast(feedSelector, () => {
    showFeedButton(feedSelector)
    callback()
  })
})


function showFeedButton(feedSelector) {
  if (window.intervention_disabled) {
    return
  }
  if ($('.habitlab_inserted_div').length > 0) {
    return
  }
  let habitLabDiv = $('<div style="width: 100%; text-align: center">')
  habitLabDiv.append($('<habitlab-logo-v2>'))
  habitLabDiv.append($('<br>'))
  let showFeedButton = $('<paper-button style="background-color: #415D67; color: white; -webkit-font-smoothing: antialiased; font-size: 14px; margin-top: 10px; box-shadow: 2px 2px 2px #888888;">Show Feed</paper-button>')
  showFeedButton.on('click', disableIntervention)
  habitLabDiv.append(showFeedButton)
  let habitLabDivWrapper = $(wrap_in_shadow(habitLabDiv)).addClass('habitlab_inserted_div').css('margin-top', '20px')
  $('ytd-browse').prepend(habitLabDivWrapper);
}

removeFeedOnceAvailable()

on_url_change(() => {
  removeFeedOnceAvailable()
})

function disableIntervention() {
  $('.habitlab_inserted_div').remove()
  $('.habitlab_youtube_feeddiet_style').remove();
  // The thumbnail heights are calculated,
  // so they end up at 0px unless explicitly reset
  // They're surprisingly less tempting without thumbnails,
  // so I'm tempted to comment this next line out
  $('ytd-thumbnail.ytd-grid-video-renderer').css('height', '100px')
}

window.on_intervention_disabled = () => {
  disableIntervention()
}