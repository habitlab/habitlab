
    suite('inline attributes', function() {
      var selector;
      var items;

      setup(function () {
        selector = fixture('inlineAttributes');
        items = Array.prototype.slice.apply(selector.querySelectorAll('div[some-attr]'));
      });

      test('selecting value programatically selects correct item', function() {
        selector.select('value1');
        assert.equal(selector.selectedItem, items[1]);
      });

      test('selecting item sets the correct selected value', function(done) {
        MockInteractions.downAndUp(items[2], function() {
          assert.equal(selector.selected, 'value2');
          done();
        });
      });
    });

    suite('reflected properties as attributes', function() {
      var selector;
      var items;

      setup(function () {
        selector = fixture('reflectedProperties');
        items = Array.prototype.slice.apply(selector.querySelectorAll('attr-reflector'));
        for (var i = 0; i < items.length; i++) {
          items[i].someAttr = "value" + i;
        }
      });

      test('selecting value programatically selects correct item', function() {
        selector.select('value1');
        assert.equal(selector.selectedItem, items[1]);
      });

      test('selecting item sets the correct selected value', function(done) {
        MockInteractions.downAndUp(items[2], function() {
          assert.equal(selector.selected, 'value2');
          done();
        });
      });
    });

    suite('mixed properties and inline attributes', function() {
      var selector;
      var items;

      setup(function () {
        selector = fixture('mixedPropertiesAndAttributes');
        items = Array.prototype.slice.apply(selector.querySelectorAll('attr-reflector, div[some-attr]'));
        for (var i = 0; i < items.length; i++) {
          items[i].someAttr = "value" + i;
        }
      });

      test('selecting value programatically selects correct item', function() {
        for (var i = 0; i < items.length; i++) {
          selector.select('value' + i);
          assert.equal(selector.selectedItem, items[i]);
        }
      });

      test('selecting item sets the correct selected value', function(done) {
        var i = 0;

        function testSelectItem(i) {
          if (i >= items.length) {
            done();
            return;
          }

          MockInteractions.downAndUp(items[i], function() {
            assert.equal(selector.selected, 'value' + i);

            testSelectItem(i + 1);
          });
        }

        testSelectItem(i);
      });
    });

    suite('default attribute', function() {
      var selector;
      var items;

      setup(function () {
        selector = fixture('defaultAttribute');
        items = Array.prototype.slice.apply(selector.querySelectorAll('div[some-attr]'));
      });

      test('setting non-existing value sets default', function() {
        selector.select('non-existing-value');
        assert.equal(selector.selected, 'default');
        assert.equal(selector.selectedItem, items[2]);
      });

      test('setting non-existing value sets default', function() {
        selector.multi = true;
        selector.select(['non-existing-value']);
        assert.deepEqual(selector.selectedValues, ['default']);
        assert.deepEqual(selector.selectedItems, [items[2]]);
      });

      test('default not used when there was at least one match', function() {
        selector.multi = true;
        selector.selectedValues = ['non-existing-value', 'value0'];
        assert.deepEqual(selector.selectedValues, ['non-existing-value', 'value0']);
        assert.deepEqual(selector.selectedItems, [items[0]]);
      });

      test('default element not found does not result in infinite loop', function() {
        selector.fallbackSelection = 'non-existing-fallback';
        selector.select('non-existing-value');
        assert.equal(selector.selectedItem, undefined);
        selector.multi = true;
        selector.selectedValues = ['non-existing-value'];
        assert.deepEqual(selector.selectedItems, [undefined]);
        selector.fallbackSelection = 'default';
        assert.deepEqual(selector.selectedItems, [items[2]]);
      });

      test('selection is updated after fallback is set', function() {
        selector.fallbackSolution = undefined;
        selector.select('non-existing-value');
        selector.fallbackSelection = 'default';
        assert.equal(selector.selectedItem, items[2]);
      });

      test('multi-selection is updated after fallback is set', function() {
        selector.fallbackSolution = undefined;
        selector.selectedValues = ['non-existing-value'];
        selector.fallbackSolution = 'default';
        assert.equal(selector.selectedItem, items[2]);
      });
    });
  