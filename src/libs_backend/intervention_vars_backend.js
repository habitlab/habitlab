const {
  getkey_dictdict,
  setkey_dictdict
} = require('libs_backend/db_utils')

async function setvar_intervention_synced_backend(intervention_name, key, val) {
  await setkey_dictdict('intervention_vars_synced', intervention_name, key, val)
}

async function setvar_intervention_unsynced_backend(intervention_name, key, val) {
  await setkey_dictdict('intervention_vars_unsynced', intervention_name, key, val)
}

async function getvar_intervention_synced_backend(intervention_name, key) {
  return await getkey_dictdict('intervention_vars_synced', intervention_name, key)
}

async function getvar_intervention_unsynced_backend(intervention_name, key) {
  return await getkey_dictdict('intervention_vars_unsynced', intervention_name, key)
}

module.exports = {
  setvar_intervention_synced_backend,
  setvar_intervention_unsynced_backend,
  getvar_intervention_synced_backend,
  getvar_intervention_unsynced_backend,
}
