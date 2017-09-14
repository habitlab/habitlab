

    suite('basic', function() {
      test('can be checked', function() {
        var c = fixture('basic');
        assert.isFalse(c.checked);
        c.checked = true;
        assert.isTrue(c.checked);
      });

      test('can be unchecked', function() {
        var c = fixture('checked');
        assert.isTrue(c.checked);
        c.checked = false;
        assert.isFalse(c.checked);
      });

      test('invalid if required and not checked', function() {
        var c = fixture('basic');
        c.required = true;
        assert.isFalse(c.checked);
        assert.isFalse(c.validate());
        assert.isTrue(c.invalid);
      });

      test('valid if required and checked', function() {
        var c = fixture('basic');
        c.required = true;
        c.checked = true;
        assert.isTrue(c.checked);
        assert.isTrue(c.validate());
        assert.isFalse(c.invalid);
      });

      test('valid if not required and not checked', function() {
        var c = fixture('basic');
        assert.isFalse(c.checked);
        assert.isTrue(c.validate());
        assert.isFalse(c.invalid);
      });

      test('has a default value of "on", always', function() {
        var c = fixture('basic');

        assert.isTrue(c.value === 'on');

        c.checked = true;
        assert.isTrue(c.value === 'on');
      });

      test('does not stomp over user defined value when checked', function() {
        var c = fixture('with-value');
        assert.isTrue(c.value === 'batman');

        c.checked = true;
        assert.isTrue(c.value === 'batman');
      });

      test('value returns "on" when no explicit value is specified', function() {
        var c = fixture('basic');

        assert.equal(c.value, 'on', 'returns "on"');
      });

      test('value returns the value when an explicit value is set', function() {
        var c = fixture('basic');

        c.value = 'abc';
        assert.equal(c.value, 'abc', 'returns "abc"');

        c.value = '123';
        assert.equal(c.value, '123', 'returns "123"');
      });

      test('value returns "on" when value is set to undefined', function() {
        var c = fixture('basic');

        c.value = 'abc';
        assert.equal(c.value, 'abc', 'returns "abc"');

        c.value = undefined;
        assert.equal(c.value, 'on', 'returns "on"');
      });
    });

    suite('a11y', function() {
      test('setting `required` sets `aria-required=true`', function() {
        var c = fixture('basic');
        c.required = true;
        assert.equal(c.getAttribute('aria-required'), 'true');
        c.required = false;
        assert.isFalse(c.hasAttribute('aria-required'));
      });

      test('setting `invalid` sets `aria-invalid=true`', function() {
        var c = fixture('basic');
        c.invalid = true;
        assert.equal(c.getAttribute('aria-invalid'), 'true');
        c.invalid = false;
        assert.isFalse(c.hasAttribute('aria-invalid'));
      });
    });

  