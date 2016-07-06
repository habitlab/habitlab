const $ = require('jquery');
require('jquery-contextmenu');

const {
  load_css_file
} = require('libs_frontend/content_script_utils')

Polymer({
  is: 'habitlab-logo-polymer',
  properties: {
    width: {
      type: String,
      value: '38px',
    },
    height: {
      type: String,
      value: '38px',
    }
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
  ready: function() {
    console.log('habitlab-logo-polymer ready');
    load_css_file('bower_components/jQuery-contextMenu/dist/jquery.contextMenu.min.css');
    $.contextMenu({
      selector: '#habitlab_logo',
      trigger: 'left',
      items: {
        "disable": {name: "Disable this intervention"}
      }
    });
  },
  get_url: function() {
    console.log('url called')
    console.log(chrome.extension.getURL('icons/icon_38.png'));
    return chrome.extension.getURL('icons/icon_38.png');
  },
});

