

    var b1;
    var b2;

    function centerOf(element) {
      var rect = element.getBoundingClientRect();
      return {left: rect.left + rect.width / 2, top: rect.top + rect.height / 2};
    }

    function approxEqual(p1, p2) {
      return Math.abs(p1.left - p2.left) <= 2 && Math.abs(p1.top-p2.top) <= 2;
    }

    setup(function() {
      b1 = fixture('TrivialIconButton').querySelector('#fab1');
      b2 = fixture('SrcIconButton');
    });

    test('applies an icon specified by the `icon` attribute', function() {
      assert.strictEqual(!!b1.$.icon.src, false);
      assert.ok(Polymer.dom(b1.$.icon.root).querySelector('svg'));
    });

    test('applies an icon specified by the `src` attribute', function() {

      assert.strictEqual(!!b2.$.icon.src, true);
      assert.ok(b2.$.icon.src);
    });

    test('renders correctly independent of line height', function() {
      assert.ok(approxEqual(centerOf(b1.$.icon), centerOf(b1)));
    });
  