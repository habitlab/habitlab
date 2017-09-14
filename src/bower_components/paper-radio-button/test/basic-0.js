
    function afterNextRenderAll(elements, callback) {
      var renderedCount = 0;

      function elementRendered() {
        renderedCount++;
        if (renderedCount === elements.length) {
          callback();
        }
      }

      elements.forEach(function(element) {
        Polymer.RenderStatus.afterNextRender(element, elementRendered);
      });
    }

    suite('defaults', function() {
      var r1;

      setup(function() {
        r1 = fixture('NoLabel');
      });

      test('check button via click', function(done) {
        r1.addEventListener('click', function() {
          assert.isTrue(r1.getAttribute('aria-checked') == 'true');
          assert.isTrue(r1.checked);
          done();
        });
        MockInteractions.tap(r1);
      });

      test('toggle button via click', function(done) {
        r1.checked = true;
        r1.addEventListener('click', function() {
          assert.isFalse(r1.getAttribute('aria-checked') == 'true');
          assert.isFalse(r1.checked);
          done();
        });
        MockInteractions.tap(r1);
      });

      test('disabled button cannot be clicked', function(done) {
        r1.disabled = true;
        r1.checked = true;
        MockInteractions.tap(r1);

        setTimeout(function() {
          assert.isTrue(r1.getAttribute('aria-checked') == 'true');
          assert.isTrue(r1.checked);
          done();
        }, 1);
      });

      test('can be styled with different sizes', function(done) {
        var radioButtons = fixture('WithDifferentSizes');
        // Wait for all radio buttons to set their default ink sizes, if any.
        // See polymer#4009 for more details.
        afterNextRenderAll(radioButtons, function() {
          var small = radioButtons[0].getBoundingClientRect();
          var medium = radioButtons[1].getBoundingClientRect();
          var large = radioButtons[2].getBoundingClientRect();

          console.log(small.width, medium.width, large.width);

          assert.isTrue(4 < small.height);
          assert.isTrue(small.height < medium.height);
          assert.isTrue(medium.height < large.height);
          assert.isTrue(large.height < 72);

          assert.isTrue(4 < small.width);
          assert.isTrue(small.width < medium.width);
          assert.isTrue(medium.width < large.width);
          assert.isTrue(large.width < 72);
          done();
        });
      });
    });

    suite('ink size', function() {
      var radioButtons;

      setup(function(done) {
        radioButtons = fixture('WithDifferentSizes');
        // Wait for all radio buttons to set their default ink sizes, if any.
        // See polymer#4009 for more details.
        afterNextRenderAll(radioButtons, done);
      });

      test('`--paper-radio-button-ink-size` sets the ink size', function() {
        var radioButton = fixture('CustomInkSize');
        assert.equal(radioButton.getComputedStyleValue('--calculated-paper-radio-button-size').trim(), '25px');
        assert.equal(radioButton.getComputedStyleValue('--calculated-paper-radio-button-ink-size').trim(), '30px');
      });

      test('ink sizes are near (3 * radio button size) by default', function() {
        radioButtons.forEach(function(radioButton) {
          var size = parseFloat(radioButton.getComputedStyleValue('--calculated-paper-radio-button-size'), 10);
          var inkSize = parseFloat(radioButton.getComputedStyleValue('--calculated-paper-radio-button-ink-size'), 10);
          assert.approximately(inkSize / size, 3, 0.1);
        });
      });

      test('ink sizes are integers', function() {
        radioButtons.forEach(function(radioButton) {
          var unparsedInkSize = radioButton.getComputedStyleValue('--calculated-paper-radio-button-ink-size');
          var floatInkSize = parseFloat(unparsedInkSize, 10);
          var intInkSize = parseInt(unparsedInkSize, 10);
          assert.equal(floatInkSize, intInkSize);
        });
      });

      test('ink size parity matches radio button size parity (centers are aligned)', function() {
        radioButtons.forEach(function(radioButton) {
          var size = parseInt(radioButton.getComputedStyleValue('--calculated-paper-radio-button-size'), 10);
          var inkSize = parseInt(radioButton.getComputedStyleValue('--calculated-paper-radio-button-ink-size'), 10);
          assert.equal(size % 2, inkSize % 2);
        });
      });
    });

    suite('a11y', function() {
      var r1;
      var r2;

      setup(function() {
        r1 = fixture('NoLabel');
        r2 = fixture('WithLabel');
      });

      test('has aria role "radio"', function() {
        assert.isTrue(r1.getAttribute('role') == 'radio');
        assert.isTrue(r2.getAttribute('role') == 'radio');
      });

      test('button with no label has no aria label', function() {
        assert.isTrue(!r1.getAttribute('aria-label'));
      });

      test('button respects the user set aria-label', function() {
        var c = fixture('AriaLabel');
        assert.isTrue(c.getAttribute('aria-label') == "Batman");
      });

      a11ySuite('NoLabel');
      a11ySuite('WithLabel');
      a11ySuite('AriaLabel');
    });
  