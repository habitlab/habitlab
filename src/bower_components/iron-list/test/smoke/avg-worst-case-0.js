
    HTMLImports.whenReady(function() {
      document.querySelector('template[is=dom-bind]')._getStyle = function(item) {
        return 'height:' + item + 'px; ';
      };

      setTimeout(function() {
        document.querySelector('#list').push('items', 251, 191, 151, 191, 51, 51, 51);
      }, 100);

       setTimeout(function() {
        document.querySelector('#list2').push('items', 251, 191, 151, 191, 51, 51, 51);
      }, 300);
    });
  