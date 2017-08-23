const {
  get_intervention
} = require('libs_common/intervention_info')

const {
  getvar_intervention_synced_backend,
  setvar_intervention_synced_backend,
  getvar_intervention_unsynced_backend,
  setvar_intervention_unsynced_backend,
} = require('libs_common/intervention_vars_backend')

async function getvar_intervention_synced(key) {
  return await getvar_intervention_synced_backend(get_intervention().name, key)
}

async function setvar_intervention_synced(key, val) {
  return await setvar_intervention_synced_backend(get_intervention().name, key, val)
}

async function getvar_intervention_unsynced(key) {
  return await getvar_intervention_unsynced_backend(get_intervention().name, key)
}

async function setvar_intervention_unsynced(key, val) {
  return await setvar_intervention_unsynced_backend(get_intervention().name, key, val)
}

let getvar_intervention = getvar_intervention_synced

let setvar_intervention = setvar_intervention_synced

module.exports = {
  getvar_intervention_synced,
  setvar_intervention_synced,
  getvar_intervention_unsynced,
  setvar_intervention_unsynced,
  getvar_intervention,
  setvar_intervention,
}
