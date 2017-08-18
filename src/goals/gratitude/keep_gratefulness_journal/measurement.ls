const {
  get_measurement_for_days_before_today
} = require 'libs_common/measurement_utils'

module.exports = (goal_info) ->
  return (days_before_today) ->>
    progress = await get_measurement_for_days_before_today 'gratitude_progress', days_before_today
    units = "times"
    message = "#{progress} #{units}"
    reward = Math.tanh(progress)
    return {
      progress
      units
      message
      reward
    }