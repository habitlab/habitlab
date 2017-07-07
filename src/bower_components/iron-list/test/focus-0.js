

  suite('basic features', function() {
    var list, container;

    setup(function() {
      container = fixture('trivialList');
      list = container.list;
    });

    test('first item should be focusable', function(done) {
      container.data = buildDataSet(100);

      flush(function() {
        assert.notEqual(getFirstItemFromList(list).tabIndex, -1);
        done();
      });
    });

    test('focus the first item and then reset the items', function(done) {
      list.items = buildDataSet(100);

      flush(function() {
        getFirstItemFromList(list).focus();

        simulateScroll({
          list: list,
          contribution: 200,
          target: 3000,
          onScrollEnd: function() {
            list.items = [];
            flush(function() {
              done();
            });
          }
        });
      });
    });

    test('focus the first item and then splice all the items', function(done) {
      list.items = buildDataSet(100);

      flush(function() {
        getFirstItemFromList(list).focus();

        simulateScroll({
          list: list,
          contribution: 200,
          target: 3000,
          onScrollEnd: function() {
            list.splice('items', 0, list.items.length);
            flush(function() {
              done();
            });
          }
        });
      });
    });

    test('should not hide the list', function(done) {
      list.items = buildDataSet(100);

      flush(function() {
        // this index isn't rendered yet
        list._focusedIndex = list.items.length-1;
        list.scrollTarget.addEventListener('scroll', function() {
          var rect = list.getBoundingClientRect();
          assert.isTrue(rect.top + rect.height > 0);
          done();
        });
        // trigger the scroll event
        list._scrollTop = 1000;
      });
    });

    test('Issue #411', function(done) {
      list.items = buildDataSet(100);

      Polymer.dom.flush();

      list.scroll(0, getFirstItemFromList(list).offsetHeight * list._physicalCount);
     
      requestAnimationFrame(function() {
        setTimeout(function() {
          var lastOffscreenFocusedItem = list._offscreenFocusedItem;
          var firstItem = getFirstItemFromList(list);
          MockInteractions.focus(firstItem.parentNode);

          Polymer.dom.flush();

          assert.equal(firstItem, getFirstItemFromList(list),
            'Should be the same item after focusing it');
          assert.isNull(lastOffscreenFocusedItem.parentNode,
            'Should remove the last offscreen focused item');
          done();
        });
      });
    });

  });

