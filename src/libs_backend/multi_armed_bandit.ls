multi_armed_bandit_thompson = require 'libs_backend/multi_armed_bandit_thompson'

export get_multi_armed_bandit_algorithm = (algorithm_name, algorithm_options) ->
  if algorithm_name == 'thompson'
    return multi_armed_bandit_thompson
  throw new Error "unknown algorithm name in get_multi_armed_bandit_algorithm #{algorithm_name}"
