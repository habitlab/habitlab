const {
  load_css_file
} = require('libs_common/content_script_utils')

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

const {close_selected_tab} = require('libs_frontend/tab_utils')

polymer_ext({
  is: 'feed-item-timer-polymer',
  doc: 'News feeds blocker that displays time spent on current site today',
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
    },
    items: {
      type: Number,
      value: 1
    }
  },
  
  attached: function() {
    var update_page = function(self) {
      get_seconds_spent_on_current_domain_today().then(function(seconds_spent) {
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
}, {
  source: require('libs_common/localization_utils'),
  methods: [
    'msg'
  ]
});
