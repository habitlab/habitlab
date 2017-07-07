

    HTMLImports.whenReady(function() {

      Polymer({
        is: 'x-collapse',

        properties: {

          items: {
            type: Array
          }

        },

        attached: function() {
          // Use the document element
          this.$.list.scrollTarget = this.ownerDocument.documentElement;
        },

        iconForItem: function(item) {
          return item ? (item.integer < 50 ? 'star-border' : 'star') : '';
        },

        getClassForItem: function(item, selected) {
          return selected ? 'item expanded' : 'item';
        }

      });

    });

  