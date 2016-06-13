
    Polymer({
      is: 'redirect-hash',
      properties: {
        hash: {
          value: '',
          observer: 'hashChanged'
        }
      },
      hashChanged: function(hash) {
        this.hash = 'redirectedTo';
      }
    });
  
    Polymer({
      is: 'redirect-path',
      properties: {
        path: {
          value: '',
          observer: 'pathChanged'
        }
      },
      pathChanged: function(path) {
        this.path = '/redirectedTo';
      }
    });
  
    Polymer({
      is: 'redirect-query',
      properties: {
        query: {
          value: '',
          observer: 'queryChanged'
        }
      },
      queryChanged: function(query) {
        this.query = 'redirectedTo';
      }
    });
  