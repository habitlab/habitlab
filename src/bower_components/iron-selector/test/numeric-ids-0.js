

    suite('select by a numeric property', function() {

      var scope, s, t;

      setup(function() {
        scope = document.querySelector('template[is="dom-bind"]');
        s = scope.$.selector;
        t = scope.$.t;
        t.items = [{ id: 0, name:'item0'}, {id: 1, name: 'item1'}, {id: 2, name: 'item2'}];
      });

      teardown(function() {
        t.items = [];
      });

      test('select a value of zero', function() {
        t.render();
        s.selected = 1;
        assert.equal(s.selected, '1');

        // select item with a name value of 0
        s.children[0].dispatchEvent(new CustomEvent('tap', {bubbles: true}));
        assert.equal(s.selected, 0);
      });

    });

  