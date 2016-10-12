{cfy} = require 'cfy'

{
  gexport
  gexport_module
} = require 'libs_common/gexport'

{
  getvar
  addtovar
  clearvar
  getkey_dict
  addtokey_dict
  addtokey_dictdict
  cleardict
} = require 'libs_common/db_utils'

export get_num_times_intervention_used = cfy (intervention_name) ->*
  return 5

export get_intervention_level = cfy (intervention_name) ->*
  return 0

export get_time_saved_total = cfy ->*
  result = yield getvar 'seconds_saved_total'
  return result ? 0

export get_time_saved_total_for_domain = cfy (domain) ->*
  result = yield getkey_dict 'seconds_saved_for_domain', domain
  return result ? 0

export get_time_saved_total_with_intervention = cfy (intervention_name) ->*
  result = yield getkey_dict 'seconds_saved_for_intervention', intervention_name
  return result ? 0

export baseline_time_per_session_for_domain = cfy (domain) ->*
  return 5*60

#export record_seconds_saved_and_get_badges = cfy (seconds, intervention_name, domain) ->*

export add_seconds_saved_with_intervention_on_domain = cfy (seconds, intervention_name, domain) ->*
  yield addtovar 'seconds_saved_total', seconds
  yield addtokey_dict 'seconds_saved_for_intervention', intervention_name, seconds
  yield addtokey_dict 'seconds_saved_for_domain', domain, seconds
  yield addtokey_dictdict 'seconds_saved_for_intervention_on_domain', intervention_name, domain, seconds
  return

#export set_seconds_saved_with_intervention_on_domain = cfy (seconds, intervention_name, domain) ->*
#  return

export clear_seconds_saved = cfy ->*
  yield clearvar 'seconds_saved_total'
  yield cleardict 'seconds_saved_for_intervention'
  yield cleardict 'seconds_saved_for_domain'
  yield cleardict 'seconds_saved_for_intervention_on_domain'
  return

gexport_module 'gamification_utils', -> eval(it)
