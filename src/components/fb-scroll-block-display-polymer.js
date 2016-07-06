const $ = require('jquery');
require('jquery-contextmenu');

const {
  load_css_file,
} = require('libs_frontend/content_script_utils')

const {
  get_minutes_spent_on_domain_today,
} = require('libs_common/time_spent_utils');

const {
  url_to_domain,
} = require('libs_common/domain_utils');

Polymer({
  is: 'fb-scroll-block-display-polymer',
  properties: {
    minutes: {
      type: Number,
    },
    site: {
      type: String,
      value: url_to_domain(window.location.href),
    },
  },
  clicked: function() {
    console.log('habitlab-logo-polymer clicked');
    this.fire('continue_scrolling', {})
  },
  buttonclicked: function() {
    console.log('habitlab-logo-polymer paper-button clicked');
  },
  ready: function() {
    console.log('fb-scroll-block-display-polymer ready');
    const self = this;
    setInterval(() => {
      get_minutes_spent_on_domain_today(self.site, (minutes_spent) => {
        self.minutes = minutes_spent;
        console.log(minutes_spent);
      });
    }, 1000);
  },
});

