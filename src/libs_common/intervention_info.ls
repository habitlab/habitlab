intervention_info = null

export set_intervention = (new_intervention_info) ->
  intervention_info := new_intervention_info

export get_intervention = ->
  if intervention?
    return intervention
  return intervention_info
