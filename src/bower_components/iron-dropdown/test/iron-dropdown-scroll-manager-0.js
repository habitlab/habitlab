

    suite('IronDropdownScrollManager', function() {
      var parent;
      var childOne;
      var childTwo;
      var grandChildOne;
      var grandChildTwo;
      var ancestor;

      setup(function() {
        parent = fixture('DOMSubtree');
        childOne = parent.$$('#ChildOne');
        childTwo = parent.$$('#ChildTwo');
        grandChildOne = parent.$$('#GrandchildOne');
        grandChildTwo = parent.$$('#GrandchildTwo');
        ancestor = document.body;
      });

      suite('constraining scroll in the DOM', function() {
        setup(function() {
          Polymer.IronDropdownScrollManager.pushScrollLock(childOne);
        });

        teardown(function() {
          Polymer.IronDropdownScrollManager.removeScrollLock(childOne);
        });

        test('recognizes sibling as locked', function() {
          expect(Polymer.IronDropdownScrollManager.elementIsScrollLocked(childTwo))
            .to.be.equal(true);
        });

        test('recognizes neice as locked', function() {
          expect(Polymer.IronDropdownScrollManager.elementIsScrollLocked(grandChildTwo))
            .to.be.equal(true);
        });

        test('recognizes parent as locked', function() {
          expect(Polymer.IronDropdownScrollManager.elementIsScrollLocked(parent))
            .to.be.equal(true);
        });

        test('recognizes ancestor as locked', function() {
          expect(Polymer.IronDropdownScrollManager.elementIsScrollLocked(ancestor))
            .to.be.equal(true);
        });

        test('recognizes locking child as unlocked', function() {
          expect(Polymer.IronDropdownScrollManager.elementIsScrollLocked(childOne))
            .to.be.equal(false);
        });

        test('recognizes descendant of locking child as unlocked', function() {
          expect(Polymer.IronDropdownScrollManager.elementIsScrollLocked(grandChildOne))
            .to.be.equal(false);
        });

        test('unlocks locked elements when there are no locking elements', function() {
          Polymer.IronDropdownScrollManager.removeScrollLock(childOne);

          expect(Polymer.IronDropdownScrollManager.elementIsScrollLocked(parent))
            .to.be.equal(false);
        });

        suite('various scroll events', function() {
          var scrollEvents;
          var events;

          setup(function() {
            scrollEvents = [
              'wheel',
              'mousewheel',
              'DOMMouseScroll',
              'touchmove'
            ];

            events = scrollEvents.map(function(scrollEvent) {
              var event = new CustomEvent(scrollEvent, {
                bubbles: true,
                cancelable: true,
                composed: true
              });
              event.deltaX = 0;
              event.deltaY = 10;
              return event;
            });
          });

          test('prevents wheel events from locked elements', function() {
            events.forEach(function(event) {
              childTwo.dispatchEvent(event);
              assert.isTrue(event.defaultPrevented, event.type + ' ok');
            });
          });

          test('allows wheel events when there are no locking elements', function() {
            Polymer.IronDropdownScrollManager.removeScrollLock(childOne);
            events.forEach(function(event) {
              childTwo.dispatchEvent(event);
              assert.isFalse(event.defaultPrevented, event.type + ' ok');
            });
          });

          test('allows wheel events from unlocked elements', function() {
            events.forEach(function(event) {
              childOne.dispatchEvent(event);
              assert.isFalse(event.defaultPrevented, event.type + ' ok');
            });
          });

          test('touchstart is prevented if dispatched by an element outside the locking element', function() {
            var event = new CustomEvent('touchstart', {
              bubbles: true,
              cancelable: true,
              composed: true
            });
            childTwo.dispatchEvent(event);
            assert.isTrue(event.defaultPrevented, event.type + ' ok');
          });

          test('touchstart is not prevented if dispatched by an element inside the locking element', function() {
            var event = new CustomEvent('touchstart', {
              bubbles: true,
              cancelable: true,
              composed: true
            });
            grandChildOne.dispatchEvent(event);
            assert.isFalse(event.defaultPrevented, event.type + ' ok');
          });

          test('arrow keyboard events not prevented by manager', function() {
            // Even if these events might cause scrolling, they should not be
            // prevented because they might cause a11y issues (e.g. arrow keys
            // used for navigating the content). iron-dropdown is capable of
            // restoring the scroll position of the document if necessary.
            var left = MockInteractions.keyboardEventFor('keydown', 37);
            var up = MockInteractions.keyboardEventFor('keydown', 38);
            var right = MockInteractions.keyboardEventFor('keydown', 39);
            var down = MockInteractions.keyboardEventFor('keydown', 40);
            grandChildOne.dispatchEvent(left);
            grandChildOne.dispatchEvent(up);
            grandChildOne.dispatchEvent(right);
            grandChildOne.dispatchEvent(down);
            assert.isFalse(left.defaultPrevented, 'left ok');
            assert.isFalse(up.defaultPrevented, 'up ok');
            assert.isFalse(right.defaultPrevented, 'right ok');
            assert.isFalse(down.defaultPrevented, 'down ok');
          });
        });
      });
    });
  