module.exports = (goal_info) ->
  return (days_since_today, callback) ->
    progress = 0 # TODO actually measure this
    if days_since_today == 0
      progress = 2
    if days_since_today == 1 or days_since_today == 2
      progress = 1
    units = "lessons"
    message = "#{progress} #{units}"
    callback {
      progress
      units
      message
    }
