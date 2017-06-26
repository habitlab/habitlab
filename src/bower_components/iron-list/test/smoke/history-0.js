
        Polymer({
          is: 'my-element',
          
          properties: {
            items: Array,
          },
          
          loadMoreData: function() {
            console.log('items before: ' + this.$.list._physicalCount);
            setTimeout(() => console.log('items after: ' + this.$.list._physicalCount), 0)
            
            var newItems = [];
            for (var i = 0; i < 30; i++) {
              newItems.push(i);
            }
            
            if (this.items) {
              //return;
              newItems.unshift('items');
              this.push.apply(this, newItems);
            } else {
              this.set('items', newItems);
            }
            this.$.threshold.clearTriggers();
          },
          
          getItemClass: function(index, length) {
            return (index == length - 1) ? 'last' : '';
          }
        });
    