
    HTMLImports.whenReady(function() {
      Polymer({
        is: 'test-checked',
        behaviors: [
          Polymer.PaperCheckedElementBehavior
        ]
      });
    });
    
    suite('PaperCheckedElementBehavior', function() {
      var checked;

      setup(function() {
        checked = fixture('basic');
      });

      test('element checked when tapped to check', function() {
        MockInteractions.tap(checked);
        assert.isTrue(checked.checked);
      });

      test('element checked when active', function() {
        checked.active = true;
        assert.isTrue(checked.checked);
      });

      test('element not checked when disabled and made active', function() {
        checked.disabled = true;
        checked.active = true;
        assert.isFalse(checked.checked);
      });

      test('element not checked when disabled and tapped', function() {
        checked.disabled = true;
        MockInteractions.tap(checked);
        assert.isFalse(checked.checked);
      });

      test('element ripple has checked attribute when element tapped to check', function() {
        MockInteractions.tap(checked);
        assert.isTrue(checked.hasRipple());
        assert.isTrue(checked.getRipple().hasAttribute('checked'));
      });

      test('element ripple does not have checked attribute when element tapped to uncheck', function() {
        MockInteractions.tap(checked);
        MockInteractions.tap(checked);
        assert.isFalse(checked.getRipple().hasAttribute('checked'));
      });

    });
  