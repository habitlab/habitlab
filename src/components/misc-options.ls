{
  send_feature_enabled
  send_feature_disabled
} = require 'libs_backend/logging_enabled_utils'

Polymer {
  is: 'misc-options'
  properties: {
    allow_reward_gifs: {
      type: Boolean
      value: do ->
        stored_value = localStorage.getItem('allow_reward_gifs')
        if stored_value?
          return stored_value == 'true'
        return true
      observer: 'allow_reward_gifs_changed'
    }
    allow_daily_goal_notifications: {
      type: Boolean
      value: do ->
        stored_value = localStorage.getItem('allow_daily_goal_notifications')
        if stored_value?
          return stored_value == 'true'
        return true
      observer: 'allow_daily_goal_notifications_changed'
    }
  }
  rerender: ->
    this.allow_reward_gifs = do ->
      stored_value = localStorage.getItem('allow_reward_gifs')
      if stored_value?
        return stored_value == 'true'
      return true
    this.allow_daily_goal_notifications = do ->
      stored_value = localStorage.getItem('allow_daily_goal_notifications')
      if stored_value?
        return stored_value == 'true'
      return true
  allow_reward_gifs_changed: (allow_reward_gifs, prev_value_allow_reward_gifs) ->
    if not prev_value_allow_reward_gifs?
      return # was initializing
    if not allow_reward_gifs?
      return
    send_change = true
    prev_allow_reward_gifs = localStorage.getItem('allow_reward_gifs')
    if prev_allow_reward_gifs?
      prev_allow_reward_gifs = (prev_allow_reward_gifs == 'true')
      if prev_allow_reward_gifs == allow_reward_gifs # no change
        send_change = false
    localStorage.setItem('allow_reward_gifs', allow_reward_gifs)
    if allow_reward_gifs
      if send_change
        send_feature_enabled({page: 'settings', feature: 'allow_reward_gifs', manual: true})
    else
      if send_change
        send_feature_disabled({page: 'settings', feature: 'allow_reward_gifs', manual: true})
  allow_daily_goal_notifications_changed: (allow_daily_goal_notifications, prev_value_allow_daily_goal_notifications) ->
    if not prev_value_allow_daily_goal_notifications?
      return # was initializing
    if not allow_daily_goal_notifications?
      return
    send_change = true
    prev_allow_daily_goal_notifications = localStorage.getItem('allow_daily_goal_notifications')
    if prev_allow_daily_goal_notifications?
      prev_allow_daily_goal_notifications = (prev_allow_daily_goal_notifications == 'true')
      if prev_allow_daily_goal_notifications == allow_daily_goal_notifications # no change
        send_change = false
    localStorage.setItem('allow_daily_goal_notifications', allow_daily_goal_notifications)
    if allow_daily_goal_notifications
      if send_change
        send_feature_enabled({page: 'settings', feature: 'allow_daily_goal_notifications', manual: true})
    else
      if send_change
        send_feature_disabled({page: 'settings', feature: 'allow_daily_goal_notifications', manual: true})
}
