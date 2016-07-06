var skate = require('skatejs');
var url_to_domain = require('libs_common/domain_utils').url_to_domain;
var get_seconds_spent_on_domain_today = require('libs_common/time_spent_utils').get_seconds_spent_on_domain_today;
var update_page = function(elem){
  return get_seconds_spent_on_domain_today(elem.site, function(seconds_spent){
    return elem.seconds = seconds_spent;
  });
};
skate.define('time-spent-display', {
  props: {
    site: {
      'default': url_to_domain(window.location.href)
    },
    seconds: {
      'default': 0
    }
  },
  render: function(elem){
    return (
    <div style="background-color: blue; position: fixed; color: white; width: 100px; height: 50px; top: 0px; right: 0px; z-index: 99999">
    Spent {elem.seconds} seconds on {elem.site}
    </div>
    )
  },
  attached: function(elem){
    update_page(elem);
    return setInterval(function(){
      return update_page(elem);
    }, 1000);
  }
});