
    HTMLImports.whenReady(function() {
      Polymer({
        is: 'x-app',

        _load: function() {
          this.$.ajax.generateRequest();
        },

        _didRespond: function(e) {
          var people = e.detail.response.results;

          people.forEach(function(person) {
            this.$.list.push('items', person);
          }, this);
          // Clear the lower threshold so we can load more data when the user scrolls down again.
          this.$.scrollTheshold.clearTriggers();
        }
      });
    });
    