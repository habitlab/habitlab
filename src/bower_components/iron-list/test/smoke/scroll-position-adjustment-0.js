

    HTMLImports.whenReady(function() {
      Polymer({
        is: 'x-list',
        properties: {
          items: {
            type: Array,
            value: function() {
              var data = [];
              
              for (var i = 1; i <= 64; i++) {
                data.push(i);
              }
              
              return data;
            }
          }
        },
        
        removeItems:function() {
          for (var i = 0; i < 16; i++ ) {
            this.shift("items");
          }
          console.log("16 items removed")
        },
      });
    });
  