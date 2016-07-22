

      suite('<paper-listbox>', function() {
        var listbox;

        setup(function() {
          listbox = fixture('basic');
        });

        test('selected item has an appropriate className', function(done) {
          Polymer.Base.async(function() {
            assert(listbox.selectedItem.classList.contains('iron-selected'));
            done();
          }, 1);
        });

        test('has listbox aria role', function() {
          assert(listbox.getAttribute('role') === 'listbox');
        });

        a11ySuite('basic');
      });

    