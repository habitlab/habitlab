
(function() {

  // Ensure that the `unresolved` attribute added by the WebComponents polyfills
  // is removed. This is done as a convenience so users don't have to remember
  // to do so themselves. This attribute provides FOUC prevention when
  // native Custom Elements is not available.

  function resolve() {
    document.body.removeAttribute('unresolved');
  }

  if (window.WebComponents) {
    addEventListener('WebComponentsReady', resolve);
  } else {
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      resolve();
    } else {
      addEventListener('DOMContentLoaded', resolve);
    }
  }

})();
