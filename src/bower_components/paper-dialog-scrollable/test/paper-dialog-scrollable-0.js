

      function runAfterScroll(node, scrollTop, callback) {
        var timeout = function() {
          node.scrollTop = scrollTop;
          if (node.scrollTop === scrollTop) {
            // there seems to be no good way to wait for pseudoelement styling to apply and
            // chrome takes a while before getComputedStyle returns the correct values
            setTimeout(function() {
              callback();
            }, 250);
          } else {
            setTimeout(timeout, 10);
          }
        };
        node.scrollTop = scrollTop;
        setTimeout(timeout);
      }

      suite('basic', function() {

        test('shows top divider if scrolled', function(done) {
          var container = fixture('basic');
          var scrollable = Polymer.dom(container).querySelector('paper-dialog-scrollable');
          setTimeout(function() {
            runAfterScroll(scrollable.scrollTarget, 10, function() {
              assert.ok(getComputedStyle(scrollable, '::before').content, '::before has content');
              done();
            });
          }, 10);
        });

        test('shows bottom divider if scrollable', function(done) {
          var container = fixture('basic');
          setTimeout(function() {
            var scrollable = Polymer.dom(container).querySelector('paper-dialog-scrollable');
            requestAnimationFrame(function() {
              assert.ok(getComputedStyle(scrollable, '::after').content, '::after has content');
              done();
            });
          }, 10);
        });

        test('hides bottom divider if scrolled to bottom', function(done) {
          var container = fixture('basic');
          var scrollable = Polymer.dom(container).querySelector('paper-dialog-scrollable');
          setTimeout(function() {
            runAfterScroll(scrollable.scrollTarget, scrollable.scrollTarget.scrollHeight - scrollable.scrollTarget.offsetHeight, function() {
              var content = getComputedStyle(scrollable, '::after').content;
              assert.ok(!content || content === 'none', '::after does not have content');
              done();
            });
          }, 10);
        });

        test('does not show dividers if scrolled and only child', function(done) {
          var container = fixture('only-child');
          var scrollable = Polymer.dom(container).querySelector('paper-dialog-scrollable');
          setTimeout(function() {
            runAfterScroll(scrollable.scrollTarget, 10, function() {
              var contentBefore = getComputedStyle(scrollable, '::before').content;
              assert.ok(!contentBefore || contentBefore === 'none', '::before does not have content');
              var contentAfter = getComputedStyle(scrollable, '::after').content;
              assert.ok(!contentAfter || contentAfter === 'none', '::after does not have content');
              done();
            });
          }, 10);
        });

        test('does not show bottom divider if not scrollable', function(done) {
          var container = fixture('short');
          setTimeout(function() {
            var scrollable = Polymer.dom(container).querySelector('paper-dialog-scrollable');
            var contentAfter = getComputedStyle(scrollable, '::after').content;
            assert.ok(!contentAfter || contentAfter === 'none', '::after does not have content');
            done();
          }, 10);
        });

        test('can be added dynamically', function(done) {
          var scrollable = document.createElement('paper-dialog-scrollable');
          document.body.appendChild(scrollable);
          setTimeout(function() {
            assert.isTrue(scrollable.dialogElement === document.body, 'dialogElement is body');
            document.body.removeChild(scrollable);
            done();
          }, 10);
        });

        test('correctly sized (container = section)', function() {
          var container = fixture('basic');
          var scrollable = Polymer.dom(container).querySelector('paper-dialog-scrollable');
          var cRect = container.getBoundingClientRect();
          var sRect = scrollable.getBoundingClientRect();
          var stRect = scrollable.scrollTarget.getBoundingClientRect();
          assert.equal(sRect.width, cRect.width, 'scrollable width ok');
          assert.isAbove(sRect.height, 0, 'scrollable height bigger than 0');
          assert.isBelow(sRect.height, cRect.height, 'scrollable height contained in container height');
          assert.equal(stRect.width, sRect.width, 'scrollTarget width ok');
          assert.equal(stRect.height, sRect.height, 'scrollTarget height ok');
        });

        test('correctly sized (container = paper-dialog[opened])', function(done) {
          var dialog = fixture('dialog');
          var scrollable = Polymer.dom(dialog).querySelector('paper-dialog-scrollable');
          // Wait for dialog to be opened and styles applied.
          dialog.addEventListener('iron-overlay-opened', function() {
            var dRect = dialog.getBoundingClientRect();
            var sRect = scrollable.getBoundingClientRect();
            var stRect = scrollable.scrollTarget.getBoundingClientRect();
            assert.equal(sRect.width, dRect.width, 'scrollable width ok');
            assert.isAbove(sRect.height, 0, 'scrollable height bigger than 0');
            assert.isBelow(sRect.height, dRect.height, 'scrollable height contained in dialog height');
            assert.equal(stRect.width, sRect.width, 'scrollTarget width ok');
            assert.equal(stRect.height, sRect.height, 'scrollTarget height ok');
            done();
          });
        });

        test('removes bottom divider if content is removed dynamically', function(done) {
          var container = fixture('basic');
          setTimeout(function() {
            var scrollable = Polymer.dom(container).querySelector('paper-dialog-scrollable');
            assert.isFalse(scrollable.classList.contains('scrolled-to-bottom'), 'scrollable does not have scrolled-to-bottom class');
            Polymer.dom(scrollable).innerHTML = '<p>dummy content</p>';
            Polymer.dom.flush();
            scrollable.updateScrollState();
            assert.isTrue(scrollable.classList.contains('scrolled-to-bottom'), 'scrollable has scrolled-to-bottom class');
            done();
          }, 10);
        });

        test('correctly sized (container = test-dialog[opened])', function(done) {
          var dialog = fixture('shadow');
          var scrollable = dialog.$.scrollable;
          // Wait for dialog to be opened and styles applied.
          dialog.addEventListener('iron-overlay-opened', function() {
            var dRect = dialog.getBoundingClientRect();
            var sRect = scrollable.getBoundingClientRect();
            var stRect = scrollable.scrollTarget.getBoundingClientRect();
            assert.equal(sRect.width, dRect.width, 'scrollable width ok');
            assert.isAbove(sRect.height, 0, 'scrollable height bigger than 0');
            assert.isBelow(sRect.height, dRect.height, 'scrollable height contained in dialog height');
            assert.equal(stRect.width, sRect.width, 'scrollTarget width ok');
            assert.equal(stRect.height, sRect.height, 'scrollTarget height ok');
            done();
          });
        });

      });

    