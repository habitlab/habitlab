{
  memoizeSingleAsync
} = require 'libs_common/memoize'

{
  gexport
  gexport_module
} = require 'libs_common/gexport'

{
  getkey_dict
  setkey_dict
  getdict
} = require 'libs_backend/db_utils'

{
  as_array
  remove_key_from_localstorage_dict
  remove_item_from_localstorage_list
} = require 'libs_common/collection_utils'

{
  unique_concat
} = require 'libs_common/array_utils'

{
  localget_json
} = require 'libs_common/cacheget_utils'

{
  get_favicon_data_for_domain
} = require 'libs_backend/favicon_utils'

{cfy, yfy} = require 'cfy'

getAllInterventionsGoalInfo = cfy ->*
  goal_info = {
    name: 'debug/all_interventions'
    sitename: 'debug'
    description: 'This goal is satisfied by all interventions'
    measurement: 'always_zero_progress'
  }
  all_interventions = yield intervention_utils.list_all_interventions()
  goal_info.interventions = all_interventions
  return goal_info

export getGoalInfo = cfy (goal_name) ->*
  all_goals = yield get_goals()
  return all_goals[goal_name]

/*
cached_get_goal_info_unmodified = {}

export getGoalInfo = cfy (goal_name) ->*
  if goal_name == 'debug/all_interventions'
    return yield getAllInterventionsGoalInfo()
  cached_goal_info = cached_get_goal_info_unmodified[goal_name]
  if cached_goal_info?
    return cached_goal_info
  goal_info = yield localget_json("/goals/#{goal_name}/info.json")
  goal_info.name = goal_name
  if not goal_info.sitename?
    goal_info.sitename = goal_name.split('/')[0]
  if not goal_info.sitename_printable?
    goal_info.sitename_printable = goal_info.sitename.substr(0, 1).toUpperCase() + goal_info.sitename.substr(1)
  if not goal_info.homepage?
    goal_info.homepage = "https://www.#{goal_info.sitename}.com/"
  cached_get_goal_info_unmodified[goal_name] = goal_info
  return goal_info
*/

export get_num_enabled_goals = cfy ->*
  enabled_goals = yield get_enabled_goals()
  return as_array(enabled_goals).length

default_goals_list = ['facebook/spend_less_time', 'youtube/spend_less_time']

export get_enabled_goals = cfy ->*
  enabled_goals_str = localStorage.getItem('enabled_goals')
  if not enabled_goals_str?
    enabled_goals = {}
    for default_goal_name in default_goals_list
      enabled_goals[default_goal_name] = true
  else
    enabled_goals = JSON.parse enabled_goals_str
    if enabled_goals['debug/all_interventions']
      if localStorage.getItem('intervention_view_show_debug_all_interventions_goal') != 'true'
        delete enabled_goals['debug/all_interventions']
        localStorage.setItem 'enabled_goals', JSON.stringify(enabled_goals)
  return enabled_goals

export set_enabled_goals = cfy (enabled_goals) ->*
  localStorage.setItem 'enabled_goals', JSON.stringify(enabled_goals)
  return

export set_goal_enabled_manual = cfy (goal_name) ->*
  enabled_goals = yield get_enabled_goals()
  prev_enabled_goals = {} <<< enabled_goals
  if enabled_goals[goal_name]?
    return
  enabled_goals[goal_name] = true
  yield set_enabled_goals enabled_goals
  log_utils.add_log_goals {
    type: 'goal_enabled'
    manual: true
    goal_name: goal_name
    prev_enabled_goals: prev_enabled_goals
    enabled_goals: enabled_goals
  }

export set_goals_enabled = cfy (goal_list) ->*
  enabled_goals = yield get_enabled_goals()
  prev_enabled_goals = {} <<< enabled_goals
  for goal_name in goal_list
    if enabled_goals[goal_name]?
      continue
    enabled_goals[goal_name] = true
  yield set_enabled_goals enabled_goals
  log_utils.add_log_goals {
    type: 'goals_enabled'
    manual: false
    goal_list: goal_list
    prev_enabled_goals: prev_enabled_goals
  }

export set_default_goals_enabled = cfy ->*
  yield set_goals_enabled default_goals_list

export set_goal_enabled = cfy (goal_name) ->*
  enabled_goals = yield get_enabled_goals()
  prev_enabled_goals = {} <<< enabled_goals
  if enabled_goals[goal_name]?
    return
  enabled_goals[goal_name] = true
  yield set_enabled_goals enabled_goals
  log_utils.add_log_goals {
    type: 'goal_enabled'
    manual: false
    goal_name: goal_name
    prev_enabled_goals: prev_enabled_goals
  }

export set_goal_disabled_manual = cfy (goal_name) ->*
  enabled_goals = yield get_enabled_goals()
  prev_enabled_goals = {} <<< enabled_goals
  if not enabled_goals[goal_name]?
    return
  delete enabled_goals[goal_name]
  yield set_enabled_goals enabled_goals
  log_utils.add_log_goals {
    type: 'goal_disabled'
    manual: false
    goal_name: goal_name
    prev_enabled_goals: prev_enabled_goals
  }

export set_goals_disabled = cfy (goal_list) ->*
  enabled_goals = yield get_enabled_goals()
  prev_enabled_goals = {} <<< enabled_goals
  for goal_name in goal_list
    if not enabled_goals[goal_name]?
      continue
    delete enabled_goals[goal_name]
  yield set_enabled_goals enabled_goals
  log_utils.add_log_goals {
    type: 'goals_disabled'
    manual: false
    goal_list: goal_list
    prev_enabled_goals: prev_enabled_goals
  }


export set_goal_disabled = cfy (goal_name) ->*
  enabled_goals = yield get_enabled_goals()
  prev_enabled_goals = {} <<< enabled_goals
  if not enabled_goals[goal_name]?
    return
  delete enabled_goals[goal_name]
  yield set_enabled_goals enabled_goals
  log_utils.add_log_goals {
    type: 'goal_disabled'
    manual: false
    goal_name: goal_name
    prev_enabled_goals: prev_enabled_goals
  }

export is_goal_enabled = cfy (goal_name) ->*
  enabled_goals = yield get_enabled_goals()
  return enabled_goals[goal_name]?

export get_goal_intervention_info = memoizeSingleAsync cfy ->*
  yield localget_json '/goal_intervention_info.json'

#local_cached_list_all_goals = null

export list_all_goals = cfy ->*
  #if local_cached_list_all_goals?
  #  return local_cached_list_all_goals
  cached_list_all_goals = localStorage.getItem 'cached_list_all_goals'
  if cached_list_all_goals?
    return JSON.parse cached_list_all_goals
    #local_cached_list_all_goals := JSON.parse cached_list_all_goals
    #return local_cached_list_all_goals
  #goals_list = yield localget_json('/goals/goals.json')
  goals_list = (yield get_goal_intervention_info()).goals.map((.name))
  extra_list_all_goals_text = localStorage.getItem 'extra_list_all_goals'
  if extra_list_all_goals_text?
    extra_list_all_goals = JSON.parse extra_list_all_goals_text
    goals_list = unique_concat goals_list, extra_list_all_goals
  localStorage.setItem 'cached_list_all_goals', JSON.stringify(goals_list)
  #local_cached_list_all_goals := goals_list
  return goals_list

export clear_cache_list_all_goals = ->
  #local_cached_list_all_goals := null
  localStorage.removeItem 'cached_list_all_goals'
  return

get_site_to_goals_sync = (goals) ->
  output = {}
  for goal_name,goal_info of goals
    sitename = goal_info.sitename
    if not output[sitename]?
      output[sitename] = []
    output[sitename].push goal_info
  return output

get_site_to_goals = cfy ->*
  goals = yield get_goals()
  return get_site_to_goals_sync(goals)

export list_goals_for_site = cfy (sitename) ->*
  # sitename example: facebook
  site_to_goals = yield get_site_to_goals()
  return site_to_goals[sitename]

export list_sites_for_which_goals_are_enabled = cfy ->*
  goals = yield get_goals()
  enabled_goals = yield get_enabled_goals()
  output = []
  output_set = {}
  for goal_name,goal_info of goals
    sitename = goal_info.sitename
    if enabled_goals[goal_name]? and not output_set[sitename]?
      output.push sitename
      output_set[sitename] = true
  return output

export list_site_info_for_sites_for_which_goals_are_enabled = cfy ->*
  goals = yield get_goals()
  enabled_goals = yield get_enabled_goals()
  site_to_goals = get_site_to_goals_sync(goals)
  output = []
  output_set = {}
  for goal_name,goal_info of goals
    sitename = goal_info.sitename
    if enabled_goals[goal_name]? and not output_set[sitename]?
      output.push {
        sitename: sitename
        sitename_printable: goal_info.sitename_printable
        goals: site_to_goals[sitename]
        goal_names: site_to_goals[sitename].map((.name))
      }
      output_set[sitename] = true
  return output

export get_goal_info = cfy (goal_name) ->*
  goals = yield get_goals()
  return goals[goal_name]

#local_cached_get_goals = null

/*
export get_goals = cfy ->*
  #if local_cached_get_goals?
  #  return local_cached_get_goals
  cached_get_goals = localStorage.getItem 'cached_get_goals'
  if cached_get_goals?
    return JSON.parse cached_get_goals
    #local_cached_get_goals := JSON.parse cached_get_goals
    #return local_cached_get_goals
  goals_list = yield list_all_goals()
  output = {}
  extra_get_goals_text = localStorage.getItem 'extra_get_goals'
  if extra_get_goals_text?
    extra_get_goals = JSON.parse extra_get_goals_text
    for k,v of extra_get_goals
      output[k] = v
  goal_name_to_info_promises = {[goal_name, getGoalInfo(goal_name)] for goal_name in goals_list when not output[goal_name]?}
  goal_info_dict = yield goal_name_to_info_promises
  for k,v of goal_info_dict
    output[k] = v
  localStorage.setItem 'cached_get_goals', JSON.stringify(output)
  #local_cached_get_goals := output
  return output
*/

export get_goals = cfy ->*
  #if local_cached_get_goals?
  #  return local_cached_get_goals
  cached_get_goals = localStorage.getItem 'cached_get_goals'
  if cached_get_goals?
    return JSON.parse cached_get_goals
    #local_cached_get_goals := JSON.parse cached_get_goals
    #return local_cached_get_goals
  goal_info_list = (yield get_goal_intervention_info()).goals
  output = {}
  for goal_info in goal_info_list
    output[goal_info.name] = goal_info
  extra_get_goals_text = localStorage.getItem 'extra_get_goals'
  if extra_get_goals_text?
    extra_get_goals = JSON.parse extra_get_goals_text
    for k,v of extra_get_goals
      output[k] = v
  localStorage.setItem 'cached_get_goals', JSON.stringify(output)
  #local_cached_get_goals := output
  return output

export clear_cache_get_goals = ->
  #local_cached_get_goals := null
  localStorage.removeItem 'cached_get_goals'
  return

export clear_cache_all_goals = ->
  clear_cache_get_goals()
  clear_cache_list_all_goals()
  return

export add_custom_goal_info = cfy (goal_info) ->*
  extra_get_goals_text = localStorage.getItem 'extra_get_goals'
  if extra_get_goals_text?
    extra_get_goals = JSON.parse extra_get_goals_text
  else
    extra_get_goals = {}
  extra_list_all_goals_text = localStorage.getItem 'extra_list_all_goals'
  if extra_list_all_goals_text?
    extra_list_all_goals = JSON.parse extra_list_all_goals_text
  else
    extra_list_all_goals = []
  extra_list_all_goals = unique_concat extra_list_all_goals, [goal_info.name]
  extra_get_goals[goal_info.name] = goal_info
  clear_cache_all_goals()
  localStorage.setItem 'extra_list_all_goals', JSON.stringify(extra_list_all_goals)
  localStorage.setItem 'extra_get_goals', JSON.stringify(extra_get_goals)
  yield list_all_goals()
  yield get_goals()
  return

export add_custom_goal_reduce_time_on_domain = cfy (domain) ->*
  domain_printable = domain
  if domain_printable.startsWith('www.')
    domain_printable = domain_printable.substr(4)
  custom_goal_name = "custom/spend_less_time_#{domain}"
  generic_interventions = yield intervention_utils.list_generic_interventions()
  generated_interventions = [x.split('generic/').join("generated_#{domain}/") for x in generic_interventions]
  goal_info = {
    name: custom_goal_name
    custom: true
    description: "Spend less time on #{domain_printable}"
    homepage: "http://#{domain}/"
    progress_description: "Time spent on #{domain_printable}"
    sitename: domain
    sitename_printable: domain_printable
    interventions: generated_interventions
    measurement: 'time_spent_on_domain'
    domain: domain
    target: {
      default: 20
      units: 'minutes'
    }
  }
  goal_info.icon = yield get_favicon_data_for_domain(domain)
  if not goal_info.icon?
    delete goal_info.icon
  yield add_custom_goal_info goal_info
  return

export add_enable_custom_goal_reduce_time_on_domain = cfy (domain) ->*
  yield add_custom_goal_reduce_time_on_domain(domain)
  yield set_goal_enabled("custom/spend_less_time_#{domain}")
  yield intervention_utils.generate_interventions_for_domain domain
  return

export disable_all_custom_goals = cfy ->*
  enabled_goals = yield get_enabled_goals()
  new_enabled_goals = {}
  for goal_name,is_enabled of enabled_goals
    if goal_name.startsWith('custom/')
      continue
    new_enabled_goals[goal_name] = is_enabled
  yield set_enabled_goals new_enabled_goals
  return

export remove_all_custom_goals_and_interventions = cfy ->*
  yield remove_all_custom_goals()
  intervention_utils.remove_all_custom_interventions()
  return

export remove_all_custom_goals = cfy ->*
  yield disable_all_custom_goals()
  clear_cache_all_goals()
  localStorage.removeItem 'extra_get_goals'
  localStorage.removeItem 'extra_list_all_goals'
  return

export remove_custom_goal_and_generated_interventions = cfy (goal_name) ->*
  all_goals = yield get_goals()
  goal = all_goals[goal_name]
  intervention_utils.remove_generated_interventions_for_domain goal.domain
  yield set_goal_disabled goal_name
  clear_cache_all_goals()
  remove_key_from_localstorage_dict 'extra_get_goals', goal_name
  remove_item_from_localstorage_list 'extra_list_all_goals', goal_name
  return

export get_interventions_to_goals = cfy ->*
  output = {}
  goals = yield get_goals()
  for goal_name,goal_info of goals
    for intervention_name in goal_info.interventions
      if not output[intervention_name]?
        output[intervention_name] = []
      output[intervention_name].push goal_info
  return output

export get_goals_for_intervention = cfy (intervention_name) ->*
  interventions_to_goals = yield get_interventions_to_goals()
  goals_for_intervention = interventions_to_goals[intervention_name] ? []
  return goals_for_intervention

export get_goal_target = cfy (goal_name) ->*
  result = yield getkey_dict 'goal_targets', goal_name
  if result?
    return parseInt(result)
  all_goals = yield get_goals()
  goal_info = all_goals[goal_name]
  return parseInt(goal_info.target.default)

export set_goal_target = cfy (goal_name, target_value) ->*
  yield setkey_dict 'goal_targets', goal_name, target_value
  return

export get_all_goal_targets = cfy ->*
  result = yield getdict 'goal_targets'
  if result?
    return result
  all_goals = yield get_goals()
  output = {}
  for goal_name,goal_info of all_goals
    output[goal_name] = goal_info.target.default
  return output

export list_goal_info_for_enabled_goals = cfy ->*
  goal_names = yield get_enabled_goals()
  goal_names = as_array goal_names
  goal_name_to_info = yield get_goals()
  return [goal_name_to_info[goal_name] for goal_name in goal_names]

intervention_utils = require 'libs_backend/intervention_utils'
log_utils = require 'libs_backend/log_utils'

gexport_module 'goal_utils', -> eval(it)
