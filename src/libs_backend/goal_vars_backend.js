const {
  getkey_dictdict,
  setkey_dictdict
} = require('libs_backend/db_utils')

async function setvar_goal_synced_backend(goal_name, key, val) {
  await setkey_dictdict('goal_vars_synced', goal_name, key, val)
}

async function setvar_goal_unsynced_backend(goal_name, key, val) {
  await setkey_dictdict('goal_vars_unsynced', goal_name, key, val)
}

async function getvar_goal_synced_backend(goal_name, key) {
  return await getkey_dictdict('goal_vars_synced', goal_name, key)
}

async function getvar_goal_unsynced_backend(goal_name, key) {
  return await getkey_dictdict('goal_vars_unsynced', goal_name, key)
}

module.exports = {
  setvar_goal_synced_backend,
  setvar_goal_unsynced_backend,
  getvar_goal_synced_backend,
  getvar_goal_unsynced_backend,
}
