
    suite('<x-progressbar>', function() {
      var range;

      setup(function() {
        range = fixture('trivialRange');
      });

      test('check default', function() {
        assert.equal(range.min, 0);
        assert.equal(range.max, 100);
        assert.equal(range.value, 0);
      });

      test('set value', function(done) {
        range.value = 50;
        flush(function() {
          assert.equal(range.value, 50);
          // test clamp value
          range.value = 60.1;
          flush(function() {
            assert.equal(range.value, 60);
            done();
          });
        });
      });

      test('set max', function(done) {
        range.max = 10;
        range.value = 11;
        flush(function() {
          assert.equal(range.value, range.max);
          done();
        });
      });

      test('test ratio', function(done) {
        range.max = 10;
        range.value = 5;
        flush(function() {
          assert.equal(range.ratio, 50);
          done();
        });
      });

      test('set min', function(done) {
        range.min = 10
        range.max = 50;
        range.value = 30;
        flush(function() {
          assert.equal(range.ratio, 50);
          range.value = 0;
          flush(function() {
            assert.equal(range.value, range.min);
            done();
          });
        });
      });

      test('set step', function(done) {
        range.min = 0;
        range.max = 10;
        range.value = 5.1;
        flush(function() {
          assert.equal(range.value, 5);
          range.step = 0.1;
          range.value = 5.1;
          flush(function() {
            assert.equal(range.value, 5.1);
            done();
          });
        });
      });

      test('set large step', function(done) {
        // PolymerElements/paper-slider#135
        range.min = 0;
        range.max = 2625;
        range.step = 875;
        range.value = 875;
        flush(function() {
          assert.equal(range.value, 875);
          done();
        });
      });

      test('set step with min', function(done) {
        range.min = -0.9;
        range.max = 1.1;
        range.step = 0.5;
        range.value = -0.5;
        flush(function() {
          assert.equal(range.value, -0.4);
          range.value = 0.7;
          flush(function() {
            assert.equal(range.value, 0.6);
            done();
          });
        });
      });

      test('odd values', function(done) {
        range.min = 1;
        range.max = 7;
        range.step = 2;
        range.value = 3;

        flush(function() {
          assert.equal(range.value, 3);

          range.value += range.step;
          assert.equal(range.value, 5);

          range.value += range.step;
          assert.equal(range.value, 7);
          done();
        });
      });

      test('negative values should round up', function(done) {
        range.min = -10;
        range.max = 10;
        range.step = 0.1;
        range.value = -8.4252;

        flush(function() {
          assert.equal(range.value, -8.4);
          done();
        });
      });

      test('positive values should round up', function(done) {
        range.min = 10;
        range.max = 100;
        range.step = 0.25;
        range.value = 19.34567;

        flush(function() {
          assert.equal(range.value, 19.25);
          done();
        });
      });

    });

  