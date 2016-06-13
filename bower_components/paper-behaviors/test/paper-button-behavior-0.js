
    suite('basic', function() {
      var button;

      setup(function() {
        button = fixture('basic');
      });

      test('normal (no states)', function() {
        assert.equal(button.elevation, 1);
      });

      test('set disabled property', function() {
        button.disabled = true;
        assert.equal(button.elevation, 0);
      });

      test('pressed and released', function() {
        MockInteractions.down(button);
        assert.equal(button.elevation, 4);
        MockInteractions.up(button);
        assert.equal(button.elevation, 1);
        assert.ok(button.hasRipple());
      });

      suite('a button with toggles', function() {
        setup(function() {
          button.toggles = true;
        });

        test('activated by tap', function(done) {
          MockInteractions.downAndUp(button, function() {
            try {
              assert.equal(button.elevation, 4);
              assert.ok(button.hasRipple());
              done();
            } catch (e) {
              done(e);
            }
          });
        });
      });

      test('receives focused', function() {
        MockInteractions.focus(button);
        assert.equal(button.elevation, 3);
        assert.ok(button.hasRipple());
      });

      test('space key', function(done) {
        const SPACE_KEY_CODE = 32;
        var ripple;
        MockInteractions.focus(button);

        assert.ok(button.hasRipple());

        ripple = button.getRipple();
        MockInteractions.keyDownOn(button, SPACE_KEY_CODE);

        assert.equal(ripple.ripples.length, 1);

        MockInteractions.keyDownOn(button, SPACE_KEY_CODE);

        assert.equal(ripple.ripples.length, 1);

        MockInteractions.keyUpOn(button, SPACE_KEY_CODE);

        var transitionEndCalled = false;
        ripple.addEventListener('transitionend', function() {
          if (!transitionEndCalled) {
            transitionEndCalled = true;
            assert.equal(ripple.ripples.length, 0);
            done();
          }
        });
      });
    });
  