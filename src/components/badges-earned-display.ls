{
  polymer_ext
} = require 'libs_frontend/polymer_utils'

$ = require 'jquery'

{
  close_selected_tab
} = require 'libs_common/tab_utils'

{
  get_intervention
} = require 'libs_common/intervention_info'

{
  get_badge_for_minutes_saved
} = require 'libs_common/badges_utils'

polymer_ext {
  is: 'badges-earned-display'
  properties: {
    badges: {
      type: Array
      value: []
    }
    isdemo: {
      type: Boolean
      observer: 'isdemo_changed'
    }
    url_of_next_page: String
  }
  compute_close_button_img_src: ->
    return chrome.extension.getURL 'icons/close_button.svg'
  isdemo_changed: (isdemo) ->
    if isdemo
      this.badges = [
        # { type: 'intervention_mastered', intervention_name: 'debug/fake_intervention' }
        get_badge_for_minutes_saved(15)
      ]
  play: ->
    return
  is_timesaved_badge: (badge) ->
    return badge.type == 'minutes_saved'
  is_intervention_mastered_badge: (badge) ->
    return badge.type == 'intervention_mastered'
  close_button_pressed: ->
    if this.url_of_next_page?
      window.location.href = 'https://' + this.url_of_next_page
    else
      close_selected_tab()
}
