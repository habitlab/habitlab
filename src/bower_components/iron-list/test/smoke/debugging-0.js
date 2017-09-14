
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

    window.addEventListener('WebComponentsReady', function() {
      Polymer({
        is: 'x-demo',

        _getStyle: function(item) {
          return 'height:' + item + 'px; ';
        },

        attached: function() {
          this.$.list1.items = arrayFill(100, 50);

          this.$.scroller.addEventListener('scroll', function() {
            this.$.list1.style.top = (-this.$.scroller.scrollTop+100) + 'px';
          }.bind(this));
        }
      });
    });
    