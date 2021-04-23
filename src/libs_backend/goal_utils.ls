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
  url_to_domain
} = require 'libs_common/domain_utils'

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
  remove_cached_favicon_for_domain
} = require 'libs_backend/favicon_utils'

require! {
  moment
}

getAllInterventionsGoalInfo = ->>
  goal_info = {
    name: 'debug/all_interventions'
    sitename: 'debug'
    description: 'This goal is satisfied by all interventions'
    measurement: 'always_zero_progress'
  }
  all_interventions = await intervention_utils.list_all_interventions()
  goal_info.interventions = all_interventions
  return goal_info

/*
cached_get_goal_info_unmodified = {}

export getGoalInfo = (goal_name) ->>
  if goal_name == 'debug/all_interventions'
    return await getAllInterventionsGoalInfo()
  cached_goal_info = cached_get_goal_info_unmodified[goal_name]
  if cached_goal_info?
    return cached_goal_info
  goal_info = await localget_json("/goals/#{goal_name}/info.json")
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

export get_num_enabled_goals = ->>
  enabled_goals = await get_enabled_goals()
  return as_array(enabled_goals).length

/**
 * Returns a list of names of enabled goals
 * @return {Promise.<Array.<GoalName>>} List of enabled goal names
 */
export list_enabled_goals = ->>
  enabled_goals = await get_enabled_goals()
  return as_array(enabled_goals)

default_goals_list = [
  'facebook/spend_less_time'
  'youtube/spend_less_time'
]

/**
 * Returns a object with with names of enabled goals as keys, and whether they are enabled as values
 * @return {Promise.<Object.<GoalName, boolean>>} Object with enabled goals as keys
 */
export get_enabled_goals = ->>
  all_goals = await get_goals()
  enabled_goals_str = localStorage.getItem('enabled_goals')
  enabled_goals = {}
  if not enabled_goals_str?
    for default_goal_name in default_goals_list
      if not all_goals[default_goal_name]?
        continue
      enabled_goals[default_goal_name] = true
  else
    for k,v of JSON.parse enabled_goals_str
      if not all_goals[k]?
        continue
      enabled_goals[k] = v
    if enabled_goals['debug/all_interventions']
      if localStorage.getItem('intervention_view_show_debug_all_interventions_goal') != 'true'
        delete enabled_goals['debug/all_interventions']
        localStorage.setItem 'enabled_goals', JSON.stringify(enabled_goals)
  return enabled_goals

export set_enabled_goals = (enabled_goals) ->>
  localStorage.setItem 'enabled_goals', JSON.stringify(enabled_goals)
  return

export set_goal_enabled_manual = (goal_name) ->>
  enabled_goals = await get_enabled_goals()
  prev_enabled_goals = {} <<< enabled_goals
  if enabled_goals[goal_name]?
    return
  enabled_goals[goal_name] = true
  await set_enabled_goals enabled_goals
  log_utils.add_log_goals {
    type: 'goal_enabled'
    manual: true
    goal_name: goal_name
    prev_enabled_goals: prev_enabled_goals
    enabled_goals: enabled_goals
  }

export set_goals_enabled = (goal_list) ->>
  enabled_goals = await get_enabled_goals()
  prev_enabled_goals = {} <<< enabled_goals
  for goal_name in goal_list
    if enabled_goals[goal_name]?
      continue
    enabled_goals[goal_name] = true
  await set_enabled_goals enabled_goals
  log_utils.add_log_goals {
    type: 'goals_enabled'
    manual: false
    goal_list: goal_list
    prev_enabled_goals: prev_enabled_goals
  }

export set_default_goals_enabled = ->>
  await set_goals_enabled default_goals_list

export set_goal_enabled = (goal_name) ->>
  enabled_goals = await get_enabled_goals()
  prev_enabled_goals = {} <<< enabled_goals
  if enabled_goals[goal_name]?
    return
  enabled_goals[goal_name] = true
  await set_enabled_goals enabled_goals
  log_utils.add_log_goals {
    type: 'goal_enabled'
    manual: false
    goal_name: goal_name
    prev_enabled_goals: prev_enabled_goals
  }

export set_goal_disabled_manual = (goal_name) ->>
  enabled_goals = await get_enabled_goals()
  prev_enabled_goals = {} <<< enabled_goals
  if not enabled_goals[goal_name]?
    return
  delete enabled_goals[goal_name]
  await set_enabled_goals enabled_goals
  log_utils.add_log_goals {
    type: 'goal_disabled'
    manual: true
    goal_name: goal_name
    prev_enabled_goals: prev_enabled_goals
  }

export set_goals_disabled = (goal_list) ->>
  enabled_goals = await get_enabled_goals()
  prev_enabled_goals = {} <<< enabled_goals
  for goal_name in goal_list
    if not enabled_goals[goal_name]?
      continue
    delete enabled_goals[goal_name]
  await set_enabled_goals enabled_goals
  log_utils.add_log_goals {
    type: 'goals_disabled'
    manual: false
    goal_list: goal_list
    prev_enabled_goals: prev_enabled_goals
  }

export set_goal_disabled = (goal_name) ->>
  enabled_goals = await get_enabled_goals()
  prev_enabled_goals = {} <<< enabled_goals
  if not enabled_goals[goal_name]?
    return
  delete enabled_goals[goal_name]
  await set_enabled_goals enabled_goals
  log_utils.add_log_goals {
    type: 'goal_disabled'
    manual: false
    goal_name: goal_name
    prev_enabled_goals: prev_enabled_goals
  }

export is_goal_enabled = (goal_name) ->>
  enabled_goals = await get_enabled_goals()
  return enabled_goals[goal_name]?

export site_has_enabled_spend_less_time_goal = (domain) ->>
  goals = await get_goals()
  for goal_name,goal_info of goals
    if domain == goal_info.domain and not goal_info.is_positive
      return await is_goal_enabled(goal_name)
  return false

export get_goal_intervention_info = memoizeSingleAsync ->>
  await localget_json '/goal_intervention_info.json'

#local_cached_list_all_goals = null

/**
 * Lists names of all available goals
 * @return {Promise.<Array.<GoalName>>} List of goal names.
 */
export list_all_goals = ->>
  #if local_cached_list_all_goals?
  #  return local_cached_list_all_goals
  cached_list_all_goals = localStorage.getItem 'cached_list_all_goals'
  if cached_list_all_goals?
    return JSON.parse cached_list_all_goals
    #local_cached_list_all_goals := JSON.parse cached_list_all_goals
    #return local_cached_list_all_goals
  #goals_list = await localget_json('/goals/goals.json')
  goals_list = (await get_goal_intervention_info()).goals.map((.name))
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

get_site_to_goals = ->>
  goals = await get_goals()
  return get_site_to_goals_sync(goals)

export list_goals_for_location = (domain) ->>
  # domain example: www.reddit.com
  all_goals = await get_goals()
  output = []
  for goal_name,goal_info of all_goals
    if domain.indexOf(goal_info.domain) != -1
      output.push(goal_name)
  return output

export list_nonpositive_goals_for_location = (domain) ->>
  # domain example: www.reddit.com
  all_goals = await get_goals()
  output = []
  for goal_name,goal_info of all_goals
    if goal_info.is_positive
      continue
    if domain.indexOf(goal_info.domain) != -1
      output.push(goal_name)
  return output

export list_goals_for_site = (sitename) ->>
  # sitename example: facebook
  site_to_goals = await get_site_to_goals()
  return site_to_goals[sitename]

export list_sites_for_which_goals_are_enabled = ->>
  goals = await get_goals()
  enabled_goals = await get_enabled_goals()
  output = []
  output_set = {}
  for goal_name,goal_info of goals
    sitename = goal_info.sitename
    if enabled_goals[goal_name]? and not output_set[sitename]?
      output.push sitename
      output_set[sitename] = true
  return output

export list_site_info_for_sites_for_which_goals_are_enabled = ->>
  goals = await get_goals()
  enabled_goals = await get_enabled_goals()
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

/**
 * Gets the goal info for the specified goal name
 * @param {GoalName} goal_name - The name of the goal
 * @return {Promise.<GoalInfo>} The goal info
 */
export get_goal_info = (goal_name) ->>
  goals = await get_goals()
  return goals[goal_name]

#local_cached_get_goals = null

/*
export get_goals = ->>
  #if local_cached_get_goals?
  #  return local_cached_get_goals
  cached_get_goals = localStorage.getItem 'cached_get_goals'
  if cached_get_goals?
    return JSON.parse cached_get_goals
    #local_cached_get_goals := JSON.parse cached_get_goals
    #return local_cached_get_goals
  goals_list = await list_all_goals()
  output = {}
  extra_get_goals_text = localStorage.getItem 'extra_get_goals'
  if extra_get_goals_text?
    extra_get_goals = JSON.parse extra_get_goals_text
    for k,v of extra_get_goals
      output[k] = v
  goal_name_to_info_promises = {[goal_name, getGoalInfo(goal_name)] for goal_name in goals_list when not output[goal_name]?}
  goal_info_dict = await goal_name_to_info_promises
  for k,v of goal_info_dict
    output[k] = v
  localStorage.setItem 'cached_get_goals', JSON.stringify(output)
  #local_cached_get_goals := output
  return output
*/

/**
 * Gets the goal info for all goals, in the form of an object mapping goal names to goal info
 * @return {Promise.<Object.<GoalName, GoalInfo>>} Object mapping goal names to goal info
 */
export get_goals = ->>
  #if local_cached_get_goals?
  #  return local_cached_get_goals
  cached_get_goals = localStorage.getItem 'cached_get_goals'
  if cached_get_goals?
    output = JSON.parse cached_get_goals
    for goal_name,goal_info of output
      if goal_info.icon == 'icon.png' or goal_info.icon == 'icon.svg' or goal_info.icon == 'icon.jpg'
        goal_info.icon = chrome.runtime.getURL('goals/' + goal_name + '/' + goal_info.icon)
    return output
    #local_cached_get_goals := JSON.parse cached_get_goals
    #return local_cached_get_goals
  goal_info_list = JSON.parse JSON.stringify (await get_goal_intervention_info()).goals
  output = {}
  for goal_info in goal_info_list
    output[goal_info.name] = goal_info
  extra_get_goals_text = localStorage.getItem 'extra_get_goals'
  if extra_get_goals_text?
    extra_get_goals = JSON.parse extra_get_goals_text
    for k,v of extra_get_goals
      output[k] = v
  extra_get_interventions_text = localStorage.getItem 'extra_get_interventions'
  goal_name_to_intervention_name_set = {}
  if extra_get_interventions_text?
    extra_get_interventions = JSON.parse extra_get_interventions_text
    for intervention_name,intervention_info of extra_get_interventions
      if not intervention_info.custom
        continue
      for goal_name in intervention_info.goals
        goal_info = output[goal_name]
        if not goal_info?
          continue
        intervention_name_set = goal_name_to_intervention_name_set[goal_name]
        if not intervention_name_set?
          intervention_name_set = {[existing_intervention_name, true] for existing_intervention_name in goal_info.interventions}
          goal_name_to_intervention_name_set[goal_name] = intervention_name_set
        if intervention_name_set[intervention_name]
          continue
        intervention_name_set[intervention_name] = true
        goal_info.interventions.push(intervention_name)
  localStorage.setItem 'cached_get_goals', JSON.stringify(output)
  #local_cached_get_goals := output
  for goal_name,goal_info of output
    if goal_info.icon == 'icon.png' or goal_info.icon == 'icon.svg' or goal_info.icon == 'icon.jpg'
      goal_info.icon = chrome.runtime.getURL('goals/' + goal_name + '/' + goal_info.icon)
  return output

export get_unproductive_domains_set = memoizeSingleAsync ->>
  unproductive_domains_list = await fetch('/unproductive_domains.json').then((.json!))
  unproductive_domains_set = new Set()
  for x in unproductive_domains_list
    unproductive_domains_set.add(x)
  return unproductive_domains_set

export is_domain_unproductive = (domain) ->>
  unproductive_domains_set = await get_unproductive_domains_set()
  if unproductive_domains_set.has(domain)
    return true
  return false

/**
 * Gets the goal info for all goals where is_positive set to true, in the form of an object mapping goal names to goal info
 * @return {Promise.<Object.<GoalName, GoalInfo>>} Object mapping goal names to goal info
 */
export get_positive_enabled_goals = ->>
  goal-to-info-map = await get_goals!
  enabled_goals = await get_enabled_goals!
  output = {}
  for goal, goal_info of goal-to-info-map
    if enabled_goals[goal] and goal_info.is_positive
      output[goal] = goal_info
  return output

cached_domains_suggested_as_goal = {}

export get_have_suggested_domain_as_goal = (domain) ->>
  if cached_domains_suggested_as_goal[domain]?
    return cached_domains_suggested_as_goal[domain]
  has_been_suggested = await getkey_dict 'domains_suggested_as_goals', domain
  cached_domains_suggested_as_goal[domain] = has_been_suggested
  return has_been_suggested

export remove_have_suggested_domain_as_goal = (domain) ->>
  cached_domains_suggested_as_goal[domain] = false
  await setkey_dict 'domains_suggested_as_goals', domain, false
  return

export record_have_suggested_domain_as_goal = (domain) ->>
  cached_domains_suggested_as_goal[domain] = true
  await setkey_dict 'domains_suggested_as_goals', domain, true
  return

export accept_domain_as_goal_and_record = (domain) ->>
  await record_have_suggested_domain_as_goal(domain)
  await log_utils.log_goal_suggestion_action({'action': 'accepted', 'accepted': 'true', 'goal_type': 'spend_less_time', 'domain': domain})
  await add_enable_custom_goal_reduce_time_on_domain(domain)
  /*
  await record_have_suggested_domain_as_goal(window.location.host)
  await log_goal_suggestion_action({'action': 'accepted', 'accepted': 'true', 'type': 'spend_less_time', 'domain': window.location.host})
  await add_enable_custom_goal_reduce_time_on_domain(window.location.host)
  */
  return

export reject_domain_as_goal_and_record = (domain) ->>
  await record_have_suggested_domain_as_goal(domain)
  await log_utils.log_goal_suggestion_action({'action': 'rejected', 'accepted': 'false', 'goal_type': 'spend_less_time', 'domain': domain})
  /*
  await record_have_suggested_domain_as_goal(window.location.host)
  await log_goal_suggestion_action({'action': 'rejected', 'accepted': 'false', 'type': 'spend_less_time', 'domain': window.location.host})
  */
  return

/**
 * Gets the goal info for all goals where is_positive set to true and that have not yet been completed
 * @return {Promise.<Object.<GoalName, GoalInfo>>} Object mapping goal names to goal info
 */
export get_positive_enabled_uncompleted_goals = ->>
  goals = await get_positive_enabled_goals!
  output = {}
  completed_promises_list = []
  goal_list = Object.keys(goals)
  for goal_name in goal_list
    completed_promises_list.push goal_progress.get_whether_goal_achieved_today(goal_name)
  completed_list = await Promise.all completed_promises_list
  for goal_name,idx in goal_list
    completed = completed_list[idx]
    goal_info = goals[goal_name]
    if not completed
      output[goal_name] = goal_info
  return output

/**
 * Gets the goal info for a random enabled positive goal
 * @return {GoalInfo} The goal info
 */
export get_random_positive_goal = ->>
  goal-name-to-goal-info = await get_positive_enabled_goals!
  return get_random_value_from_object goal-name-to-goal-info

/**
 * Gets the goal info for a random enabled uncompleted positive goal
 * @return {GoalInfo} The goal info
 */
export get_random_uncompleted_positive_goal = ->>
  goal-name-to-goal-info = await get_positive_enabled_uncompleted_goals!
  console.log goal-name-to-goal-info
  return get_random_value_from_object goal-name-to-goal-info

get_random_value_from_object = (obj) ->
  keyList = Object.keys obj
  if keyList.length == 0
    return null
  rand-index = Math.floor (Math.random! * keyList.length)
  key = keyList[rand-index]
  return obj[key]  

/* TODO: Consolidate with get_positive_enabled_goals */
export get_spend_more_time_goals = ->>
  goals = await get_goals()
  spend-more-time-goals = {}
  for goal, goal-info of goals
    if goal-info.is_positive
      spend-more-time-goals[goal] = goal-info
  return spend-more-time-goals

export clear_cache_get_goals = ->
  #local_cached_get_goals := null
  localStorage.removeItem 'cached_get_goals'
  return

export clear_cache_all_goals = ->
  clear_cache_get_goals()
  clear_cache_list_all_goals()
  return

/*
export make_goal_frequency_info = ->
  output = {}
  output.algorithm = 'isoweek_alternating'
  output.onweeks = Math.round(Math.random()) # either 0 or 1
  output.timestamp = Date.now()
  return output
*/

export make_goal_frequency_info = ->
  output = {}
  output.algorithm = 'isoweek_random'
  output.onweeks = [Math.round(Math.random()) for x from 0 to 53] # either 0 or 1. 54 entries total since isoweek ranges from 1 to 53, ignore 0th entry
  output.timestamp = Date.now()
  return output

export get_is_goal_frequent_from_frequency_info = (goal_frequency_info) ->
  algorithm = goal_frequency_info.algorithm
  if algorithm == 'isoweek_alternating'
    isoweek = moment().isoWeek()
    onweeks = goal_frequency_info.onweeks
    return (isoweek % 2) == onweeks
  if algorithm == 'isoweek_random'
    isoweek = moment().isoWeek()
    onweeks = goal_frequency_info.onweeks
    return onweeks[isoweek] == 1
  throw new Error('goal frequency algorithm not implemented')

export get_is_goal_frequent = (goal_name) ->>
  goal_frequency_info = await getkey_dict 'goal_frequencies', goal_name
  if goal_frequency_info?
    goal_frequency_info = JSON.parse goal_frequency_info
    if goal_frequency_info.algorithm == 'isoweek_alternating'
      if (moment().year() == 2018) and (moment().isoWeek() > 32) # august 13, 2018 or after
        goal_frequency_info = make_goal_frequency_info()
        await setkey_dict 'goal_frequencies', goal_name, JSON.stringify(goal_frequency_info)
  else
    goal_frequency_info = make_goal_frequency_info()
    await setkey_dict 'goal_frequencies', goal_name, JSON.stringify(goal_frequency_info)
  return get_is_goal_frequent_from_frequency_info goal_frequency_info

export add_custom_goal_info = (goal_info) ->>
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
  await list_all_goals()
  await get_goals()
  return

export add_custom_goal_reduce_time_on_domain = (domain) ->>
  await add_custom_goal_involving_time_on_domain(domain, false)
  return

export get_goal_statement = (goal_info) ->>
  if goal_info.goal_statement_to_fill_in?
    ad_lib = goal_info.goal_statement_to_fill_in
    target = await get_goal_target(goal_info.name)
    ad_lib = ad_lib.replace("TARGET", target)

    unit = goal_info.target.units
    if goal_info.goal_statement_units?
      unit = goal_info.goal_statement_units
    if target == 1
      unit = unit.substring(0, unit.length-1)
    return ad_lib.replace("UNITS", unit)
  else
    return goal_info.description

export add_custom_goal_involving_time_on_domain = (domain, is-positive) ->>
  domain_printable = domain
  if domain_printable.startsWith('www.')
    domain_printable = domain_printable.substr(4)
  
  if is-positive
    custom_goal_name = "custom/spend_more_time_#{domain}"
    description = "Spend more time on #{domain_printable}"
    goal_statement_to_fill_in = "Spend at least TARGET UNITS on #domain_printable each day"

    call_to_action = "Go to #{domain_printable}"
    generic_positive_interventions = await intervention_utils.list_generic_positive_interventions()
    fix_names_generic_positive = (x) ->
      return x.replace('generic_positive/', "generated_#{domain}/")
    generated_interventions = generic_positive_interventions.map(fix_names_generic_positive)
    default_interventions = await intervention_utils.list_enabled_generic_positive_interventions()
    default_interventions = default_interventions.map(fix_names_generic_positive)
    target_default = 5
  else
    custom_goal_name = "custom/spend_less_time_#{domain}"
    description = "Spend less time on #{domain_printable}"
    goal_statement_to_fill_in = "Spend less than TARGET UNITS on #domain_printable each day"
    call_to_action = "Close #{domain_printable}"
    generic_interventions = await intervention_utils.list_generic_interventions()
    fix_names_generic = (x) ->
      return x.replace('generic/', "generated_#{domain}/")
    fix_names_video = (x) ->
      return x.replace('video/', "generated_#{domain}/")
    generated_interventions = generic_interventions.map(fix_names_generic)
    default_interventions= await intervention_utils.list_enabled_generic_interventions()
    default_interventions = default_interventions.map(fix_names_generic)
    if intervention_utils.is_video_domain(domain)
      video_interventions = await intervention_utils.list_video_interventions()
      generated_interventions = generated_interventions.concat(video_interventions.map(fix_names_video))
    target_default = 20
        
  goal_info = {
    name: custom_goal_name
    custom: true
    description: description
    call_to_action: call_to_action
    homepage: "https://#{domain}/"
    progress_description: "Time spent on #{domain_printable}"
    sitename: domain
    sitename_printable: domain_printable
    default_interventions: default_interventions
    interventions: generated_interventions
    measurement: 'time_spent_on_domain'
    domain: domain
    is_positive: is-positive
    target: {
      default: target_default
      units: 'minutes'
    }
  }
  #goal_info.icon = chrome.extension.getURL('icons/loading.gif')
  #goal_info.icon = await get_favicon_data_for_domain(domain)
  #if not goal_info.icon?
  #  delete goal_info.icon
  await add_custom_goal_info goal_info
  return

export get_spend_less_time_goals_for_domain = (domain) ->>
  output = []
  all_goals = await get_goals()
  for goal_name,goal_info of all_goals
    if goal_info.is_positive
      continue
    if goal_info.domain == domain
      output.push(goal_name)
  return output

export get_spend_more_time_goals_for_domain = (domain) ->>
  output = []
  all_goals = await get_goals()
  for goal_name,goal_info of all_goals
    if not goal_info.is_positive
      continue
    if goal_info.domain == domain
      output.push(goal_name)
  return output

export add_enable_custom_goal_reduce_time_on_domain = (domain) ->>
  existing_goals = await get_spend_less_time_goals_for_domain(domain)
  if existing_goals.length > 0
    goal_name = existing_goals[0]
    await set_goal_enabled(goal_name)
    return goal_name
  await add_custom_goal_reduce_time_on_domain(domain)
  await set_goal_enabled("custom/spend_less_time_#{domain}")
  await intervention_utils.generate_interventions_for_domain domain
  return "custom/spend_less_time_#{domain}"

export add_enable_custom_goal_increase_time_on_domain = (domain) ->>
  existing_goals = await get_spend_more_time_goals_for_domain(domain)
  if existing_goals.length > 0
    goal_name = existing_goals[0]
    await set_goal_enabled(goal_name)
    return goal_name
  await add_custom_goal_involving_time_on_domain(domain, true)
  await set_goal_enabled("custom/spend_more_time_#{domain}")
  await intervention_utils.generate_interventions_for_positive_domain domain
  return "custom/spend_more_time_#{domain}"

export disable_all_custom_goals = ->>
  enabled_goals = await get_enabled_goals()
  new_enabled_goals = {}
  for goal_name,is_enabled of enabled_goals
    if goal_name.startsWith('custom/')
      continue
    new_enabled_goals[goal_name] = is_enabled
  await set_enabled_goals new_enabled_goals
  return

export remove_all_custom_goals_and_interventions = ->>
  await remove_all_custom_goals()
  intervention_utils.remove_all_custom_interventions()
  return

export remove_all_custom_goals = ->>
  await disable_all_custom_goals()
  clear_cache_all_goals()
  localStorage.removeItem 'extra_get_goals'
  localStorage.removeItem 'extra_list_all_goals'
  return

export remove_custom_goal_and_generated_interventions = (goal_name) ->>
  all_goals = await get_goals()
  goal = all_goals[goal_name]
  intervention_utils.remove_generated_interventions_for_domain goal.domain
  await set_goal_disabled goal_name
  clear_cache_all_goals()
  remove_key_from_localstorage_dict 'extra_get_goals', goal_name
  remove_item_from_localstorage_list 'extra_list_all_goals', goal_name
  remove_cached_favicon_for_domain goal.domain
  return

export get_interventions_to_goals = ->>
  output = {}
  goals = await get_goals()
  for goal_name,goal_info of goals
    if not goal_info.interventions?
      continue
    for intervention_name in goal_info.interventions
      if not output[intervention_name]?
        output[intervention_name] = []
      output[intervention_name].push goal_name
  return output

export get_goals_for_intervention = (intervention_name) ->>
  interventions_to_goals = await get_interventions_to_goals()
  goals_for_intervention = interventions_to_goals[intervention_name] ? []
  return goals_for_intervention

/**
 * Gets the target time spent in seconds for the specified goal
 * @param {GoalName} goal_name - The name of the goal
 * @return {Promise.<Number>} The target in seconds
 */
export get_goal_target = (goal_name) ->>
  result = await getkey_dict 'goal_targets', goal_name
  if result?
    return parseFloat(result)
  all_goals = await get_goals()
  goal_info = all_goals[goal_name]
  return parseFloat(goal_info.target.default)

export set_goal_target = (goal_name, target_value) ->>
  result = await getkey_dict 'goal_targets', goal_name
  if result? and parseInt(result) == target_value
    return
  await setkey_dict 'goal_targets', goal_name, target_value
  return

export get_all_goal_targets = ->>
  all_goals = await get_goals()
  saved_targets = await getdict 'goal_targets'
  output = {}
  for goal_name,goal_info of all_goals
    if saved_targets[goal_name]?
      output[goal_name] = parseFloat(saved_targets[goal_name])
    else
      output[goal_name] = parseFloat(goal_info.target.default)
  return output

export list_goal_info_for_enabled_goals = ->>
  goal_names = await get_enabled_goals()
  goal_names = as_array goal_names
  goal_name_to_info = await get_goals()
  output = []
  for goal_name in goal_names
    if goal_name_to_info[goal_name]?
      output.push goal_name_to_info[goal_name]
  return output

intervention_utils = require 'libs_backend/intervention_utils'
log_utils = require 'libs_backend/log_utils'
goal_progress = require 'libs_common/goal_progress'

gexport_module 'goal_utils', -> eval(it)
