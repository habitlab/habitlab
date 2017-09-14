

    (function(scope) {

      scope._loadMoreData = function() {
        scope.$.ajax.generateRequest();
      };

      scope._didRespond = function(e) {
        var people = e.detail.response.results;

        people.forEach(function(person) {
          scope.$.list.push('items', person);
        });
        // Clear the lower threshold so we can load more data when the user scrolls down again.
        scope.$.scrollTheshold.clearTriggers();
      };

    })(document.querySelector('#app'));

  