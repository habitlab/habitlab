

    function runAfterOpen(dropdownMenu, callback) {
      dropdownMenu.$.menuButton.$.dropdown.addEventListener('iron-overlay-opened', function() {
        Polymer.Base.async(callback, 1);
      });
      MockInteractions.tap(dropdownMenu);
    }

    suite('<paper-dropdown-menu>', function() {
      var dropdownMenu;
      var content;

      setup(function() {
        dropdownMenu = fixture('TrivialDropdownMenu');
        content = Polymer.dom(dropdownMenu).querySelector('[slot="dropdown-content"]');
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
        setup(function(done) {
          dropdownMenu = fixture('PreselectedDropdownMenu');
          // Wait for distribution.
          Polymer.Base.async(function() {
            done();
          });
        });

        test('the input area shows the correct selection', function() {
          var secondItem = Polymer.dom(dropdownMenu).querySelectorAll('paper-item')[1];
          expect(dropdownMenu.selectedItem).to.be.equal(secondItem);
        });
      });

      suite('deselecting', function() {
        setup(function(done) {
          dropdownMenu = fixture('PreselectedDropdownMenu');
          content = Polymer.dom(dropdownMenu).querySelector('[slot="dropdown-content"]');
          // Wait for distribution.
          Polymer.Base.async(function() {
            done();
          });
        });

        test('an `iron-deselect` event clears the current selection', function() {
          content.selected = null;
          expect(dropdownMenu.selectedItem).to.be.equal(null);
        });
      });

      suite('validation', function() {
        test('a non required dropdown is valid regardless of its selection', function(done) {
          dropdownMenu = fixture('TrivialDropdownMenu');
          content = Polymer.dom(dropdownMenu).querySelector('[slot="dropdown-content"]');
          // Wait for distribution.
          Polymer.Base.async(function() {
            // no selection.
            expect(dropdownMenu.validate()).to.be.true;
            expect(dropdownMenu.invalid).to.be.false;
            expect(dropdownMenu.value).to.not.be.ok;

            // some selection.
            content.selected = 1;
            expect(dropdownMenu.validate()).to.be.true;
            expect(dropdownMenu.invalid).to.be.false;
            expect(dropdownMenu.value).to.be.equal('Bar');
            done();
          });
        });

        test('a required dropdown is invalid without a selection', function(done) {
          dropdownMenu = fixture('TrivialDropdownMenu');
          // Wait for distribution.
          Polymer.Base.async(function() {
            dropdownMenu.required = true;
            // no selection.
            expect(dropdownMenu.validate()).to.be.false;
            expect(dropdownMenu.invalid).to.be.true;
            expect(dropdownMenu.value).to.not.be.ok;
            done();
          });
        });

        test('a required dropdown is valid with a selection', function(done) {
          dropdownMenu = fixture('PreselectedDropdownMenu');
          // Wait for distribution.
          Polymer.Base.async(function() {
            dropdownMenu.required = true;
            expect(dropdownMenu.validate()).to.be.true;
            expect(dropdownMenu.invalid).to.be.false;
            expect(dropdownMenu.value).to.be.equal('Bar');
            done();
          });
        });
      });

      suite('selectedItemLabel', function() {
        setup(function(done) {
          dropdownMenu = fixture('LabelsDropdownMenu');
          content = Polymer.dom(dropdownMenu).querySelector('[slot="dropdown-content"]');
          // Wait for distribution.
          Polymer.Base.async(function() {
            done();
          });
        });

        test('label property', function() {
          content.selected = 0;
          //Fake a label property since paper-item doesn't have one
          dropdownMenu.selectedItem.label = dropdownMenu.selectedItem.getAttribute('label');
          expect(dropdownMenu.selectedItemLabel).to.be.equal('Foo label property');
        });

        test('label attribute', function() {
          content.selected = 1;
          expect(dropdownMenu.selectedItemLabel).to.be.equal('Foo label attribute');
        });

        test('textContent', function() {
          content.selected = 2;
          expect(dropdownMenu.selectedItemLabel).to.be.equal('Foo textContent');
        });
      });
    });
  