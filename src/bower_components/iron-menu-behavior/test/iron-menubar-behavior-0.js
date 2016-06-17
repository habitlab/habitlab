

      suite('menubar a11y tests', function() {

        test('menubar has role="menubar"', function() {
          var menubar = fixture('basic');
          assert.equal(menubar.getAttribute('role'), 'menubar', 'has role="menubar"');
        });

        test('first item gets focus when menubar is focused', function(done) {
          var menubar = fixture('basic');
          MockInteractions.focus(menubar);
          Polymer.Base.async(function() {
            assert.equal(Polymer.dom(document).activeElement, menubar.firstElementChild, 'document.activeElement is first item')
            done();
          });
        });

        test('selected item gets focus when menubar is focused', function(done) {
          var menubar = fixture('basic');
          menubar.selected = 1;
          MockInteractions.focus(menubar);
          Polymer.Base.async(function() {
            assert.equal(Polymer.dom(document).activeElement, menubar.selectedItem, 'document.activeElement is selected item');
            done();
          });
        });

        test('focusing non-item content does not auto-focus an item', function(done) {
          var menubar = fixture('basic');
          menubar.extraContent.focus();
          Polymer.Base.async(function() {
            var ownerRoot = Polymer.dom(menubar.extraContent).getOwnerRoot() || document;
            var activeElement = Polymer.dom(ownerRoot).activeElement;
            assert.equal(activeElement, menubar.extraContent, 'menubar.extraContent is focused');
            assert.equal(Polymer.dom(document).activeElement, menubar, 'menubar is document.activeElement');
            done();
          });
        });

        test('last activated item in a multi select menubar is focused', function(done) {
          var menubar = fixture('multi');
          menubar.selected = 0;
          menubar.items[1].click();
          Polymer.Base.async(function() {
            assert.equal(Polymer.dom(document).activeElement, menubar.items[1], 'document.activeElement is last activated item');
            done();
          });
        });

        test('deselection in a multi select menubar focuses deselected item', function(done) {
          var menubar = fixture('multi');
          menubar.selected = 0;
          menubar.items[0].click();
          Polymer.Base.async(function() {
            assert.equal(Polymer.dom(document).activeElement, menubar.items[0], 'document.activeElement is last activated item');
            done();
          });
        });

        suite('left / right keys are reversed when the menubar has RTL directionality', function() {
          var LEFT = 37;
          var RIGHT = 39;

          test('left key moves to the next item', function() {
            var rtlContainer = fixture('rtl');
            var menubar = rtlContainer.querySelector('test-menubar');
            menubar.selected = 0;
            menubar.items[1].click();

            assert.equal(Polymer.dom(document).activeElement, menubar.items[1]);

            MockInteractions.pressAndReleaseKeyOn(menubar, LEFT);

            assert.equal(Polymer.dom(document).activeElement, menubar.items[2],
                '`document.activeElement` should be the next item.');
            assert.equal(menubar.selected, 1,
                '`menubar.selected` should not change.');
          });

          test('right key moves to the previous item', function() {
            var rtlContainer = fixture('rtl');
            var menubar = rtlContainer.querySelector('test-menubar');
            menubar.selected = 0;
            menubar.items[1].click();

            assert.equal(Polymer.dom(document).activeElement, menubar.items[1]);

            MockInteractions.pressAndReleaseKeyOn(menubar, RIGHT);

            assert.equal(Polymer.dom(document).activeElement, menubar.items[0],
                '`document.activeElement` should be the previous item');
            assert.equal(menubar.selected, 1,
                '`menubar.selected` should not change.');
          });
        });

      });

    