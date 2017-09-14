void(0)

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

    test('blur when focused item is removed (#336)', function(done) {
      list.items = buildDataSet(100);

      flush(function() {
        getFirstItemFromList(list).focus();

        assert.notEqual(document.activeElement, document.body);

        list.splice('items', 0, 1);

        // HACK(keanulee): This test fails in IE11 if the window is not focused, so
        // skip this test in that case.
        if (document.hasFocus()) {
          assert.equal(document.activeElement, document.body);
        }
        done();
      });
    });

    test('don\'t blur when items changed (#449)', function(done) {
      list.items = buildDataSet(100);

      flush(function() {
        var button = document.createElement('button');
        list.parentNode.appendChild(button);
        button.focus();
        // getFirstItemFromList(list).focus();

        assert.notEqual(document.activeElement, document.body);

        list.items = buildDataSet(100);

        assert.notEqual(document.activeElement, document.body);
        done();
      });
    });

    test('focusItem()', function(done) {
      list.items = buildDataSet(100);

      flush(function() {
        var i = 1;
        var item = getNthItemFromList(list, i);

        assert.equal(item.tabIndex, -1);

        list.focusItem(i);

        assert.equal(item.tabIndex, 0);
        done();
      });
    });

    test('should not hide the list', function(done) {
      container.useTabIndex = true;
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

    test('list focus change with down arrow', function(done) {
      container.useTabIndex = true;
      list.items = buildDataSet(100);

      flush(function() {
        var initialItem = getFirstItemFromList(list);
        var itemToFocus = getNthItemFromList(list, 1);
        initialItem.focus();
        flush(function() {
          MockInteractions.pressAndReleaseKeyOn(list, 40); // down
          flush(function() {
            assert.notEqual(itemToFocus.tabIndex, -1);
            done();
          });
        });
      });
    });

    test('list focus change with up arrow', function(done) {
      list.items = buildDataSet(100);

      flush(function() {
        var initialItem = getNthItemFromList(list, 1);
        var itemToFocus = getFirstItemFromList(list);
        initialItem.focus();
        flush(function() {
          MockInteractions.pressAndReleaseKeyOn(list, 38); // up
          flush(function() {
            assert.notEqual(itemToFocus.tabIndex, -1);
            done();
          });
        });
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

