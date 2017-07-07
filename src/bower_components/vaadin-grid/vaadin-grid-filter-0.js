
    Polymer({
      is: 'vaadin-grid-filter',

      properties: {

        /**
         * JS Path of the property in the item used for filtering the data.
         */
        path: String,

        /**
         * Current filter value.
         */
        value: {
          type: String,
          notify: true
        }
      },

      observers: ['_filterChanged(path, value, isAttached)'],

      _filterChanged: function(path, value, isAttached) {
        if (isAttached) {
          this.debounce('filter-changed', function() {
            this.fire('filter-changed');
          }, 200);
        }
      }
    });
  