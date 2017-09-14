void(0)

  suite('basic features', function() {
    var list, container;

    setup(function() {
      container = fixture('trivialList');
      list = container.list;
    });

    test('check horizontal rendering', function() {
      container.data = buildDataSet(100);
      PolymerFlush();
      // Validate the first viewport
      for (var i = 0; i < 9; i++) {
        assert.equal(getNthItemFromGrid(list, i).textContent, i);
      }
    });

    test('grid focus change with right arrow', function() {
      container.useTabIndex = true;
      container.data = buildDataSet(100);

      PolymerFlush();
      var initialItem = getNthItemFromGrid(list, 0);
      var itemToFocus = getNthItemFromGrid(list, 1);
      initialItem.focus();
      PolymerFlush();
      MockInteractions.pressAndReleaseKeyOn(list, 39); // right
      PolymerFlush();

      assert.notEqual(itemToFocus.tabIndex, -1);
    });

    test('grid focus change with left arrow', function() {
      container.useTabIndex = true;
      container.data = buildDataSet(100);

      PolymerFlush();
      var initialItem = getNthItemFromGrid(list, 1);
      var itemToFocus = getNthItemFromGrid(list, 0);
      initialItem.focus();
      PolymerFlush();
      MockInteractions.pressAndReleaseKeyOn(list, 37); // left
      PolymerFlush();

      assert.notEqual(itemToFocus.tabIndex, -1);
    });

    test('grid focus change with down arrow', function() {
      container.useTabIndex = true;
      container.data = buildDataSet(100);

      PolymerFlush();
      var initialItem = getNthItemFromGrid(list, 0);
      var itemToFocus = getNthItemFromGrid(list, list._itemsPerRow);
      initialItem.focus();
      PolymerFlush();
      MockInteractions.pressAndReleaseKeyOn(list, 40); // down
      PolymerFlush();

      assert.notEqual(itemToFocus.tabIndex, -1);
    });

    test('grid focus does not change with down arrow from last row', function() {
      container.useTabIndex = true;
      container.data = buildDataSet(5);

      PolymerFlush();
      var initialItem = getNthItemFromGrid(list, 3);
      initialItem.focus();
      PolymerFlush();
      MockInteractions.pressAndReleaseKeyOn(list, 40); // down
      PolymerFlush();

      assert.notEqual(initialItem.tabIndex, -1);
    });

    test('grid focus change with up arrow', function() {
      container.useTabIndex = true;
      container.data = buildDataSet(100);

      PolymerFlush();
      var initialItem = getNthItemFromGrid(list, list._itemsPerRow);
      var itemToFocus = getNthItemFromGrid(list, 0);
      initialItem.focus();
      PolymerFlush();
      MockInteractions.pressAndReleaseKeyOn(list, 38); // up
      PolymerFlush();

      assert.notEqual(itemToFocus.tabIndex, -1);
    });

    test('first visible index', function(done) {
      container.data = buildDataSet(100);
      PolymerFlush();

      var setSize = list.items.length;
      var rowHeight = container.itemSize;
      var viewportHeight = list.offsetHeight;
      var scrollToItem;

      function checkFirstVisible() {
        assert.equal(list.firstVisibleIndex, getNthItemRowStart(list, scrollToItem));
        assert.equal(getNthItemFromGrid(list, 0).textContent, getNthItemRowStart(list, scrollToItem));
      }

      function checkLastVisible() {
        var visibleItemsCount = Math.floor(viewportHeight / rowHeight) * list._itemsPerRow;
        var visibleItemStart = getNthItemRowStart(list, scrollToItem);
        assert.equal(list.lastVisibleIndex, visibleItemStart + visibleItemsCount - 1);
        assert.equal(getNthItemFromGrid(list, 8).textContent, visibleItemStart + visibleItemsCount - 1);
      }

      function doneScrollDown() {
        checkFirstVisible();
        checkLastVisible();
        scrollToItem = 0;
        simulateScroll({
          list: list,
          contribution: rowHeight,
          target: getGridRowFromIndex(list, scrollToItem)*rowHeight,
          onScrollEnd: doneScrollUp
        });
      }

      function doneScrollUp() {
        checkFirstVisible();
        checkLastVisible();
        done();
      }

      scrollToItem = 60;

      simulateScroll({
        list: list,
        contribution: rowHeight,
        target: getGridRowFromIndex(list, scrollToItem)*rowHeight,
        onScrollEnd: doneScrollDown
      });
    });

    test('scroll to index', function() {
      list.items = buildDataSet(100);
      PolymerFlush();
      list.scrollToIndex(30);
      assert.equal(list.firstVisibleIndex, 30);
      list.scrollToIndex(0);
      assert.equal(list.firstVisibleIndex, 0);
      list.scrollToIndex(60);
      assert.equal(list.firstVisibleIndex, 60);

      var rowHeight = getNthItemFromGrid(list, 0).offsetHeight;
      var viewportHeight = list.offsetHeight;
      var itemsPerViewport = Math.floor(viewportHeight/rowHeight) * list._itemsPerRow;

      list.scrollToIndex(99);
      // make the height of the viewport same as the height of the row
      // and scroll to the last item
      list.style.height = list._physicalItems[0].offsetHeight + 'px';
      list.fire('iron-resize');
      list.scrollToIndex(99);
      PolymerFlush();
      assert.equal(list.firstVisibleIndex,
          (list.items.length-1)*2 - Math.floor(list.items.length/list._itemsPerRow)*list._itemsPerRow);
    });

    test('reset items', function() {
      list.items = buildDataSet(100);
      PolymerFlush();
      assert.equal(getNthItemFromGrid(list, 0).textContent, '0');
      list.items = null;
      PolymerFlush();
      assert.notEqual(getNthItemFromGrid(list, 0).textContent, '0');
      list.items = buildDataSet(100);
      PolymerFlush();
      assert.equal(getNthItemFromGrid(list, 0).textContent, '0');
    });

    test('delete a grid item when the last row should only have one item and scroll to bottom', function(done) {
      list.items = buildDataSet(64);
      Polymer.dom.flush();
      list.shift('items');
      Polymer.dom.flush();
      list.scroll(0, 10000000);
      requestAnimationFrame(function() {
        setTimeout(function() {
          assert.equal(list.lastVisibleIndex, list.items.length - 1);
          done();
        });
      });
    });

    test('Columns per row (#381)', function(done) {
      container.data = buildDataSet(1000);
      container.itemSize = 33.333;
      PolymerFlush();
      list.scroll(0, 5021);
      requestAnimationFrame(function() {
        setTimeout(function() {
          PolymerFlush();
          assert.equal(list._physicalStart % list._itemsPerRow, 0, '_physicalStart');
          // TODO: investigate why this is flaky.
          // assert.equal((list._physicalEnd + 1) % list._itemsPerRow, 0, '_physicalEnd');
          done();
        });
      });
    });

    test('last visible items should change on resize', function(done) {
      flush(function() {
        // Physical scroll bar causes there to be less columns than expected.
        // Force list to be wide enough to allow for 3 columns and the scroller.
        list.style.width = '320px';
        list.items = buildDataSet(64);
        Polymer.dom.flush();
        assert.equal(list.lastVisibleIndex, 8, 'The 8th item should be visible.');
        list.style.height = '400px';
        requestAnimationFrame(function() {
          setTimeout(function() {
            PolymerFlush();
            list.fire('iron-resize');
            PolymerFlush();
            assert.equal(list.lastVisibleIndex, 11, 'The last visible changed as expected.')
            done();
          });
        });
      });
    });

    test('first visible items should change on resize when scrolled to the end of the list', function(done) {
      flush(function() {
        // Physical scroll bar causes there to be less columns than expected.
        // Force list to be wide enough to allow for 3 columns and the scroller.
        list.style.width = '320px';
        list.items = buildDataSet(64);
        Polymer.dom.flush();
        list.scroll(0, 10000000);
        requestAnimationFrame(function() {
          setTimeout(function() {
            PolymerFlush();
            assert.equal(list.lastVisibleIndex, 64, 'Scroll is maxed out.');
            assert.equal(list.firstVisibleIndex, 57, 'The first visible index is appropriately set.');
            list.style.height = '400px';
            requestAnimationFrame(function() {
              requestAnimationFrame(function() {
                setTimeout(function() {
                  PolymerFlush();
                  list.fire('iron-resize');
                  PolymerFlush();
                  assert.equal(list.lastVisibleIndex, 64, 'Scroll is maxed out.');
                  assert.equal(list.firstVisibleIndex, 54, 'The first visible item changed as expected.')
                  done();
                });
              });
            });
          });
        });
      });
    });

    test('Items display in the correct column after scroll', function(done) {
      list.style.width = '500px';
      list.style.height = '500px';
      list.fire('iron-resize');
      container.data = buildDataSet(5000);
      PolymerFlush();

      var setSize = list.items.length;
      var rowHeight = container.itemSize;
      var viewportHeight = list.offsetHeight;
      var scrollToItem = 100;

      function afterScroll() {
        var firstItem = getNthItemFromGrid(list, 0);
        assert.equal(firstItem.innerText, '100');
        done();
      }

      simulateScroll({
        list: list,
        contribution: rowHeight,
        target: getGridRowFromIndex(list, scrollToItem)*rowHeight,
        onScrollEnd: afterScroll
      });
    });

  });
