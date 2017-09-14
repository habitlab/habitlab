

    suite('selected attributes', function() {

      var s;

      setup(function () {
        s = fixture('test');
      });

      test('custom selectedAttribute', function() {
        // set selectedAttribute
        s.selectedAttribute = 'myattr';
        // check selected attribute (should not be there)
        assert.isFalse(s.children[4].hasAttribute('myattr'));
        // set selected
        s.selected = 4;
        // now selected attribute should be there
        assert.isTrue(s.children[4].hasAttribute('myattr'));
      });

    });

    suite('changing attrForSelected', function() {

      var s;

      setup(function () {
        s = fixture('test-attr-change');
      });

      test('changing selectedAttribute', function() {
        Polymer.dom.flush();
        s.attrForSelected = 'data-y';
        assert.equal(s.selected, 'y-1');
      });

    });

    suite('changing attrForSelected in multi', function() {

      var s;

      setup(function () {
        s = fixture('test-attr-change-multi');
      });

      test('changing selectedAttribute', function() {
        Polymer.dom.flush();
        s.attrForSelected = 'data-y';
        assert.equal(s.selectedValues.length, 2);
        assert.equal(s.selectedValues[0],'y-1');
        assert.equal(s.selectedValues[1],'y-2');
      });

    });

  