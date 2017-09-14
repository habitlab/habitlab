
    suite('<paper-slider>', function() {
      var slider;

      setup(function() {
        slider = fixture('rtlProgress');
      });

      test('snap to the correct value on tapping', function(done) {
        var cursor = MockInteractions.topLeftOfNode(slider.$.sliderBar);
        cursor.x += slider.$.sliderBar.getBoundingClientRect().width * 0.9;

        slider.min = 0;
        slider.max = 2;
        slider.step = 1;
        slider.value = 2;

        MockInteractions.down(slider.$.sliderBar, cursor);

        flush(function() {
          assert.equal(slider.value, slider.min);
          done();
        });
      });

      test('tracking', function(done) {
        var sliderWidth = slider.$.sliderBar.getBoundingClientRect().width;
        slider.min = 0;
        slider.max = 2;
        slider.step = 1;
        slider.value = 2;

        MockInteractions.track(slider.$.sliderBar, sliderWidth * 0.9, 0);

        flush(function() {
          assert.equal(slider.value, slider.min);
          done();
        });
      });

      test('slider increments on up key', function() {
        var oldValue = slider.value;
        var up = MockInteractions.keyboardEventFor('keydown', 38);
        slider.dispatchEvent(up);
        assert.equal(oldValue + slider.step, slider.value);
        assert.isTrue(up.defaultPrevented);
      });

      test('slider increments on left key', function() {
        var oldValue = slider.value;
        var up = MockInteractions.keyboardEventFor('keydown', 37);
        slider.dispatchEvent(up);
        assert.equal(oldValue + slider.step, slider.value);
        assert.isTrue(up.defaultPrevented);
      });

      test('slider decrements on right key', function() {
        var oldValue = slider.value;
        var down = MockInteractions.keyboardEventFor('keydown', 39);
        slider.dispatchEvent(down);
        assert.equal(oldValue - slider.step, slider.value);
        assert.isTrue(down.defaultPrevented);
      });

      test('slider decrements on down key', function() {
        var oldValue = slider.value;
        var down = MockInteractions.keyboardEventFor('keydown', 40);
        slider.dispatchEvent(down);
        assert.equal(oldValue - slider.step, slider.value);
        assert.isTrue(down.defaultPrevented);
      });
    });

  