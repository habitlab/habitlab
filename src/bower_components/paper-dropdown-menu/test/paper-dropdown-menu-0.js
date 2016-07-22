

    function runAfterOpen(menu, callback) {
      menu.$.menuButton.$.dropdown.addEventListener('iron-overlay-opened', function() {
        Polymer.Base.async(callback, 1);
      });
      MockInteractions.tap(menu);
    }

    suite('<paper-dropdown-menu>', function() {
      var dropdownMenu;

      setup(function() {
        dropdownMenu = fixture('TrivialDropdownMenu');
        content = Polymer.dom(dropdownMenu).querySelector('.dropdown-content');
      });

      test('opens when tapped', function(done) {
        var contentRect = content.getBoundingClientRect();

        expect(contentRect.width).to.be.equal(0);
        expect(contentRect.height).to.be.equal(0);

        runAfterOpen(dropdownMenu, function() {
          contentRect = content.getBoundingClientRect();

          expect(dropdownMenu.opened).to.be.equal(true);

          expect(contentRect.width).to.be.greaterThan(0);
          expect(contentRect.height).to.be.greaterThan(0);
          done();
        });

        expect(dropdownMenu.opened).to.be.equal(true);
      });

      test('closes when an item is activated', function(done) {
        runAfterOpen(dropdownMenu, function() {
          var firstItem = Polymer.dom(content).querySelector('paper-item');

          MockInteractions.tap(firstItem);

          Polymer.Base.async(function() {
            expect(dropdownMenu.opened).to.be.equal(false);
            done();
          });
        });
      });

      test('sets selected item to the activated item', function(done) {
        runAfterOpen(dropdownMenu, function() {
          var firstItem = Polymer.dom(content).querySelector('paper-item');

          MockInteractions.tap(firstItem);

          Polymer.Base.async(function() {
            expect(dropdownMenu.selectedItem).to.be.equal(firstItem);
            done();
          });
        });
      });

      suite('when a value is preselected', function() {
        setup(function() {
          dropdownMenu = fixture('PreselectedDropdownMenu');
        });

        test('the input area shows the correct selection', function() {
          Polymer.dom.flush();
          var secondItem = Polymer.dom(dropdownMenu).querySelectorAll('paper-item')[1];
          expect(dropdownMenu.selectedItem).to.be.equal(secondItem);
        });
      });

      suite('deselecting', function() {
        var menu;

        setup(function() {
          dropdownMenu = fixture('PreselectedDropdownMenu');
          menu = Polymer.dom(dropdownMenu).querySelector('.dropdown-content');
        });

        test('an `iron-deselect` event clears the current selection', function() {
          Polymer.dom.flush();
          menu.selected = null;
          expect(dropdownMenu.selectedItem).to.be.equal(null);
        });
      });

      suite('validation', function() {
        test('a non required dropdown is valid regardless of its selection', function() {
          var dropdownMenu = fixture('TrivialDropdownMenu');
          menu = Polymer.dom(dropdownMenu).querySelector('.dropdown-content');

          // no selection.
          expect(dropdownMenu.validate()).to.be.true;
          expect(dropdownMenu.invalid).to.be.false;
          expect(dropdownMenu.value).to.not.be.ok;

          // some selection.
          menu.selected = 1;
          expect(dropdownMenu.validate()).to.be.true;
          expect(dropdownMenu.invalid).to.be.false;
          expect(dropdownMenu.value).to.be.equal('Bar');
        });

        test('a required dropdown is invalid without a selection', function() {
          var dropdownMenu = fixture('TrivialDropdownMenu');
          dropdownMenu.required = true;

          // no selection.
          expect(dropdownMenu.validate()).to.be.false;
          expect(dropdownMenu.invalid).to.be.true;
          expect(dropdownMenu.value).to.not.be.ok;
        });

        test('a required dropdown is valid with a selection', function() {
          var dropdownMenu = fixture('PreselectedDropdownMenu');
          Polymer.dom.flush();

          dropdownMenu.required = true;

          expect(dropdownMenu.validate()).to.be.true;
          expect(dropdownMenu.invalid).to.be.false;
          expect(dropdownMenu.value).to.be.equal('Bar');
        });
      });

      suite('selectedItemLabel', function() {
        test('label property', function() {
          var dropdownMenu = fixture('LabelsDropdownMenu');
          var menu = Polymer.dom(dropdownMenu).querySelector('.dropdown-content');
          menu.selected = 0;
          //Fake a label property since paper-item doesn't have one
          dropdownMenu.selectedItem.label = dropdownMenu.selectedItem.getAttribute('label');
          expect(dropdownMenu.selectedItemLabel).to.be.equal('Foo label property');
        });

        test('label attribute', function() {
          var dropdownMenu = fixture('LabelsDropdownMenu');
          var menu = Polymer.dom(dropdownMenu).querySelector('.dropdown-content');
          menu.selected = 1;
          expect(dropdownMenu.selectedItemLabel).to.be.equal('Foo label attribute');
        });

        test('textContent', function() {
          var dropdownMenu = fixture('LabelsDropdownMenu');
          var menu = Polymer.dom(dropdownMenu).querySelector('.dropdown-content');
          menu.selected = 2;
          expect(dropdownMenu.selectedItemLabel).to.be.equal('Foo textContent');
        });
      });
    });
  