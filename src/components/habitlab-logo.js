const {
  load_css_file
} = require('libs_common/content_script_utils')

const {
  set_intervention_disabled,
  set_intervention_disabled_permanently,
  set_intervention_enabled
} = require('libs_common/intervention_utils')

const {
  open_url_in_new_tab,
  close_selected_tab
} = require('libs_common/tab_utils')

const {polymer_ext} = require('libs_frontend/polymer_utils');
const {cfy} = require('cfy');

const swal = require('sweetalert2')

var intervention = require('libs_common/intervention_info').get_intervention();

polymer_ext({
  is: 'habitlab-logo',
  properties: {
    width: {
      type: String,
      value: '38px',
    },
    height: {
      type: String,
      value: '38px',
    },
    intervention: {
      type: String,
      value: (typeof(intervention) != 'undefined' && intervention) ? intervention.name : '',
    },
    context: {
      type: Boolean,
      value: true

    },
    unclickable: {
      type: Boolean,
      value: false
    },
    intervention_description: {
      type: String,
      value: (typeof(intervention) != 'undefined' && intervention) ? intervention.description : '',
    },
    goal_descriptions: {
      type: String,
      value: (typeof(intervention) != 'undefined' && intervention) ? intervention.goals.map((x) => x.description).join(', ') : '',
    },
  },
  clicked: function() {
    console.log('habitlab-logo clicked');
    this.$.tooltip.showed = false;
  },
  get_img_style: function() {
    return `width: ${this.width}; height: ${this.height};`
  },
  disable_temp_callback: function() {
    this.$$('#intervention_info_dialog').close()
    const self = this;
    this.fire('disable_intervention');

    console.log (`disabled ${self.intervention}`)
    swal({
      title: 'Disabled!',
      text: 'This intervention will be disabled temporarily.'
    })
  },
  disable_perm_callback: function() {
    this.$$('#intervention_info_dialog').close()
    const self = this;
    this.fire('disable_intervention');

    set_intervention_disabled_permanently(this.intervention, () => {
      console.log (`disabled ${self.intervention}`)
      swal('Disabled!', 'This intervention will be disabled permanently.')
    })
  },
  ready: cfy(function*() {
    yield load_css_file('bower_components/sweetalert2/dist/sweetalert2.css');
    if (this.unclickable) {
      this.style.cursor = "default";
    }
  }),

  open_interventions_page: function() {
    open_url_in_new_tab("options.html#interventions")
    this.$$('#intervention_info_dialog').close()
  },

  habitlab_button_clicked: function() {
    this.$$('#intervention_info_dialog').open()
  },

  get_url: function() {
    return chrome.extension.getURL('icons/habitlab_gear_with_text.svg');
  },
});
