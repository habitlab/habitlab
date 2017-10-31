const {
  addtolist_for_key,
  getlist_for_key,
} = require('libs_common/db_utils')

const {
  log_upvote_internal,
  log_downvote_internal,
  log_feedback_internal
} = require('libs_backend/log_utils')

async function get_num_upvotes_for_intervention(intervention_name) {
  let results = await getlist_for_key('intervention_upvote_timestamps', intervention_name)
  return results.length
}

async function get_upvote_timestamps_for_intervention(intervention_name) {
  return await getlist_for_key('intervention_upvote_timestamps', intervention_name)
}

async function get_num_downvotes_for_intervention(intervention_name) {
  let results = await getlist_for_key('intervention_downvote_timestamps', intervention_name)
  return results.length
}

async function get_downvote_timestamps_for_intervention(intervention_name) {
  return await getlist_for_key('intervention_downvote_timestamps', intervention_name)
}

async function get_feedback_for_intervention(intervention_name) {
  return await getlist_for_key('intervention_feedback', intervention_name)
}

async function upvote_intervention(intervention_name) {
  await addtolist_for_key('intervention_upvote_timestamps', intervention_name, Date.now())
  await log_upvote_internal(intervention_name, {})
}

async function downvote_intervention(intervention_name) {
  await addtolist_for_key('intervention_downvote_timestamps', intervention_name, Date.now())
  await log_downvote_internal(intervention_name, {})
}

async function add_feedback_for_intervention(intervention_name, feedback_data) {
  let data = JSON.parse(JSON.stringify(feedback_data))
  data.timestamp = Date.now()
  await addtolist_for_key('intervention_feedback', intervention_name, data)
  await log_feedback_internal(intervention_name, feedback_data)
}

module.exports = {
  upvote_intervention,
  downvote_intervention,
  add_feedback_for_intervention,
  get_num_upvotes_for_intervention,
  get_num_downvotes_for_intervention,
  get_upvote_timestamps_for_intervention,
  get_downvote_timestamps_for_intervention,
  get_feedback_for_intervention,
}
