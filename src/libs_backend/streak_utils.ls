const {
  get_duolingo_streak
} = require('libs_backend/duolingo_utils')

const {
  get_codeacademy_streak
} = require('libs_backend/codeacademy_utils')

const {
  get_goal_target
} = require('libs_backend/goal_utils')

const {
  get_progress_on_goal_days_before_today
} = require('libs_backend/goal_progress')

get_streak = (goal_info) ->>
  goal_name = goal_info.name
  if goal_name == 'duolingo/complete_lesson_each_day'
    return await get_duolingo_streak()
  else if goal_name == 'codeacademy/practice_each_day'
    return await get_codeacademy_streak()
  else
    target = await get_goal_target(goal_name)
    streak = 0
    streak_continuing = true
    while streak_continuing
      progress_info = await get_progress_on_goal_days_before_today goal_name, streak
      if goal_info.is_positive == (progress_info.progress >= target)
        streak += 1
      else
        streak_continuing = false
    return streak
  
module.exports = {
  get_streak
}
