const $ = require('jquery');
require('jquery-contextmenu');

const {
  load_css_file
} = require('libs_frontend/content_script_utils')

const {
  set_intervention_disabled,
  set_intervention_enabled
} = require('libs_common/intervention_utils')

const {polymer_ext} = require('libs_frontend/polymer_utils');

const swal = require('sweetalert')//require('../node_modules/sweetalert/dist/sweetalert.min.js')
//const swal = require('bower_components/sweetalert/dist/sweetalert.min.js')

polymer_ext({
  is: 'habitlab-logo-polymer',
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
      value: window.intervention ? window.intervention.name : '',
    },
  },
  clicked: function() {
    console.log('habitlab-logo-polymer clicked');
  },
  buttonclicked: function() {
    console.log('habitlab-logo-polymer paper-button clicked');
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
  ready: function() {
    const self = this;
    console.log('habitlab-logo-polymer ready');
    load_css_file('bower_components/sweetalert/dist/sweetalert.css', function() {
      console.log('css file loaded for sweetalert');

      load_css_file('bower_components/jQuery-contextMenu/dist/jquery.contextMenu.min.css', function() {
        console.log('css file loaded for jquery contextmenu');

        $.contextMenu({
          selector: '#habitlab_logo',
          trigger: 'left',
          items: {
            "name": {name: window.intervention.name, disabled: true},
            "disable": {name: "Disable this intervention", callback: function() {self.disable_callback()}
          
            }
          }
        });

      });
    })


  },
  get_url: function() {
    console.log('url called')
    console.log(chrome.extension.getURL('icons/icon_38.png'));
    return chrome.extension.getURL('icons/icon_38.png');
  },
});

