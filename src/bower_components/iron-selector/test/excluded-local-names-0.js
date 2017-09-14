

    suite('excluded local names', function() {

      var test1, test2;

      setup(function () {
        test1 = fixture('test1');
        test2 = fixture('test2');
      });

      test('default `_excludedLocalNames`', function() {
        assert.isTrue('template' in test1._excludedLocalNames);
        assert.isTrue('template' in test2._excludedLocalNames);
      });

      test('custom `_excludedLocalNames`', function() {
        test1._excludedLocalNames.foo = 1;

        assert.isTrue('foo' in test1._excludedLocalNames);
        assert.isFalse('foo' in test2._excludedLocalNames);
      });


      test('items', function(done) {
        test1._excludedLocalNames.span = 1;
        test2._excludedLocalNames.div = 1;
        test1._updateItems();
        test2._updateItems();

        Polymer.Base.async(function() {
          var NOT_FOUND = -1;
          var items1 = test1.items.map(function(el) { return el.localName; });
          var items2 = test2.items.map(function(el) { return el.localName; });

          assert.equal(items1.indexOf('span'), NOT_FOUND);
          assert.equal(items2.indexOf('div'), NOT_FOUND);
          done();
        });
      });

    });

  