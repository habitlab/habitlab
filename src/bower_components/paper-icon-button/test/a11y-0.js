

    var b1;
    var b2;
    var b3;
    var b4;
    var b5;

    setup(function() {
      var iconButtons = fixture('A11yIconButtons');

      b1 = iconButtons[0];
      b2 = iconButtons[1];
      b3 = iconButtons[2];
      b4 = iconButtons[3];
      b5 = iconButtons[4];
    });

    test('aria role is a button', function() {
      assert.strictEqual(b1.getAttribute('role'), 'button');
    });

    test('aria-disabled is set', function() {
      assert.strictEqual(b2.getAttribute('aria-disabled'), 'true');
      b2.removeAttribute('disabled');
      assert.strictEqual(b2.getAttribute('aria-disabled'), 'false');
    });

    test('user-defined aria-label is preserved', function() {
      assert.strictEqual(b3.getAttribute('aria-label'), 'custom');
      b3.icon = 'arrow-forward';
      assert.strictEqual(b3.getAttribute('aria-label'), 'custom');
    });

    test('alt attribute is used for the aria-label', function() {
      assert.strictEqual(b4.getAttribute('aria-label'), 'alt text');
      b4.icon = 'arrow-forward';
      assert.strictEqual(b4.getAttribute('aria-label'), 'alt text');
    });

    test('aria-label wins over alt attribute', function() {
      assert.strictEqual(b5.getAttribute('aria-label'), 'custom');
      b5.icon = 'arrow-forward';
      b5.alt = 'other alt'
      assert.strictEqual(b5.getAttribute('aria-label'), 'custom');
    });

    test('alt attribute can be updated', function() {
      assert.strictEqual(b4.getAttribute('aria-label'), 'alt text');
      b4.alt = 'alt again';
      assert.strictEqual(b4.getAttribute('aria-label'), 'alt again');
    });

  