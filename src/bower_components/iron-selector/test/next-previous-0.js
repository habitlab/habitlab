

    var s;

    function assertAndSelect(method, expectedIndex) {
      assert.equal(s.selected, expectedIndex);
      s[method]();
    }

    suite('next/previous', function() {

      setup(function () {
        s = fixture('test1');
      });

      test('selectNext', function() {
        assert.equal(s.selected, 0);
        assertAndSelect('selectNext', 0);
        assertAndSelect('selectNext', 1);
        assertAndSelect('selectNext', 2);
        assert.equal(s.selected, 0);
      });

      test('selectPrevious', function() {
        assert.equal(s.selected, 0);
        assertAndSelect('selectPrevious', 0);
        assertAndSelect('selectPrevious', 2);
        assertAndSelect('selectPrevious', 1);
        assert.equal(s.selected, 0);
      });

      test('selectNext/Previous', function() {
        assert.equal(s.selected, 0);
        assertAndSelect('selectNext', 0);
        assertAndSelect('selectNext', 1);
        assertAndSelect('selectPrevious', 2);
        assertAndSelect('selectNext', 1);
        assertAndSelect('selectPrevious', 2);
        assert.equal(s.selected, 1);
      });

    });

    suite('next/previous attrForSelected', function() {

      setup(function () {
        s = fixture('test2');
      });

      test('selectNext', function() {
        assert.equal(s.selected, 'foo');
        assertAndSelect('selectNext', 'foo');
        assertAndSelect('selectNext', 'bar');
        assertAndSelect('selectNext', 'zot');
        assert.equal(s.selected, 'foo');
      });

      test('selectPrevious', function() {
        assert.equal(s.selected, 'foo');
        assertAndSelect('selectPrevious', 'foo');
        assertAndSelect('selectPrevious', 'zot');
        assertAndSelect('selectPrevious', 'bar');
        assert.equal(s.selected, 'foo');
      });

      test('selectNext/Previous', function() {
        assert.equal(s.selected, 'foo');
        assertAndSelect('selectNext', 'foo');
        assertAndSelect('selectNext', 'bar');
        assertAndSelect('selectPrevious', 'zot');
        assertAndSelect('selectNext', 'bar');
        assertAndSelect('selectPrevious', 'zot');
        assert.equal(s.selected, 'bar');
      });

    });

  