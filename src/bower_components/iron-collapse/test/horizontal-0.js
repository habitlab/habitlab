

      suite('horizontal', function() {

        var collapse;
        var collapseWidth;

        setup(function () {
          collapse = fixture('test');
          collapseWidth = getComputedStyle(collapse).width;
        });

        test('opened attribute', function() {
          assert.equal(collapse.opened, true);
        });

        test('horizontal attribute', function() {
          assert.equal(collapse.horizontal, true);
        });

        test('default opened width', function() {
          assert.equal(collapse.style.width, '');
        });

        test('set opened to false, then to true', function(done) {
          // This listener will be triggered twice (every time `opened` changes).
          collapse.addEventListener('transitionend', function() {
            if (collapse.opened) {
              // Check finalSize after animation is done.
              assert.equal(collapse.style.width, '');
              done();
            } else {
              // Check if size is still 0px.
              assert.equal(collapse.style.maxWidth, '0px');
              // Trigger 2nd toggle.
              collapse.opened = true;
              // Size should be immediately set.
              assert.equal(collapse.style.maxWidth, collapseWidth);
            }
          });
          // Trigger 1st toggle.
          collapse.opened = false;
          // Size should be immediately set.
          assert.equal(collapse.style.maxWidth, '0px');
        });

        test('change size with updateSize', function(done) {
          collapse.addEventListener('transitionend', function() {
            // size should be kept after transition
            assert.equal(collapse.style.maxWidth, "123px");
            done();
          });
          collapse.updateSize("123px", true);
        });

      });

    