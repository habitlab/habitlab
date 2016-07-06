
    suite('basic features', function() {
      var progress;

      setup(function() {
        progress = fixture('trivialProgress');
      });

      test('check default', function() {
        assert.equal(progress.min, 0);
        assert.equal(progress.max, 100);
        assert.equal(progress.value, 0);
      });

      test('set value', function(done) {
        progress.value = 50;
        asyncPlatformFlush(function() {
          assert.equal(progress.value, 50);
          // test clamp value
          progress.value = 60.1;
          asyncPlatformFlush(function() {
            assert.equal(progress.value, 60);
            done();
          });
        });
      });

      test('set max', function(done) {
        progress.max = 10;
        progress.value = 11;
        asyncPlatformFlush(function() {
          assert.equal(progress.value, progress.max);
          done();
        });
      });

      test('test ratio', function(done) {
        progress.max = 10;
        progress.value = 5;
        asyncPlatformFlush(function() {
          assert.equal(progress.ratio, 50);
          done();
        });
      });

      test('test secondary ratio', function(done) {
        progress.max = 10;
        progress.secondaryProgress = 5;
        asyncPlatformFlush(function() {
          assert.equal(progress.secondaryRatio, 50);
          done();
        });
      });

      test('set min', function(done) {
        progress.min = 10
        progress.max = 50;
        progress.value = 30;
        asyncPlatformFlush(function() {
          assert.equal(progress.ratio, 50);
          progress.value = 0;
          asyncPlatformFlush(function() {
            assert.equal(progress.value, progress.min);
            done();
          });
        });
      });

      test('set step', function(done) {
        progress.min = 0;
        progress.max = 10;
        progress.value = 5.1;
        asyncPlatformFlush(function() {
          assert.equal(progress.value, 5);
          progress.step = 0.1;
          progress.value = 5.1;
          asyncPlatformFlush(function() {
            assert.equal(progress.value, 5.1);
            done();
          });
        });
      });
    });

    suite('transiting class', function() {
      var progress;

      setup(function() {
        progress = fixture('transitingProgress');
      });

      test('progress bars', function() {
        var stylesForPrimaryProgress = window.getComputedStyle(progress.$.primaryProgress);
        var stylesForSecondaryProgress = window.getComputedStyle(progress.$.secondaryProgress);
        var transitionProp = stylesForPrimaryProgress['transition-property'];

        assert.isTrue(transitionProp === 'transform' || transitionProp === '-webkit-transform');
        assert.equal(stylesForPrimaryProgress['transition-duration'], '0.08s');

        transitionProp = stylesForSecondaryProgress['transition-property'];

        assert.isTrue(transitionProp === 'transform' || transitionProp === '-webkit-transform');
        assert.equal(stylesForSecondaryProgress['transition-duration'], '0.08s');
      });
    });

  