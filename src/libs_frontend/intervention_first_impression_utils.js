async function show_first_impression_notice_if_needed () {
  require('components/habitlab-intervention-first-seen-power.deps')
  require('libs_frontend/frontend_libs').append_to_body_shadow(document.createElement('habitlab-intervention-first-seen-power'), {zIndex: 2147483647})
}

module.exports = {
  show_first_impression_notice_if_needed,
}