
    suite('<paper-menu-button>', function() {
      var menuButton;
      var trigger;
      var content;

      setup(function() {
        menuButton = fixture('TrivialMenuButton');
        trigger = Polymer.dom(menuButton).querySelector('[slot="dropdown-trigger"]');
        content = Polymer.dom(menuButton).querySelector('[slot="dropdown-content"]');
      });

      test('opens when trigger is clicked', function(done) {
        var contentRect;

        contentRect = content.getBoundingClientRect();

        expect(contentRect.width).to.be.equal(0);
        expect(contentRect.height).to.be.equal(0);

        menuButton.addEventListener('paper-dropdown-open', function() {
          expect(menuButton.opened).to.be.equal(true);
          done();
        });

        MockInteractions.tap(trigger);
      });

      test('closes when trigger is clicked again', function(done) {
        menuButton.addEventListener('paper-dropdown-open', function() {
          menuButton.addEventListener('paper-dropdown-close', function() {
            expect(menuButton.opened).to.be.equal(false);
            done();
          });

          Polymer.Base.async(function() {
            MockInteractions.tap(trigger);
          });
        });

        MockInteractions.tap(trigger);
      });

      test('closes when disabled while open', function() {
        var contentRect;

        menuButton.opened = true;
        menuButton.disabled = true;

        expect(menuButton.opened).to.be.equal(false);

        contentRect = content.getBoundingClientRect();
        expect(contentRect.width).to.be.equal(0);
        expect(contentRect.height).to.be.equal(0);
      });

      test('has aria-haspopup attribute', function() {
        expect(menuButton.hasAttribute('aria-haspopup')).to.be.equal(true);
      });

      test('closes on iron-activate if close-on-activate is true', function(done) {
        menuButton.closeOnActivate = true;

        menuButton.addEventListener('paper-dropdown-open', function() {
          menuButton.addEventListener('paper-dropdown-close', function() {
            done();
          });

          content.dispatchEvent(new CustomEvent('iron-activate', {
            bubbles: true,
            cancelable: true
          }));
        });

        MockInteractions.tap(trigger);
      });

      test('allowOutsideScroll propagates to <iron-dropdown>', function() {
        menuButton.allowOutsideScroll = false;
        expect(menuButton.$.dropdown.allowOutsideScroll).to.be.equal(false);
        menuButton.allowOutsideScroll = true;
        expect(menuButton.$.dropdown.allowOutsideScroll).to.be.equal(true);
      });

      test('restoreFocusOnClose propagates to <iron-dropdown>', function() {
        menuButton.restoreFocusOnClose = false;
        expect(menuButton.$.dropdown.restoreFocusOnClose).to.be.equal(false);
        menuButton.restoreFocusOnClose = true;
        expect(menuButton.$.dropdown.restoreFocusOnClose).to.be.equal(true);
      });

    });

    suite('when there are two buttons', function() {
      var menuButton;
      var trigger;
      var otherButton;
      var otherTrigger;

      setup(function() {
        var buttons = fixture('TwoMenuButtons');
        menuButton = buttons[0];
        otherButton = buttons[1];
        trigger = Polymer.dom(menuButton).querySelector('[slot="dropdown-trigger"]');
        otherTrigger = Polymer.dom(otherButton).querySelector('[slot="dropdown-trigger"]');
      });

      test('closes current and opens other', function(done) {
        expect(menuButton.opened).to.be.equal(false);
        expect(otherButton.opened).to.be.equal(false);

        /*
          NOTE: iron-overlay-behavior adds listeners asynchronously when the
          overlay opens, so we need to wait for this event which is a
          more-explicit signal that tells us that the overlay is really opened.
         */
        menuButton.addEventListener('iron-overlay-opened', function() {
          expect(menuButton.opened).to.be.equal(true);
          expect(otherButton.opened).to.be.equal(false);

          var firstClosed = false;
          var secondOpened = false;

          menuButton.addEventListener('paper-dropdown-close', function() {
            firstClosed = true;
          });

          otherButton.addEventListener('paper-dropdown-open', function() {
            secondOpened = true;
          });

          Polymer.Base.async(function() {
            MockInteractions.tap(otherTrigger);
          });


          Polymer.Base.async(function() {
            expect(firstClosed).to.be.equal(true);
            expect(secondOpened).to.be.equal(true);

            done();
          });
        });

        MockInteractions.tap(trigger);
      });
    });
  