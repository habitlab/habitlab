

      suite('flex', function() {

      	var container;
        var collapse;
        var collapseHeight;

        setup(function() {
          container = fixture('test');
          collapse = container.querySelector('iron-collapse');
          collapseHeight = getComputedStyle(collapse).height;
        });

        test('default opened height', function() {
          assert.equal(collapse.style.height, '');
        });

        test('set opened to false triggers animation', function(done) {
          collapse.opened = false;
          // Animation got enabled.
          assert.notEqual(collapse.style.transitionDuration, '0s');
          collapse.addEventListener('transitionend', function() {
            // Animation disabled.
            assert.equal(collapse.style.transitionDuration, '0s');
            done();
          });
        });

        test('enableTransition(false) disables animations', function() {
          collapse.enableTransition(false);
          assert.isTrue(collapse.noAnimation, '`noAnimation` is true');
          // trying to animate the size update
          collapse.updateSize('0px', true);
          // Animation immediately disabled.
          assert.equal(collapse.style.maxHeight, '0px');
        });

        test('set opened to false, then to true', function(done) {
          // this listener will be triggered twice (every time `opened` changes)
          collapse.addEventListener('transitionend', function() {
            if (collapse.opened) {
              // Check finalSize after animation is done.
              assert.equal(collapse.style.maxHeight, '');
              done();
            } else {
              // Check if size is still 0px.
              assert.equal(collapse.style.maxHeight, '0px');
              // Trigger 2nd toggle.
              collapse.opened = true;
              // Size should be immediately set.
              assert.equal(collapse.style.maxHeight, collapseHeight);
            }
          });
          // Trigger 1st toggle.
          collapse.opened = false;
          // Size should be immediately set.
          assert.equal(collapse.style.maxHeight, '0px');
        });

        test('opened changes trigger iron-resize', function() {
          var spy = sinon.stub();
          collapse.addEventListener('iron-resize', spy);
          // No animations for faster test.
          collapse.noAnimation = true;
          collapse.opened = false;
          assert.isTrue(spy.calledOnce, 'iron-resize was fired');
        });

        test('overflow is hidden while animating', function(done) {
          collapse.addEventListener('transitionend', function() {
            // Should still be hidden.
            assert.equal(getComputedStyle(collapse).overflow, 'hidden');
            done();
          });
          assert.equal(getComputedStyle(collapse).overflow, 'visible');
          collapse.opened = false;
          // Immediately updated style.
          assert.equal(getComputedStyle(collapse).overflow, 'hidden');
        });

        test('toggle horizontal updates size', function() {
          collapse.horizontal = false;
          assert.equal(collapse.style.width, '');
          assert.equal(collapse.style.maxHeight, '');
          assert.equal(collapse.style.transitionProperty, 'max-height');

          collapse.horizontal = true;
          assert.equal(collapse.style.maxWidth, '');
          assert.equal(collapse.style.height, '');
          assert.equal(collapse.style.transitionProperty, 'max-width');
        });

        test('change size with updateSize', function(done) {
          collapse.addEventListener('transitionend', function() {
            // size should be kept after transition
            assert.equal(collapse.style.maxHeight, "123px");
            done();
          });
          collapse.updateSize("123px", true);
        });

      });

    