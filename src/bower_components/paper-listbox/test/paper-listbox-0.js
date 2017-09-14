

      suite('<paper-listbox>', function() {
        var listbox;

        setup(function(done) {
          listbox = fixture('basic');

          // Wait for the initial items update.
          listbox.addEventListener('iron-items-changed', function onIronItemsChanged() {
            listbox.removeEventListener('iron-items-changed', onIronItemsChanged);
            done();
          });
        });

        test('selected item has an appropriate className', function() {
          assert(listbox.selectedItem.classList.contains('iron-selected'));
        });

        test('has listbox aria role', function() {
          assert(listbox.getAttribute('role') === 'listbox');
        });

        a11ySuite('basic');
      });

    