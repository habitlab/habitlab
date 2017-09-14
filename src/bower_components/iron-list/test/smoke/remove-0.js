
    HTMLImports.whenReady(function() {
      Polymer({
        is: 'x-demo',
        
        attached() {
          this._setItems();
        },
        
        _removeItem(e) {
          e.preventDefault();

          var i = this.$.list.modelForElement(e.target.parentElement).index;
          this.splice('items', i, 1);
          // this.async(_ => this.$.list.focusItem(i));
        },

        _setItems() {
          var items = [];
          for (var i = 0; i < 1000; ++i) {
            items.push({
              name: 'a'+i,
              modelIndex: i
            });
          }
          this.items = items;
        }
      });
    });
    