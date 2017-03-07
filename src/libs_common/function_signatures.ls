lib_name_to_func_names_and_signatures =
  log_utils:
    addtolog: ['name', 'data']
    getlog: 'name'
    clearlog: 'name'
    log_impression: 'name'
    log_action: ['name', 'data']
  db_utils:
    addtolist: ['name', 'data']
    getlist: 'name'
    clearlist: 'name'
    getvar: 'key'
    setvar: ['key', 'val']
    addtovar: ['key', 'val']
    getkey_dictdict: ['name', 'key', 'key2']
    getdict_for_key_dictdict: ['name', 'key']
    getdict_for_key2_dictdict: ['name', 'key2']
  intervention_utils:
    set_intervention_enabled: 'name'
    set_intervention_disabled: 'name'
    set_intervention_disabled_permanently: 'name'
    get_intervention_info: 'intervention_name'
  tab_utils:
    close_selected_tab: []
    open_url_in_new_tab: 'url'
    get_selected_tab_id: []
    close_tab_with_id: 'tab_id'
  history_utils:
    get_pages_visited_today: []
    get_pages_visited_all_time: []
    get_work_pages_visited_today: []
    get_productivity_classifications: []
  goal_utils:
    get_goal_target: ['goal_name']
    set_goal_target: ['goal_name', 'target_value']
    get_all_goal_targets: []
    list_goal_info_for_enabled_goals: []
  goal_progress:
    get_progress_on_enabled_goals_this_week: []
  gamification_utils:
    get_num_times_intervention_used: ['intervention_name']
    get_intervention_level: ['intervention_name']
    get_time_saved_total: []
    get_time_saved_total_with_intervention: ['intervention_name']
    baseline_time_per_session_for_domain: ['domain']
    record_seconds_saved_and_get_rewards: ['seconds', 'intervention_name', 'domain']
  disable_habitlab_utils:
    disable_habitlab: []
    enable_habitlab: []
    is_habitlab_enabled: []
  session_utils:
    is_on_same_domain_and_same_tab: 'tab_id'
    is_on_same_domain: 'tab_id'
  screenshot_utils:
    get_screenshot_as_base64: []
    get_data_for_feedback: []
  fetch_page_utils:
    fetch_page_text: 'url'
  ajax_utils:
    ajax: 'options'
  cacheget_utils:
    localget: 'url'
    localget_json: 'url'
    localget_base64: 'url'
    remoteget: 'url'
    remoteget_json: 'url'
    remoteget_base64: 'url'
  favicon_utils:
    get_favicon_data_for_domain: 'domain'

func_name_to_signature = {}
for lib_name,funcs of lib_name_to_func_names_and_signatures
  for func_name,func_signature of funcs
    func_name_to_signature[func_name] = func_signature

export list_functions_in_lib = (lib_name) ->
  return Object.keys(lib_name_to_func_names_and_signatures[lib_name])

export list_libs = ->
  return Object.keys(lib_name_to_func_names_and_signatures)

export get_function_signature = (func_name) ->
  return func_name_to_signature[func_name]
