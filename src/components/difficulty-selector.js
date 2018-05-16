const {
  polymer_ext,
  list_polymer_ext_tags_with_info
} = require('libs_frontend/polymer_utils')

const {
  get_interventions,
  get_enabled_interventions,
} = require('libs_backend/intervention_utils')

polymer_ext({
  is: 'difficulty-selector',
  selectedchanged: async function(evt) {
    let difficulty = evt.detail.value
    let all_interventions = await get_interventions()
    let prev_enabled_interventions = await get_enabled_interventions()
    let new_enabled_interventions = {}
    for (let intervention_name of Object.keys(all_interventions)) {
      let intervention_info = all_interventions[intervention_name]
      let was_previously_enabled = prev_enabled_interventions[intervention_name] == true
      //if (intervention_info.difficulty == null) {
      //}
    }
    //send_feature_option({feature: 'difficuty', page: 'onboarding-view', })
    /*
    let log_intervention_info = {
      type: 'intervention_set_always_disabled',
      page: 'onboarding-view',
      subpage: 'difficulty-selector',
      category: 'intervention_enabledisable',
      now_enabled: false,
      is_permanent: true,
      is_generic: is_generic,
      manual: true,
      url: window.location.href,
      intervention_name: this.dialog_intervention.name,
      prev_enabled_interventions: prev_enabled_interventions,
    }
    log_intervention_info.change_subinterventions = true
    log_intervention_info.subinterventions_list = await list_subinterventions_for_generic_intervention(intervention_name)
    await set_subinterventions_disabled_for_generic_intervention(intervention_name)
    await add_log_interventions(log_intervention_info)
    */
  },
}, {
  source: require('libs_frontend/polymer_methods'),
  methods: [
    'json_stringify'
  ]
})
