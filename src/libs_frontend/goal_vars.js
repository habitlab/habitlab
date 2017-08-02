const {
  get_goal_name
} = require('libs_common/intervention_info')

const {
  getvar_goal_synced_backend,
  setvar_goal_synced_backend,
  getvar_goal_unsynced_backend,
  setvar_goal_unsynced_backend,
} = require('libs_common/goal_vars_backend')

async function getvar_goal_synced(key) {
  return await getvar_goal_synced(get_goal_name(), key)
}

async function setvar_goal_synced(key, val) {
  return await setvar_goal_synced(get_goal_name(), key, val)
}

async function getvar_goal_unsynced(key) {
  return await getvar_goal_unsynced(get_goal_name(), key)
}

async function setvar_goal_unsynced(key, val) {
  return await setvar_goal_unsynced(get_goal_name(), key, val)
}

let getvar_goal = getvar_goal_synced

let setvar_goal = setvar_goal_synced

module.exports = {
  getvar_goal_synced,
  setvar_goal_synced,
  getvar_goal_unsynced,
  setvar_goal_unsynced,
  getvar_goal,
  setvar_goal,
}
