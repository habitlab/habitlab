(() => {
  if (window.show_user_info_interstitial) {
    return;
  }
  window.show_user_info_interstitial = true;

  const $ = require('jquery');
  require('enable-webcomponents-in-content-scripts');
  require('components/interstitial-screen-polymer.deps');

  const {
    get_minutes_spent_on_domain_today
  } = require('libs_common/time_spent_utils');

  const {
    log_impression,
    log_action
  } = require('libs_common/log_utils');


  var interstitial = $('<interstitial-screen-polymer>');
  console.log(interstitial);
  console.log('loading interstitial');
  $(document.body).append(interstitial);


})()