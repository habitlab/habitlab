(function() {
  var {systemjsget} = require('libs_backend/cacheget_utils');
  systemjsget('index.js').then(function(index_js_contents) {
    eval(index_js_contents);
  });
})();
