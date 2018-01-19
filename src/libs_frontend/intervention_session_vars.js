const {
  get_intervention_session_var_backend,
  set_intervention_session_var_backend,
} = require('libs_common/intervention_session_vars_backend')

const {
  get_intervention,
  get_session_id,
} = require('libs_common/intervention_info')

async function get_intervention_session_var(key) {
  const intervention_name = get_intervention().name
  const session_id = get_session_id()
  return await get_intervention_session_var_backend(intervention_name, session_id, key);
}

async function set_intervention_session_var(key, val) {
  const intervention_name = get_intervention().name
  const session_id = get_session_id()
  return await set_intervention_session_var_backend(intervention_name, session_id, key, val);
}

module.exports = {
  get_intervention_session_var,
  set_intervention_session_var,
}
