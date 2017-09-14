void(0)

    suite('dynamic physical count', function() {
      var list, container;

      setup(function() {
        container = fixture('trivialList');
        list = container.list;
        list.items = buildDataSet(200);
      });

      test('increase pool size', function() {
        PolymerFlush();
        list.scrollTop = 0;
        var lastItem = getLastItemFromList(list);
        var lastItemHeight = lastItem.offsetHeight;
        var expectedFinalItem = container.listHeight/lastItemHeight - 1;

        assert.equal(list.offsetHeight, container.listHeight);
        assert.equal(lastItemHeight, 4);
        assert.isTrue(isFullOfItems(list));
        assert.equal(lastItem.textContent, expectedFinalItem);
      });
    });

    suite('iron-resize', function() {
      var list, container;

      setup(function() {
        container = fixture('trivialList');
        list = container.list;
        list.style.display = 'none';
        list.items = buildDataSet(200);
      });

      test('increase pool size after resizing the list', function(done) {
        flush(function() {
          list.style.display = '';
          assert.notEqual(getFirstItemFromList(list).textContent, '0', 'Item should not be rendered');
          list.fire('iron-resize');
          PolymerFlush();
          assert.equal(getFirstItemFromList(list).textContent, '0', 'Item should be rendered');
          done();
        });
      });

      test('pool should not increase if the list has no size', function(done) {
        flush(function() {
          container.style.display = 'none';
          list.fire('iron-resize');
          PolymerFlush();
          assert.equal(list._physicalCount, 0);
          done();
        });
      });

      test('last visible items should change on resize', function(done) {
        flush(function() {
          list.style.display = '';
          list.fire('iron-resize');
          PolymerFlush();
          assert.equal(list.lastVisibleIndex, 49, 'The 50th item should be visible.');
          container.listHeight = 300;
          requestAnimationFrame(function() {
            list.fire('iron-resize');
            PolymerFlush();
            assert.equal(list.lastVisibleIndex, 74, 'The last visible changed as expected.')
            done();
          });
        });
      });

      test('first visible items should change on resize when scrolled to the end of the list', function(done) {
        flush(function() {
          list.style.display = '';
          list.fire('iron-resize');
          list.scrollToIndex(199);
          PolymerFlush();
          assert.equal(list.lastVisibleIndex, 199, 'Scroll is maxed out.');
          assert.equal(list.firstVisibleIndex, 150, 'The first visible index is appropriately set.');
          container.listHeight = 300;
          list.fire('iron-resize');
          flush(function() {
            assert.equal(list.lastVisibleIndex, 199, 'Scroll is maxed out.');
            assert.equal(list.firstVisibleIndex, 125, 'The first visible item changed as expected.')
            done();
          });
        });
      });
    });

  