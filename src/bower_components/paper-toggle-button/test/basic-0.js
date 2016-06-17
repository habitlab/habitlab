
      suite('defaults', function() {
        var b1;

        setup(function() {
          b1 = fixture('Basic');
        });

        test('check button via click', function(done) {
          b1.addEventListener('click', function() {
            assert.isTrue(b1.getAttribute('aria-pressed') == 'true');
            assert.isTrue(b1.checked);
            done();
          });
          MockInteractions.tap(b1);
        });

        test('toggle button via click', function(done) {
          b1.checked = true;
          b1.addEventListener('click', function() {
            assert.isFalse(b1.getAttribute('aria-pressed') == 'true');
            assert.isFalse(b1.checked);
            done();
          });
          MockInteractions.tap(b1);
        });

        test('disabled button cannot be clicked', function(done) {
          b1.disabled = true;
          b1.checked = true;
          MockInteractions.tap(b1);

          setTimeout(function() {
            assert.isTrue(b1.getAttribute('aria-pressed') == 'true');
            assert.isTrue(b1.checked);
            done();
          }, 1);
        });
      });

      suite('a11y', function() {
        var b1;

        setup(function() {
          b1 = fixture('Basic');
        });

        test('has aria role "button"', function() {
          console.log(b1.getAttribute('role'));
          assert.isTrue(b1.getAttribute('role') == 'button');
        });

        a11ySuite('Basic');
      });
    