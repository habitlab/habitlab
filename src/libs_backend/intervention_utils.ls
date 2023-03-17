require! {
  moment
  shuffled
}

prelude = require 'prelude-ls'

{median} = require 'libs_common/math_utils'

{
  memoizeSingleAsync
} = require 'libs_common/memoize'

{
  setkey_dictdict
  getkey_dictdict
  setkey_dict
  getkey_dict
  getdict_for_key_dictdict
  getvar
  setvar
  setvar_experiment
} = require 'libs_backend/db_utils'

{
  getlog
} = require 'libs_backend/log_utils'

{
  get_baseline_session_time_on_domain
} = require 'libs_backend/history_utils'

{
  url_to_domain
} = require 'libs_common/domain_utils'

{
  gexport
  gexport_module
} = require 'libs_common/gexport'

{
  get_days_since_epoch
} = require 'libs_common/time_utils'

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

/*
cached_get_intervention_info = {}
cached_get_intervention_info_unmodified = {}

getInterventionInfo = (intervention_name) ->>
  cached_val = cached_get_intervention_info[intervention_name]
  if cached_val?
    return JSON.parse JSON.stringify cached_val
  cached_val = cached_get_intervention_info_unmodified[intervention_name]
  if cached_val?
    return JSON.parse JSON.stringify cached_val
  intervention_info = await localget_json("/interventions/#{intervention_name}/info.json")
  intervention_info.name = intervention_name
  intervention_info.sitename = intervention_name.split('/')[0]
  cached_get_intervention_info[intervention_name] = intervention_info
  cached_get_intervention_info_unmodified[intervention_name] = intervention_info
  return intervention_info
*/

export set_override_enabled_interventions_once = (intervention_name) ->
  localStorage.setItem('override_enabled_interventions_once', JSON.stringify([intervention_name]))
  return

export get_enabled_interventions_with_override = ->>
  override_enabled_interventions = localStorage.getItem('override_enabled_interventions_once')
  if override_enabled_interventions?
    #localStorage.removeItem('override_enabled_interventions_once')
    return as_dictset(JSON.parse(override_enabled_interventions))
  enabled_interventions = await intervention_manager.get_enabled_interventions_for_today()
  return enabled_interventions

export get_enabled_interventions_with_override_for_visit = ->>
  override_enabled_interventions = localStorage.getItem('override_enabled_interventions_once')
  if override_enabled_interventions?
    #localStorage.removeItem('override_enabled_interventions_once')
    return as_dictset(JSON.parse(override_enabled_interventions))
  enabled_interventions = await intervention_manager.get_enabled_interventions_for_visit()
  return enabled_interventions

/*
export get_enabled_interventions = ->>
  enabled_interventions = await intervention_manager.get_enabled_interventions_for_today()
  return enabled_interventions

export set_enabled_interventions = (enabled_interventions) ->>
  await intervention_manager.set_enabled_interventions_for_today_manual enabled_interventions
  return
*/

is_between_times = (time, start, end) ->
  if start > end
    return start <= time or time <= end
  return start <= time <= end

count_as_yesterday = (time, start, end) ->
  return time < end < start

export is_it_outside_work_hours = ->
  {work_hours_only ? 'false', start_mins_since_midnight ? '0', end_mins_since_midnight ? '1440', activedaysarray} = localStorage
  work_hours_only = work_hours_only == 'true'
  start_mins_since_midnight = parseInt start_mins_since_midnight
  end_mins_since_midnight = parseInt end_mins_since_midnight
  mins_since_midnight = moment().hours()*60 + moment().minutes()
  if work_hours_only
    if not is_between_times(mins_since_midnight, start_mins_since_midnight, end_mins_since_midnight)
      return true
    if activedaysarray?
      activedaysarray = JSON.parse activedaysarray
      day = moment()
      if count_as_yesterday(mins_since_midnight, start_mins_since_midnight, end_mins_since_midnight)
        day.subtract(1, 'day')
      today_idx = day.weekday()
      if not activedaysarray.includes(today_idx)
        return true
  return false

/**
 * Returns a list of names of enabled interventions
 * @return {Promise.<Array.<InterventionName>>} List of enabled intervention names
 */
export list_enabled_interventions = ->>
  enabled_interventions = await intervention_manager.get_currently_enabled_interventions()
  return as_array(enabled_interventions)

/**
 * Returns a object with with names of enabled interventions as keys, and whether they are enabled as values
 * @return {Promise.<Object.<InterventionName, boolean>>} Object with enabled interventions as keys
 */
export get_enabled_interventions = ->>
  enabled_interventions = await intervention_manager.get_currently_enabled_interventions()
  return enabled_interventions

export set_enabled_interventions = (enabled_interventions) ->>
  await intervention_manager.set_currently_enabled_interventions_manual enabled_interventions

/*
export set_intervention_enabled = (intervention_name) ->>
  enabled_interventions = await get_enabled_interventions()
  if enabled_interventions[intervention_name]
    return
  enabled_interventions[intervention_name] = true
  await set_enabled_interventions enabled_interventions

export set_intervention_disabled_permanently = (intervention_name) ->>
  await set_intervention_manually_managed intervention_name
  enabled_interventions = await get_enabled_interventions()
  if not enabled_interventions[intervention_name]
    return
  enabled_interventions[intervention_name] = false
  await set_enabled_interventions enabled_interventions

export set_intervention_disabled = (intervention_name) ->>
  enabled_interventions = await get_enabled_interventions()
  if not enabled_interventions[intervention_name]
    return
  enabled_interventions[intervention_name] = false
  await set_enabled_interventions enabled_interventions
*/

default_generic_interventions_list = [
  'generic/block_after_interval_per_visit'
  'generic/close_tab_timer'
  'generic/make_user_wait'
  'generic/prompt_reason'
  'generic/scroll_blocker'
  'generic/show_timer_banner'
  'generic/show_user_info_banner'
  'generic/show_user_info_interstitial'
  'generic/toast_notifications'
]

default_generic_positive_interventions_list = [
  'generic_positive/feed_injection_positive_goal_widget'
]

export list_enabled_generic_interventions = ->>
  enabled_interventions = await get_enabled_interventions()
  output = []
  for k,v of enabled_interventions
    if v and k.startsWith('generic/')
      output.push k
  if output.length == 0
    return default_generic_interventions_list
  return output

export list_enabled_generic_positive_interventions = ->>
  enabled_interventions = await get_enabled_interventions()
  output = []
  for k,v of enabled_interventions
    if v and k.startsWith('generic_positive/')
      output.push k
  if output.length == 0
    return default_generic_positive_interventions_list
  return output

export set_default_generic_interventions_enabled = ->>
  await set_interventions_enabled (default_generic_interventions_list.concat(default_generic_positive_interventions_list))
  return

export set_interventions_enabled = (intervention_name_list) ->>
  for x in intervention_name_list
    await set_intervention_enabled(x)
  return

export set_intervention_enabled = (intervention_name) ->>
  is_disabled = await intervention_manager.get_is_intervention_disabled_from_intervention_manager(intervention_name)
  if is_disabled == false
    return
  await intervention_manager.set_intervention_enabled_from_intervention_manager(intervention_name)
  return

export set_intervention_disabled_permanently = (intervention_name) ->>
  is_disabled = await intervention_manager.get_is_intervention_disabled_from_intervention_manager(intervention_name)
  if is_disabled == true
    return
  await intervention_manager.set_intervention_disabled_from_intervention_manager(intervention_name)
  return

export set_intervention_disabled = (intervention_name) ->>
  is_disabled = await intervention_manager.get_is_intervention_disabled_from_intervention_manager(intervention_name)
  if is_disabled == true
    return
  await intervention_manager.set_intervention_disabled_from_intervention_manager(intervention_name)
  return

export is_intervention_enabled = (intervention_name) ->>
  is_disabled = await intervention_manager.get_is_intervention_disabled_from_intervention_manager(intervention_name)
  if is_disabled == true
    return false
  return true

export record_intensity_level_for_intervention = (intervention_name, generic_name, intensity) ->>
  await setkey_dict 'interventions_to_intensity_ratings', generic_name, intensity
  await log_utils.log_feedback_internal(intervention_name, {
    feedback_type: 'intensity',
    intensity: intensity,
    generic_name: generic_name,
    intervention_name: intervention_name,
  })

export get_intensity_level_for_intervention = (intervention_name) ->>
  return await getkey_dict 'interventions_to_intensity_ratings', intervention_name

export list_interventions_and_num_log_items = ->>
  all_interventions = await get_interventions()
  intervention_log_db = await log_utils.getInterventionLogDb()
  intervention_names = []
  intervention_count_promises = []
  intervention_to_generic_name = {}
  for intervention_name,intervention_info of all_interventions
    if intervention_info.generic_intervention?
      intervention_to_generic_name[intervention_name] = intervention_info.generic_intervention
    intervention_names.push(intervention_name)
    intervention_log_collection = intervention_log_db[intervention_name]
    if not intervention_log_collection?
      intervention_count_promises.push(Promise.resolve(0))
    else
      intervention_count_promises.push(intervention_log_collection.count())
  intervention_counts = await Promise.all(intervention_count_promises)
  intervention_name_to_count = {}
  intervention_names_and_counts = prelude.zip(intervention_names, intervention_counts)
  for [intervention_name, intervention_count] in intervention_names_and_counts
    generic_name = intervention_to_generic_name[intervention_name]
    if not generic_name?
      continue
    if not intervention_name_to_count[generic_name]?
      intervention_name_to_count[generic_name] = intervention_count
    else
      intervention_name_to_count[generic_name] += intervention_count
  intervention_name_to_count_all = {}
  for [intervention_name, intervention_count] in intervention_names_and_counts
    generic_name = intervention_to_generic_name[intervention_name]
    if not generic_name?
      intervention_name_to_count_all[intervention_name] = intervention_count
    else
      generic_count = intervention_name_to_count[generic_name]
      intervention_name_to_count_all[intervention_name] = generic_count      
  output = []
  for [intervention_name, intervention_count] in intervention_names_and_counts
    output.push [intervention_name, intervention_name_to_count_all[intervention_name]]
  return output

export list_interventions_that_have_been_seen = ->>
  interventions_and_num_log_items = await list_interventions_and_num_log_items()
  output = []
  for [intervention_name, num_log_items] in interventions_and_num_log_items
    if num_log_items > 0
      output.push(intervention_name)
  return output

export list_interventions_that_have_not_been_seen = ->>
  interventions_and_num_log_items = await list_interventions_and_num_log_items()
  output = []
  for [intervention_name, num_log_items] in interventions_and_num_log_items
    if num_log_items == 0
      output.push(intervention_name)
  return output

export list_possible_intervention_suggestions = ->>
  # unenabled interventions, not seen, for goals that are enabled
  # returns a list of suggestions
  interventions_not_seen = await list_interventions_that_have_not_been_seen()
  #enabled_interventions = await get_enabled_interventions()
  enabled_goals = await goal_utils.get_enabled_goals()
  all_interventions = await get_interventions()
  output = []
  for intervention_name in interventions_not_seen
    #if enabled_interventions[intervention_name] != true
    #  continue
    intervention_info = all_interventions[intervention_name]
    goal_for_intervention = intervention_info?goals?[0]
    if not goal_for_intervention?
      continue
    if enabled_goals[goal_for_intervention] != true
      continue
    output.push(intervention_name)
  return output

export get_enabled_interventions_for_url_that_have_not_been_seen = (url) ->>
  output = []
  enabled_interventions = await get_enabled_interventions()
  possible_suggestions = await list_possible_intervention_suggestions_for_url(url)
  for intervention_name in possible_suggestions
    if enabled_interventions[intervention_name]
      # have not yet tried all existing enabled interventions
      output.push intervention_name
  return output

export list_possible_intervention_suggestions_for_url = (url) ->>
  available_interventions = await list_available_interventions_for_location(url)
  available_interventions_set = new Set(available_interventions)
  possible_intervention_suggestions = await list_possible_intervention_suggestions()
  return possible_intervention_suggestions.filter ->
    available_interventions_set.has(it)

export get_suggested_intervention_if_needed_for_url = (url) ->>
  if localStorage.suggest_interventions != 'true'
    return null
  cur_epoch = get_days_since_epoch()
  intervention_suggestion_frequency_days = switch localStorage.intervention_suggestion_algorithm
  | '1day' => 1
  | '3day' => 3
  | '5day' => 5
  | '7day' => 7
  | 'always' => 0
  | _ => 0
  #intervention_suggestion_frequency_days_options = [1,3,5,7]
  #intervention_suggestion_frequency_days = intervention_suggestion_frequency_days_options[Math.floor(Math.random() * intervention_suggestion_frequency_days_options.length)]
  #last_epoch_intervention_suggested = await getvar('last_epoch_intervention_suggested')
  #if not (last_epoch_intervention_suggested? and isFinite(last_epoch_intervention_suggested))
  #  last_epoch_intervention_suggested = 0
  last_epoch_new_intervention_seen = await getvar('last_epoch_new_intervention_seen')
  last_epoch_new_intervention_seen = parseInt(last_epoch_new_intervention_seen)
  if not (last_epoch_new_intervention_seen? and isFinite(last_epoch_new_intervention_seen))
    last_epoch_new_intervention_seen = 0
  last_epoch_new_intervention_suggested_or_seen = last_epoch_new_intervention_seen
  #last_epoch_new_intervention_suggested_or_seen = Math.max(last_epoch_intervention_suggested, last_epoch_new_intervention_seen)
  if (Math.abs(cur_epoch - last_epoch_new_intervention_suggested_or_seen) < intervention_suggestion_frequency_days)
    # already suggested an intervention recently
    return null
  possible_suggestions = await list_possible_intervention_suggestions_for_url(url)
  if possible_suggestions.length == 0
    return null
  enabled_interventions = await get_enabled_interventions()
  for intervention_name in possible_suggestions
    if enabled_interventions[intervention_name]
      # have not yet tried all existing enabled interventions
      return null
  random_intervention = possible_suggestions[Math.floor(Math.random() * possible_suggestions.length)]
  return random_intervention
  # todo implement
  # returns null if no intervention should be suggested
  #available_interventions = await list_available_interventions_for_location(url)
  #possible_intervention_suggestions = await list_possible_intervention_suggestions()

video_domains_set = new Set([
  'www.iqiyi.com'
  'v.youku.com'
  'vimeo.com'
  'www.youtube.com'
  'www.netflix.com'
  'www.hulu.com'
  'www.dailymotion.com'
  'www.iqiyi.com'
  'www.youku.com'
  'www.bilibili.com'
  'www.nicovideo.jp'
  'metacafe.com'
  'www.veoh.com'
  'www.sonycrackle.com'
  'www.screenjunkies.com'
  '9gag.com'
  'www.ted.com'
])

export is_video_domain = (domain) ->
  return video_domains_set.has(domain)

export enabledisable_interventions_based_on_difficulty = (difficulty) ->>
  difficulty_numeric_map = {
    'nothing': 0,
    'easy': 1,
    'medium': 2,
    'hard': 3,
  }
  difficulty_numeric = difficulty_numeric_map[difficulty]
  all_interventions = await get_interventions()
  prev_enabled_interventions = await get_enabled_interventions()
  new_enabled_interventions = {}
  changed_interventions = []
  for intervention_name in Object.keys(all_interventions)
    intervention_info = all_interventions[intervention_name]
    was_previously_enabled = prev_enabled_interventions[intervention_name] == true
    now_enabled = was_previously_enabled
    if difficulty == 'nothing'
      now_enabled = false
    if (intervention_info.difficulty != null && difficulty_numeric_map[intervention_info.difficulty] != null)
      now_enabled = difficulty_numeric_map[intervention_info.difficulty] <= difficulty_numeric
    new_enabled_interventions[intervention_name] = now_enabled
    if now_enabled != was_previously_enabled
      changed_interventions.push(intervention_name)
  for intervention_name in changed_interventions
    now_enabled = new_enabled_interventions[intervention_name]
    if now_enabled
      await set_intervention_enabled(intervention_name)
    else
      await set_intervention_disabled(intervention_name)
  return

export intervention_first_seen_power_enabledisable = (intervention, is_enabled, url) ->>
  is_generic = false
  intervention_name_orig = intervention.name
  intervention_name = intervention.name
  if intervention.generic_intervention?
    intervention_name = intervention.generic_intervention
    is_generic = true
  prev_enabled_interventions = await get_enabled_interventions()
  log_intervention_info = {
    page: 'habitlab-intervention-first-seen-power',
    subpage: 'habitlab-intervention-first-seen-power',
    category: 'intervention_enabledisable',
    is_permanent: true,
    is_generic: is_generic,
    manual: true,
    turned_off_for_visit: false,
    url: url,
    intervention_name: intervention_name_orig,
    prev_enabled_interventions: prev_enabled_interventions,
  }
  if is_enabled
    log_intervention_info.type = 'intervention_set_smartly_managed'
    log_intervention_info.now_enabled = true
    await set_intervention_enabled(intervention_name)
    if is_generic
      log_intervention_info.change_subinterventions = true
      log_intervention_info.subinterventions_list = await list_subinterventions_for_generic_intervention(intervention_name)
      await set_subinterventions_enabled_for_generic_intervention(intervention_name)
  else
    log_intervention_info.type = 'intervention_set_always_disabled'
    log_intervention_info.now_enabled = false
    await set_intervention_disabled(intervention_name)
    if is_generic
      log_intervention_info.change_subinterventions = true
      log_intervention_info.subinterventions_list = await list_subinterventions_for_generic_intervention(intervention_name)
      await set_subinterventions_disabled_for_generic_intervention(intervention_name)
  await log_utils.add_log_interventions(log_intervention_info)
  return

export set_subinterventions_enabled_for_generic_intervention = (generic_intervention_name) ->>
  subinterventions_list = await list_subinterventions_for_generic_intervention(generic_intervention_name)
  for intervention_name in subinterventions_list
    await set_intervention_enabled(intervention_name)
  return

export set_subinterventions_disabled_for_generic_intervention = (generic_intervention_name) ->>
  subinterventions_list = await list_subinterventions_for_generic_intervention(generic_intervention_name)
  for intervention_name in subinterventions_list
    await set_intervention_disabled(intervention_name)
  return

export list_subinterventions_for_generic_intervention = (generic_intervention_name) ->>
  interventions_list = await list_all_interventions()
  all_interventions = await get_interventions()
  output = []
  for intervention_name in interventions_list
    intervention_info = all_interventions[intervention_name]
    if intervention_info? and intervention_info.generic_intervention? and intervention_info.generic_intervention == generic_intervention_name
      output.push(intervention_name)
  return output

export generate_interventions_for_domain = (domain) ->>
  goal_name = "custom/spend_less_time_#{domain}"
  goal_info = await goal_utils.get_goal_info(goal_name)
  default_interventions = goal_info.default_interventions ? []
  generic_interventions = await list_generic_interventions()
  all_intervention_info = await get_interventions()
  if is_video_domain(domain)
    video_interventions = await list_video_interventions()
    generic_interventions = generic_interventions.concat video_interventions
  new_intervention_info_list = []
  for generic_intervention in generic_interventions
    intervention_info = all_intervention_info[generic_intervention]
    if not intervention_info?
      continue
    intervention_info = JSON.parse JSON.stringify intervention_info
    fixed_intervention_name = generic_intervention
    fixed_intervention_name = fixed_intervention_name.split('generic/').join("generated_#{domain}/")
    fixed_intervention_name = fixed_intervention_name.split('video/').join("generated_#{domain}/")
    intervention_info.name = fixed_intervention_name
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
    intervention_info.goals = [goal_name]
    intervention_info.is_default = default_interventions.includes(intervention_info.name)
    #fix_intervention_info intervention_info, ["custom/spend_less_time_#{domain}"] # TODO may need to add the goal it addresses
    new_intervention_info_list.push intervention_info
  /*
  [default_enabled_interventions, interventions_per_goal, intervention_choosing_strategy] = select_subset_of_available_interventions(new_intervention_info_list)
  log_utils.add_log_interventions {
    type: 'default_interventions_for_custom_goal'
    interventions_per_goal: interventions_per_goal
    custom_goal: goal_name
    intervention_choosing_strategy: intervention_choosing_strategy
    default_enabled_interventions: default_enabled_interventions
  }
  */
  await add_new_interventions new_intervention_info_list
  return

export generate_interventions_for_positive_domain = (domain) ->>
  goal_name = "custom/spend_more_time_#{domain}"
  goal_info = await goal_utils.get_goal_info(goal_name)
  default_interventions = goal_info.default_interventions ? []
  generic_interventions = await list_generic_positive_interventions()
  all_intervention_info = await get_interventions()
  new_intervention_info_list = []
  for generic_intervention in generic_interventions
    intervention_info = all_intervention_info[generic_intervention]
    if not intervention_info?
      continue
    intervention_info = JSON.parse JSON.stringify intervention_info
    fixed_intervention_name = generic_intervention
    fixed_intervention_name = fixed_intervention_name.split('generic_positive/').join("generated_#{domain}/")
    intervention_info.name = fixed_intervention_name
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
    intervention_info.goals = [goal_name]
    intervention_info.is_default = default_interventions.includes(intervention_info.name)
    #fix_intervention_info intervention_info, ["custom/spend_less_time_#{domain}"] # TODO may need to add the goal it addresses
    new_intervention_info_list.push intervention_info
  await add_new_interventions new_intervention_info_list
  return

export add_new_intervention = (intervention_info) ->>
  await add_new_interventions [intervention_info]
  /*
  add_new_intervention({

  })
  */

/**
 * Returns a list of names of custom interventions
 * @return {Promise.<Array.<InterventionName>>} List of names of custom interventions
 */
export list_custom_interventions = ->>
  all_interventions = await get_interventions()
  return prelude.sort [name for name,info of all_interventions when info.custom]

export add_new_interventions = (intervention_info_list) ->>
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
  goal_utils.clear_cache_get_goals()
  clear_cache_all_interventions()
  log_utils.clear_intervention_logdb_cache()
  #clear_interventions_from_cache(new_intervention_names)
  await list_all_interventions()
  await get_interventions()
  await goal_utils.get_goals()
  await log_utils.getInterventionLogDb()
  return

export remove_all_custom_interventions = ->
  clear_cache_all_interventions()
  goal_utils.clear_cache_get_goals()
  localStorage.removeItem 'extra_get_interventions'
  localStorage.removeItem 'extra_list_all_interventions'
  return

export remove_generated_interventions_for_domain = (domain) ->
  clear_cache_all_interventions()
  goal_utils.clear_cache_get_goals()
  remove_keys_matching_patternfunc_from_localstorage_dict 'extra_get_interventions', -> it.startsWith("generated_#{domain}/")
  remove_items_matching_patternfunc_from_localstorage_list 'extra_list_all_interventions', -> it.startsWith("generated_#{domain}/")
  return

export remove_custom_intervention = (intervention_name) ->
  clear_cache_all_interventions()
  goal_utils.clear_cache_get_goals()
  remove_key_from_localstorage_dict 'extra_get_interventions', intervention_name
  remove_item_from_localstorage_list 'extra_list_all_interventions', intervention_name
  localStorage.removeItem 'saved_intervention_' + intervention_name
  localStorage.removeItem 'saved_interventions_' + intervention_name
  localStorage.removeItem 'saved_intervention_time_' + intervention_name
  # if it is downloaded
  localStorage.removeItem 'downloaded_intervention_' + intervention_name
  return

export list_generic_interventions = memoizeSingleAsync ->>
  cached_generic_interventions = localStorage.getItem 'cached_list_generic_interventions'
  if cached_generic_interventions?
    return JSON.parse cached_generic_interventions
  #interventions_list = await localget_json('/interventions/interventions.json')
  interventions_list = (await goal_utils.get_goal_intervention_info()).interventions.map((.name))
  generic_interventions_list = interventions_list.filter -> it.startsWith('generic/')
  localStorage.setItem 'cached_list_generic_interventions', JSON.stringify(generic_interventions_list)
  return generic_interventions_list

export list_generic_positive_interventions = memoizeSingleAsync ->>
  cached_generic_positive_interventions = localStorage.getItem 'cached_list_generic_positive_interventions'
  if cached_generic_positive_interventions?
    return JSON.parse cached_generic_positive_interventions
  interventions_list = (await goal_utils.get_goal_intervention_info()).interventions.map((.name))
  generic_positive_interventions_list = interventions_list.filter -> it.startsWith('generic_positive/')
  localStorage.setItem 'cached_list_generic_positive_interventions', JSON.stringify(generic_positive_interventions_list)
  return generic_positive_interventions_list

export list_video_interventions = memoizeSingleAsync ->>
  cached_video_interventions = localStorage.getItem 'cached_list_video_interventions'
  if cached_video_interventions?
    return JSON.parse cached_video_interventions
  #interventions_list = await localget_json('/interventions/interventions.json')
  interventions_list = (await goal_utils.get_goal_intervention_info()).interventions.map((.name))
  video_interventions_list = interventions_list.filter -> it.startsWith('video/')
  localStorage.setItem 'cached_list_video_interventions', JSON.stringify(video_interventions_list)
  return video_interventions_list


#local_cache_list_all_interventions = null

/**
 * Lists all available interventions
 * @return {Promise.<Array.<InterventionName>>} The list of available interventions
 */
export list_all_interventions = ->>
  #if local_cache_list_all_interventions?
  #  return local_cache_list_all_interventions
  cached_list_all_interventions = localStorage.getItem 'cached_list_all_interventions'
  if cached_list_all_interventions?
    return JSON.parse cached_list_all_interventions
    #local_cache_list_all_interventions := JSON.parse cached_list_all_interventions
    #return local_cache_list_all_interventions
  #interventions_list = await localget_json('/interventions/interventions.json')
  interventions_list = (await goal_utils.get_goal_intervention_info()).interventions.map((.name))
  interventions_list_extra_text = localStorage.getItem 'extra_list_all_interventions'
  if interventions_list_extra_text?
    interventions_list_extra = JSON.parse interventions_list_extra_text
    interventions_list = unique_concat interventions_list, interventions_list_extra
  localStorage.setItem 'cached_list_all_interventions', JSON.stringify(interventions_list)
  #local_cache_list_all_interventions := interventions_list
  return interventions_list

export clear_extra_interventions_and_cache = ->
  localStorage.removeItem('extra_get_interventions')
  localStorage.removeItem('extra_list_all_interventions')
  clear_cache_all_interventions()


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

/**
 * Gets the intervention info for the specified intervention name
 * @param {InterventionName} intervention_name - The name of the intervention
 * @return {Promise.<InterventionInfo>} The intervention info
 */
export get_intervention_info = (intervention_name) ->>
  all_interventions = await get_interventions()
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
  intervention_info.match_functions = intervention_info.matches.map (x) ->
    if x.includes('/') or x.includes('\\') or x.includes('*') or x.includes('?') # looks like a regex
      regex = new RegExp(x)
      return (str) -> regex.test(str)
    else
      return (str) -> url_to_domain(str).includes(x)
  intervention_info.nomatch_functions = intervention_info.nomatches.map (x) ->
    if x.includes('/') or x.includes('\\') or x.includes('*') or x.includes('?') # looks like a regex
      regex = new RegExp(x)
      return (str) -> regex.test(str)
    else
      return (str) -> url_to_domain(str).includes(x)
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
export get_interventions = ->>
  #if local_cache_get_interventions?
    #return local_cache_get_interventions
  cached_get_interventions = localStorage.getItem 'cached_get_interventions'
  if cached_get_interventions?
    interventions_to_goals = await goal_utils.get_interventions_to_goals()
    intervention_name_to_info = JSON.parse cached_get_interventions
    fix_intervention_name_to_intervention_info_dict intervention_name_to_info, interventions_to_goals
    return intervention_name_to_info
    #return JSON.parse cached_get_interventions
    #local_cache_get_interventions := JSON.parse cached_get_interventions
    #return local_cache_get_interventions
  interventions_to_goals_promises = goal_utils.get_interventions_to_goals()
  interventions_list = await list_all_interventions()
  output = {}
  extra_get_interventions_text = localStorage.getItem 'extra_get_interventions'
  if extra_get_interventions_text?
    extra_get_interventions = JSON.parse extra_get_interventions_text
    for intervention_name,intervention_info of extra_get_interventions
      output[intervention_name] = intervention_info
  intervention_name_to_info_promises = {[intervention_name, getInterventionInfo(intervention_name)] for intervention_name in interventions_list when not output[intervention_name]?}
  [intervention_name_to_info, interventions_to_goals] = await Promise.all [intervention_name_to_info_promises, interventions_to_goals_promises]
  for intervention_name,intervention_info of intervention_name_to_info
    output[intervention_name] = intervention_info
  localStorage.setItem 'cached_get_interventions', JSON.stringify(output)
  fix_intervention_name_to_intervention_info_dict output, interventions_to_goals
  return output
*/

get_interventions_per_goal = ->
  if localStorage.getItem('interventions_per_goal')?
    return localStorage.getItem('interventions_per_goal')
  interventions_per_goal = ['one', 'half_of_defaults', 'all_of_defaults'][Math.floor(Math.random()*3)]
  localStorage.setItem 'interventions_per_goal', interventions_per_goal
  return interventions_per_goal

get_intervention_choosing_strategy = ->
  if localStorage.getItem('intervention_choosing_strategy')?
    return localStorage.getItem('intervention_choosing_strategy')
  intervention_choosing_strategy = 'random'
  localStorage.setItem 'intervention_choosing_strategy', intervention_choosing_strategy
  return intervention_choosing_strategy

select_subset_of_available_interventions = (intervention_info_list_all) ->
  goal_to_intervention_info_list = {}
  for intervention_info in intervention_info_list_all
    if not intervention_info.goals?
      continue
    goal_name = intervention_info.goals[0]
    if not goal_name?
      continue
    if not goal_to_intervention_info_list[goal_name]?
      goal_to_intervention_info_list[goal_name] = []
    goal_to_intervention_info_list[goal_name].push(intervention_info)
  default_enabled_interventions = {}
  interventions_per_goal = get_interventions_per_goal()
  for goal_name,intervention_info_list of goal_to_intervention_info_list
    available_default_interventions = []
    for intervention_info in intervention_info_list
      if intervention_info.is_default
        available_default_interventions.push(intervention_info.name)
    available_default_interventions = shuffled(available_default_interventions)
    num_interventions_chosen = available_default_interventions.length
    if interventions_per_goal == 'half_of_defaults'
      num_interventions_chosen = Math.round(available_default_interventions.length * 0.5)
    if interventions_per_goal == 'one'
      num_interventions_chosen = 1
    chosen_interventions = available_default_interventions.slice(0, num_interventions_chosen)
    for intervention_name in chosen_interventions
      default_enabled_interventions[intervention_name] = true
  for intervention_info in intervention_info_list_all
    if not default_enabled_interventions[intervention_info.name]?
      default_enabled_interventions[intervention_info.name] = false
  intervention_choosing_strategy = get_intervention_choosing_strategy()
  return [default_enabled_interventions, interventions_per_goal, intervention_choosing_strategy]

/**
 * Gets the intervention info for all interventions, in the form of an object mapping intervention names to intervention info
 * @return {Promise.<Object.<InterventionName, InterventionInfo>>} Object mapping intervention names to intervention info
 */
export get_interventions = ->>
  #if local_cache_get_interventions?
    #return local_cache_get_interventions
  cached_get_interventions = localStorage.getItem 'cached_get_interventions'
  interventions_to_goals = await goal_utils.get_interventions_to_goals()
  if cached_get_interventions?
    intervention_name_to_info = JSON.parse cached_get_interventions
    fix_intervention_name_to_intervention_info_dict intervention_name_to_info, interventions_to_goals
    return intervention_name_to_info
    #return JSON.parse cached_get_interventions
    #local_cache_get_interventions := JSON.parse cached_get_interventions
    #return local_cache_get_interventions
  interventions_list = await list_all_interventions()
  output = {}
  intervention_info_list = (await goal_utils.get_goal_intervention_info()).interventions
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

/*
export get_interventions = ->>
  #if local_cache_get_interventions?
    #return local_cache_get_interventions
  cached_get_interventions = localStorage.getItem 'cached_get_interventions'
  interventions_to_goals = await goal_utils.get_interventions_to_goals()
  if cached_get_interventions?
    intervention_name_to_info = JSON.parse cached_get_interventions
    fix_intervention_name_to_intervention_info_dict intervention_name_to_info, interventions_to_goals
    return intervention_name_to_info
    #return JSON.parse cached_get_interventions
    #local_cache_get_interventions := JSON.parse cached_get_interventions
    #return local_cache_get_interventions
  interventions_list = await list_all_interventions()
  output = {}
  intervention_info_list = (await goal_utils.get_goal_intervention_info()).interventions
  default_enabled_interventions = {}
  cached_default_enabled_interventions = localStorage.getItem('default_interventions_on_install_cached')
  if cached_default_enabled_interventions?
    default_enabled_interventions = JSON.parse(cached_default_enabled_interventions)
  else
    [default_enabled_interventions, interventions_per_goal, intervention_choosing_strategy] = select_subset_of_available_interventions(intervention_info_list)
    localStorage.setItem('default_interventions_on_install_cached', JSON.stringify(default_enabled_interventions))
    # log the enabled one
    await log_utils.add_log_interventions {
      type: 'default_interventions_on_install'
      interventions_per_goal: interventions_per_goal
      intervention_choosing_strategy: intervention_choosing_strategy
      enabled_interventions: default_enabled_interventions
      #enabled_goals: {} # incorrect value
    }
  for intervention_info in intervention_info_list
    intervention_info.is_default = (default_enabled_interventions[intervention_info.name] == true)
    output[intervention_info.name] = intervention_info
  extra_get_interventions_text = localStorage.getItem 'extra_get_interventions'
  if extra_get_interventions_text?
    extra_get_interventions = JSON.parse extra_get_interventions_text
    for intervention_name,intervention_info of extra_get_interventions
      output[intervention_name] = intervention_info
  localStorage.setItem 'cached_get_interventions', JSON.stringify(output)
  fix_intervention_name_to_intervention_info_dict output, interventions_to_goals
  return output
*/

export clear_cache_get_interventions = ->
  #local_cache_get_interventions := null
  localStorage.removeItem 'cached_get_interventions'
  return

export list_enabled_interventions_for_location = (location) ->>
  available_interventions = await list_available_interventions_for_location(location)
  enabled_interventions = await get_enabled_interventions()
  return available_interventions.filter((x) -> enabled_interventions[x])

/*
export list_all_enabled_interventions_for_location_with_override = (location) ->>
  # TODO this no longer works on new days. need to persist enabled interventions across days
  override_enabled_interventions = localStorage.getItem('override_enabled_interventions_once')
  if override_enabled_interventions?
    #localStorage.removeItem('override_enabled_interventions_once')
    return as_array(JSON.parse(override_enabled_interventions))
  available_interventions = await list_available_interventions_for_location(location)
  enabled_interventions = await intervention_manager.get_most_recent_enabled_interventions()
  return available_interventions.filter((x) -> enabled_interventions[x])
*/

export list_all_enabled_interventions_for_location = (location) ->>
  #override_enabled_interventions = localStorage.getItem('override_enabled_interventions_once')
  #if override_enabled_interventions?
  #  return as_array(JSON.parse(override_enabled_interventions))
  available_interventions = await list_available_interventions_for_location(location)
  enabled_interventions = await intervention_manager.get_currently_enabled_interventions()
  return available_interventions.filter((x) -> enabled_interventions[x])

export list_enabled_nonconflicting_interventions_for_location = (location) ->>
  available_interventions = await list_available_interventions_for_location(location)
  enabled_interventions = await get_enabled_interventions_with_override_for_visit()
  all_interventions = await get_interventions()
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

export list_available_interventions_for_location = (location) ->>
  all_interventions = await get_interventions()
  possible_interventions = []
  for intervention_name,intervention_info of all_interventions
    blacklisted = false
    for func in intervention_info.nomatch_functions
      if func(location)
        blacklisted = true
        break
    if blacklisted
      continue
    matches = false
    if intervention_info.matches_all?
      matches = true
    else
      for func in intervention_info.match_functions
        if func(location)
          matches = true
          break
    if matches
      possible_interventions.push intervention_name
  return possible_interventions

export filter_interventions_by_temporary_difficulty = (intervention_list, all_interventions) ->
  difficulty = localStorage.getItem('temporary_difficulty')
  if not difficulty?
    return intervention_list
  return filter_interventions_to_best_match_difficulty(intervention_list, difficulty, all_interventions)

export filter_interventions_to_best_match_difficulty = (intervention_list, difficulty, all_interventions) ->
  console.log('filter_interventions_to_best_match_difficulty')
  console.log(intervention_list)
  console.log(difficulty)
  console.log(all_interventions)
  if not difficulty?
    return intervention_list
  difficulties = ['hard', 'medium', 'easy']
  target_difficulty_idx = difficulties.indexOf(difficulty)
  if target_difficulty_idx == -1
    return intervention_list
  easiest_allowed_difficulty_idx = target_difficulty_idx
  while easiest_allowed_difficulty_idx < difficulties.length
    output = []
    for intervention_name in intervention_list
      intervention_info = all_interventions[intervention_name]
      if not intervention_info?difficulty?
        continue
      cur_difficulty = intervention_info.difficulty
      cur_difficulty_idx = difficulties.indexOf(cur_difficulty)
      if cur_difficulty_idx == -1
        continue
      if cur_difficulty_idx < target_difficulty_idx # too hard
        continue
      if cur_difficulty_idx > easiest_allowed_difficulty_idx # too easy
        continue
      output.push(intervention_name)
    easiest_allowed_difficulty_idx += 1
    if output.length > 0
      return output
  return intervention_list

export set_temporary_difficulty = (difficulty) ->>
  localStorage.setItem('temporary_difficulty', difficulty)
  setvar_experiment('temporary_difficulty', difficulty)
  return

export set_asknext_time = (asknext_time) ->>
  localStorage.setItem('asknext_time', asknext_time)
  setvar_experiment('asknext_time', asknext_time)
  return

/*
export get_enabled_intervention_for_goal_by_difficulty = (goal, difficulty) ->>
  all_interventions = await get_interventions()
  enabled_interventions = await get_enabled_interventions()
  intervention_list = await list_all_interventions()
  available_interventions = []
  for intervention_name in intervention_list
    if not enabled_interventions[intervention_name]
      continue
    intervention_info = all_interventions[intervention_name]
    if not intervention_info?goals?indexOf?
      continue
    if intervention_info.goals.indexOf(goal) == -1
      continue
    if 
    available_interventions.push(intervention_name)
  return available_interventions
*/

export get_manually_managed_interventions_localstorage = ->>
  manually_managed_interventions_str = localStorage.getItem('manually_managed_interventions')
  if not manually_managed_interventions_str?
    manually_managed_interventions = {}
  else
    manually_managed_interventions = JSON.parse manually_managed_interventions_str
  return manually_managed_interventions

export get_manually_managed_interventions = get_manually_managed_interventions_localstorage

/*
export get_most_recent_manually_enabled_interventions = ->>
  enabled_interventions = await intervention_manager.get_most_recent_enabled_interventions()
  manually_managed_interventions = await get_manually_managed_interventions()
  output = {}
  for intervention_name,is_enabled of enabled_interventions
    output[intervention_name] = is_enabled and manually_managed_interventions[intervention_name]
  return output

export get_most_recent_manually_disabled_interventions = ->>
  enabled_interventions = await intervention_manager.get_most_recent_enabled_interventions()
  manually_managed_interventions = await get_manually_managed_interventions()
  output = {}
  for intervention_name,is_enabled of enabled_interventions
    output[intervention_name] = (!is_enabled) and manually_managed_interventions[intervention_name]
  return output
*/

export set_manually_managed_interventions = (manually_managed_interventions) ->>
  localStorage.setItem 'manually_managed_interventions', JSON.stringify(manually_managed_interventions)
  return

export set_intervention_manually_managed = (intervention_name) ->>
  manually_managed_interventions = await get_manually_managed_interventions()
  if manually_managed_interventions[intervention_name]
    return
  manually_managed_interventions[intervention_name] = true
  await set_manually_managed_interventions manually_managed_interventions

export set_intervention_automatically_managed = (intervention_name) ->>
  manually_managed_interventions = await get_manually_managed_interventions()
  if not manually_managed_interventions[intervention_name]
    return
  manually_managed_interventions[intervention_name] = false
  await set_manually_managed_interventions manually_managed_interventions

export list_available_interventions_for_enabled_goals = ->>
  # outputs a list of intervention names
  interventions_to_goals = await goal_utils.get_interventions_to_goals()
  enabled_goals = await goal_utils.get_enabled_goals()
  output = []
  output_set = {}
  for intervention_name,goal_names of interventions_to_goals
    for goal_name in goal_names
      if enabled_goals[goal_name]? and not output_set[intervention_name]?
        output.push intervention_name
        output_set[intervention_name] = true
  return output

export list_available_interventions_for_goal = (goal_name) ->>
  # outputs a list of intervention names
  goal_info = await goal_utils.get_goal_info(goal_name)
  if goal_info? and goal_info.interventions?
    return goal_info.interventions
  else
    return []

export list_enabled_interventions_for_goal = (goal_name) ->>
  # outputs a list of intervention names
  enabled_interventions = await get_enabled_interventions()
  available_interventions_for_goal = await list_available_interventions_for_goal(goal_name)
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

export set_intervention_parameter = (intervention_name, parameter_name, parameter_value) ->>
  await setkey_dictdict 'intervention_to_parameters', intervention_name, parameter_name, parameter_value

get_intervention_parameter_type = (intervention_name, parameter_name) ->>
  interventions = await get_interventions()
  intervention_info = interventions[intervention_name]
  parameter_type = intervention_info.params[parameter_name].type
  return parameter_type

export get_intervention_parameter_default = (intervention_name, parameter_name) ->>
  interventions = await get_interventions()
  intervention_info = interventions[intervention_name]
  parameter_type = intervention_info.params[parameter_name].type
  parameter_value = intervention_info.params[parameter_name].default
  return cast_to_type(parameter_value, parameter_type)

export get_intervention_parameters_default = (intervention_name) ->>
  interventions = await get_interventions()
  intervention_info = interventions[intervention_name]
  return {[x.name, cast_to_type(x.default, x.type)] for x in intervention_info.parameters}

export get_intervention_parameter = (intervention_name, parameter_name) ->>
  result = await getkey_dictdict 'intervention_to_parameters', intervention_name, parameter_name
  parameter_type = await get_intervention_parameter_type(intervention_name, parameter_name)
  if result?
    return cast_to_type(result, parameter_type)
  await get_intervention_parameter_default(intervention_name, parameter_name)

export get_intervention_parameters = (intervention_name) ->>
  results = await getdict_for_key_dictdict 'intervention_to_parameters', intervention_name
  default_parameters = await get_intervention_parameters_default(intervention_name)
  interventions = await get_interventions()
  intervention_info = interventions[intervention_name]
  output = {}
  for k,v of default_parameters
    parameter_value = results[k] ? default_parameters[k]
    parameter_type = intervention_info.params[k].type
    output[k] = cast_to_type(parameter_value, parameter_type)
  return output

/**
 * Returns a dictionary with keys being the intervention, values being the number of sessions.
 * NOTE: These interventions are not necessarily enabled by the user.
 */
export get_number_sessions_for_each_intervention = (domain) ->>
  session_id_to_interventions = await getdict_for_key_dictdict('interventions_active_for_domain_and_session', domain)
  interventions = {}
  for id, intervention of session_id_to_interventions
    # Need to cut of brackets and quotations from string. 
    intervention_name = intervention.substr(2,intervention.length - 4)
    if interventions[intervention_name]?
      interventions[intervention_name]++
    else
      interventions[intervention_name] = 1
  return interventions

export get_seconds_spent_on_domain_for_each_intervention = (domain) ->>
  session_id_to_interventions = await getdict_for_key_dictdict('interventions_active_for_domain_and_session', domain)
  session_id_to_seconds = await getdict_for_key_dictdict('seconds_on_domain_per_session', domain)
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
    output[intervention] = median session_lengths
  return output

export get_seconds_spent_for_each_session_per_intervention = (domain) ->>
  session_id_to_interventions = await getdict_for_key_dictdict('interventions_active_for_domain_and_session', domain)
  session_id_to_seconds = await getdict_for_key_dictdict('seconds_on_domain_per_session', domain)
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
    output[intervention] = session_lengths
  return output

export get_seconds_saved_per_session_for_each_intervention_for_goal = (goal_name) ->>
  goal_info = await goal_utils.get_goal_info(goal_name)
  output = {}
  if not goal_info.interventions?
    return output
  domain = goal_info.domain
  intervention_names = goal_info.interventions
  intervention_to_seconds_per_session = await get_seconds_spent_on_domain_for_each_intervention(domain)
  baseline_session_time = await get_baseline_session_time_on_domain(domain)
  for intervention in intervention_names
    seconds_per_session = intervention_to_seconds_per_session[intervention]
    if not seconds_per_session?
      output[intervention] = NaN
      continue
    time_saved = baseline_session_time - seconds_per_session
    output[intervention] = time_saved
  return output

export get_seconds_spent_per_session_for_each_intervention_for_goal = (goal_name) ->>
  goal_info = await goal_utils.get_goal_info(goal_name)
  domain = goal_info.domain
  intervention_names = goal_info.interventions
  session_id_to_interventions = await getdict_for_key_dictdict('interventions_active_for_domain_and_session', domain)
  session_id_to_seconds = await getdict_for_key_dictdict('seconds_on_domain_per_session', domain)
  intervention_to_seconds_per_session = await get_seconds_spent_on_domain_for_each_intervention(domain)
  baseline_session_time = await get_baseline_session_time_on_domain(domain)
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
export get_effectiveness_of_all_interventions_for_goal = (goal_name) ->>
  goal_info = await goal_utils.get_goal_info(goal_name)
  domain = goal_info.domain
  intervention_names = goal_info.interventions
  session_id_to_interventions = await getdict_for_key_dictdict('interventions_active_for_domain_and_session', domain)
  session_id_to_seconds = await getdict_for_key_dictdict('seconds_on_domain_per_session', domain)
  intervention_to_seconds_per_session = await get_seconds_spent_on_domain_for_each_intervention(domain)
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

export get_goals_and_interventions = ->>
  intervention_name_to_info = await get_interventions()
  enabled_interventions = await get_enabled_interventions()
  enabled_goals = await goal_utils.get_enabled_goals()
  all_goals = await goal_utils.get_goals()
  all_goals_list = await goal_utils.list_all_goals()
  manually_managed_interventions = await get_manually_managed_interventions()
  goal_to_interventions = {}
  for intervention_name,intervention_info of intervention_name_to_info
    for goalname in intervention_info.goals
      if not goal_to_interventions[goalname]?
        goal_to_interventions[goalname] = []
      goal_to_interventions[goalname].push intervention_info
  list_of_goals_and_interventions = []
  list_of_goals = prelude.sort as_array(all_goals_list)
  for goalname in list_of_goals
    current_item = {goal: all_goals[goalname]}
    current_item.enabled = enabled_goals[goalname] == true
    if not goal_to_interventions[goalname]?
      current_item.interventions = []
    else
      current_item.interventions = prelude.sort-by (.name), goal_to_interventions[goalname]
    for intervention in current_item.interventions
      intervention.enabled_goals = []
      #if intervention.goals?
      #  intervention.enabled_goals = [goal for goal in intervention.goals when enabled_goals[goal.name]]
      intervention.enabled = (enabled_interventions[intervention.name] == true)
      intervention.automatic = (manually_managed_interventions[intervention.name] != true)
    list_of_goals_and_interventions.push current_item
  return list_of_goals_and_interventions

export get_nonpositive_goals_and_interventions = ->>
  list_of_goals_and_interventions = await get_goals_and_interventions()
  return list_of_goals_and_interventions.filter(-> !it.goal.is_positive)

/**
 * Gets the time in milliseconds since the intervention was most recently given.
 * If this intervention corresponds to a generic intervention, then we choose
 * the most recent intervention across the generic one. 
 * Returns -1 if the intervention has not been used yet.
 */
export get_time_since_intervention = (intervention_name) ->>
  name = intervention_name
  intervention = await get_intervention_info(intervention_name)
  console.log(intervention.generic_intervention)
  if intervention.generic_intervention?
    name = intervention.generic_intervention
  time = await getkey_dict('time_intervention_most_recently_seen', name)
  if time?
    return Date.now() - time
  return 60 * 60 * 1000 * 24 * 365 # number of milliseconds in a year. TODO: Visualize novelty data to find upper bound. 

/**
 * Currently, novelty is just the time since the intervention was last used.
 * TODO: Consider some other function of that time to better represent the novelty curve. [Currently assuming linear]
 * @param intervention_names list of strings
 * @return dictionary {<intervention_name>: novelty}
 */
export get_novelty = (intervention_names) ->>
  novelty = {}
  for intervention_name in intervention_names
    novelty[intervention_name] = await get_time_since_intervention(intervention_name) # TODO: see function docs
  return novelty

/*
export get_goals_and_interventions = ->>
  intervention_name_to_info = await get_interventions()
  enabled_interventions = await get_enabled_interventions()
  enabled_goals = await goal_utils.get_enabled_goals()
  all_goals = await goal_utils.get_goals()
  manually_managed_interventions = await get_manually_managed_interventions()
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

export choose_intervention_for_difficulty_level_and_goal = (difficulty, goal) ->>
  available_interventions = await intervention_selection_algorithms.all_enabled()
  all_interventions = await get_interventions()
  intervention_name_to_load = null
  for intervention_name in available_interventions
    intervention_info = all_interventions[intervention_name]
    if intervention_info.goals?
      if intervention_info.goals.indexOf(goal) != -1
        intervention_name_to_load = intervention_name
        break
  all_interventions = await get_interventions()
  intervention_list = await list_enabled_interventions_for_goal(goal)
  output = filter_interventions_to_best_match_difficulty(intervention_list, difficulty, all_interventions)
  return output[Math.floor(Math.random() * output.length)]

export choose_intervention_for_each_difficulty_level_and_goal = (goal) ->>
  difficulty_levels = ['hard', 'medium', 'easy']
  output = {}
  for difficulty in difficulty_levels
    output[difficulty] = await choose_intervention_for_difficulty_level_and_goal(difficulty, goal)
  return output

intervention_manager = require 'libs_backend/intervention_manager'
goal_utils = require 'libs_backend/goal_utils'
log_utils = require 'libs_backend/log_utils'
intervention_selection_algorithms = require 'libs_backend/intervention_selection_algorithms'

gexport_module 'intervention_utils', -> eval(it)
