

      suite('<paper-menu>', function() {
        var menu;

        setup(function() {
          menu = fixture('basic');
        });

        test('selected item is styled', function() {

          var boldDiv = document.createElement('div');
          boldDiv.style.fontWeight = 'bold';
          document.body.appendChild(boldDiv);

          menu.selected = 1;

          assert.equal(getComputedStyle(menu.selectedItem).fontWeight,
              getComputedStyle(boldDiv).fontWeight, 'selected item is bold');
        });

      });

    