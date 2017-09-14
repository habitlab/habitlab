
    window.addEventListener('WebComponentsReady', function() {
      Polymer({
        is: 'x-demo',

        _getStyle: function(item) {
          return 'height:' + item + 'px; ';
        },

        attached: function() {
          this.async(function() {
            this.$.list.push('items', 251, 191, 151, 191, 51, 51, 51);
          }, 100);

          this.async(function() {
            this.$.list2.push('items', 251, 191, 151, 191, 51, 51, 51);
          }, 300);
        }
      });
    });
    