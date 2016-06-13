

      suite('basic', function() {
        var pages;

        suite('defaults', function() {
          setup(function () {
            pages = fixture('basic');
          });

          test('to nothing selected', function() {
            assert.equal(pages.selected, undefined);
          });

          test('null activateEvent', function() {
            // `activateEvent` is not a useful feature for iron-pages and it can interfere
            // with ux; ensure iron-pages has cleared any default `activateEvent`
            assert.equal(pages.activateEvent, null);
          });

          test('to iron-selected as selectedClass', function() {
            assert.equal(pages.selectedClass, 'iron-selected');
          });

          test('as many items as children', function() {
            assert.equal(pages.items.length, 4);
          });

          test('all pages are display:none', function() {
            pages.items.forEach(function(p) {
              assert.equal(getComputedStyle(p).display, 'none');
            });
          });
        });

        suite('set the selected attribute', function() {
          setup(function () {
            pages = fixture('basic');
            pages.selected = 0;
          });

          test('selected value', function() {
            assert.equal(pages.selected, '0');
          });

          test('selected item', function() {
            assert.equal(pages.selectedItem, pages.items[0]);
          });

          test('selected item is display:block and all others are display:none', function() {
            pages.items.forEach(function(p) {
              assert.equal(getComputedStyle(p).display, p == pages.selectedItem ? 'block' : 'none');
            });
          });
        });

      });

    