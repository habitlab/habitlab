(() => {

  if (window.make_user_wait) {
    return
  }
  window.make_user_wait = true

  require('enable-webcomponents-in-content-scripts')
  require('components/interstitial-screen-polymer.deps')
  const $ = require('jquery')

})()