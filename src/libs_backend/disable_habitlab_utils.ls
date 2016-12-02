{cfy} = require 'cfy'

{
  disable_interventions_in_active_tab
} = require 'libs_backend/background_common'

export disable_habitlab = cfy ->*
  localStorage.setItem 'habitlab_disabled', 'true'
  yield disable_interventions_in_active_tab()

export enable_habitlab = cfy ->*
  localStorage.removeItem 'habitlab_disabled'

export is_habitlab_enabled = cfy ->*
  return localStorage.getItem('habitlab_disabled') != 'true'
