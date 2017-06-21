module.exports = (goal_info) ->
  return (days_before_today) ->>
    progress = 0 # TODO actually measure this
    if days_before_today == 0
      progress = 2
    if days_before_today == 1 or days_before_today == 2
      progress = 1
    units = "lessons"
    message = "#{progress} #{units}"
    reward = 0
    return {
      progress
      units
      message
      reward
    }
