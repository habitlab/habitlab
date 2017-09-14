
    window.ShadyDOM = {
      force: true
    };
    if (window.customElements) customElements.forcePolyfill = true;
    window.webComponentsReadyCount = 0;
    window.addEventListener('WebComponentsReady', function() {
      window.webComponentsReadyCount++;
    });
  
    suite('Force polyfill', function() {
      test('expected boot', function() {
        assert.equal(window.webComponentsReadyCount, 1, 'failed to fire WebComponentsReady');
      });
    });
  