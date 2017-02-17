(function() {
  var {localget} = require('libs_frontend/cacheget_utils');
  if (!window.fetch.overridden) {
    var fetch_orig = window.fetch;
    window.fetch_orig = fetch_orig;
    window.fetch = function(input, init) {
      if (input.startsWith('chrome-extension://')) {
        return localget(input).then(function(text) {
          return new Response(text);
        });
      }
      return fetch_orig(input, init);
    }
    window.fetch.overridden = true;
  }
})();

require('libs_common/systemjs');
