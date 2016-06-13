
      window.addEventListener('WebComponentsReady', function() {
        Polymer({
          is: 'iron-query-params-demo',
          properties: {
            paramsString: {
              observer: 'paramsStringChanged'
            },
            params: {
              observer: 'paramsChanged'
            },
            paramsInvalid: {
              value: false,
            },
          },
          paramsStringChanged: function() {
            if (this.ignore) {
              return;
            }
            this.ignore = true;
            try {
              this.params = JSON.parse(this.paramsString);
              this.paramsInvalid = false;
            } catch(_) {
              this.paramsInvalid = true;
            }
            this.ignore = false;
          },
          paramsChanged: function() {
            if (this.ignore) {
              return;
            }
            this.ignore = true;
            this.paramsString = JSON.stringify(this.params);
            this.paramsInvalid = false;
            this.ignore = false;
          }
        });
      });
    