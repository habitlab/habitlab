

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
                cancelable: true
              });
              event.deltaX = 0;
              event.deltaY = 10;
              return event;
            });
          });

          test('prevents wheel events from locked elements', function() {
            events.forEach(function(event) {
              childTwo.dispatchEvent(event);
              expect(event.defaultPrevented).to.be.eql(true);
            });
          });

          test('allows wheel events when there are no locking elements', function() {
            Polymer.IronDropdownScrollManager.removeScrollLock(childOne);
            events.forEach(function(event) {
              childTwo.dispatchEvent(event);
              expect(event.defaultPrevented).to.be.eql(false);
            });
          });

          test('allows wheel events from unlocked elements', function() {
            events.forEach(function(event) {
              childOne.dispatchEvent(event);
              expect(event.defaultPrevented).to.be.eql(false);
            });
          });

          test('touchstart is prevented if dispatched by an element outside the locking element', function() {
            var event = new CustomEvent('touchstart', {
              bubbles: true,
              cancelable: true
            });
            childTwo.dispatchEvent(event);
            expect(event.defaultPrevented).to.be.eql(true);
          });

          test('touchstart is not prevented if dispatched by an element inside the locking element', function() {
            var event = new CustomEvent('touchstart', {
              bubbles: true,
              cancelable: true
            });
            grandChildOne.dispatchEvent(event);
            expect(event.defaultPrevented).to.be.eql(false);
          });
        });
      });
    });
  