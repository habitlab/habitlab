const {polymer_ext} = require('libs_frontend/polymer_utils');
const $ = require('jquery');
const {
  get_work_pages_visited_today
} = require('libs_common/history_utils');
const {
  url_to_domain
} = require('libs_common/domain_utils');

polymer_ext({
  is: 'workpages-message',
  properties: {
    links: {
      type: Array,
      
    }, 
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