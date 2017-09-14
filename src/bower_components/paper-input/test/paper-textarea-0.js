

    suite('basic', function() {

      test('setting value sets the input value', function() {
        var input = fixture('basic');
        input.value = 'foobar';
        assert.equal(input.inputElement.bindValue, input.value, 'inputElement value equals input.value');
      });

      test('empty required input shows error', function(done) {
        var input = fixture('required');

        // Need to wait a tick to stamp the error message.
        Polymer.Base.async(function() {
          var error = Polymer.dom(input.root).querySelector('paper-input-error');
          assert.ok(error, 'paper-input-error exists');
          assert.notEqual(getComputedStyle(error).display, 'none', 'error is not display:none');
          done();
        }, 1);
      });

      test('caret position is preserved', function() {
        var input = fixture('basic');
        var ironTextarea = Polymer.dom(input.root).querySelector('iron-autogrow-textarea');
        input.value = 'nananana';
        ironTextarea.selectionStart = 2;
        ironTextarea.selectionEnd = 2;

        input.updateValueAndPreserveCaret('nanananabatman');

        assert.equal(ironTextarea.selectionStart, 2, 'selectionStart is preserved');
        assert.equal(ironTextarea.selectionEnd, 2, 'selectionEnd is preserved');
      });

      test('input attributes are bound to textarea', function() {
        var input = fixture('basic');
        var attrs = {
          'autocomplete': 'true',
          'autofocus': true,
          'inputmode': 'number',
          'name': 'foo',
          'placeholder': 'bar',
          'readonly': true,
          'required': true,
          'maxlength': 3
        };
        for (var attr in attrs) {
          input[attr] = attrs[attr];
        }
        for (var attr in attrs) {
          var inputAttr = input.inputElement.getAttribute(attr);
          if (typeof attrs[attr] === 'boolean') {
            assert.equal(inputAttr !== null, attrs[attr], 'attribute "' + attr + '" is equal to property (' + attrs[attr] + ', ' + inputAttr !== null + ')');
          } else {
            assert.equal(inputAttr, attrs[attr], 'attribute "' + attr + '" is equal to property (' + attrs[attr] + ', ' + inputAttr + ')');
          }
        }
      });

      test('always-float-label attribute works', function() {
        var input = fixture('always-float-label');
        var container = Polymer.dom(input.root).querySelector('paper-input-container');
        var inputContent = Polymer.dom(container.root).querySelector('.input-content');
        assert.isTrue(inputContent.classList.contains('label-is-floating'), 'label is floating');
      });

      test('label does not receive pointer events', function() {
        var input = fixture('always-float-label');
        var label = Polymer.dom(input.root).querySelector('label');
        assert.equal(getComputedStyle(label).pointerEvents, 'none');
      });

      test('no extra space between input and underline', function() {
        var input = fixture('label');
        var container = Polymer.dom(input.root).querySelector('paper-input-container');
        var inputContent = Polymer.dom(container.root).querySelector('.input-content');
        var ironTextarea = Polymer.dom(input.root).querySelector('iron-autogrow-textarea');
        assert.equal(inputContent.clientHeight,ironTextarea.clientHeight, 'container and textarea are same height');
      });
    });

    suite('focus/blur events', function() {
      var input;

      setup(function() {
        input = fixture('basic');
      });

      // At the moment, it is very hard to correctly fire exactly
      // one focus/blur events on a paper-textarea. This is because
      // when a paper-textarea is focused, it needs to focus
      // its underlying native textarea, which will also fire a `blur`
      // event.
      test('focus events fired on host element', function() {
        input.addEventListener('focus', function(event) {
          assert(input.focused, 'input is focused');
        });
        MockInteractions.focus(input);
      });

      test('focus events fired on host element if nested element is focused', function() {
        input.addEventListener('focus', function(event) {
          assert(input.focused, 'input is focused');
        });
        MockInteractions.focus(input.inputElement.textarea);
      });

      // TODO(notwaldorf): Re-enable this test when
      // https://github.com/webcomponents/shadydom/issues/126 is fixed.
      // test('blur events fired on host element', function() {
      //   MockInteractions.focus(input);
      //   input.addEventListener('blur', function(event) {
      //     assert(!input.focused, 'input is blurred');
      //   });
      //   MockInteractions.blur(input);
      // });

      // TODO(notwaldorf): Re-enable this test when
      // https://github.com/webcomponents/shadydom/issues/126 is fixed.
      // test('blur events fired on host element nested element is blurred', function() {
      //   MockInteractions.focus(input);
      //   input.addEventListener('blur', function(event) {
      //     assert(!input.focused, 'input is blurred');
      //   });
      //   MockInteractions.blur(input.inputElement.textarea);
      // });

      // TODO(notwaldorf): Re-enable this test when
      // https://github.com/webcomponents/shadydom/issues/126 is fixed.
      // test('focusing then bluring sets the focused attribute correctly', function() {
      //   MockInteractions.focus(input);
      //   assert(input.focused, 'input is focused');
      //   MockInteractions.blur(input);
      //   assert(!input.focused, 'input is blurred');
      //   MockInteractions.focus(input.inputElement.textarea);
      //   assert(input.focused, 'input is focused');
      //   MockInteractions.blur(input.inputElement.textarea);
      //   assert(!input.focused, 'input is blurred');
      // });
    });

    suite('a11y', function() {

      test('has aria-labelledby', function() {
        var input = fixture('label');
        assert.isTrue(input.inputElement.textarea.hasAttribute('aria-labelledby'))
        assert.equal(input.inputElement.textarea.getAttribute('aria-labelledby'), Polymer.dom(input.root).querySelector('label').id, 'aria-labelledby points to the label');
      });

      test('has aria-describedby for error message', function(done) {
        var input = fixture('required');

        // Need to wait a tick to stamp the error message.
        Polymer.Base.async(function() {
          assert.isTrue(input.inputElement.textarea.hasAttribute('aria-describedby'));
          assert.equal(input.inputElement.textarea.getAttribute('aria-describedby'), Polymer.dom(input.root).querySelector('paper-input-error').id, 'aria-describedby points to the error message');
          done();
        }, 1);
      });

      test('has aria-describedby for character counter', function(done) {
        var input = fixture('char-counter');

        // Need to wait a tick to stamp the char-counter.
        Polymer.Base.async(function() {
          assert.isTrue(input.inputElement.textarea.hasAttribute('aria-describedby'));
          assert.equal(input.inputElement.textarea.getAttribute('aria-describedby'), Polymer.dom(input.root).querySelector('paper-input-char-counter').id, 'aria-describedby points to the character counter');
          done();
        }, 1);
      });

      test('has aria-describedby for character counter and error', function(done) {
        var input = fixture('required-char-counter');

        // Need to wait a tick to stamp the char-counter and error message.
        Polymer.Base.async(function() {
          assert.isTrue(input.inputElement.textarea.hasAttribute('aria-describedby'));
          var ariaDescribedBy = input.inputElement.textarea.getAttribute('aria-describedby');

          assert.notEqual(ariaDescribedBy.indexOf(Polymer.dom(input.root).querySelector('paper-input-error').id, -1,
              'aria-describedby points to the error message'));
          assert.notEqual(ariaDescribedBy.indexOf(Polymer.dom(input.root).querySelector('paper-input-char-counter').id, -1,
              'aria-describedby points to the character counter'));
          done();
        }, 1);
      });
    });
  