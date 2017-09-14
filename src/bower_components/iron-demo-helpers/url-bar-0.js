
    Polymer({
      is: 'url-bar',
      properties: {
        url: {
          computed: '__computeUrl(path, query, hash)'
        },
        inIframe: {
          value: function() {
            return window.top !== window;
          },
          reflectToAttribute: true
        },
        path: {
          type: String
        },
        query: {
          type: String
        },
        hash: {
          type: String
        }
      },
      __computeUrl: function(path, query, hash) {
        var url = path;
        if (query) {
          url += '?' + query;
        }
        if (hash) {
          url += '#' + hash;
        }
        return url;
      }
    })
  