{
  gexport
  gexport_module
} = require 'libs_common/gexport'

{
  url_to_domain
} = require 'libs_common/domain_utils'

{cfy} = require 'cfy'

tab_id_to_prev2_url_visited = {}
tab_id_to_prev1_url_visited = {}

past_navigation_events_list = []

export add_tab_navigation_event = (tab_id, url) ->
  if tab_id_to_prev1_url_visited[tab_id]?
    tab_id_to_prev2_url_visited[tab_id] = tab_id_to_prev1_url_visited[tab_id]
  tab_id_to_prev1_url_visited[tab_id] = url
  while past_navigation_events_list.length > 1
    past_navigation_events_list.shift()
  past_navigation_events_list.push [tab_id, url]
  return

export is_on_same_domain_and_same_tab = (tab_id) ->
  current_url = tab_id_to_prev1_url_visited[tab_id]
  prev_url = tab_id_to_prev2_url_visited[tab_id]
  if not prev_url? or not current_url?
    return false
  current_domain = url_to_domain current_url
  prev_domain = url_to_domain prev_url
  return prev_domain == current_domain

export is_on_same_domain = (tab_id) ->
  current_tab_id_and_url = past_navigation_events_list[1]
  prev_tab_id_and_url = past_navigation_events_list[0]
  if not current_tab_id_and_url? or not prev_tab_id_and_url?
    return false
  current_url = current_tab_id_and_url[1]
  prev_url = current_tab_id_and_url[0]
  if not current_url? or not prev_url?
    return false
  current_domain = url_to_domain current_url
  prev_domain = url_to_domain prev_url
  return current_domain == prev_domain

gexport_module 'session_utils', -> eval(it)
