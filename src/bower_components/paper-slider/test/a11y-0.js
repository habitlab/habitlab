
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

      a11ySuite('trivialSlider');

    });

  