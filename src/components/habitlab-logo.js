const {polymer_ext} = require('libs_frontend/polymer_utils');

polymer_ext({
  is: 'habitlab-logo',
  doc: 'Turn off button for user to turn off current nudge or HabitLab',
  properties: {
    width: {
      type: String,
      value: '40px',
    },
    height: {
      type: String,
      value: '40px',
    },
    unclickable: {
      type: Boolean,
      value: false
    },
  },
  get_img_style: function() {
    return `width: ${this.width}; height: ${this.height};`
  },
  ready: function() {
    if (this.unclickable) {
      this.style.cursor = "default";
    }
    SystemJS.import('libs_common/screenshot_utils');
  },
  habitlab_button_clicked: async function() {
    var screenshot_utils = await SystemJS.import('libs_common/screenshot_utils');
    var screenshot = await screenshot_utils.get_screenshot_as_base64();
    var data = await screenshot_utils.get_data_for_feedback();
    const habitlab_options_popup = document.createElement('habitlab-options-popup');
    document.body.appendChild(habitlab_options_popup);
    habitlab_options_popup.screenshot = screenshot;
    habitlab_options_popup.other = data;
    habitlab_options_popup.open();
  },
  get_url: function() {
    return chrome.extension.getURL('icons/gear_white.svg');
  },
}, {
  source: require('libs_common/localization_utils'),
  methods: [
    'msg'
  ]
});
