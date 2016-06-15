
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

      test('can be styled with different sizes', function() {
        var r2 = fixture('WithDifferentSizes');
        var small = r2[0].getBoundingClientRect();
        var medium = r2[1].getBoundingClientRect();
        var large = r2[2].getBoundingClientRect();

        console.log(small.width, medium.width, large.width);

        assert.isTrue(4 < small.height);
        assert.isTrue(small.height < medium.height);
        assert.isTrue(medium.height < large.height);
        assert.isTrue(large.height < 72);

        assert.isTrue(4 < small.width);
        assert.isTrue(small.width < medium.width);
        assert.isTrue(medium.width < large.width);
        assert.isTrue(large.width < 72);
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
  