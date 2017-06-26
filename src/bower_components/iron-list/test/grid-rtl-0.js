

  suite('basic features', function() {
    var list, container;

    setup(function() {
      container = fixture('trivialList');
      list = container.list;
    });


    test('check horizontal rendering for rtl direction', function(done) {
      container.data = buildDataSet(100);

      flush(function() {
        // Validate that items are being laid out from left to right.
        for (var i = 0, rowIndex, indexInRow, itemsFromPreviousRows,
             actualVisualIndex, expectedVisualIndex; i < 9; i++) {
          rowIndex = getGridRowFromIndex(list, i);
          indexInRow = i % list._itemsPerRow;
          itemsFromPreviousRows = rowIndex * list._itemsPerRow;
          // The item's "visual" index, which does not consider RTL. I.e. the
          // item on the left side of a row is index 0, even with RTL direction.
          actualVisualIndex = getNthItemFromGrid(list, i).textContent;
          expectedVisualIndex = itemsFromPreviousRows + list._itemsPerRow - indexInRow - 1;
          assert.equal(actualVisualIndex, expectedVisualIndex);
        }
        done();
      });
    });

  });
