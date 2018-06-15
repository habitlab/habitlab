{
  get_intervention
  get_tab_id
  get_session_id
  get_is_new_session
  get_is_preview_mode
  get_is_suggestion_mode
  get_is_previously_seen
} = require 'libs_common/intervention_info'

log_utils = require 'libs_frontend/log_utils'

make_basic_data = (data) ->
  if not data?
    data = {}
  data.url = window.location.href
  data.tab_id = get_tab_id()
  data.session_id = get_session_id()
  data.is_new_session = get_is_new_session()
  data.is_preview_mode = get_is_preview_mode()
  data.is_suggestion_mode = get_is_suggestion_mode()
  data.is_previously_seen = get_is_previously_seen()
  return data

export log_impression = (data) ->>
  data = make_basic_data data
  await log_utils.log_impression_internal get_intervention().name, data

export log_intervention_suggested = (data) ->>
  data = make_basic_data data
  await log_utils.log_intervention_suggested_internal get_intervention().name, data

export log_intervention_suggestion_action = (data) ->>
  data = make_basic_data data
  await log_utils.log_intervention_suggestion_action_internal get_intervention().name, data

export log_disable = (data) ->>
  data = make_basic_data data
  await log_utils.log_disable_internal get_intervention().name, data

export log_action = (data) ->>
  data = make_basic_data data
  await log_utils.log_action_internal get_intervention().name, data

export log_upvote = (data) ->>
  data = make_basic_data data
  await log_utils.log_upvote_internal get_intervention().name, data

export log_downvote = (data) ->>
  data = make_basic_data data
  await log_utils.log_downvote_internal get_intervention().name, data

export log_feedback = (data) ->>
  data = make_basic_data data
  await log_utils.log_feedback_internal get_intervention().name, data

