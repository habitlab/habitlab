const {
  list_subinterventions_for_generic_intervention,
  get_enabled_interventions,
  set_intervention_enabled,
  set_subinterventions_enabled_for_generic_intervention,
  set_intervention_disabled,
  set_subinterventions_disabled_for_generic_intervention,
} = require('libs_backend/intervention_utils')

const {
  add_log_interventions,
} = require('libs_backend/log_utils')

Polymer({
  is: 'enabledisable-intervention-all-sites',
  properties: {
    intervention: {
      type: Object,
    },
    is_enabled: {
      type: String,
    },
    newstate_printable: {
      type: String,
      computed: 'compute_newstate_printable(is_enabled)'
    },
    newaction_printable: {
      type: String,
      computed: 'compute_newaction_printable(is_enabled)'
    },
    isdemo: {
      type: Boolean,
      observer: 'isdemo_changed',
    }
  },
  compute_newstate_printable: function(is_enabled) {
    if (is_enabled) {
      return 'enabled'
    }
    return 'disabled'
  },
  compute_newaction_printable: function(is_enabled) {
    if (is_enabled) {
      return 'enable'
    }
    return 'disable'
  },
  isdemo_changed: function(isdemo) {
    if (isdemo) {
      this.is_enabled = Math.random() > 0.5
      this.intervention = {
        name: 'buzzfeed/scroll_blocker',
        displayname: 'Scroll Freezer',
        sitename_printable: 'Buzzfeed',
        generic_intervention: 'generic/scroll_blocker',
      }
      this.show()
    }
  },
  show: function() {
   this.$$('#sample_toast').show()
  },
  hide: function() {
    this.$$('#sample_toast').hide()
  },
  yes_button_clicked: async function() {
    let intervention_name = this.intervention.generic_intervention
    let prev_enabled_interventions = await get_enabled_interventions()
    let log_intervention_info = {
      page: 'site-view',
      subpage: 'enabledisable-intervention-all-sites',
      category: 'intervention_enabledisable',
      is_permanent: true,
      is_generic: true,
      manual: true,
      turned_off_for_visit: false,
      url: window.location.href,
      intervention_name: this.intervention.name,
      prev_enabled_interventions: prev_enabled_interventions,
    }
    if (this.is_enabled) {
      log_intervention_info.type = 'intervention_set_smartly_managed'
      log_intervention_info.now_enabled = true
      await set_intervention_enabled(intervention_name)
      log_intervention_info.change_subinterventions = true
      log_intervention_info.subinterventions_list = await list_subinterventions_for_generic_intervention(intervention_name)
      await set_subinterventions_enabled_for_generic_intervention(intervention_name)
    } else {
      log_intervention_info.type = 'intervention_set_always_disabled'
      log_intervention_info.now_enabled = false
      await set_intervention_disabled(intervention_name)
      log_intervention_info.change_subinterventions = true
      log_intervention_info.subinterventions_list = await list_subinterventions_for_generic_intervention(intervention_name)
      await set_subinterventions_disabled_for_generic_intervention(intervention_name)
    }
    await add_log_interventions(log_intervention_info)
    this.hide()
  },
  no_button_clicked: function() {
    this.hide()
  },
})
