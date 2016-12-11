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

tab_id_to_current_session_id = {}

export get_session_id_from_tab_id = cfy (tab_id) ->*
  return tab_id_to_current_session_id[tab_id]?

session_id_counter = 0

export add_tab_navigation_event = (tab_id, url) ->
  #if past_navigation_events_list.length > 0
  #  most_recent_navigation_event = past_navigation_events_list[*-1]
  #  if tab_id == most_recent_navigation_event[0] and url == most_recent_navigation_event[1]
  #    return
  if tab_id_to_prev1_url_visited[tab_id]?
    tab_id_to_prev2_url_visited[tab_id] = tab_id_to_prev1_url_visited[tab_id]
  tab_id_to_prev1_url_visited[tab_id] = url
  while past_navigation_events_list.length > 1
    past_navigation_events_list.shift()
  past_navigation_events_list.push [tab_id, url]

  if not tab_id_to_current_session_id[tab_id]?
    session_id_counter := session_id_counter + 1
    tab_id_to_current_session_id[tab_id] = session_id_counter
  else
    if not is_on_same_domain_and_same_tab_sync(tab_id)
      session_id_counter := session_id_counter + 1
      tab_id_to_current_session_id[tab_id] = session_id_counter
  return

/*
export is_on_same_domain_and_same_tab = cfy (tab_id) ->*
  current_url = tab_id_to_prev1_url_visited[tab_id]
  prev_url = tab_id_to_prev2_url_visited[tab_id]
  if not prev_url? or not current_url?
    return false
  current_domain = url_to_domain current_url
  prev_domain = url_to_domain prev_url
  return prev_domain == current_domain
*/

is_on_same_domain_and_same_tab_sync = (tab_id) ->
  current_tab_id_and_url = past_navigation_events_list[1]
  prev_tab_id_and_url = past_navigation_events_list[0]
  if not current_tab_id_and_url? or not prev_tab_id_and_url?
    return false
  current_url = current_tab_id_and_url[1]
  prev_url = prev_tab_id_and_url[1]
  if not current_url? or not prev_url?
    return false
  current_tab_id = current_tab_id_and_url[0]
  prev_tab_id = prev_tab_id_and_url[0]
  current_domain = url_to_domain current_url
  prev_domain = url_to_domain prev_url
  return current_domain == prev_domain and current_tab_id == prev_tab_id

export is_on_same_domain_and_same_tab = cfy (tab_id) ->*
  return is_on_same_domain_and_same_tab_sync(tab_id)

is_on_same_domain_sync = (tab_id) ->
  current_tab_id_and_url = past_navigation_events_list[1]
  prev_tab_id_and_url = past_navigation_events_list[0]
  if not current_tab_id_and_url? or not prev_tab_id_and_url?
    return false
  current_url = current_tab_id_and_url[1]
  prev_url = prev_tab_id_and_url[1]
  if not current_url? or not prev_url?
    return false
  current_domain = url_to_domain current_url
  prev_domain = url_to_domain prev_url
  return current_domain == prev_domain

export is_on_same_domain = cfy (tab_id) ->*
  return is_on_same_domain_sync(tab_id)

gexport_module 'session_utils', -> eval(it)
