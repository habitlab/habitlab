(() => {

  if (window.show_user_info_interstitial) {
    return
  }
  window.show_user_info_interstitial = true

  require('enable-webcomponents-in-content-scripts')
  require('components/interstitial-screen-polymer.deps')

  const $ = require('jquery')
  const {
    get_minutes_spent_on_domain_today,
    get_visits_to_domain_today
  } = require('libs_common/time_spent_utils')

  const {
    log_impression,
    log_action,
  } = require('libs_common/log_utils')

  const {
    url_to_domain
  } = require('libs_common/domain_utils')


  


  var numMinutesSpent = 2;
  get_minutes_spent_on_domain_today(url_to_domain(window.location.href), function(numMins){
    
    get_visits_to_domain_today(url_to_domain(window.location.href), function(numVisits) {
      
      var titleString = 'You have visited ' + url_to_domain(window.location.href) +' ' + numVisits + ' times and spent '+ numMins + ' minutes there today.'
      titleString += ' \n Take this chance to do something more valuable with your time!'
      var interst_screen = $('<interstitial-screen-polymer btn-txt="Click to continue to Facebook">')
      interst_screen.prop('titleText', titleString)
      $(document.body).append(interst_screen)
    })
  });
  

})()