const $ = require('jquery')

const {
  load_css_file
} = require('libs_frontend/content_script_utils')

const {
  set_intervention_disabled,
  set_intervention_enabled
} = require('libs_common/intervention_utils')

const {
  url_to_domain
} = require('libs_common/domain_utils')

const {
  get_seconds_spent_on_current_domain_today
} = require('libs_common/time_spent_utils')

const {polymer_ext} = require('libs_frontend/polymer_utils')

polymer_ext({
  is: 'feed-item-timer-polymer',
  properties: {
    site: {
      type: String,
      value: url_to_domain(window.location.href)
    },
    minutes: {
      type: Number,
      value: 0
    },
    seconds: {
      type: Number,
      value: 0
    }
  },
  /*update_page: function() {
    var self = this;
    get_seconds_spent_on_domain_today(self.site, function(seconds_spent) {
      self.minutes = Math.floor(seconds_spent/60);
      self.seconds = seconds_spent % 60;
    });
  },*/
  attached: function() {
    var update_page = function(self) {
      console.log('attached')
      
      get_seconds_spent_on_current_domain_today(function(seconds_spent) {
        self.minutes = Math.floor(seconds_spent/60);
        self.seconds = seconds_spent % 60;
      });
    };
    update_page(this);
    var self = this;
    setInterval(function() {
      update_page(self);
      
    }, 1000);
  },
  attributeChanged: function() {
    get_seconds_spent_on_current_domain_today(function(seconds_spent) {
        console.log(seconds_spent);
        console.log(self)
        this.$.minutes = Math.floor(seconds_spent/60);
        self.seconds = seconds_spent % 60;
      });
  }
});