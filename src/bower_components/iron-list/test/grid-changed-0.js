void(0)

  suite('basic features', function() {
    var list, container;

    setup(function() {
      container = fixture('trivialList');
      list = container.list;
    });

    test('check from grid=true to grid=false and back', function() {
      // Physical scroll bar causes there to be less columns than expected.
      // Force list to be wide enough to allow for 3 columns and the scroller.
      list.style.width = '320px';
      container.data = buildDataSet(100);
      PolymerFlush();
      assert.equal(list.lastVisibleIndex, 8);
      assert.equal(list._scrollHeight, 3400);
      list.grid = false;
      PolymerFlush();
      assert.equal(list.lastVisibleIndex, 2);
      assert.equal(list._scrollHeight, 10000);
      list.grid = true;
      PolymerFlush();
      assert.equal(list.lastVisibleIndex, 8);
      assert.equal(list._scrollHeight, 3400);
    });

    test('check from grid=false to grid=true and back', function() {
      // Physical scroll bar causes there to be less columns than expected.
      // Force list to be wide enough to allow for 3 columns and the scroller.
      list.style.width = '320px';
      list.grid = false;
      container.data = buildDataSet(100);
      PolymerFlush();
      assert.equal(list.lastVisibleIndex, 2);
      assert.equal(list._scrollHeight, 10000);
      list.grid = true;
      PolymerFlush();
      assert.equal(list.lastVisibleIndex, 8, 'Grid should show more items.');
      assert.equal(list._scrollHeight, 3400);
      list.grid = false;
      PolymerFlush();
      assert.equal(list.lastVisibleIndex, 2);
      assert.equal(list._scrollHeight, 10000);
    });

  });
