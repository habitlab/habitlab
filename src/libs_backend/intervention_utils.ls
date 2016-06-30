$ = require 'jquery'

{
  memoizeSingleAsync
} = require 'libs_common/memoize'

require! {
  async
}

{
  get_interventions_to_goals
  get_enabled_goals
} = require 'libs_backend/goal_utils'

{
  gexport
  gexport_module
} = require 'libs_common/gexport'

export getInterventionInfo = (intervention_name, callback) ->
  intervention_info_text <- $.get "/interventions/#{intervention_name}/info.json"
  intervention_info = JSON.parse intervention_info_text
  intervention_info.name = intervention_name
  intervention_info.sitename = intervention_name.split('/')[0]
  callback intervention_info

/*
export get_enabled_interventions = (callback) ->
  enabled_interventions_str = localStorage.getItem('enabled_interventions')
  if not enabled_interventions_str?
    enabled_interventions = {}
  else
    enabled_interventions = JSON.parse enabled_interventions_str
  callback enabled_interventions

export set_enabled_interventions = (enabled_interventions, callback) ->
  localStorage.setItem 'enabled_interventions', JSON.stringify(enabled_interventions)
  callback?!
*/

export get_enabled_interventions = (callback) ->
  enabled_interventions <- intervention_manager.get_enabled_interventions_for_today()
  callback enabled_interventions

export set_enabled_interventions = (enabled_interventions, callback) ->
  <- intervention_manager.set_enabled_interventions_for_today_manual enabled_interventions
  callback?!

export set_intervention_enabled = (intervention_name, callback) ->
  enabled_interventions <- get_enabled_interventions()
  if enabled_interventions[intervention_name]
    return callback?!
  enabled_interventions[intervention_name] = true
  set_enabled_interventions enabled_interventions, callback

export set_intervention_disabled = (intervention_name, callback) ->
  enabled_interventions <- get_enabled_interventions()
  if not enabled_interventions[intervention_name]
    return callback?!
  enabled_interventions[intervention_name] = false
  set_enabled_interventions enabled_interventions, callback

export is_intervention_enabled = (intervention_name, callback) ->
  enabled_interventions <- get_enabled_interventions()
  callback enabled_interventions[intervention_name]

export list_all_interventions = memoizeSingleAsync (callback) ->
  interventions_list_text <- $.get '/interventions/interventions.json'
  interventions_list = JSON.parse interventions_list_text
  callback interventions_list

export get_interventions = memoizeSingleAsync (callback) ->
  interventions_list <- list_all_interventions()
  output = {}
  fix_content_script_options = (options, intervention_name) ->
    if typeof options == 'string'
      options = {path: options}
    if options.path[0] == '/'
      options.path = options.path.substr(1)
    else
      options.path = "interventions/#{intervention_name}/#{options.path}"
    if not options.run_at?
      options.run_at = 'document_end' # document_start
    if not options.all_frames?
      options.all_frames = false
    return options
  fix_background_script_options = (options, intervention_name) ->
    if typeof options == 'string'
      options = {path: options}
    if options.path[0] == '/'
      options.path = options.path.substr(1)
    else
      options.path = "interventions/#{intervention_name}/#{options.path}"
    return options
  interventions_to_goals <- get_interventions_to_goals()
  errors,results <- async.mapSeries interventions_list, (intervention_name, ncallback) ->
    intervention_info <- getInterventionInfo intervention_name
    if not intervention_info.nomatches?
      intervention_info.nomatches = []
    if not intervention_info.matches?
      intervention_info.matches = []
    if not intervention_info.content_scripts?
      intervention_info.content_scripts = []
    if not intervention_info.background_scripts?
      intervention_info.background_scripts = []
    intervention_info.content_script_options = [fix_content_script_options(x, intervention_name) for x in intervention_info.content_scripts]
    intervention_info.background_script_options = [fix_background_script_options(x, intervention_name) for x in intervention_info.background_scripts]
    intervention_info.match_regexes = [new RegExp(x) for x in intervention_info.matches]
    intervention_info.nomatch_regexes = [new RegExp(x) for x in intervention_info.nomatches]
    intervention_info.goals = interventions_to_goals[intervention_name]
    output[intervention_name] = intervention_info
    ncallback null, null
  callback output

export list_enabled_interventions_for_location = (location, callback) ->
  available_interventions <- list_available_interventions_for_location(location)
  enabled_interventions <- get_enabled_interventions()
  callback available_interventions.filter((x) -> enabled_interventions[x]?)

export list_available_interventions_for_location = (location, callback) ->
  all_interventions <- get_interventions()
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
  callback possible_interventions

export get_manually_managed_interventions_localstorage = (callback) ->
  manually_managed_interventions_str = localStorage.getItem('manually_managed_interventions')
  if not manually_managed_interventions_str?
    manually_managed_interventions = {}
  else
    manually_managed_interventions = JSON.parse manually_managed_interventions_str
  callback manually_managed_interventions

export get_manually_managed_interventions = get_manually_managed_interventions_localstorage

export set_manually_managed_interventions = (manually_managed_interventions, callback) ->
  localStorage.setItem 'manually_managed_interventions', JSON.stringify(manually_managed_interventions)
  callback?!

export set_intervention_manually_managed = (intervention_name, callback) ->
  manually_managed_interventions <- get_manually_managed_interventions()
  if manually_managed_interventions[intervention_name]
    return callback?!
  manually_managed_interventions[intervention_name] = true
  set_manually_managed_interventions manually_managed_interventions, callback

export set_intervention_automatically_managed = (intervention_name, callback) ->
  manually_managed_interventions <- get_manually_managed_interventions()
  if not manually_managed_interventions[intervention_name]
    return callback?!
  manually_managed_interventions[intervention_name] = false
  set_manually_managed_interventions manually_managed_interventions, callback

export list_available_interventions_for_enabled_goals = (callback) ->
  # outputs a list of intervention names
  interventions_to_goals <- get_interventions_to_goals()
  enabled_goals <- get_enabled_goals()
  output = []
  output_set = {}
  for intervention_name,goals of interventions_to_goals
    for goal in goals
      if enabled_goals[goal.name]? and not output_set[intervention_name]?
        output.push intervention_name
        output_set[intervention_name] = true
  callback output

intervention_manager = require 'libs_backend/intervention_manager'

gexport_module 'intervention_utils', -> eval(it)
