

    suite('scrollOffset property', function() {
      var list, container;

      setup(function() {
        container = fixture('trivialList');
        list = container.querySelector('iron-list');
      });

      test('value', function() {
        list.items = buildDataSet(100);
        Polymer.dom.flush();
        assert.equal(list.scrollOffset, 100);
      });

      test('firstVisibleIndex', function(done) {
        list.items = buildDataSet(100);
        Polymer.dom.flush();
        window.scrollTo(0, 1000);
        requestAnimationFrame(function() {
          setTimeout(function() {
            var idx = Math.floor((window.pageYOffset - list.scrollOffset) / 50);
            assert.equal(list.firstVisibleIndex, idx);
            done();
          });
        });
      });

      test('lastVisibleIndex', function(done) {
        list.items = buildDataSet(100);
        Polymer.dom.flush();
        window.scrollTo(0, 1000);
        requestAnimationFrame(function() {
          setTimeout(function() {
            var idx = Math.floor((window.pageYOffset + window.innerHeight - list.scrollOffset) / 50);
            assert.equal(list.lastVisibleIndex, idx);
            done();
          });
        });
      });

    });

  