const {
  setvar_experiment
} = require('libs_backend/db_utils')

async function show_firstimpression_message_for_intervention(intervention_name) {
  let condition = localStorage.getItem('intervention_firstimpression_notice')
  if (condition == 'none' || condition == null) {
    return 'none'
  }
  let interventions_shown_for = localStorage.getItem('intervention_firstimpression_notice_seenlist')
  if (interventions_shown_for == null) {
    interventions_shown_for = []
  } else {
    interventions_shown_for = JSON.parse(interventions_shown_for)
  }
  let already_shown = interventions_shown_for.includes(intervention_name)
  if (already_shown) {
    return 'none'
  }
  interventions_shown_for.push(intervention_name)
  localStorage.setItem('intervention_firstimpression_notice_seenlist', JSON.stringify(interventions_shown_for))
  setvar_experiment('intervention_firstimpression_notice_seenlist', JSON.stringify(interventions_shown_for))
  return condition
}

module.exports = {
  show_firstimpression_message_for_intervention
}

