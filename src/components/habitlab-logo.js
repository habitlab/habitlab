const $ = require('jquery');

require('jquery-contextmenu')($)

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

    }
  },
  clicked: function() {
    console.log('habitlab-logo clicked');
    this.$.tooltip.showed = false;
  },
  get_img_style: function() {
    return `width: ${this.width}; height: ${this.height};`
  },
  disable_temp_callback: function() {
    const self = this;
    this.fire('disable_intervention');

    set_intervention_disabled(this.intervention, () => {
      console.log (`disabled ${self.intervention}`)
      swal({
        title: 'Disabled!',
        text: 'This intervention will be disabled temporarily.'
      })
    })
  },
  disable_perm_callback: function() {
    const self = this;
    this.fire('disable_intervention');

    set_intervention_disabled_permanently(this.intervention, () => {
      console.log (`disabled ${self.intervention}`)
      swal('Disabled!', 'This intervention will be disabled permanently.')
    })
  },
  ready: cfy(function*() {
    const self = this;

    yield load_css_file('bower_components/sweetalert2/dist/sweetalert2.css');
    yield load_css_file('bower_components/jQuery-contextMenu/dist/jquery.contextMenu.min.css');

    function get_intervention_name() {
      return "Intervention: " + intervention.description
    }

    function get_intervention_goal() {
      return "Goals: " + intervention.goals.map((x) => x.description).join(', ')
    }

    var name = get_intervention_name()
    var goal = get_intervention_goal()

    if (this.context === true) {
      $.contextMenu({
        selector: '#habitlab_button',
        trigger: 'left',
        items: {
          "name": {name: name, disabled: true},
          "goal": {name: goal, disabled: true},
//        "disable": {name: "Disable this intervention", callback: () => self.disable_callback()},
          "disableFold": {
              "name": "Disable intervention",
              items: {
                  "tempDisable": {name: "For the rest of the day", callback: () => self.disable_temp_callback()},
                  "permDisable": {name: "Permamently",  callback: () => self.disable_perm_callback()}
              }
          },
          "options": {name: "View all interventions", callback: () => open_url_in_new_tab("options.html#interventions")}
        }
      });
    }
  }),

  get_url: function() {
    return chrome.extension.getURL('icons/habitlab_gear_with_text.svg');
  },
});
