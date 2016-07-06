

    function getTransform(node) {
      var style = getComputedStyle(node);
      return style.transform || style.webkitTransform;
    }

    suite('basic', function() {
      test('can be created imperatively', function() {
        var container = document.createElement('paper-input-container');
        var input = document.createElement('input', 'iron-input');
        input.className = 'paper-input-input';
        input.id = 'input';

        var label = document.createElement('label');
        label.innerHTML = 'label';

        Polymer.dom(container).appendChild(label);
        Polymer.dom(container).appendChild(input);

        document.body.appendChild(container);
        assert.isOk(container);
        document.body.removeChild(container);
      });
    });

    suite('label position', function() {

      test('label is visible by default', function() {
        var container = fixture('basic');
        assert.equal(getComputedStyle(container.querySelector('#l')).visibility, 'visible', 'label has visibility:visible');
      });

      test('label is floated if value is initialized to not null', function(done) {
        var container = fixture('has-value');
        requestAnimationFrame(function() {
          assert.notEqual(getTransform(container.querySelector('#l')), 'none', 'label has transform');
          done();
        });
      });

      test('label is invisible if no-label-float and value is initialized to not null', function() {
        var container = fixture('no-float-has-value');
        assert.equal(getComputedStyle(container.querySelector('#l')).visibility, 'hidden', 'label has visibility:hidden');
      });

      test('label is floated if always-float-label is true', function() {
        var container = fixture('always-float');
        assert.notEqual(getTransform(container.querySelector('#l')), 'none', 'label has transform');
      });

      test('label is floated correctly with a prefix', function(done) {
        var container = fixture('prefix');
        var label = Polymer.dom(container).querySelector('#l');
        var input = Polymer.dom(container).querySelector('#i');

        // Label is initially visible.
        assert.equal(getComputedStyle(label).visibility, 'visible', 'label has visibility:visible');

        // After entering text, the label floats, and it is not indented.
        input.bindValue = 'foobar';
        requestAnimationFrame(function() {
          assert.notEqual(getTransform(label), 'none', 'label has transform');
          assert.equal(label.getBoundingClientRect().left, container.getBoundingClientRect().left);
          done();
        });
      });

      test('label is floated correctly with a prefix and prefilled value', function(done) {
        var container = fixture('prefix-has-value');
        var label = Polymer.dom(container).querySelector('#l');

        // The label floats, and it is not indented.
        requestAnimationFrame(function() {
          assert.notEqual(getTransform(label), 'none', 'label has transform');
          assert.equal(label.getBoundingClientRect().left, container.getBoundingClientRect().left);
          done();
        });
      });

    });

    suite('focused styling', function() {

      test('label is colored when input is focused and has value', function(done) {
        var container = fixture('has-value');
        var label = Polymer.dom(container).querySelector('#l');
        var input = Polymer.dom(container).querySelector('#i');
        var inputContent = Polymer.dom(container.root).querySelector('.input-content');
        MockInteractions.focus(input);
        requestAnimationFrame(function() {
          assert.isTrue(container.focused, 'focused is true');
          assert.isTrue(inputContent.classList.contains('label-is-highlighted'), 'label is highlighted when input has focus');
          done();
        });
      });

      test('label is not colored when input is focused and has null value', function(done) {
        var container = fixture('basic');
        var label = Polymer.dom(container).querySelector('#l');
        var input = Polymer.dom(container).querySelector('#i');
        var inputContent = Polymer.dom(container.root).querySelector('.input-content');
        MockInteractions.focus(input);
        requestAnimationFrame(function() {
          assert.isFalse(inputContent.classList.contains('label-is-highlighted'), 'label is not highlighted when input has focus and has null value');
          done();
        });
      });

      test('underline is colored when input is focused', function(done) {
        var container = fixture('basic');
        var input = Polymer.dom(container).querySelector('#i');
        var line = Polymer.dom(container.root).querySelector('.underline');
        assert.isFalse(line.classList.contains('is-highlighted'), 'line is not highlighted when input is not focused');
        MockInteractions.focus(input);
        requestAnimationFrame(function() {
          assert.isTrue(line.classList.contains('is-highlighted'), 'line is highlighted when input is focused');
          done();
        });
      });

    });

    suite('validation', function() {

      test('styled when the input is set to an invalid value with auto-validate', function() {
        var container = fixture('auto-validate-numbers');
        var input = Polymer.dom(container).querySelector('#i');
        var inputContent = Polymer.dom(container.root).querySelector('.input-content');
        var line = Polymer.dom(container.root).querySelector('.underline');

        input.bindValue = 'foobar';

        assert.isTrue(container.invalid, 'invalid is true');
        assert.isTrue(inputContent.classList.contains('is-invalid'), 'label has invalid styling when input is invalid');
        assert.isTrue(line.classList.contains('is-invalid'), 'underline has invalid styling when input is invalid');
      });

      test('styled when the input is set to an invalid value with auto-validate, with validator', function() {
        var container = fixture('auto-validate-validator');
        var input = Polymer.dom(container).querySelector('#i');
        var inputContent = Polymer.dom(container.root).querySelector('.input-content');
        var line = Polymer.dom(container.root).querySelector('.underline');

        input.bindValue = '123123';

        assert.isTrue(container.invalid, 'invalid is true');
        assert.isTrue(inputContent.classList.contains('is-invalid'), 'label has invalid styling when input is invalid');
        assert.isTrue(line.classList.contains('is-invalid'), 'underline has invalid styling when input is invalid');
      });

      test('styled when the input is set initially to an invalid value with auto-validate, with validator', function() {
        var container = fixture('auto-validate-validator-has-invalid-value');
        assert.isTrue(container.invalid, 'invalid is true');
        assert.isTrue(Polymer.dom(container.root).querySelector('.underline').classList.contains('is-invalid'), 'underline has is-invalid class');
      });

      test('styled when the input is set to an invalid value with manual validation', function() {
        var container = fixture('manual-validate-numbers');
        var input = Polymer.dom(container).querySelector('#i');
        var inputContent = Polymer.dom(container.root).querySelector('.input-content');
        var line = Polymer.dom(container.root).querySelector('.underline');

        input.bindValue = 'foobar';
        input.validate();

        assert.isTrue(container.invalid, 'invalid is true');
        assert.isTrue(inputContent.classList.contains('is-invalid'), 'label has invalid styling when input is invalid');
        assert.isTrue(line.classList.contains('is-invalid'), 'underline has invalid styling when input is invalid');
      });

    });

  