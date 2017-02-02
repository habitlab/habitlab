window.Polymer = window.Polymer || {}
window.Polymer.dom = 'shadow'

if (typeof(window.wrap) != 'function') {
  window.wrap = null;
}

require('enable-webcomponents-in-content-scripts')
require('components/num_episodes.deps')
const $ = require('jquery')

const {
  log_impression,
  log_action,
} = require('libs_common/log_utils')

const {
  is_on_same_domain_and_same_tab
} = require('libs_common/session_utils')

const co = require('co')

/*
co(function*() {
  const on_same_domain_and_same_tab = yield is_on_same_domain_and_same_tab(tab_id)
  if (on_same_domain_and_same_tab) {
    return
  }
*/