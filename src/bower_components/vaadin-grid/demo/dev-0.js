
        document.addEventListener('WebComponentsReady', function() {
          Polymer({
            is: 'x-app',

            properties: {
              items: {
                value: window.users.results
              }
            }
          });
        });
      