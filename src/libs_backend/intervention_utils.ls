require! {
  moment
  mathjs
}

prelude = require 'prelude-ls'

{
  memoizeSingleAsync
} = require 'libs_common/memoize'

{
  setkey_dictdict
  getkey_dictdict
  getdict_for_key_dictdict
} = require 'libs_backend/db_utils'

{
  get_baseline_session_time_on_domain
} = require 'libs_backend/history_utils'

{
  gexport
  gexport_module
} = require 'libs_common/gexport'

{
  as_dictset
  as_array
  remove_keys_matching_patternfunc_from_localstorage_dict
  remove_items_matching_patternfunc_from_localstorage_list
  remove_key_from_localstorage_dict
  remove_item_from_localstorage_list
  remove_keys_from_localstorage_dict
  remove_items_from_localstorage_list
} = require 'libs_common/collection_utils'

{
  unique_concat
} = require 'libs_common/array_utils'

{
  localget_json
} = require 'libs_common/cacheget_utils'

{cfy, yfy} = require 'cfy'

/*
cached_get_intervention_info = {}
cached_get_intervention_info_unmodified = {}

getInterventionInfo = cfy (intervention_name) ->*
  cached_val = cached_get_intervention_info[intervention_name]
  if cached_val?
    return JSON.parse JSON.stringify cached_val
  cached_val = cached_get_intervention_info_unmodified[intervention_name]
  if cached_val?
    return JSON.parse JSON.stringify cached_val
  intervention_info = yield localget_json("/interventions/#{intervention_name}/info.json")
  intervention_info.name = intervention_name
  intervention_info.sitename = intervention_name.split('/')[0]
  cached_get_intervention_info[intervention_name] = intervention_info
  cached_get_intervention_info_unmodified[intervention_name] = intervention_info
  return intervention_info
*/

export getInterventionInfo = cfy (intervention_name) ->*
  all_intervention_info = yield get_interventions()
  return all_intervention_info[intervention_name]

export set_override_enabled_interventions_once = (intervention_name) ->
  localStorage.setItem('override_enabled_interventions_once', JSON.stringify([intervention_name]))
  return

export get_enabled_interventions_with_override = cfy ->*
  override_enabled_interventions = localStorage.getItem('override_enabled_interventions_once')
  if override_enabled_interventions?
    #localStorage.removeItem('override_enabled_interventions_once')
    return as_dictset(JSON.parse(override_enabled_interventions))
  enabled_interventions = yield intervention_manager.get_enabled_interventions_for_today()
  return enabled_interventions

export get_enabled_interventions_with_override_for_visit = cfy ->*
  override_enabled_interventions = localStorage.getItem('override_enabled_interventions_once')
  if override_enabled_interventions?
    #localStorage.removeItem('override_enabled_interventions_once')
    return as_dictset(JSON.parse(override_enabled_interventions))
  enabled_interventions = yield intervention_manager.get_enabled_interventions_for_visit()
  return enabled_interventions

/*
export get_enabled_interventions = cfy ->*
  enabled_interventions = yield intervention_manager.get_enabled_interventions_for_today()
  return enabled_interventions

export set_enabled_interventions = cfy (enabled_interventions) ->*
  yield intervention_manager.set_enabled_interventions_for_today_manual enabled_interventions
  return
*/

export is_it_outside_work_hours = ->
  {work_hours_only ? 'false', start_mins_since_midnight ? '0', end_mins_since_midnight ? '1440'} = localStorage
  work_hours_only = work_hours_only == 'true'
  start_mins_since_midnight = parseInt start_mins_since_midnight
  end_mins_since_midnight = parseInt end_mins_since_midnight
  mins_since_midnight = moment().hours()*60 + moment().minutes()
  if work_hours_only and not (start_mins_since_midnight <= mins_since_midnight <= end_mins_since_midnight)
    return true
  return false

export get_enabled_interventions = cfy ->*
  enabled_interventions = yield intervention_manager.get_currently_enabled_interventions()
  return enabled_interventions

export set_enabled_interventions = cfy (enabled_interventions) ->*
  yield intervention_manager.set_currently_enabled_interventions_manual enabled_interventions

export set_intervention_enabled = cfy (intervention_name) ->*
  enabled_interventions = yield get_enabled_interventions()
  if enabled_interventions[intervention_name]
    return
  enabled_interventions[intervention_name] = true
  yield set_enabled_interventions enabled_interventions

export set_intervention_disabled_permanently = cfy (intervention_name) ->*
  yield set_intervention_manually_managed intervention_name
  enabled_interventions = yield get_enabled_interventions()
  if not enabled_interventions[intervention_name]
    return
  enabled_interventions[intervention_name] = false
  yield set_enabled_interventions enabled_interventions

export set_intervention_disabled = cfy (intervention_name) ->*
  enabled_interventions = yield get_enabled_interventions()
  if not enabled_interventions[intervention_name]
    return
  enabled_interventions[intervention_name] = false
  yield set_enabled_interventions enabled_interventions

export is_intervention_enabled = cfy (intervention_name) ->*
  enabled_interventions = yield get_enabled_interventions()
  return enabled_interventions[intervention_name]

export generate_interventions_for_domain = cfy (domain) ->*
  generic_interventions = yield list_generic_interventions()
  new_intervention_info_list = []
  goals = yield goal_utils.get_goals()
  goal_for_intervention = goals["custom/spend_less_time_#{domain}"]
  for generic_intervention in generic_interventions
    intervention_info = yield getInterventionInfo generic_intervention
    # TODO replace the above step with something that is non-asynchronous
    intervention_info = JSON.parse JSON.stringify intervention_info
    intervention_info.name = generic_intervention.split('generic/').join("generated_#{domain}/")
    intervention_info.matches = [domain]
    make_absolute_path = (content_script) ->
      if content_script.path?
        if content_script.path[0] == '/'
          return content_script
        content_script.path = '/interventions/' + generic_intervention + '/' + content_script.path
        return content_script
      if content_script[0] == '/'
        return content_script
      return '/interventions/' + generic_intervention + '/' + content_script
    if intervention_info.content_scripts?
      intervention_info.content_scripts = intervention_info.content_scripts.map make_absolute_path
    if intervention_info.background_scripts?
      intervention_info.background_scripts = intervention_info.background_scripts.map make_absolute_path
    intervention_info.sitename = domain
    intervention_info.sitename_printable = domain
    if intervention_info.sitename_printable.startsWith('www.')
      intervention_info.sitename_printable = intervention_info.sitename_printable.substr(4)
    intervention_info.generated = true
    intervention_info.generic_intervention = generic_intervention
    intervention_info.goals = [goal_for_intervention]
    #fix_intervention_info intervention_info, ["custom/spend_less_time_#{domain}"] # TODO may need to add the goal it addresses
    new_intervention_info_list.push intervention_info
  yield add_new_interventions new_intervention_info_list
  return

export add_new_intervention = cfy (intervention_info) ->*
  yield add_new_interventions [intervention_info]
  /*
  add_new_intervention({

  })
  */

export list_custom_interventions = cfy ->*
  all_interventions = yield get_interventions()
  return prelude.sort [name for name,info of all_interventions when info.custom]

export add_new_interventions = cfy (intervention_info_list) ->*
  extra_get_interventions = localStorage.getItem 'extra_get_interventions'
  if extra_get_interventions?
    extra_get_interventions = JSON.parse extra_get_interventions
  else
    extra_get_interventions = {}
  extra_list_all_interventions = localStorage.getItem 'extra_list_all_interventions'
  if extra_list_all_interventions?
    extra_list_all_interventions = JSON.parse extra_list_all_interventions
  else
    extra_list_all_interventions = []
  new_intervention_names = intervention_info_list.map (.name)
  extra_list_all_interventions = unique_concat extra_list_all_interventions, new_intervention_names
  localStorage.setItem 'extra_list_all_interventions', JSON.stringify(extra_list_all_interventions)
  for intervention_info in intervention_info_list
    extra_get_interventions[intervention_info.name] = intervention_info
  localStorage.setItem 'extra_get_interventions', JSON.stringify(extra_get_interventions)
  clear_cache_all_interventions()
  log_utils.clear_intervention_logdb_cache()
  #clear_interventions_from_cache(new_intervention_names)
  yield list_all_interventions()
  yield get_interventions()
  yield log_utils.getInterventionLogDb()
  return

export remove_all_custom_interventions = ->
  clear_cache_all_interventions()
  localStorage.removeItem 'extra_get_interventions'
  localStorage.removeItem 'extra_list_all_interventions'
  return

export remove_generated_interventions_for_domain = (domain) ->
  clear_cache_all_interventions()
  remove_keys_matching_patternfunc_from_localstorage_dict 'extra_get_interventions', -> it.startsWith("generated_#{domain}/")
  remove_items_matching_patternfunc_from_localstorage_list 'extra_list_all_interventions', -> it.startsWith("generated_#{domain}/")
  return

export remove_custom_intervention = (intervention_name) ->
  clear_cache_all_interventions()
  remove_key_from_localstorage_dict 'extra_get_interventions', intervention_name
  remove_item_from_localstorage_list 'extra_list_all_interventions', intervention_name
  return

export list_generic_interventions = memoizeSingleAsync cfy ->*
  cached_generic_interventions = localStorage.getItem 'cached_list_generic_interventions'
  if cached_generic_interventions?
    return JSON.parse cached_generic_interventions
  #interventions_list = yield localget_json('/interventions/interventions.json')
  interventions_list = (yield goal_utils.get_goal_intervention_info()).interventions.map((.name))
  generic_interventions_list = interventions_list.filter -> it.startsWith('generic/')
  localStorage.setItem 'cached_list_generic_interventions', JSON.stringify(generic_interventions_list)
  return generic_interventions_list

#local_cache_list_all_interventions = null

export list_all_interventions = cfy ->*
  #if local_cache_list_all_interventions?
  #  return local_cache_list_all_interventions
  cached_list_all_interventions = localStorage.getItem 'cached_list_all_interventions'
  if cached_list_all_interventions?
    return JSON.parse cached_list_all_interventions
    #local_cache_list_all_interventions := JSON.parse cached_list_all_interventions
    #return local_cache_list_all_interventions
  #interventions_list = yield localget_json('/interventions/interventions.json')
  interventions_list = (yield goal_utils.get_goal_intervention_info()).interventions.map((.name))
  interventions_list_extra_text = localStorage.getItem 'extra_list_all_interventions'
  if interventions_list_extra_text?
    interventions_list_extra = JSON.parse interventions_list_extra_text
    interventions_list = unique_concat interventions_list, interventions_list_extra
  localStorage.setItem 'cached_list_all_interventions', JSON.stringify(interventions_list)
  #local_cache_list_all_interventions := interventions_list
  return interventions_list

export clear_cache_all_interventions = ->
  clear_cache_list_all_interventions()
  clear_cache_get_interventions()
  return

#clear_interventions_from_cache = (intervention_names) ->
#  remove_items_from_localstorage_list('cached_list_all_interventions', intervention_names)
#  remove_keys_from_localstorage_dict('cached_get_interventions', intervention_names)

export clear_cache_list_all_interventions = ->
  #local_cache_list_all_interventions := null
  localStorage.removeItem 'cached_list_all_interventions'
  return

export get_intervention_info = cfy (intervention_name) ->*
  all_interventions = yield get_interventions()
  return all_interventions[intervention_name]

fix_intervention_info = (intervention_info, goals_satisfied_by_intervention) ->
  intervention_name = intervention_info.name
  fix_content_script_options = (options, intervention_name) ->
    if typeof options == 'string'
      options = {path: options}
    if options.code?
      if not options.path?
        options.path = 'content_script_' + Math.floor(Math.random()*1000000)
    else
      if options.path[0] != '/'
        options.path = "/interventions/#{intervention_name}/#{options.path}"
    if not options.run_at?
      options.run_at = 'document_end' # document_start
    if not options.all_frames?
      options.all_frames = false
    return options
  fix_background_script_options = (options, intervention_name) ->
    if typeof options == 'string'
      options = {path: options}
    if options.code?
      if not options.path?
        options.path = 'background_script_' + Math.floor(Math.random()*1000000)
    else
      if options.path[0] == '/'
        options.path = options.path.substr(1)
      else
        options.path = "/interventions/#{intervention_name}/#{options.path}"
    return options
  fix_intervention_parameter = (parameter, intervention_info) ->
    if not parameter.name?
      console.log "warning: missing parameter.name for intervention #{intervention_info.name}"
    if not parameter.default?
      console.log "warning: missing parameter.default for intervention #{intervention_info.name}"
    if not parameter.type?
      parameter.type = 'string'
      return
    curtype = parameter.type.toLowerCase()
    if curtype.startsWith('str')
      parameter.type = 'string'
      return
    if curtype.startsWith('int')
      parameter.type = 'int'
      return
    if curtype.startsWith('float') or curtype.startsWith('real') or curtype.startsWith('double') or curtype.startsWith('num')
      parameter.type = 'float'
      return
    if curtype.startsWith('bool')
      parameter.type = 'bool'
      return
    console.log "warning: invalid parameter.type #{curtype} for intervention #{intervention_info.name}"
  if not intervention_info.displayname?
    intervention_info.displayname = intervention_name.split('/')[*-1].split('_').join(' ')
  if not intervention_info.nomatches?
    intervention_info.nomatches = []
  if not intervention_info.matches?
    intervention_info.matches = []
  if not intervention_info.content_scripts?
    intervention_info.content_scripts = []
  if not intervention_info.background_scripts?
    intervention_info.background_scripts = []
  if not intervention_info.parameters?
    intervention_info.parameters = []
  if not intervention_info.categories?
    intervention_info.categories = []
  if not intervention_info.conflicts?
    intervention_info.conflicts = []
  if intervention_info.parameters.filter(-> it.name == 'debug').length == 0
    intervention_info.parameters.push {
      name: 'debug'
      description: 'Insert debug console'
      type: 'bool'
      default: false
    }
  for parameter in intervention_info.parameters
    fix_intervention_parameter(parameter, intervention_info)
  intervention_info.params = {[x.name, x] for x in intervention_info.parameters}
  intervention_info.content_script_options = [fix_content_script_options(x, intervention_name) for x in intervention_info.content_scripts]
  intervention_info.background_script_options = [fix_background_script_options(x, intervention_name) for x in intervention_info.background_scripts]
  intervention_info.match_regexes = [new RegExp(x) for x in intervention_info.matches]
  intervention_info.nomatch_regexes = [new RegExp(x) for x in intervention_info.nomatches]
  if not intervention_info.goals?
    if goals_satisfied_by_intervention?
      intervention_info.goals = goals_satisfied_by_intervention
    else
      intervention_info.goals = []
  return intervention_info

fix_intervention_name_to_intervention_info_dict = (intervention_name_to_info, interventions_to_goals) ->
  for intervention_name,intervention_info of intervention_name_to_info
    fix_intervention_info intervention_info, interventions_to_goals[intervention_name]
  category_to_interventions = {}
  for intervention_name,intervention_info of intervention_name_to_info
    for category in intervention_info.categories
      if not category_to_interventions[category]?
        category_to_interventions[category] = []
      category_to_interventions[category].push intervention_name
  for intervention_name,intervention_info of intervention_name_to_info
    seen_conflicts = {}
    for category in intervention_info.categories
      for conflict in category_to_interventions[category]
        if conflict == intervention_name
          continue
        if seen_conflicts[conflict]
          continue
        seen_conflicts[conflict] = true
        intervention_info.conflicts.push conflict
  return intervention_name_to_info

#local_cache_get_interventions = null

/*
export get_interventions = cfy ->*
  #if local_cache_get_interventions?
    #return local_cache_get_interventions
  cached_get_interventions = localStorage.getItem 'cached_get_interventions'
  if cached_get_interventions?
    interventions_to_goals = yield goal_utils.get_interventions_to_goals()
    intervention_name_to_info = JSON.parse cached_get_interventions
    fix_intervention_name_to_intervention_info_dict intervention_name_to_info, interventions_to_goals
    return intervention_name_to_info
    #return JSON.parse cached_get_interventions
    #local_cache_get_interventions := JSON.parse cached_get_interventions
    #return local_cache_get_interventions
  interventions_to_goals_promises = goal_utils.get_interventions_to_goals()
  interventions_list = yield list_all_interventions()
  output = {}
  extra_get_interventions_text = localStorage.getItem 'extra_get_interventions'
  if extra_get_interventions_text?
    extra_get_interventions = JSON.parse extra_get_interventions_text
    for intervention_name,intervention_info of extra_get_interventions
      output[intervention_name] = intervention_info
  intervention_name_to_info_promises = {[intervention_name, getInterventionInfo(intervention_name)] for intervention_name in interventions_list when not output[intervention_name]?}
  [intervention_name_to_info, interventions_to_goals] = yield [intervention_name_to_info_promises, interventions_to_goals_promises]
  for intervention_name,intervention_info of intervention_name_to_info
    output[intervention_name] = intervention_info
  localStorage.setItem 'cached_get_interventions', JSON.stringify(output)
  fix_intervention_name_to_intervention_info_dict output, interventions_to_goals
  return output
*/

export get_interventions = cfy ->*
  #if local_cache_get_interventions?
    #return local_cache_get_interventions
  cached_get_interventions = localStorage.getItem 'cached_get_interventions'
  if cached_get_interventions?
    interventions_to_goals = yield goal_utils.get_interventions_to_goals()
    intervention_name_to_info = JSON.parse cached_get_interventions
    fix_intervention_name_to_intervention_info_dict intervention_name_to_info, interventions_to_goals
    return intervention_name_to_info
    #return JSON.parse cached_get_interventions
    #local_cache_get_interventions := JSON.parse cached_get_interventions
    #return local_cache_get_interventions
  interventions_to_goals = yield goal_utils.get_interventions_to_goals()
  interventions_list = yield list_all_interventions()
  output = {}
  intervention_info_list = (yield goal_utils.get_goal_intervention_info()).interventions
  for intervention_info in intervention_info_list
    output[intervention_info.name] = intervention_info
  extra_get_interventions_text = localStorage.getItem 'extra_get_interventions'
  if extra_get_interventions_text?
    extra_get_interventions = JSON.parse extra_get_interventions_text
    for intervention_name,intervention_info of extra_get_interventions
      output[intervention_name] = intervention_info
  localStorage.setItem 'cached_get_interventions', JSON.stringify(output)
  fix_intervention_name_to_intervention_info_dict output, interventions_to_goals
  return output

export clear_cache_get_interventions = ->
  #local_cache_get_interventions := null
  localStorage.removeItem 'cached_get_interventions'
  return

export list_enabled_interventions_for_location = cfy (location) ->*
  available_interventions = yield list_available_interventions_for_location(location)
  enabled_interventions = yield get_enabled_interventions()
  return available_interventions.filter((x) -> enabled_interventions[x])

/*
export list_all_enabled_interventions_for_location_with_override = cfy (location) ->*
  # TODO this no longer works on new days. need to persist enabled interventions across days
  override_enabled_interventions = localStorage.getItem('override_enabled_interventions_once')
  if override_enabled_interventions?
    #localStorage.removeItem('override_enabled_interventions_once')
    return as_array(JSON.parse(override_enabled_interventions))
  available_interventions = yield list_available_interventions_for_location(location)
  enabled_interventions = yield intervention_manager.get_most_recent_enabled_interventions()
  return available_interventions.filter((x) -> enabled_interventions[x])
*/

export list_all_enabled_interventions_for_location = cfy (location) ->*
  #override_enabled_interventions = localStorage.getItem('override_enabled_interventions_once')
  #if override_enabled_interventions?
  #  return as_array(JSON.parse(override_enabled_interventions))
  available_interventions = yield list_available_interventions_for_location(location)
  enabled_interventions = yield intervention_manager.get_currently_enabled_interventions()
  return available_interventions.filter((x) -> enabled_interventions[x])

export list_enabled_nonconflicting_interventions_for_location = cfy (location) ->*
  available_interventions = yield list_available_interventions_for_location(location)
  enabled_interventions = yield get_enabled_interventions_with_override_for_visit()
  all_interventions = yield get_interventions()
  enabled_interventions_for_location = available_interventions.filter((x) -> enabled_interventions[x])
  output = []
  output_set = {}
  for intervention_name in enabled_interventions_for_location
    intervention_info = all_interventions[intervention_name]
    keep_enabled = true
    for conflict in intervention_info.conflicts
      if output_set[conflict]?
        keep_enabled = false
    if keep_enabled
      output.push intervention_name
      output_set[intervention_name] = true
  return output

export list_available_interventions_for_location = cfy (location) ->*
  all_interventions = yield get_interventions()
  possible_interventions = []
  for intervention_name,intervention_info of all_interventions
    blacklisted = false
    for regex in intervention_info.nomatch_regexes
      if regex.test(location)
        blacklisted = true
        break
    if blacklisted
      continue
    matches = false
    for regex in intervention_info.match_regexes
      if regex.test(location)
        matches = true
        break
    if matches
      possible_interventions.push intervention_name
  return possible_interventions

export get_manually_managed_interventions_localstorage = cfy ->*
  manually_managed_interventions_str = localStorage.getItem('manually_managed_interventions')
  if not manually_managed_interventions_str?
    manually_managed_interventions = {}
  else
    manually_managed_interventions = JSON.parse manually_managed_interventions_str
  return manually_managed_interventions

export get_manually_managed_interventions = get_manually_managed_interventions_localstorage

/*
export get_most_recent_manually_enabled_interventions = cfy ->*
  enabled_interventions = yield intervention_manager.get_most_recent_enabled_interventions()
  manually_managed_interventions = yield get_manually_managed_interventions()
  output = {}
  for intervention_name,is_enabled of enabled_interventions
    output[intervention_name] = is_enabled and manually_managed_interventions[intervention_name]
  return output

export get_most_recent_manually_disabled_interventions = cfy ->*
  enabled_interventions = yield intervention_manager.get_most_recent_enabled_interventions()
  manually_managed_interventions = yield get_manually_managed_interventions()
  output = {}
  for intervention_name,is_enabled of enabled_interventions
    output[intervention_name] = (!is_enabled) and manually_managed_interventions[intervention_name]
  return output
*/

export set_manually_managed_interventions = cfy (manually_managed_interventions) ->*
  localStorage.setItem 'manually_managed_interventions', JSON.stringify(manually_managed_interventions)
  return

export set_intervention_manually_managed = cfy (intervention_name) ->*
  manually_managed_interventions = yield get_manually_managed_interventions()
  if manually_managed_interventions[intervention_name]
    return
  manually_managed_interventions[intervention_name] = true
  yield set_manually_managed_interventions manually_managed_interventions

export set_intervention_automatically_managed = cfy (intervention_name) ->*
  manually_managed_interventions = yield get_manually_managed_interventions()
  if not manually_managed_interventions[intervention_name]
    return
  manually_managed_interventions[intervention_name] = false
  yield set_manually_managed_interventions manually_managed_interventions

export list_available_interventions_for_enabled_goals = cfy ->*
  # outputs a list of intervention names
  interventions_to_goals = yield goal_utils.get_interventions_to_goals()
  enabled_goals = yield goal_utils.get_enabled_goals()
  output = []
  output_set = {}
  for intervention_name,goals of interventions_to_goals
    for goal in goals
      if enabled_goals[goal.name]? and not output_set[intervention_name]?
        output.push intervention_name
        output_set[intervention_name] = true
  return output

export list_available_interventions_for_goal = cfy (goal_name) ->*
  # outputs a list of intervention names
  interventions_to_goals = yield goal_utils.get_interventions_to_goals()
  output = []
  output_set = {}
  for intervention_name,goals of interventions_to_goals
    for goal in goals
      if goal_name == goal.name and not output_set[intervention_name]?
        output.push intervention_name
        output_set[intervention_name] = true
  return output

export list_enabled_interventions_for_goal = cfy (goal_name) ->*
  # outputs a list of intervention names
  enabled_interventions = yield get_enabled_interventions()
  available_interventions_for_goal = yield list_available_interventions_for_goal(goal_name)
  return available_interventions_for_goal.filter(-> enabled_interventions[it])

cast_to_bool = (parameter_value) ->
  if typeof(parameter_value) != 'string'
    return Boolean(parameter_value)
  if parameter_value.toLowerCase() == 'false'
    return false
  return true

cast_to_type = (parameter_value, type_name) ->
  if type_name == 'string'
    return parameter_value.toString()
  if type_name == 'int'
    return parseInt(parameter_value)
  if type_name == 'float'
    return parseFloat(parameter_value)
  if type_name == 'bool'
    return cast_to_bool(parameter_value)
  return parameter_value

export set_intervention_parameter = cfy (intervention_name, parameter_name, parameter_value) ->*
  yield setkey_dictdict 'intervention_to_parameters', intervention_name, parameter_name, parameter_value

get_intervention_parameter_type = cfy (intervention_name, parameter_name) ->*
  interventions = yield get_interventions()
  intervention_info = interventions[intervention_name]
  parameter_type = intervention_info.params[parameter_name].type
  return parameter_type

export get_intervention_parameter_default = cfy (intervention_name, parameter_name) ->*
  interventions = yield get_interventions()
  intervention_info = interventions[intervention_name]
  parameter_type = intervention_info.params[parameter_name].type
  parameter_value = intervention_info.params[parameter_name].default
  return cast_to_type(parameter_value, parameter_type)

export get_intervention_parameters_default = cfy (intervention_name) ->*
  interventions = yield get_interventions()
  intervention_info = interventions[intervention_name]
  return {[x.name, cast_to_type(x.default, x.type)] for x in intervention_info.parameters}

export get_intervention_parameter = cfy (intervention_name, parameter_name) ->*
  result = yield getkey_dictdict 'intervention_to_parameters', intervention_name, parameter_name
  parameter_type = yield get_intervention_parameter_type(intervention_name, parameter_name)
  if result?
    return cast_to_type(result, parameter_type)
  yield get_intervention_parameter_default(intervention_name, parameter_name)

export get_intervention_parameters = cfy (intervention_name) ->*
  results = yield getdict_for_key_dictdict 'intervention_to_parameters', intervention_name
  default_parameters = yield get_intervention_parameters_default(intervention_name)
  interventions = yield get_interventions()
  intervention_info = interventions[intervention_name]
  output = {}
  for k,v of default_parameters
    parameter_value = results[k] ? default_parameters[k]
    parameter_type = intervention_info.params[k].type
    output[k] = cast_to_type(parameter_value, parameter_type)
  return output

export get_seconds_spent_on_domain_for_each_intervention = cfy (domain) ->*
  session_id_to_interventions = yield getdict_for_key_dictdict('interventions_active_for_domain_and_session', domain)
  session_id_to_seconds = yield getdict_for_key_dictdict('seconds_on_domain_per_session', domain)
  intervention_to_session_lengths = {}
  for session_id,interventions of session_id_to_interventions
    interventions = JSON.parse interventions
    if interventions.length != 1
      # cannot currently deal with multiple simultaneous interventions
      continue
    intervention = interventions[0]
    seconds_spent = session_id_to_seconds[session_id]
    if not seconds_spent?
      continue
    if not intervention_to_session_lengths[intervention]?
      intervention_to_session_lengths[intervention] = []
    intervention_to_session_lengths[intervention].push seconds_spent
  output = {}
  for intervention,session_lengths of intervention_to_session_lengths
    output[intervention] = mathjs.median session_lengths
  return output

export get_seconds_saved_per_session_for_each_intervention_for_goal = cfy (goal_name) ->*
  goal_info = yield goal_utils.get_goal_info(goal_name)
  domain = goal_info.domain
  intervention_names = goal_info.interventions
  session_id_to_interventions = yield getdict_for_key_dictdict('interventions_active_for_domain_and_session', domain)
  session_id_to_seconds = yield getdict_for_key_dictdict('seconds_on_domain_per_session', domain)
  intervention_to_seconds_per_session = yield get_seconds_spent_on_domain_for_each_intervention(domain)
  baseline_session_time = yield get_baseline_session_time_on_domain(domain)
  output = {}
  for intervention in intervention_names
    seconds_per_session = intervention_to_seconds_per_session[intervention]
    if not seconds_per_session?
      output[intervention] = NaN
      continue
    time_saved = baseline_session_time - seconds_per_session
    output[intervention] = time_saved
  return output

export get_seconds_spent_per_session_for_each_intervention_for_goal = cfy (goal_name) ->*
  goal_info = yield goal_utils.get_goal_info(goal_name)
  domain = goal_info.domain
  intervention_names = goal_info.interventions
  session_id_to_interventions = yield getdict_for_key_dictdict('interventions_active_for_domain_and_session', domain)
  session_id_to_seconds = yield getdict_for_key_dictdict('seconds_on_domain_per_session', domain)
  intervention_to_seconds_per_session = yield get_seconds_spent_on_domain_for_each_intervention(domain)
  baseline_session_time = yield get_baseline_session_time_on_domain(domain)
  output = {}
  for intervention in intervention_names
    seconds_per_session = intervention_to_seconds_per_session[intervention]
    if not seconds_per_session?
      output[intervention] = NaN
      continue
    output[intervention] = seconds_per_session
  return output

/*
# only kept for legacy compatibility purposes, will be removed, do not use
# replacement: get_seconds_saved_per_session_for_each_intervention_for_goal
export get_effectiveness_of_all_interventions_for_goal = cfy (goal_name) ->*
  goal_info = yield goal_utils.get_goal_info(goal_name)
  domain = goal_info.domain
  intervention_names = goal_info.interventions
  session_id_to_interventions = yield getdict_for_key_dictdict('interventions_active_for_domain_and_session', domain)
  session_id_to_seconds = yield getdict_for_key_dictdict('seconds_on_domain_per_session', domain)
  intervention_to_seconds_per_session = yield get_seconds_spent_on_domain_for_each_intervention(domain)
  output = {}
  for intervention,seconds_per_session of intervention_to_seconds_per_session
    minutes_per_session = seconds_per_session / 60
    output[intervention] = {
      progress: minutes_per_session
      units: 'minutes'
      message: "#{minutes_per_session} minutes"
    }
  for intervention in intervention_names
    if not output[intervention]?
      output[intervention] = {
        progress: NaN
        units: 'minutes'
        message: 'no data'
      }
  return output
*/

export get_goals_and_interventions = cfy ->*
  intervention_name_to_info = yield get_interventions()
  enabled_interventions = yield get_enabled_interventions()
  enabled_goals = yield goal_utils.get_enabled_goals()
  all_goals = yield goal_utils.get_goals()
  all_goals_list = yield goal_utils.list_all_goals()
  manually_managed_interventions = yield get_manually_managed_interventions()
  goal_to_interventions = {}
  for intervention_name,intervention_info of intervention_name_to_info
    for goal in intervention_info.goals
      goalname = goal.name
      if not goal_to_interventions[goalname]?
        goal_to_interventions[goalname] = []
      goal_to_interventions[goalname].push intervention_info
  list_of_goals_and_interventions = []
  list_of_goals = prelude.sort as_array(all_goals_list)
  for goalname in list_of_goals
    current_item = {goal: all_goals[goalname]}
    current_item.enabled = enabled_goals[goalname] == true
    current_item.interventions = prelude.sort-by (.name), goal_to_interventions[goalname]
    for intervention in current_item.interventions
      intervention.enabled_goals = []
      #if intervention.goals?
      #  intervention.enabled_goals = [goal for goal in intervention.goals when enabled_goals[goal.name]]
      intervention.enabled = (enabled_interventions[intervention.name] == true)
      intervention.automatic = (manually_managed_interventions[intervention.name] != true)
    list_of_goals_and_interventions.push current_item
  return list_of_goals_and_interventions

/*
export get_goals_and_interventions = cfy ->*
  intervention_name_to_info = yield get_interventions()
  enabled_interventions = yield get_enabled_interventions()
  enabled_goals = yield goal_utils.get_enabled_goals()
  all_goals = yield goal_utils.get_goals()
  manually_managed_interventions = yield get_manually_managed_interventions()
  goal_to_interventions = {}
  for intervention_name,intervention_info of intervention_name_to_info
    for goal in intervention_info.goals
      goalname = goal.name
      if not goal_to_interventions[goalname]?
        goal_to_interventions[goalname] = []
      goal_to_interventions[goalname].push intervention_info
  list_of_goals_and_interventions = []
  list_of_goals = prelude.sort as_array(enabled_goals)
  for goalname in list_of_goals
    current_item = {goal: all_goals[goalname]}
    current_item.interventions = prelude.sort-by (.name), goal_to_interventions[goalname]
    for intervention in current_item.interventions
      intervention.enabled_goals = []
      #if intervention.goals?
      #  intervention.enabled_goals = [goal for goal in intervention.goals when enabled_goals[goal.name]]
      intervention.enabled = (enabled_interventions[intervention.name] == true)
      intervention.automatic = (manually_managed_interventions[intervention.name] != true)
    list_of_goals_and_interventions.push current_item
  return list_of_goals_and_interventions
*/

intervention_manager = require 'libs_backend/intervention_manager'
goal_utils = require 'libs_backend/goal_utils'
goal_progress = require 'libs_backend/goal_progress'
log_utils = require 'libs_backend/log_utils'

gexport_module 'intervention_utils', -> eval(it)
