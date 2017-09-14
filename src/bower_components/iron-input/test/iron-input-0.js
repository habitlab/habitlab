
    function fireNativeInputEvent(input) {
      var ev = new Event('input', { bubbles: true, cancelable: true, composed: true });
      input.dispatchEvent(ev);
    }

    suite('basic', function() {
      test('can initialize programmatically', function(done) {
        var ironInput = fixture('programmatic');
        assert.isNull(ironInput.querySelector('input'));
        Polymer.dom(ironInput).appendChild(document.createElement('input'));

        // Mutation observer is async, so wait one tick.
        Polymer.Base.async(function() {
          var input = ironInput.querySelector('input');
          assert.ok(input);
          assert.ok(ironInput.inputElement);

          // Updating bind-value updates the input's value.
          ironInput.bindValue = 'foobar';
          assert.equal(input.value, ironInput.bindValue, 'input value equals to iron-input bindValue');

          // Updating the input's value updates bind-value;
          input.value = 'foo';
          fireNativeInputEvent(input);
          assert.equal(input.value, ironInput.bindValue, 'input value equals to iron-input bindValue');
          done();
        }, 1);

      });

      test('setting bindValue sets value', function(done) {
        var ironInput = fixture('basic');

        // Mutation observer is async, so wait one tick.
        Polymer.Base.async(function() {
          var input = ironInput.querySelector('input');
          ironInput.bindValue = 'foobar';
          assert.equal(input.value, ironInput.bindValue, 'input value equals to iron-input bindValue');
          done();
        }, 1);
      });

      test('changing the input triggers an event', function(done) {
        var ironInput = fixture('basic');

        // Mutation observer is async, so wait one tick.
        Polymer.Base.async(function() {
          var input = ironInput.querySelector('input');

          ironInput.addEventListener('bind-value-changed', function(value) {
            assert.equal(input.value, ironInput.bindValue, 'input value equals to iron-input bindValue');
            done();
          });

          input.value = 'foo';
          fireNativeInputEvent(input);
        }, 1);
      });

      test('default bindValue sets value', function(done) {
        var ironInput = fixture('has-bind-value');

        // Mutation observer is async, so wait one tick.
        Polymer.Base.async(function() {
          var input = ironInput.querySelector('input');
          assert.equal(ironInput.bindValue, input.value, 'input value equals to iron-input bindValue');
          done();
        }, 1);
      });

      test('set bindValue to undefined', function() {
        var domBind = document.getElementById('bind-to-object');
        var templ = document.getElementById('bind-to-object-template');

        // The data lives in a different place in Polymer 1.0 vs 2.0.
        var scope = domBind.$ ? domBind : templ;
        scope.foo = undefined;
        var ironInput = scope.$.input;
        var input = ironInput.querySelector('input');
        assert.ok(!ironInput.bindValue, 'ironInput bindValue is falsy');
        assert.ok(!input.value, 'input value is falsy');
      });

      test('set bindValue to false', function() {
        var domBind = document.getElementById('bind-to-object');
        var templ = document.getElementById('bind-to-object-template');

        // The data lives in a different place in Polymer 1.0 vs 2.0.
        var scope = domBind.$ ? domBind : templ;
        scope.foo = false;
        var ironInput = scope.$.input;
        var input = ironInput.querySelector('input');
        assert.isFalse(ironInput.bindValue);
        assert.equal(input.value, 'false');
      });

      test('prevent invalid input works after an input event', function(done) {
        var ironInput = fixture('prevent-invalid-input');

        // Mutation observer is async, so wait one tick.
        Polymer.Base.async(function() {
          var input = ironInput.querySelector('input');
          input.value = '123';
          fireNativeInputEvent(input);
          assert.equal(ironInput.bindValue, '123');

          input.value = '123foo';
          fireNativeInputEvent(input);
          assert.equal(ironInput.bindValue, '123');
          done();
        }, 1);
      });

      test('inputs can be validated', function(done) {
        var ironInput = fixture('basic-validation');

        // Mutation observer is async, so wait one tick.
        Polymer.Base.async(function() {
          var input = ironInput.querySelector('input');

          input.value = '123';
          fireNativeInputEvent(input);
          assert.equal(ironInput.bindValue, '123');
          ironInput.validate();
          assert.isTrue(ironInput.invalid, 'input is invalid');

          input.value = 'foo';
          fireNativeInputEvent(input);
          assert.equal(ironInput.bindValue, 'foo');
          ironInput.validate();
          assert.isFalse(ironInput.invalid, 'input is valid');

          input.value = 'foo123';
          fireNativeInputEvent(input);
          assert.equal(ironInput.bindValue, 'foo123');
          ironInput.validate();
          assert.isFalse(ironInput.invalid, 'input is valid');
          done();
        }, 1);
      });

      test('validator used instead of constraints api if provided', function(done) {
        var ironInput = fixture('has-validator')[1];

        // Mutation observer is async, so wait one tick.
        Polymer.Base.async(function() {
          var input = ironInput.querySelector('input');
          input.value = '123';
          fireNativeInputEvent(input);
          ironInput.validate();
          assert.isTrue(ironInput.invalid, 'input is invalid');
          done();
        }, 1);
      });

      test('browser validation beats custom validation', function(done) {
        var ironInput = fixture('native-and-custom-validator')[1];

        // Mutation observer is async, so wait one tick.
        Polymer.Base.async(function() {
          var input = ironInput.querySelector('input');

          // The input allows any letters, but the browser only allows one
          // of [abc].
          input.value = 'aaaa';
          fireNativeInputEvent(input);
          ironInput.validate();
          assert.isFalse(ironInput.invalid, 'input is valid');

          // The validator allows this, but the browser doesn't.
          input.value = 'zzz';
          fireNativeInputEvent(input);
          ironInput.validate();
          assert.isTrue(ironInput.invalid, 'input is invalid');
          done();
        }, 1);
      });

      test('prevent invalid input works automatically when allowed pattern is set', function(done) {
        var ironInput = fixture('automatically-prevent-invalid-input-if-allowed-pattern');

        // Mutation observer is async, so wait one tick.
        Polymer.Base.async(function() {
          var input = ironInput.querySelector('input');

          input.value = '123';
          fireNativeInputEvent(input);
          assert.equal(ironInput.bindValue, '123');

          input.value = '123foo';
          fireNativeInputEvent(input);
          assert.equal(ironInput.bindValue, '123');

          ironInput.allowedPattern = '';
          input.value = '#123foo BAR!';
          fireNativeInputEvent(input);
          assert.equal(ironInput.bindValue, '#123foo BAR!');

          ironInput.allowedPattern = '[a-zA-Z]';
          input.value = 'foo';
          fireNativeInputEvent(input);
          input.value = 'bar123';
          fireNativeInputEvent(input);
          assert.equal(ironInput.bindValue, 'foo');
          done();
        }, 1);
      });

      test('disabled input doesn\'t throw on Firefox', function() {
        var el = fixture('disabled');
        var ironInput = el.$.input;
        var input = ironInput.querySelector('input');

        assert.equal(ironInput.bindValue, 'foo');

        assert.isFalse(el.myInvalid);
        assert.isTrue(input.disabled);
      });
    });

    suite('a11y', function() {
      test('announces invalid characters after an input event', function(done) {
        var ironInput = fixture('prevent-invalid-input');

        // Mutation observer is async, so wait one tick.
        Polymer.Base.async(function() {
          var input = ironInput.querySelector('input');

          ironInput.addEventListener('iron-announce', function(event) {
            assert.equal(event.detail.text, 'Invalid string of characters not entered.');
          });
          input.value = 'foo';
          fireNativeInputEvent(input);
          done();
        }, 1);
      });

      test('announces invalid characters on keypress', function() {
        var ironInput = fixture('prevent-invalid-input');
        var input = ironInput.querySelector('input');

        ironInput.addEventListener('iron-announce', function(event) {
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
  