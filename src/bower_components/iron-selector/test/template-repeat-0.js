

    suite('dom-repeat', function() {

      var scope, s, t;

      setup(function() {
        scope = document.querySelector('template[is="dom-bind"]');
        s = scope.$.selector;
        t = scope.$.t;
        t.items = [{name:'item0'}, {name: 'item1'}, {name: 'item2'}, {name: 'item3'}];
      });

      teardown(function() {
        t.items = [];
      });

      test('supports repeated items', function() {
        t.render();
        // check items
        assert.equal(s.items.length, 4);
        // check selected
        assert.equal(s.selected, 1);
        // check selected item
        var item = s.selectedItem;
        assert.equal(s.items[1], item);
        // check selected class
        assert.isTrue(item.classList.contains('iron-selected'));
      });

      test('update items', function() {
        t.render();
        // check items
        assert.equal(s.items.length, 4);
        // check selected
        assert.equal(s.selected, 1);
        // update items
        t.items = [{name:'foo'}, {name: 'bar'}];
        t.render();
        // check items
        assert.equal(s.items.length, 2);
        // check selected (should still honor the selected)
        assert.equal(s.selected, 1);
        // check selected class
        assert.isTrue(s.querySelector('#bar').classList.contains('iron-selected'));
      });

      test('set selected to something else', function() {
        t.render();
        // set selected to something else
        s.selected = 3;
        // check selected item
        var item = s.selectedItem;
        assert.equal(s.items[3], item);
        // check selected class
        assert.isTrue(item.classList.contains('iron-selected'));
      });

    });

  