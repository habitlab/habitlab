

    suite('hidden list', function() {
      var list, container;

      setup(function() {
        container = fixture('trivialList');
        list = container.list;
      });

      test('list size', function(done) {
        list.items = buildDataSet(100);
        flush(function() {
          assert.equal(list.offsetWidth, 0);
          assert.equal(list.offsetHeight, 0);
          done();
        });
      });

      test('iron-resize', function(done) {
        list.items = buildDataSet(100);
        list.fire('iron-resize');

        assert.notEqual(getFirstItemFromList(list).textContent, '0');
        Polymer.RenderStatus.whenReady(function() {
          container.removeAttribute('hidden');
          assert.notEqual(getFirstItemFromList(list).textContent, '0');
          list.fire('iron-resize');
          flush(function() {
            assert.isTrue(list.isAttached);
            assert.equal(getFirstItemFromList(list).textContent, '0');
            done();
          });
        });
      });

    });

  