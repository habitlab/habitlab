const $ = require('jquery');

require('jquery-contextmenu')($)

const {
  load_css_file
} = require('libs_frontend/content_script_utils')

const {
  set_intervention_disabled,
  set_intervention_enabled
} = require('libs_common/intervention_utils')

const {polymer_ext} = require('libs_frontend/polymer_utils');

const swal = require('sweetalert')

const {open_url_in_new_tab, close_selected_tab} = require('libs_frontend/tab_utils')

const {cfy} = require('cfy');

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
  disable_callback: function() {
    const self = this;
    this.fire('disable_intervention');

    set_intervention_disabled(this.intervention, () => {
      console.log (`disabled ${self.intervention}`)
      swal("This intervention has been disabled!", "Sorry for the inconvenience. Refresh the page, and the intervention will be gone.")
    })
  },
  ready: cfy(function*() {
    const self = this;

    yield load_css_file('bower_components/sweetalert/dist/sweetalert.css');
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
        selector: '#habitlab_logo',
        trigger: 'left',
        items: {
          "name": {name: name, disabled: true},
          "goal": {name: goal, disabled: true},
          "disable": {name: "Disable this intervention", callback: () => self.disable_callback()},
          "options": {name: "View all interventions", callback: () => open_url_in_new_tab("options.html#interventions")}
        }
      });
    }
  }),

  get_url: function() {
    return chrome.extension.getURL('icons/icon_38.png');
  },
});
