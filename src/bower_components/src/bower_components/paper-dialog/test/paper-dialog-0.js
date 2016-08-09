
    suite('modal', function() {

      test('backdrop element remains opened when closing top modal, closes when all modals are closed', function(done) {
        var modals = fixture('opened-modals');
        modals[1].addEventListener('iron-overlay-opened', function() {
          assert.isTrue(modals[1].backdropElement.opened, 'backdrop is open');
          modals[1].close();
        });
        modals[1].addEventListener('iron-overlay-closed', function() {
          assert.isTrue(modals[1].backdropElement.opened, 'backdrop is still open');
          modals[0].close();
        });
        modals[0].addEventListener('iron-overlay-closed', function() {
          assert.isFalse(modals[0].backdropElement.opened, 'backdrop is closed');
          done();
        });
      });

    });

    suite('a11y', function() {
      a11ySuite('basic', []);

      a11ySuite('modal', []);

      test('dialog has role="dialog"', function() {
        var dialog = fixture('basic');
        assert.equal(dialog.getAttribute('role'), 'dialog', 'has role="dialog"');
      });

    });
  