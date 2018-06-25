async function show_first_impression_notice_if_needed () {
  const {
    get_intervention,
    get_is_preview_mode,
    get_is_suggestion_mode,
    get_is_previously_seen,
    get_is_new_session,
  } = require('libs_common/intervention_info')
  const intervention = get_intervention()
  const is_suggestion_mode = get_is_suggestion_mode()
  if (is_suggestion_mode) {
    return
  }
  const is_preview_mode = get_is_preview_mode()
  if (is_preview_mode) {
    return
  }
  const is_previously_seen = get_is_previously_seen()
  if (is_previously_seen) {
    return
  }
  const is_new_session = get_is_new_session()
  if (!is_new_session) {
    return
  }
  let intervention_name = intervention.name
  if (intervention.generic_intervention != null) {
    intervention_name = intervention.generic_intervention
  }
  const {show_firstimpression_message_for_intervention} = require('libs_common/intervention_first_impression_utils_backend')
  let notice_to_show = await show_firstimpression_message_for_intervention(intervention_name)

  if (intervention_name == 'generic/toast_notifications') {
    setTimeout(function() {
      if (notice_to_show == 'power') {
        show_first_impression_notice_power()
      } else if (notice_to_show == 'info') {
        show_first_impression_notice_info()
      }
    }, 5000)
  } else {
    setTimeout(function() {
      if (notice_to_show == 'power') {
        show_first_impression_notice_power()
      } else if (notice_to_show == 'info') {
        show_first_impression_notice_info()
      }
    }, 500)
  }
}

async function show_first_impression_notice_power() {
  require('components/habitlab-intervention-first-seen-power.deps')
  require('libs_frontend/frontend_libs').append_to_body_shadow(document.createElement('habitlab-intervention-first-seen-power'), {zIndex: 2147483647})
}

async function show_first_impression_notice_info() {
  require('components/habitlab-intervention-first-seen-info.deps')
  require('libs_frontend/frontend_libs').append_to_body_shadow(document.createElement('habitlab-intervention-first-seen-info'), {zIndex: 2147483647})
}

module.exports = {
  show_first_impression_notice_if_needed,
}