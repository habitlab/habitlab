{
  get_seconds_spent_on_domain_days_since_today
} = require 'libs_common/time_spent_utils'

export time_spent_on_domain = (goal_info) ->
  {domain} = goal_info
  return (days_since_today, callback) ->
    seconds_spent <- get_seconds_spent_on_domain_days_since_today domain, days_since_today
    progress = seconds_spent / 60
    units = "minutes"
    message = "#{progress} #{units}"
    callback {
      progress
      units
      message
    }

# this is a dummy progress measurement for debugging purposes
export always_zero_progress = (goal_info) ->
  return (days_since_today, callback) ->
    progress = 0
    units = "minutes"
    message = "#{progress} #{units}"
    callback {
      progress
      units
      message
    }
