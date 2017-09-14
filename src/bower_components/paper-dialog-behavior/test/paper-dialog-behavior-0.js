

      function runAfterOpen(dialog, callback) {
        dialog.addEventListener('iron-overlay-opened', callback);
        dialog.open();
      }

      suite('basic', function() {

        test('clicking dialog does not cancel the dialog', function(done) {
          var dialog = fixture('basic');
          runAfterOpen(dialog, function() {
            dialog.addEventListener('iron-overlay-closed', function() {
              assert('dialog should not close');
            });
            MockInteractions.tap(dialog);
            setTimeout(function() {
              done();
            }, 100);
          });
        });

        test('clicking dialog-dismiss button closes the dialog without confirmation', function(done) {
          var dialog = fixture('basic');
          runAfterOpen(dialog, function() {
            dialog.addEventListener('iron-overlay-closed', function(event) {
              assert.isFalse(event.detail.canceled, 'dialog is not canceled');
              assert.isFalse(event.detail.confirmed, 'dialog is not confirmed');
              done();
            });
            MockInteractions.tap(Polymer.dom(dialog).querySelector('[dialog-dismiss]'));
          });
        });

        test('dialog-dismiss on a custom element is handled', function(done) {
          var dialog = fixture('custom-element-button');
          runAfterOpen(dialog, function() {
            dialog.addEventListener('iron-overlay-closed', function(event) {
              assert.isFalse(event.detail.canceled, 'dialog is not canceled');
              assert.isFalse(event.detail.confirmed, 'dialog is not confirmed');
              done();
            });
            MockInteractions.tap(Polymer.dom(dialog).querySelector('[dialog-dismiss]'));
          });
        });

        test('dialog-dismiss button inside a custom element is handled', function(done) {
          var dialog = fixture('buttons');
          runAfterOpen(dialog, function() {
            dialog.addEventListener('iron-overlay-closed', function(event) {
              assert.isFalse(event.detail.canceled, 'dialog is not canceled');
              assert.isFalse(event.detail.confirmed, 'dialog is not confirmed');
              done();
            });
            MockInteractions.tap(Polymer.dom(dialog).querySelector('test-buttons').$.dismiss);
          });
        });

        test('clicking dialog-confirm button closes the dialog with confirmation', function(done) {
          var dialog = fixture('basic');
          runAfterOpen(dialog, function() {
            dialog.addEventListener('iron-overlay-closed', function(event) {
              assert.isFalse(event.detail.canceled, 'dialog is not canceled');
              assert.isTrue(event.detail.confirmed, 'dialog is confirmed');
              done();
            });
            MockInteractions.tap(Polymer.dom(dialog).querySelector('[dialog-confirm]'));
          });
        });

        test('dialog-confirm on a custom element handled', function(done) {
          var dialog = fixture('custom-element-button');
          runAfterOpen(dialog, function() {
            dialog.addEventListener('iron-overlay-closed', function(event) {
              assert.isFalse(event.detail.canceled, 'dialog is not canceled');
              assert.isTrue(event.detail.confirmed, 'dialog is confirmed');
              done();
            });
            MockInteractions.tap(Polymer.dom(dialog).querySelector('[dialog-confirm]'));
          });
        });

        test('dialog-confirm button inside a custom element is handled', function(done) {
          var dialog = fixture('buttons');
          runAfterOpen(dialog, function() {
            dialog.addEventListener('iron-overlay-closed', function(event) {
              assert.isFalse(event.detail.canceled, 'dialog is not canceled');
              assert.isTrue(event.detail.confirmed, 'dialog is confirmed');
              done();
            });
            MockInteractions.tap(Polymer.dom(dialog).querySelector('test-buttons').$.confirm);
          });
        });

        test('clicking dialog-dismiss button closes only the dialog where is contained', function(done) {
          var dialog = fixture('nestedmodals');
          var innerDialog = Polymer.dom(dialog).querySelector('test-dialog');
          MockInteractions.tap(Polymer.dom(innerDialog).querySelector('[dialog-dismiss]'));
          setTimeout(function() {
            assert.isFalse(innerDialog.opened, 'inner dialog is closed');
            assert.isTrue(dialog.opened, 'dialog is still open');
            done();
          }, 10);
        });

        test('clicking dialog-confirm button closes only the dialog where is contained', function(done) {
          var dialog = fixture('nestedmodals');
          var innerDialog = Polymer.dom(dialog).querySelector('test-dialog');
          MockInteractions.tap(Polymer.dom(innerDialog).querySelector('[dialog-confirm]'));
          setTimeout(function() {
            assert.isFalse(innerDialog.opened, 'inner dialog is closed');
            assert.isTrue(dialog.opened, 'dialog is still open');
            done();
          }, 10);
        });

        var properties = ['noCancelOnEscKey', 'noCancelOnOutsideClick', 'withBackdrop'];
        properties.forEach(function(property) {
          suite(property, function() {

            test('modal sets ' + property + ' to true', function() {
              var dialog = fixture('modal');
              assert.isTrue(dialog[property], property);
            });

            test('modal toggling keeps current value of ' + property, function() {
              var dialog = fixture('modal');
              // Changed to false while modal is true.
              dialog[property] = false;
              dialog.modal = false;
              assert.isFalse(dialog[property], property + ' is false');
            });

            test('modal toggling keeps previous value of ' + property, function() {
              var dialog = fixture('basic');
              // Changed before modal is true.
              dialog[property] = true;
              // Toggle twice to trigger observer.
              dialog.modal = true;
              dialog.modal = false;
              assert.isTrue(dialog[property], property + ' is still true');
            });

            test('default modal does not override ' + property +' (attribute)', function() {
              // Property is set on ready from attribute.
              var dialog = fixture('like-modal');
              assert.isTrue(dialog[property], property + ' is true');
            });

            test('modal toggling keeps previous value of ' + property + ' (attribute)', function() {
              // Property is set on ready from attribute.
              var dialog = fixture('like-modal');
              // Toggle twice to trigger observer.
              dialog.modal = true;
              dialog.modal = false;
              assert.isTrue(dialog[property], property + ' is still true');
            });

          });
        });

        test('clicking outside a modal dialog does not move focus from dialog', function(done) {
          var dialog = fixture('modal');
          runAfterOpen(dialog, function() {
            MockInteractions.tap(document.body);
            setTimeout(function() {
              assert.equal(document.activeElement, Polymer.dom(dialog).querySelector('[autofocus]'), 'document.activeElement is the autofocused button');
              done();
            }, 10);
          });
        });

        test('removing a child element on click does not cause an exception', function(done) {
          var dialog = fixture('basic');
          runAfterOpen(dialog, function() {
            var button = Polymer.dom(dialog).querySelector('[extra]');
            button.addEventListener('click', function(event) {
              Polymer.dom(event.target.parentNode).removeChild(event.target);
              // should not throw exception here
              done();
            });
            MockInteractions.tap(button);
          });
        });

        test('multiple modal dialogs opened, handle focus change', function(done) {
          var dialogs = fixture('multiple');

          runAfterOpen(dialogs[0], function() {
            runAfterOpen(dialogs[1], function() {
              // Each modal dialog will trap the focus within its children.
              // Multiple modal dialogs doing it might result in an infinite loop
              // dialog1 focus -> dialog2 focus -> dialog1 focus -> dialog2 focus...
              // causing a "Maximum call stack size exceeded" error.
              // Wait 50ms and verify this does not happen.
              Polymer.Base.async(function() {
                // Should not enter in an infinite loop.
                done();
              }, 50);
            });
          });
        });

        test('multiple modal dialogs opened, handle outside click', function(done) {
          var dialogs = fixture('multiple');

          runAfterOpen(dialogs[0], function() {
            runAfterOpen(dialogs[1], function() {
              // Click should be handled only by dialogs[1].
              MockInteractions.tap(document.body);
              // Each modal dialog will trap the focus within its children.
              // Multiple modal dialogs doing it might result in an infinite loop
              // dialog1 focus -> dialog2 focus -> dialog1 focus -> dialog2 focus...
              // causing a "Maximum call stack size exceeded" error.
              // Wait 50ms and verify this does not happen.
              Polymer.Base.async(function() {
                // Should not enter in an infinite loop.
                done();
              }, 50);
            });
          });
        });

        test('focus is given to the autofocus element when clicking on backdrop', function(done) {
          var dialog = fixture('modal');
          dialog.addEventListener('iron-overlay-opened', onFirstOpen);
          dialog.open();

          function onFirstOpen() {
            dialog.removeEventListener('iron-overlay-opened', onFirstOpen);
            dialog.addEventListener('iron-overlay-closed', onFirstClose);
            // Set the focus on dismiss button
            MockInteractions.focus(Polymer.dom(dialog).querySelector('[dialog-dismiss]'));
            // Close the dialog
            dialog.close();
          }

          function onFirstClose() {
            dialog.removeEventListener('iron-overlay-closed', onFirstClose);
            dialog.addEventListener('iron-overlay-opened', onSecondOpen);
            dialog.open();
          }

          function onSecondOpen() {
            MockInteractions.tap(document.body);
            setTimeout(function() {
              assert.equal(document.activeElement, Polymer.dom(dialog).querySelector('[autofocus]'), 'document.activeElement is the autofocused button');
              done();
            }, 10);
          }
        });

      });

      suite('a11y', function() {

        test('dialog has role="dialog"', function() {
          var dialog = fixture('basic');
          assert.equal(dialog.getAttribute('role'), 'dialog', 'has role="dialog"');
        });

      });
    