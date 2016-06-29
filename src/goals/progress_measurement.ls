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

export lessons_completed_on_duolingo = (goal_info) ->
  return (days_since_today, callback) ->
    progress = 0 # TODO actually measure this
    units = "lessons"
    message = "#{progress} #{units}"
    callback {
      progress
      units
      message
    }
