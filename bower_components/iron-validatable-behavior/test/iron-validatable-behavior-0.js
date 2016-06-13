

    suite('basic', function() {

      test('setting `invalid` sets `aria-invalid=true`', function() {
        var node = fixture('basic');
        node.invalid = true;
        assert.equal(node.getAttribute('aria-invalid'), 'true', 'aria-invalid is set');
        node.invalid = false;
        assert.isFalse(node.hasAttribute('aria-invalid'), 'aria-invalid is unset');
      });

      test('validate() is true if a validator isn\'t set', function() {
        var node = fixture('basic');
        var valid = node.validate();
        assert.isTrue(valid);
      });

      test('changing the validator works', function() {
        var node = fixture('validators');
        var input = node[2];

        // Initially there's no validator, so everything is valid.
        assert.isTrue(input.validate(''));
        assert.isTrue(input.validate('cats'));

        // Only valid if the value is 'cats'.
        input.validator = 'cats-only';
        assert.isFalse(input.validate('ca'));
        assert.isTrue(input.validate('cats'));

        // Only valid if the value is 'dogs'.
        input.validator = 'dogs-only';
        assert.isFalse(input.validate('cats'));
        assert.isTrue(input.validate('dogs'));
      });

    });

  