const intervention_to_session_id_to_vars = {}

async function get_intervention_session_var_backend(intervention_name, session_id, key) {
  if (intervention_to_session_id_to_vars[intervention_name] != null && intervention_to_session_id_to_vars[intervention_name][session_id] != null && intervention_to_session_id_to_vars[intervention_name][session_id][key] != null) {
    return intervention_to_session_id_to_vars[intervention_name][session_id][key]
  }
  return
}

async function set_intervention_session_var_backend(intervention_name, session_id, key, val) {
  if (intervention_to_session_id_to_vars[intervention_name] == null) {
    intervention_to_session_id_to_vars[intervention_name] = {}
  }
  if (intervention_to_session_id_to_vars[intervention_name][session_id] == null) {
    intervention_to_session_id_to_vars[intervention_name][session_id] = {}
  }
  intervention_to_session_id_to_vars[intervention_name][session_id][key] = val
}

