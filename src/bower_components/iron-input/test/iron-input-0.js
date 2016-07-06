

    suite('basic', function() {

      test('setting bindValue sets value', function() {
        var input = fixture('basic');
        input.bindValue = 'foobar';
        assert.equal(input.value, input.bindValue, 'value equals to bindValue');
      });

      test('changing the input triggers an event', function(done) {
        var input = fixture('basic');

        input.addEventListener('bind-value-changed', function(value) {
          assert.equal(input.value, input.bindValue, 'value equals to bindValue');
          done();
        });

        input.value = "foo";
        input._onInput();
      });

      test('default value sets bindValue', function() {
        var input = fixture('has-value');
        assert.equal(input.bindValue, input.value, 'bindValue equals value');
      });

      test('default bindValue sets value', function() {
        var input = fixture('has-bind-value');
        assert.equal(input.value, input.bindValue, 'value equals to bindValue');
      });

      test('set bindValue to undefined', function() {
        var scope = document.getElementById('bind-to-object');
        scope.foo = undefined;
        assert.ok(!scope.$.input.bindValue, 'bindValue is falsy');
        assert.ok(!scope.$.input.value, 'value is falsy');
      });

      test('can validate using a complex regex', function() {
        var input = fixture('no-validator');
        input.value = '123';
        input.validate();
        assert.isTrue(input.invalid, 'input is invalid');
        input.value = 'foo';
        input.validate();
        assert.isFalse(input.invalid, 'input is valid');
        input.value = 'foo123';
        input.validate();
        assert.isFalse(input.invalid, 'input is valid');
      });

      test('set bindValue to false', function() {
        var scope = document.getElementById('bind-to-object');
        scope.foo = false;
        assert.isFalse(scope.$.input.bindValue);
        assert.equal(scope.$.input.value, 'false');
      });

      test('validator used instead of constraints api if provided', function() {
        var input = fixture('has-validator')[1];
        input.value = '123';
        input.validate();
        assert.isTrue(input.invalid, 'input is invalid');
      });

      test('prevent invalid input works in _onInput', function() {
        var input = fixture('prevent-invalid-input');
        input.value = '123';
        input._onInput();
        assert.equal(input.bindValue, '123');

        input.value = '123foo';
        input._onInput();
        assert.equal(input.bindValue, '123');
      });

      test('inputs can be validated', function() {
        var input = fixture('prevent-invalid-input-with-pattern');
        input.value = '123';
        input._onInput();
        assert.equal(input.bindValue, '123');
        input.validate();
        assert.isTrue(input.invalid, 'input is invalid');

        input.value = 'foo';
        input._onInput();
        assert.equal(input.bindValue, 'foo');
        input.validate();
        assert.isFalse(input.invalid, 'input is valid');

        input.value = 'foo123';
        input._onInput();
        assert.equal(input.bindValue, 'foo123');
        input.validate();
        assert.isFalse(input.invalid, 'input is valid');
      });

      test('prevent invalid input works automatically when allowed pattern is set', function() {
        var input = fixture('automatically-prevent-invalid-input-if-allowed-pattern');
        input.value = '123';
        input._onInput();
        assert.equal(input.bindValue, '123');

        input.value = '123foo';
        input._onInput();
        assert.equal(input.bindValue, '123');

        input.allowedPattern = '';
        input.value = '#123foo BAR!';
        input._onInput();
        assert.equal(input.bindValue, '#123foo BAR!');

        input.allowedPattern = '[a-zA-Z]';
        input.value = 'foo';
        input._onInput();
        input.value = 'bar123';
        input._onInput();
        assert.equal(input.bindValue, 'foo');
      });

      test('disabled input doesn\'t throw on Firefox', function() {
        var el = fixture('disabled-input');
        var input = el.$.input;

        assert.equal(input.bindValue, 'foo');

        assert.isFalse(el.myInvalid);
        assert.isTrue(input.disabled);
      });

      test('browser validation beats custom validation', function() {
        var input = fixture('native-and-custom-validator')[1];
        // The input allows any letters, but the browser only allows one
        // of [abc].
        input.value = 'aaaa';
        input.validate();
        assert.isFalse(input.invalid, 'input is valid');

        // The validator allows this, but the browser doesn't.
        input.value = 'zzz';
        input.validate();
        assert.isTrue(input.invalid, 'input is invalid');
      });
    });

    suite('a11y', function() {
      test('announces invalid characters when _onInput is called', function() {
        var input = fixture('prevent-invalid-input');
        input.addEventListener('iron-announce', function(event) {
          assert.equal(event.detail.text, 'Invalid string of characters not entered.');
        });
        input.value = 'foo';
        input._onInput();
      });

      test('announces invalid characters on keypress', function() {
        var input = fixture('prevent-invalid-input');
        input.addEventListener('iron-announce', function(event) {
          assert.equal(event.detail.text, 'Invalid character a not entered.');
        });

        // Simulate key press event.
        var event = new CustomEvent('keypress', {
          bubbles: true,
          cancelable: true
        });
        event.charCode = 97 /* a */;
        input.dispatchEvent(event);
      });
    });
  