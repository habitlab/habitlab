{cfy} = require 'cfy'

{
  gexport
  gexport_module
} = require 'libs_common/gexport'

export get_num_times_intervention_used = cfy (intervention_name) ->*
  return 5

export get_intervention_level = cfy (intervention_name) ->*
  return 0

export get_time_saved_total = cfy ->*
  return 80

export get_time_saved_with_intervention = cfy (intervention_name) ->*
  return 20

export baseline_time_per_session_for_domain = cfy (domain) ->*
  return 5

gexport_module 'gamification_utils', -> eval(it)
