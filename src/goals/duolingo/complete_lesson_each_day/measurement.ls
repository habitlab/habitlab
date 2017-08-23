const {
  set_measurement_for_days_before_today,
  get_measurement_for_days_before_today
} = require 'libs_common/measurement_utils'

const {
  get_duolingo_is_logged_in,
  get_duolingo_info
} = require 'libs_backend/duolingo_utils'

require! {
  moment
}

module.exports = (goal_info) ->
  return (days_before_today) ->>
    
    # first, check the stored measurement value
    lessons_completed = await get_measurement_for_days_before_today 'duolingo_lessons_completed', days_before_today
    
    # if it's 0, go update the stored value using what Duolingo gives us and use that
    if days_before_today == 0 and lessons_completed == 0 and await get_duolingo_is_logged_in! 
      duolingo_info = await get_duolingo_info!
      days_ago_moment = moment().subtract(days_before_today, 'days')
      # iterate through the lesson events and increment lesson completed count if it's the right day
      for lesson in duolingo_info.calendar
        lesson_moment = moment().year(1970).month(0).date(1).hours(0).minutes(0).seconds(0).milliseconds(lesson.datetime)
        console.log "dbt: #{days_before_today} ld: #{lesson.datetime} days_ago_moment: #{days_ago_moment} lesson_moment: #{lesson_moment}"
        if days_ago_moment.isSame(lesson_moment, 'day')
          console.log 'Same day! ' + lesson.datetime
          lessons_completed += 1
      await set_measurement_for_days_before_today 'duolingo_lessons_completed', days_before_today, lessons_completed
      
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