
      window.addEventListener("message", messageReceived, false);

      window.addEventListener('WebComponentsReady', function() {
        window.parent.postMessage({
          'type': 'ready'
        }, '*');
      });

      var appendBodyReceived = false;
      function messageReceived(msg) {
        if (!msg.data) {
          console.error('got invalid msg?');
        }
        // the parent can (at any time) ask for our URL.
        if (msg.data.type === 'urlQuery') {
          msg.source.postMessage({
            'type': 'urlQueryResponse',
            'href': window.location.href,
            'pathname': window.location.pathname,
            'hash': window.location.hash,
            'search': window.location.search
          }, '*');
        } else if (msg.data.type === 'appendBody') {
          if (appendBodyReceived) {
            throw new Error('should only receive at most one appendBody call');
          }
          var element = document.createElement(msg.data.tagName);
          document.body.appendChild(element);
          appendBodyReceived = true;
        }
      }

      window.addEventListener('error', function(e) {
        window.parent.postMessage({
          'type': 'error',
          'error': e.message
        }, '*');
      });
    