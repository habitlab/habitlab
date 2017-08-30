{
  gexport
  gexport_module
} = require 'libs_common/gexport'

{memoize} = require 'libs_common/memoize'

export list_all_badge_info = ->
  output = [
    {
      minutes_saved: 10
      name: 'Mile Run'
      message: 'That is enough time to run a mile!'
      icon: 'run.svg'
    }
    {
      minutes_saved: 20
      name: 'Nap Time'
      message: 'That is enough time to fit in a quick nap!'
      icon: 'nap.svg'
    }
    {
      minutes_saved: 40
      name: 'Workout'
      message: 'That is enough time for a workout!'
      icon: 'workout.svg'
    }
    {
      minutes_saved: 60
      name: 'Hike'
      message: 'That is enough time for a hike!'
      icon: 'hike.svg'
    }
    {
      minutes_saved: 2*60
      name: 'Harry Potter'
      message: 'That is enough time to watch the first Harry Potter movie!'
      icon: 'wizard.svg'
    }
    {
      minutes_saved: 3*60
      name: 'Museum'
      message: 'That is enough time to go to go explore a museum!'
      icon: 'museum.svg'
    }
    {
      minutes_saved: 4*60
      name: 'Surfing'
      message: 'That is enough time to go to the beach for some surfing!'
      icon: 'surfing.svg'
    }
    {
      minutes_saved: 5*60
      name: 'Skydiving'
      message: 'That is enough time for a skydiving expedition!'
      icon: 'skydiving.svg'
    }
  ]
  for badge_info in output
    if badge_info.icon?
      badge_info.img_url = chrome.extension.getURL "icons/badges/#{badge_info.icon}"
    badge_info.type = 'minutes_saved'
    if badge_info.minutes_saved?
      if 59 < badge_info.minutes_saved < 61
        badge_info.time_message = '1 hour'
      else if badge_info.minutes_saved > 61
        badge_info.time_message = "#{Math.round(badge_info.minutes_saved / 60)} hours"
      else
        badge_info.time_message = "#{badge_info.minutes_saved} minutes"
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

export get_all_badges_earned_for_minutes_saved = (minutes_saved) ->
  output = []
  for badge_info in list_all_badge_info()
    if badge_info.minutes_saved <= minutes_saved
      output.push badge_info
  return output

gexport_module 'badges_utils', -> eval(it)
