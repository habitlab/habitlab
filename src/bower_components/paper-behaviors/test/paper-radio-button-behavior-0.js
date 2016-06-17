
    suite('basic', function() {
      var button;

      setup(function() {
        button = fixture('basic');
        MockInteractions.blur(button);
      });

      test('normal (no states)', function() {
        assert.isFalse(button.focused);
        assert.isFalse(button.hasRipple());
      });

      test('receives focus', function() {
        MockInteractions.focus(button);

        assert.isTrue(button.focused);
        assert.isTrue(button.hasRipple());
      });

    });
  