

      suite('basic', function() {

        test('setting bindValue sets textarea value', function() {
          var autogrow = fixture('basic');
          var textarea = autogrow.textarea;

          autogrow.bindValue = 'batman';
          assert.equal(textarea.value, autogrow.bindValue, 'textarea value equals to bindValue');
        });

        test('can set an initial bindValue', function() {
          var autogrow = fixture('has-bindValue');
          assert.equal(autogrow.textarea.value, 'foobar', 'textarea value equals to initial bindValue');
          assert.equal(autogrow.value, 'foobar', 'value equals to initial bindValue');
        });

        test('can set an initial value', function() {
          var autogrow = fixture('has-value');
          assert.equal(autogrow.textarea.value, 'foobar', 'textarea value equals to initial bindValue');
          assert.equal(autogrow.bindValue, 'foobar', 'textarea bindValue equals to initial value');
        });

        test('can update the value', function() {
          var autogrow = fixture('has-bindValue');
          assert.equal(autogrow.textarea.value, 'foobar', 'textarea value equals to initial bindValue');
          autogrow.value = 'batman';
          assert.equal(autogrow.textarea.value, 'batman', 'textarea value is updated');
          assert.equal(autogrow.bindValue, 'batman', 'bindValue is updated');
          assert.equal(autogrow.value, 'batman', 'value is updated');
        });

        test('can update the bindValue', function() {
          var autogrow = fixture('has-bindValue');
          assert.equal(autogrow.textarea.value, 'foobar', 'textarea value equals to initial bindValue');
          autogrow.bindValue = 'batman';
          assert.equal(autogrow.textarea.value, 'batman', 'textarea value is updated');
          assert.equal(autogrow.bindValue, 'batman', 'bindValue is updated');
          assert.equal(autogrow.value, 'batman', 'value is updated');
        });

        test('can set an initial number of rows', function() {
          var autogrow = fixture("rows");
          assert.equal(autogrow.textarea.rows, 3, 'textarea has rows=3');
        });

        test('adding rows grows the textarea', function() {
          var autogrow = fixture('basic');
          var initialHeight = autogrow.offsetHeight;

          autogrow.bindValue = 'batman\nand\nrobin';
          var finalHeight = autogrow.offsetHeight
          assert.isTrue(finalHeight > initialHeight);
        });

        test('removing rows shrinks the textarea', function() {
          var autogrow = fixture('basic');
          autogrow.bindValue = 'batman\nand\nrobin';
          var initialHeight = autogrow.offsetHeight;

          autogrow.bindValue = 'batman';
          var finalHeight = autogrow.offsetHeight
          assert.isTrue(finalHeight < initialHeight);
        });

        test('an undefined bindValue is the empty string', function() {
          var autogrow = fixture('basic');
          var initialHeight = autogrow.offsetHeight;

          autogrow.bindValue = 'batman\nand\nrobin';
          var finalHeight = autogrow.offsetHeight;
          assert.isTrue(finalHeight > initialHeight);

          autogrow.bindValue = undefined;
          assert.equal(autogrow.offsetHeight, initialHeight);
          assert.equal(autogrow.textarea.value, '');
        });

        test('textarea selection works', function() {
          var autogrow = fixture('basic');
          var textarea = autogrow.textarea;
          autogrow.bindValue = 'batman\nand\nrobin';

          autogrow.selectionStart = 3;
          autogrow.selectionEnd = 5;

          assert.equal(textarea.selectionStart, 3);
          assert.equal(textarea.selectionEnd, 5);
        });
      });

      suite('focus/blur events', function() {
        var input;

        setup(function() {
          input = fixture('basic');
        });

        test('focus/blur events fired on host element', function(done) {
          var nFocusEvents = 0;
          var nBlurEvents = 0;
          input.addEventListener('focus', function() {
            nFocusEvents += 1;
            // setTimeout to wait for potentially more, erroneous events
            setTimeout(function() {
              assert.equal(nFocusEvents, 1, 'one focus event fired');
              MockInteractions.blur(input.textarea);
            });
          });
          input.addEventListener('blur', function() {
            nBlurEvents += 1;
            // setTimeout to wait for potentially more, erroneous events
            setTimeout(function() {
              assert.equal(nBlurEvents, 1, 'one blur event fired');
              done();
            });
          });
          MockInteractions.focus(input.textarea);
        });

      });

      suite('validation', function() {
        test('a required textarea with no text is invalid', function() {
          var input = fixture('basic');
          input.required = true;
          assert.isFalse(input.validate());

          input.bindValue = 'batman';
          assert.isTrue(input.validate());
        });
      });

    