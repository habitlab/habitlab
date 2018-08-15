const {
  polymer_ext,
  list_polymer_ext_tags_with_info
} = require('libs_frontend/polymer_utils')

const {
  add_log_interventions,
} = require('libs_backend/log_utils')

const {
  setvar_experiment
} = require('libs_backend/db_utils')

polymer_ext({
  is: 'difficulty-selector-survey',
  selectedchanged: async function(evt) {
    if (this.ignoreselectedchanged == true) {
      return
    }
    let difficulty = evt.detail.value
    let log_intervention_info = {
      type: 'difficulty_selector_survey_changed_onboarding',
      page: 'onboarding-view',
      subpage: 'difficulty-selector-survey',
      category: 'difficulty_change_survey',
      difficulty: difficulty,
      manual: true,
      url: window.location.href,
    }
    await add_log_interventions(log_intervention_info)
    localStorage.user_chosen_difficulty_survey = difficulty
    setvar_experiment('user_chosen_difficulty_survey', difficulty)
  },
  ignore_keydown: function(evt) {
    evt.preventDefault()
    //evt.stopPropagation()
    return false
  },
  ready: async function(evt) {
    if (localStorage.user_chosen_difficulty_survey != null) {
      //await once_available('')
      this.ignoreselectedchanged = true
      await this.once_available('#difficultyradiogroup')
      this.$$('#difficultyradiogroup').selected = localStorage.user_chosen_difficulty_survey
      this.ignoreselectedchanged = false
    }
  }
}, {
  source: require('libs_frontend/polymer_methods'),
  methods: [
    'once_available'
  ]
})
