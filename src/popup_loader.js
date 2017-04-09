(function() {
  var {localget} = require('libs_backend/cacheget_utils');
  localget('popup.js').then(function(popup_js_contents) {
    eval(popup_js_contents);
  });
})();
