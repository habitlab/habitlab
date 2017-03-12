{cfy} = require 'cfy'

{
  get_intervention
} = require 'libs_common/intervention_info'

log_utils = require 'libs_frontend/log_utils'

export log_impression = cfy ->*
  yield log_utils.log_impression_internal get_intervention().name

export log_disable = cfy ->*
  yield log_utils.log_disable_internal get_intervention().name

export log_action = cfy (data) ->*
  yield log_utils.log_action_internal get_intervention().name, data
