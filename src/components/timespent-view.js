const $ = require('jquery');

const {
  polymer_ext
} = require('libs_frontend/polymer_utils');

const {
  get_seconds_spent_on_current_domain_today
} = require('libs_common/time_spent_utils');

const {
  url_to_domain,
} = require('libs_common/domain_utils');

const {
  close_selected_tab
} = require('libs_common/tab_utils')

polymer_ext({
  is: 'timespent-view',
  properties: {
    minutes: {
      type: Number,
      value: 0
    },
    seconds: {
      type: Number,
      value: 0
    },
    site: {
      type: String,
      value: url_to_domain(window.location.href)
    },
    displayText: {
      type: String,
    }
  },
  attached: function() {
    /*var update_page = function(self) {
      console.log('attached')
      
      get_seconds_spent_on_current_domain_today(function(seconds_spent) {
        self.minutes = Math.floor(seconds_spent/60);
        self.seconds = seconds_spent % 60;
        self.displayText = self.minutes + " minutes and " + self.seconds
      });
    };
    update_page(this);
    var self = this;
    setInterval(function() {
      update_page(self);
      
    }, 1000); */
  }
    
});
