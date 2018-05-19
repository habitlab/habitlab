const {
  polymer_ext,
  list_polymer_ext_tags_with_info
} = require('libs_frontend/polymer_utils')

const {
  get_interventions,
  get_enabled_interventions,
  set_intervention_enabled,
  set_intervention_disabled,
} = require('libs_backend/intervention_utils')

const {
  add_log_interventions,
} = require('libs_backend/log_utils')

const {
  send_feature_option,
} = require('libs_backend/logging_enabled_utils')

const {
  setvar_experiment
} = require('libs_backend/db_utils')

polymer_ext({
  is: 'difficulty-selector',
  selectedchanged: async function(evt) {
    if (this.ignoreselectedchanged == true) {
      return
    }
    let difficulty = evt.detail.value
    let difficulty_numeric_map = {
      'nothing': 0,
      'easy': 1,
      'medium': 2,
      'hard': 3,
    }
    let difficulty_numeric = difficulty_numeric_map[difficulty]
    let all_interventions = await get_interventions()
    let prev_enabled_interventions = await get_enabled_interventions()
    let new_enabled_interventions = {}
    let changed_interventions = []
    for (let intervention_name of Object.keys(all_interventions)) {
      let intervention_info = all_interventions[intervention_name]
      let was_previously_enabled = prev_enabled_interventions[intervention_name] == true
      let now_enabled = was_previously_enabled
      if (difficulty == 'nothing') {
        now_enabled = false
      }
      if (intervention_info.difficulty != null && difficulty_numeric_map[intervention_info.difficulty] != null) {
        now_enabled = difficulty_numeric_map[intervention_info.difficulty] <= difficulty_numeric
      }
      new_enabled_interventions[intervention_name] = now_enabled
      if (now_enabled != was_previously_enabled) {
        changed_interventions.push(intervention_name)
      }
    }
    for (let intervention_name of changed_interventions) {
      let now_enabled = new_enabled_interventions[intervention_name]
      if (now_enabled) {
        await set_intervention_enabled(intervention_name)
      } else {
        await set_intervention_disabled(intervention_name)
      }
    }
    localStorage.user_chosen_difficulty = difficulty
    setvar_experiment('user_chosen_difficulty', difficulty)
    send_feature_option({feature: 'difficuty', page: 'onboarding-view', difficulty: difficulty})
    let log_intervention_info = {
      type: 'difficulty_selector_changed_onboarding',
      page: 'onboarding-view',
      subpage: 'difficulty-selector',
      category: 'difficulty_change',
      manual: true,
      url: window.location.href,
      prev_enabled_interventions: prev_enabled_interventions,
    }
    await add_log_interventions(log_intervention_info)
    this.fire('difficulty-changed', {difficulty: difficulty})
  },
  ignore_keydown: function(evt) {
    console.log('ignore_keydown called')
    evt.preventDefault()
    //evt.stopPropagation()
    return false
  },
  ready: async function(evt) {
    if (localStorage.user_chosen_difficulty != null) {
      //await once_available('')
      this.ignoreselectedchanged = true
      await this.once_available('#difficultyradiogroup')
      this.$$('#difficultyradiogroup').selected = localStorage.user_chosen_difficulty
      this.ignoreselectedchanged = false
    }
  }
}, {
  source: require('libs_frontend/polymer_methods'),
  methods: [
    'json_stringify',
    'once_available'
  ]
})
