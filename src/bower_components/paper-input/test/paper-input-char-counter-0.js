

    suite('basic', function() {

      test('character counter shows the value length', function() {
        var container = fixture('counter');
        var input = Polymer.dom(container).querySelector('#i');
        var counter = Polymer.dom(container).querySelector('#c');
        assert.equal(counter._charCounterStr, input.value.length, 'character counter shows input value length');
      });

      test('character counter shows the value length with maxlength', function() {
        var container = fixture('counter-with-max');
        var input = Polymer.dom(container).querySelector('#i');
        var counter = Polymer.dom(container).querySelector('#c');
        assert.equal(counter._charCounterStr, input.value.length + '/' + input.maxLength, 'character counter shows input value length and maxLength');
      });

      test('character counter shows the value length with maxlength', function() {
        var input = fixture('textarea-with-max');
        forceXIfStamp(input);

        var counter = Polymer.dom(input.root).querySelector('paper-input-char-counter');
        assert.ok(counter, 'paper-input-char-counter exists');

        assert.equal(counter._charCounterStr, input.value.length + '/' + input.inputElement.textarea.getAttribute('maxlength'), 'character counter shows input value length and maxLength');
      });

      test('character counter counts new lines in textareas correctly', function() {
        var input = fixture('textarea');
        input.value = 'foo\nbar';
        forceXIfStamp(input);

        var counter = Polymer.dom(input.root).querySelector('paper-input-char-counter')
        assert.ok(counter, 'paper-input-char-counter exists');

        assert.equal(counter._charCounterStr, input.value.length, 'character counter shows the value length');
      });

    });

  