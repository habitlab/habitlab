(function() {
  var {systemjsget} = require('libs_backend/cacheget_utils');
  var loadingloader = setTimeout(function() {
    if (loadingloader == null) {
      return;
    }
    var img = document.createElement('img');
    img.setAttribute('src', chrome.extension.getURL('/icons/spinner.svg'));
    img.setAttribute('id', 'loadingspinner');
    img.style.width = "100vw";
    img.style.height = "100vh";
    document.body.style.overflow = "hidden";
    document.body.appendChild(img);
  }, 500);
  systemjsget('index.js').then(function(index_js_contents) {
    clearTimeout(loadingloader);
    loadingloader = null;
    var loadingspinner = document.getElementById('loadingspinner');
    if (loadingspinner != null) {
      loadingspinner.remove();
      document.body.style.overflow = "";
    }
    eval(index_js_contents);
  });
})();
