{
  gexport
  gexport_module
} = require 'libs_common/gexport'

{memoize} = require 'libs_common/memoize'

export list_all_badge_info = ->
  output = [
    {
      minutes_saved: 15
      name: 'Starbucks'
      message: 'That is enough time to get a Starbucks coffee!'
      icon: 'starbucks.svg'
    }
    {
      minutes_saved: 30
      name: 'Workout'
      message: 'That is enough time for a workout at the gym!'
      icon: 'workout.svg'
    }
  ]
  for badge_info in output
    if badge_info.icon?
      badge_info.img_url = chrome.extension.getURL "icons/badges/#{badge_info.icon}"
    badge_info.type = 'minutes_saved'
  return output

export get_minutes_saved_to_badges = memoize ->
  output = {}
  for badge_info in list_all_badge_info()
    output[badge_info.minutes_saved] = badge_info
  return output

export get_badge_for_minutes_saved = (minutes_saved) ->
  minutes_saved_to_badges = get_minutes_saved_to_badges()
  return minutes_saved_to_badges[minutes_saved]

export get_timesaved_badge_that_should_be_awarded = (seconds_saved, seconds_saved_prev) ->
  for badge_info in list_all_badge_info()
    if seconds_saved_prev < badge_info.minutes_saved*60 <= seconds_saved
      return badge_info
  return

gexport_module 'badges_utils', -> eval(it)
