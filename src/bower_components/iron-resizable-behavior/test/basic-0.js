

  suite('iron-resizable-behavior', function() {
    function ListenForResize(el, expectsResize) {
      var listener = function(event) {
        var target = event.path ? event.path[0] : event.target;
        pendingNotifications--;
      };

      if (expectsResize !== false) {
        pendingNotifications++;
      }

      el.addEventListener('iron-resize', listener);

      return {
        el: el,
        remove: function() {
          el.removeEventListener('iron-resize', listener);
        }
      };
    }

    function RemoveListeners(listeners) {
      listeners.forEach(function(listener) {
        listener.remove();
      });
    }

    var pendingNotifications;
    var testEl;

    setup(function() {
      pendingNotifications = 0;
      testEl = fixture('TestElement');
    });

    suite('x-resizer-parent', function() {

      test('notify resizables from window', function() {
        var listeners = [
          ListenForResize(testEl.$.parent),
          ListenForResize(testEl.$.child1a),
          ListenForResize(testEl.$.child1b),
          ListenForResize(testEl.$.shadow1c.$.resizable),
          ListenForResize(testEl.$.shadow1d.$.resizable)
        ];

        window.dispatchEvent(new CustomEvent('resize', { bubbles: false }));
        expect(pendingNotifications).to.be.eql(0);

        RemoveListeners(listeners);
      });

      test('notify resizables from parent', function() {
        var listeners = [
          ListenForResize(testEl.$.parent),
          ListenForResize(testEl.$.child1a),
          ListenForResize(testEl.$.child1b),
          ListenForResize(testEl.$.shadow1c.$.resizable),
          ListenForResize(testEl.$.shadow1d.$.resizable)
        ];

        testEl.$.parent.notifyResize();
        expect(pendingNotifications).to.be.eql(0);
        RemoveListeners(listeners);
      });

      test('detach resizables then notify parent', function() {
        sinon.spy(testEl.$.child1a, 'notifyResize');
        sinon.spy(testEl.$.shadow1c.$.resizable, 'notifyResize');
        sinon.spy(testEl.$.child1b, 'notifyResize');
        sinon.spy(testEl.$.shadow1d.$.resizable, 'notifyResize');

        var firstElementToRemove = testEl.$.child1a;
        var firstElementParent = Polymer.dom(firstElementToRemove).parentNode;
        var secondElementToRemove = testEl.$.shadow1c.$.resizable;
        var secondElementParent = Polymer.dom(secondElementToRemove).parentNode;

        Polymer.dom(firstElementParent).removeChild(firstElementToRemove);
        Polymer.dom(secondElementParent).removeChild(secondElementToRemove);

        Polymer.dom.flush();

        testEl.$.parent.notifyResize();

        expect(testEl.$.child1a.notifyResize.callCount).to.be.equal(0);
        expect(testEl.$.shadow1c.$.resizable.notifyResize.callCount).to.be.equal(0);
        expect(testEl.$.child1b.notifyResize.callCount).to.be.equal(1);
        expect(testEl.$.shadow1d.$.resizable.notifyResize.callCount).to.be.equal(1);
      });

      test('detach parent then notify window', function(done) {
        var listeners = [
          ListenForResize(testEl.$.parent, false),
          ListenForResize(testEl.$.child1a, false),
          ListenForResize(testEl.$.child1b, false),
          ListenForResize(testEl.$.shadow1c.$.resizable, false),
          ListenForResize(testEl.$.shadow1d.$.resizable, false)
        ];

        var el = Polymer.dom(testEl.root).querySelector('#parent');

        el.parentNode.removeChild(el);

        setTimeout(function() {
          try {
            window.dispatchEvent(new CustomEvent('resize', { bubbles: false }));
            expect(pendingNotifications).to.be.eql(0);
            RemoveListeners(listeners);
            done();
          } catch (e) {
            done(e);
          }
        }, 0);
      });

    });

    suite('x-resizer-parent-filtered', function() {

      test('notify resizables from window', function() {
        var listeners = [
          ListenForResize(testEl.$.parentFiltered),
          ListenForResize(testEl.$.child2a),
          ListenForResize(testEl.$.child2b, false),
          ListenForResize(testEl.$.shadow2c.$.resizable, false),
          ListenForResize(testEl.$.shadow2d.$.resizable, false)
        ];

        testEl.$.parentFiltered.active = testEl.$.child2a;

        window.dispatchEvent(new CustomEvent('resize', { bubbles: false }));
        expect(pendingNotifications).to.be.eql(0);
        RemoveListeners(listeners);
      });

      test('notify resizables from parent', function() {
        var listeners = [
          ListenForResize(testEl.$.parentFiltered),
          ListenForResize(testEl.$.child2a),
          ListenForResize(testEl.$.child2b, false),
          ListenForResize(testEl.$.shadow2c.$.resizable, false),
          ListenForResize(testEl.$.shadow2d.$.resizable, false)
        ];

        testEl.$.parentFiltered.active = testEl.$.child2a;

        testEl.$.parentFiltered.notifyResize();
        expect(pendingNotifications).to.be.eql(0);
        RemoveListeners(listeners);
      });

      test('detach resizables then notify parent', function() {
        var listeners = [
          ListenForResize(testEl.$.parentFiltered),
          ListenForResize(testEl.$.child2a, false),
          ListenForResize(testEl.$.child2b, false),
          ListenForResize(testEl.$.shadow2c.$.resizable, false),
          ListenForResize(testEl.$.shadow2d.$.resizable)
        ];

        var el = Polymer.dom(testEl.root).querySelector('#child2a');
        el.parentNode.removeChild(el);
        el = Polymer.dom(testEl.root).querySelector('#shadow2c');
        el.parentNode.removeChild(el);

        testEl.$.parentFiltered.active = testEl.$.shadow2d.$.resizable;

        testEl.$.parentFiltered.notifyResize();
        expect(pendingNotifications).to.be.eql(0);
        RemoveListeners(listeners);
      });
    });
  });
  