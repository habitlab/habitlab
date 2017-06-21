{
  get_seconds_spent_on_domain_days_before_today
  get_visits_to_domain_days_before_today
} = require 'libs_common/time_spent_utils'

{
  printable_time_spent
} = require 'libs_common/time_utils'

{cfy} = require 'cfy'

# rewards spending less time
export time_spent_on_domain = (goal_info) ->
  {domain} = goal_info
  return (days_before_today) ->>
    seconds_spent = await get_seconds_spent_on_domain_days_before_today domain, days_before_today
    progress = seconds_spent / 60
    units = "minutes"
    message = printable_time_spent(seconds_spent)
    reward = 1.0 - Math.tanh(seconds_spent / 3600) # between 0 and 1
    return {
      progress
      units
      message
      reward
    }

# rewards visiting more
export visit_count_good = (goal_info) ->
  {domain} = goal_info
  return (days_before_today) ->>
    visits = await get_visits_to_domain_days_before_today domain, days_before_today
    progress = visits
    units = "visits"
    message = visits + " visits"
    reward = Math.tanh(visits)
    return {
      progress
      units
      message
      reward
    }

# this is a dummy progress measurement for debugging purposes
export always_zero_progress = (goal_info) ->
  return (days_before_today) ->>
    progress = 0
    units = "minutes"
    message = "0 seconds"
    reward = 0
    return {
      progress
      units
      message
      reward
    }
