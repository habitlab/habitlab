
    suite('a11y', function() {
      var slider;

      setup(function() {
        slider = fixture('trivialSlider');
      });

      test('has aria role "slider"', function(done) {
        flush(function() {
          assert.equal(slider.getAttribute('role'), 'slider');
          assert.equal(slider.getAttribute('aria-valuemin'), slider.min);
          assert.equal(slider.getAttribute('aria-valuemax'), slider.max);
          assert.equal(slider.getAttribute('aria-valuenow'), slider.value);
          done();
        });
      });

      test('ripple is added after keyboard event on knob', function() {
        assert.isFalse(slider.hasRipple());
        MockInteractions.down(slider.$.sliderKnob);
        assert.isTrue(slider.hasRipple());
      });

      test('interacting without keyboard causes no ripple', function() {
        MockInteractions.focus(slider);
        MockInteractions.down(slider.$.sliderKnob);
        var ripple = slider.getRipple();
        assert.equal(ripple.offsetHeight, 0);
        assert.equal(ripple.offsetWidth, 0);
      });

      test('interacting with keyboard causes ripple', function() {
        MockInteractions.focus(slider);
        MockInteractions.pressSpace(slider.$.sliderKnob);
        var ripple = slider.getRipple();
        assert.isAbove(ripple.offsetHeight, 0);
        assert.isAbove(ripple.offsetWidth, 0);
      });

      test('slider has focus after click event on bar"', function() {
        var focusSpy = sinon.spy(slider, 'focus');
        MockInteractions.down(slider.$.sliderBar);
        assert.isTrue(focusSpy.called);
      });

      test('slider increments on up key"', function() {
        var oldValue = slider.value;
        var up = MockInteractions.keyboardEventFor('keydown', 38);
        slider.dispatchEvent(up);
        assert.equal(oldValue + slider.step, slider.value);
        assert.isTrue(up.defaultPrevented);
      });

      test('slider increments on right key', function() {
        var oldValue = slider.value;
        var up = MockInteractions.keyboardEventFor('keydown', 39);
        slider.dispatchEvent(up);
        assert.equal(oldValue + slider.step, slider.value);
        assert.isTrue(up.defaultPrevented);
      });

      test('slider decrements on left key', function() {
        var oldValue = slider.value;
        var down = MockInteractions.keyboardEventFor('keydown', 37);
        slider.dispatchEvent(down);
        assert.equal(oldValue - slider.step, slider.value);
        assert.isTrue(down.defaultPrevented);
      });

      test('slider decrements on down key"', function() {
        var oldValue = slider.value;
        var down = MockInteractions.keyboardEventFor('keydown', 40);
        slider.dispatchEvent(down);
        assert.equal(oldValue - slider.step, slider.value);
        assert.isTrue(down.defaultPrevented);
      });

      test('slider does not change on key when disabled"', function() {
        slider.disabled = true;
        var oldValue = slider.value;
        var up = MockInteractions.keyboardEventFor('keydown', 38);
        slider.dispatchEvent(up);
        assert.equal(oldValue, slider.value);
        assert.isFalse(up.defaultPrevented);
      });

      a11ySuite('trivialSlider');
    });

  