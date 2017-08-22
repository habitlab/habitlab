const {polymer_ext} = require('libs_frontend/polymer_utils');
const screenshot_utils = require('libs_common/screenshot_utils');
const {msg} = require('libs_common/localization_utils');

polymer_ext({
  is: 'sidebar-tabs',
  properties: {
    items: {
      type: Array
    },
    selected_tab_idx: {
      type: Number,
      notify: true
    },
    isdemo: {
      type: Boolean,
      observer: 'isdemo_changed'
    },
    feedback_icon: {
      type: String,
      value: chrome.extension.getURL('icons/feedback_icon.svg')
    }
  },
  isdemo_changed: function(isdemo) {
    if (isdemo) {
      this.items = [{name: msg('Overview')}, {name: msg('Settings')}];
      this.selected_tab_idx = 0;
    }
  },
  tab_elem_selected: function(evt) {
    this.selected_tab_idx = evt.target.idx;
  },
  feedback_button_clicked: async function() {
    //var screenshot_utils = await SystemJS.import('libs_common/screenshot_utils');
    var screenshot = await screenshot_utils.get_screenshot_as_base64();
    var data = await screenshot_utils.get_data_for_feedback();
    var feedback_form = document.createElement('feedback-form')
    document.body.appendChild(feedback_form);
    feedback_form.screenshot = screenshot;
    feedback_form.other = data;
    feedback_form.open();
  }
}, [{
  source: require('libs_frontend/polymer_methods'),
  methods: [
    'SM',
    'text_if_equal'
  ]
}, {
  source: require('libs_common/localization_utils'),
  methods: [
    'msg'
  ]
}])
