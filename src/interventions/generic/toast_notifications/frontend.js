const {
  get_intervention
} = require('libs_common/intervention_info')

const {
  printable_time_spent_long
} = require('libs_common/time_utils')

const {
  get_seconds_spent_on_current_domain_today
} = require('libs_common/time_spent_utils')

const {
  once_body_available
} = require('libs_frontend/frontend_libs')

const {
  show_toast
} = require('libs_frontend/toast_utils')

const $ = require('jquery')

let sitename_printable = 'this site'
let intervention_info = get_intervention()
if (intervention_info.sitename_printable) {
  sitename_printable = intervention_info.sitename_printable
}

let current_toast = null

let show_new_toast = function() {
  if (window.intervention_disabled) {
    return
  }
  get_seconds_spent_on_current_domain_today().then(function(seconds_spent) {
    let duration = printable_time_spent_long(seconds_spent)
    current_toast = show_toast({
      text: `You've been on ${sitename_printable} for ${duration} today`,
      duration: 5000
    })
  });
}

let show_new_toast_job = setInterval(show_new_toast, 60000)

let update_time = function() {
  if (window.intervention_disabled) {
    return
  }
  get_seconds_spent_on_current_domain_today().then(function(seconds_spent) {
    let duration = printable_time_spent_long(seconds_spent)
    if (current_toast != null) {
      $(current_toast).attr('text', `You've been on ${sitename_printable} for ${duration} today`)
    }
  });
}

let update_time_job = setInterval(update_time, 1000)

once_body_available().then(function() {
  show_new_toast()
  update_time()
})

window.on_intervention_disabled = function() {
  clearInterval(show_new_toast_job)
  clearInterval(update_time_job)
  if (current_toast != null) {
    current_toast.hide()
  }
}
