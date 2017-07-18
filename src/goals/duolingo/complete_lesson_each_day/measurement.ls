const {
  get_duolingo_is_logged_in,
  get_duolingo_streak
} = require 'libs_backend/duolingo_utils'

const {
  getvar_goal_unsynced_backend,
  setvar_goal_unsynced_backend
} = require 'libs_backend/goal_vars_backend'

const {
  get_streak
} = require 'libs_backend/goal_progress'

# check the streak on Duolingo, see if it matches what have 
module.exports = (goal_info) ->
  return (days_before_today) ->>
    progress = 0
    units = "lessons"
    message = "#{progress} #{units}"
    reward = 0
    return {
      progress
      units
      message
      reward
    }
    # if not get_duolingo_is_logged_in!
    #   alert "Have a second to log into Duolingo?"
    # else
    #   streak = await get_duolingo_streak
    #   recordedStreak = await get_streak goal_info.name
    #   if recordedStreak < streak
    #     await setvar_goal_unsynced_backend goal_info.name "streak" streak
    #     streakDict = await getvar_goal_unsynced_backend goal_info.name "streaks"
    #     streakDict[]

    #     # TODO: set as completed in db!
    #     progress = 1
   
    

    # TODO add a streak measurement function too
