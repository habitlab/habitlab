const {
  get_measurement_for_days_before_today
} = require 'libs_common/measurement_utils'

const {
  get_duolingo_is_logged_in,
  get_duolingo_info
} = require 'libs_backend/duolingo_utils'

module.exports = (goal_info) ->
  return (days_before_today) ->>
    lessons_completed = await get_measurement_for_days_before_today 'duolingo_lessons_completed', days_before_today
    progress = lessons_completed
    units = "lessons"
    message = "#{progress} #{units}"
    reward = Math.tanh(lessons_completed)
    return {
      progress
      units
      message
      reward
    }