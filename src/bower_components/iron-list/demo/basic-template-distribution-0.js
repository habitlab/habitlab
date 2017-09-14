
    window.addEventListener('WebComponentsReady', function() {
      Polymer({
        is: 'x-list',
        properties: {
          items: Array,
          as: {
            type: String,
            value: 'item'
          }
        }
      });
    });
    
    window.addEventListener('WebComponentsReady', function() {
      Polymer({ is: 'x-example' });
    });
    