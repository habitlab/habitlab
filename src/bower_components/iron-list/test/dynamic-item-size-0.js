void(0)

    suite('Dynamic item size', function() {
      var list, container;

      setup(function() {
        container = fixture('trivialList');
        list = container.list;
      });

      test('update size using item index', function(done) {
        list.items = buildDataSet(100);

        flush(function() {
          var firstItem = getFirstItemFromList(list);
          var initHeight = firstItem.offsetHeight;

          list.set('items.0.index', '1\n2\n3\n4');
          list.updateSizeForItem(0);
          assert.isAbove(firstItem.offsetHeight, initHeight*3);
          list.set('items.0.index', '1');
          list.updateSizeForItem(0);
          assert.equal(firstItem.offsetHeight, initHeight);
          done();
        });
      });

      test('update size using item object', function(done) {
        list.items = buildDataSet(100);

        flush(function() {
          var firstItem = getFirstItemFromList(list);
          var initHeight = firstItem.offsetHeight;

          list.set('items.0.index', '1\n2\n3\n4');
          list.updateSizeForItem(list.items[0]);
          assert.isAbove(firstItem.offsetHeight, initHeight*3);
          list.set('items.0.index', '1');
          list.updateSizeForItem(list.items[0]);
          assert.equal(firstItem.offsetHeight, initHeight);
          done();
        });
      });

      test('ignore items that are not rendered', function(done) {
        list.items = buildDataSet(100);

        flush(function() {
          list.updateSizeForItem(list.items[list.items.length - 1]);
          done();
        });
      });

    });

  