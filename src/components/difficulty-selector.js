const {
  polymer_ext,
  list_polymer_ext_tags_with_info
} = require('libs_frontend/polymer_utils')

const {
  get_enabled_interventions,
  enabledisable_interventions_based_on_difficulty,
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
    let prev_enabled_interventions = await get_enabled_interventions()
    await enabledisable_interventions_based_on_difficulty(difficulty)
    localStorage.user_chosen_difficulty = difficulty
    setvar_experiment('user_chosen_difficulty', difficulty)
    send_feature_option({feature: 'difficuty', page: 'onboarding-view', difficulty: difficulty})
    let log_intervention_info = {
      type: 'difficulty_selector_changed_onboarding',
      page: 'onboarding-view',
      subpage: 'difficulty-selector',
      category: 'difficulty_change',
      difficulty: difficulty,
      manual: true,
      url: window.location.href,
      prev_enabled_interventions: prev_enabled_interventions,
    }
    await add_log_interventions(log_intervention_info)
    this.fire('difficulty-changed', {difficulty: difficulty})
  },
  ignore_keydown: function(evt) {
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
    'once_available'
  ]
})
