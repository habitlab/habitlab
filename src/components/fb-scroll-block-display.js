const $ = require('jquery');
require('jquery-contextmenu');

const {
  close_selected_tab
} = require('libs_common/tab_utils')

const {
  load_css_file,
} = require('libs_common/content_script_utils')

require('libs_frontend/polymer_methods.ls') 

const {
  get_minutes_spent_on_domain_today,
} = require('libs_common/time_spent_utils');

const {
  url_to_domain,
} = require('libs_common/domain_utils');

Polymer({
  is: 'fb-scroll-block-display',
  properties: {
    intervention: {
      type: String,
      value: '',
    },
    minutes: {
      type: Number,
    },
    site: {
      type: String,
      value: url_to_domain(window.location.href),
    },
    visits: {
      type: Number,
    }
  },
  listeners: {
    
  },
  /*
  clicked: function(event) {
    if (this.$.habitlab_logo !== Polymer.dom(event).localTarget) {
      this.fire('continue_scrolling', {});
    }
    
  },
  */
  close_button_clicked: function(event) {
    var reward_display = this.$$('#reward_display')
    reward_display.addEventListener('reward_done', function() {
      close_selected_tab()
    })
    reward_display.play()
  },
  continue_scrolling: function(event) {
    this.fire('continue_scrolling', {})
  },
  ready: function() {
    console.log('fb-scroll-block-display ready');
    const self = this;
    setInterval(() => {
      get_minutes_spent_on_domain_today(self.site, (minutes_spent) => {
        self.minutes = minutes_spent;
        
      });
    }, 1000);
  },
});

