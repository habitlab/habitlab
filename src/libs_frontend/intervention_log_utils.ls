{
  get_intervention
} = require 'libs_common/intervention_info'

log_utils = require 'libs_frontend/log_utils'

export log_impression = (data) ->>
  if not data?
    data = {}
  data.url = window.location.href
  await log_utils.log_impression_internal get_intervention().name, data

export log_disable = (data) ->>
  if not data?
    data = {}
  data = {}
  data.url = window.location.href
  await log_utils.log_disable_internal get_intervention().name, data

export log_action = (data) ->>
  data.url = window.location.href
  await log_utils.log_action_internal get_intervention().name, data
