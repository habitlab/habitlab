

      suite('basic', function() {
        var pages;

        suite('honor the selected attribute', function() {
          setup(function () {
            pages = fixture('basic');
          });

          test('selected value', function() {
            assert.equal(pages.selected, 'page0');
          });

          test('selected item', function(done) {
            // iron-selector uses observeNodes, which is async.
            Polymer.Base.async(function() {
              assert.equal(pages.selectedItem, pages.items[0])
              done();
            }, 1);
          });

          test('selected item is display:block and all others are display:none', function() {
            pages.items.forEach(function(p) {
              assert.equal(getComputedStyle(p).display, p == pages.selectedItem ? 'block' : 'none');
            });
          });
        });

        suite('set selected attribute', function() {
          setup(function () {
            pages = fixture('basic');
            pages.selected = 'page2';
          });

          test('selected value', function() {
            assert.equal(pages.selected, 'page2');
          });

          test('selected item', function() {
            assert.equal(pages.selectedItem, pages.items[2]);
          });

          test('selected item is display:block and all others are display:none', function() {
            pages.items.forEach(function(p) {
              assert.equal(getComputedStyle(p).display, p == pages.selectedItem ? 'block' : 'none');
            });
          });
        });

      });

    