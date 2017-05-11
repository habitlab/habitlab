const {polymer_ext} = require('libs_frontend/polymer_utils');
const $ = require('jquery');
const {
  get_work_pages_visited_today
} = require('libs_common/history_utils');
const {
  url_to_domain
} = require('libs_common/domain_utils');
const {
  log_action
} = require('libs_frontend/intervention_log_utils');

polymer_ext({
  is: 'workpages-message',
  properties: {
    links: {
      type: Array,
      
    }, 
  },
  link_clicked: function(evt) {
    var link_url = evt.target.parentNode.href;
    var link_title = evt.target.innerText;
    evt.preventDefault();
    evt.stopPropagation();
    log_action({positive: 'suggestion_clicked', link_title: link_title, link_type: 'past_work_sites', link_url: link_url}).then(function() {
      window.location.href = link_url;
    });
    return false;
  },
  attached: function() {
    get_work_pages_visited_today().then(function(result) {
      console.log(result);
      var z = result.map(function(obj) {
        return url_to_domain(obj.url)
      });
      z = Array.from(new Set(z))
      z.length = Math.min(z.length, 5);
      this.links = z;
    }.bind(this));
  }
});