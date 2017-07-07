

      HTMLImports.whenReady(function() {

        Polymer({

          is: 'x-app',

          properties: {
            selectedItems: {
              type: Object
            }
          },

          iconForItem: function(isSelected) {
            return isSelected ? 'star' : 'star-border';
          },

          _computedClass: function(isSelected) {
            var classes = 'item';
            if (isSelected) {
              classes += ' selected';
            }
            return classes;
          },

          _unselect: function(e) {
            this.$.itemsList.deselectItem(e.model.item);
          },

          _getFormattedCount: function(count) {
            return count > 0 ? '(' + count + ')' : '';
          }
        });

     });

    