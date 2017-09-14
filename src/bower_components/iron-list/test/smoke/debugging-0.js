
    function arrayFill(size, value) {
      return (new Array(size)).fill(value, 0, size);
    }

    function randomArrayFill(size, min, max) {
      var a = [];
      while (a.length < size) {
        a.push(parseInt(Math.random() * (max-min+1)) + min);
      }
      return a;
    }

    function asyncJob(fn) {
      if (fn()) {
        setTimeout(asyncJob.bind(null, fn));
      }
    }

    document.querySelector('template[is=dom-bind]')._getStyle = function(item) {
      return 'height:' + item + 'px; ';
    };

    HTMLImports.whenReady(function() {

      setTimeout(function() {
        var list1 = document.querySelector('#list1');
        console.log(list1)
        var items = randomArrayFill(100, 1, 200);
        list1.items = arrayFill(100, 50);

        var scroller = document.querySelector('#scroller');
        scroller.addEventListener('scroll', function() {
          list1.style.top = (-scroller.scrollTop+100) + 'px';
        });
      });

    });
  