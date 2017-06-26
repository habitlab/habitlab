
        document.addEventListener('WebComponentsReady', function() {
          Polymer({
            is: 'iron-ajax',

            properties: {
              url: {
                type: String,
                observer: '_urlChanged'
              },

              lastResponse: {
                type: Object,
                notify: true
              },

              loading: {
                type: Boolean,
                notify: true
              },

              debounceDuration: Number
            },

            _urlChanged: function(url) {
              var urlParts = url.split('?filter=');
              var filter = urlParts[1];

              this.loading = true;

              this.debounce('loading', function() {
                this.loading = false;
                this.lastResponse = elements.filter(function(el) {
                  return el.toLowerCase().indexOf(filter.toLowerCase()) > -1;
                });
              }, this.debounceDuration);
            }
          });
        });
      