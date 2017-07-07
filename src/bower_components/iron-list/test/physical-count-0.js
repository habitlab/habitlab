

    suite('dynamic physical count', function() {
      var list, container;

      setup(function() {
        container = fixture('trivialList');
        list = container.list;
        list.items = buildDataSet(200);
      });

      test('increase pool size', function(done) {
        setTimeout(function() {
          list.scrollTop = 0;

          var lastItem = getLastItemFromList(list);
          var lastItemHeight = lastItem.offsetHeight;
          var expectedFinalItem = container.listHeight/lastItemHeight - 1;

          assert.equal(list.offsetHeight, container.listHeight);
          assert.equal(lastItemHeight, 2);
          assert.isTrue(isFullOfItems(list));
          assert.equal(lastItem.textContent, expectedFinalItem);
          done();
        }, 100);
      });
    });

    suite('iron-resize', function() {
      var list, container;

      setup(function() {
        container = fixture('trivialListSmall');
        list = container.list;
        list.style.display = 'none';
        list.items = buildDataSet(200);
      });

      test('increase pool size after resizing the list', function(done) {
        flush(function() {
          list.style.display = '';
          assert.notEqual(getFirstItemFromList(list).textContent, '0', 'Item should not be rendered');

          list.fire('iron-resize');

          flush(function() {
            assert.equal(getFirstItemFromList(list).textContent, '0', 'Item should be rendered');
            done();
          });
        });
      });

      test('pool should not increase if the list has no size', function(done) {
        container.style.display = 'none';
        list.fire('iron-resize');

        flush(function() {
          assert.equal(list._physicalCount, 0);
          done();
        });
      });
    });

  