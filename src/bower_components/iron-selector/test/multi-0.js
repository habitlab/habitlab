

    suite('multi', function() {

      var s;

      setup(function () {
        s = fixture('test');
        t = Polymer.dom(s).querySelector('[is="dom-repeat"]');
      });

      test('honors the multi attribute', function() {
        assert.isTrue(s.multi);
      });

      test('has sane defaults', function() {
        assert.equal(s.selectedValues, undefined);
        assert.equal(s.selectedClass, 'iron-selected');
        assert.equal(s.items.length, 5);
      });

      test('set multi-selection via selected property', function() {
        // set selectedValues
        s.selectedValues = [0, 2];
        // check selected class
        assert.isTrue(s.children[0].classList.contains('iron-selected'));
        assert.isTrue(s.children[2].classList.contains('iron-selected'));
        // check selectedItems
        assert.equal(s.selectedItems.length, 2);
        assert.equal(s.selectedItems[0], s.children[0]);
        assert.equal(s.selectedItems[1], s.children[2]);
      });

      test('set multi-selection via tap', function() {
        // set selectedValues
        MockInteractions.tap(s.children[0]);
        MockInteractions.tap(s.children[2]);
        // check selected class
        assert.isTrue(s.children[0].classList.contains('iron-selected'));
        assert.isTrue(s.children[2].classList.contains('iron-selected'));
        // check selectedItems
        assert.equal(s.selectedItems.length, 2);
        assert.equal(s.selectedItems[0], s.children[0]);
        assert.equal(s.selectedItems[1], s.children[2]);
      });

      test('fire iron-select/deselect events when selectedValues changes', function() {
        // setup listener for iron-select/deselect events
        var items = [s.children[0], s.children[1], s.children[2]], 
            selectEventCounters = [0, 0, 0], 
            deselectEventCounters = [0, 0, 0];

        s.addEventListener('iron-select', function(e) {
          selectEventCounters[items.indexOf(e.detail.item)]++;
        });
        s.addEventListener('iron-deselect', function(e) {
          deselectEventCounters[items.indexOf(e.detail.item)]++;
        });

        // programatically select values 0 and 1 (both fire select)
        s.selectedValues = [0, 1];

        // programatically select values 1 and 2 (2 fires select, 0 fires deselect)
        s.selectedValues = [1, 2];

        // programatically deselect all values (1 and 2 fire deselect)
        s.selectedValues = [];

        // check events
        assert.equal(selectEventCounters[0], 1);
        assert.equal(deselectEventCounters[0], 1);
        assert.equal(selectEventCounters[1], 1);
        assert.equal(deselectEventCounters[1], 1);
        assert.equal(selectEventCounters[2], 1);
        assert.equal(deselectEventCounters[2], 1);
      });

      test('fire iron-select/deselect events when selectedValues is modified', function() {
        // setup listener for iron-select/deselect events
        var items = [s.children[0], s.children[1], s.children[2]],
            selectEventCounters = [0, 0, 0],
            deselectEventCounters = [0, 0, 0];

        s.addEventListener('iron-select', function(e) {
          selectEventCounters[items.indexOf(e.detail.item)]++;
        });
        s.addEventListener('iron-deselect', function(e) {
          deselectEventCounters[items.indexOf(e.detail.item)]++;
        });

        s.selectedValues = []

        // programatically select value 0
        s.push('selectedValues', 0, 1);

        // programatically deselect value 0
        s.shift('selectedValues');

        // programatically select value 2
        s.push('selectedValues', 2);

        // programatically deselect value 1
        s.shift('selectedValues');

        assert.equal(selectEventCounters[0], 1);
        assert.equal(deselectEventCounters[0], 1);
        assert.equal(selectEventCounters[1], 1);
        assert.equal(deselectEventCounters[1], 1);
        assert.equal(selectEventCounters[2], 1);
        assert.equal(deselectEventCounters[2], 0);
      });

      test('fire iron-select/deselect events when toggling items', function() {
        // setup listener for iron-select/deselect events
        var items = [s.children[0], s.children[1], s.children[2]], 
            selectEventCounters = [0, 0, 0], 
            deselectEventCounters = [0, 0, 0];

        s.addEventListener('iron-select', function(e) {
          selectEventCounters[items.indexOf(e.detail.item)]++;
        });
        s.addEventListener('iron-deselect', function(e) {
          deselectEventCounters[items.indexOf(e.detail.item)]++;
        });

        // tap to select items 0 and 1 (both fire select)
        MockInteractions.tap(items[0]);
        MockInteractions.tap(items[1]);
        
        // programatically select values 1 and 2 (2 fires select, 0 fires deselect)
        s.selectedValues = [1, 2];

        // tap to deselect items 1 and 2 (both fire deselect)
        MockInteractions.tap(items[1]);
        MockInteractions.tap(items[2]);

        // check events
        assert.equal(selectEventCounters[0], 1);
        assert.equal(deselectEventCounters[0], 1);
        assert.equal(selectEventCounters[1], 1);
        assert.equal(deselectEventCounters[1], 1);
        assert.equal(selectEventCounters[2], 1);
        assert.equal(deselectEventCounters[2], 1);
      });

      test('toggle iron-selected class when toggling items selection', function() {
        // setup listener for iron-item-select/deselect events
        var item0 = s.children[0], item1 = s.children[1];

        assert.isFalse(item0.classList.contains('iron-selected'));
        assert.isFalse(item1.classList.contains('iron-selected'));

        // tap to select item 0 (add iron-selected class)
        MockInteractions.tap(item0);

        assert.isTrue(item0.classList.contains('iron-selected'));
        assert.isFalse(item1.classList.contains('iron-selected'));
        
        // tap to select item 1 (add iron-selected class)
        MockInteractions.tap(item1);
        
        assert.isTrue(item0.classList.contains('iron-selected'));
        assert.isTrue(item1.classList.contains('iron-selected'));

        // tap to deselect item 1 (remove iron-selected class)
        MockInteractions.tap(item1);
        
        assert.isTrue(item0.classList.contains('iron-selected'));
        assert.isFalse(item1.classList.contains('iron-selected'));

        // programatically select both values (1 add iron-selected class)
        s.selectedValues = [0, 1];

        assert.isTrue(item0.classList.contains('iron-selected'));
        assert.isTrue(item1.classList.contains('iron-selected'));

        // programatically deselect all values (both removes iron-selected class)
        s.selectedValues = [];
        
        assert.isFalse(item0.classList.contains('iron-selected'));
        assert.isFalse(item1.classList.contains('iron-selected'));
      });

      test('fires selected-values-changed when selection changes', function() {
        var selectedValuesChangedEventCounter = 0;

        s.addEventListener('selected-values-changed', function(e) {
          selectedValuesChangedEventCounter++;
        });

        MockInteractions.tap(Polymer.dom(s).children[0]);
        MockInteractions.tap(Polymer.dom(s).children[0]);
        MockInteractions.tap(Polymer.dom(s).children[0]);

        expect(selectedValuesChangedEventCounter);
      });

      test('selects from items created by dom-repeat', function(done) {
        var selectEventCounter = 0;
        var firstChild;

        s = document.querySelector('#repeatedItems');
        s.addEventListener('iron-select', function(e) {
          selectEventCounter++;
        });

        // NOTE(cdata): I guess `dom-repeat` doesn't stamp synchronously..
        Polymer.Base.async(function() {
          firstChild = Polymer.dom(s).querySelector('div');
          MockInteractions.tap(firstChild);

          assert.equal(s.selectedItems[0].textContent, 'foo');
          done();
        });
      });

      test('updates selection when dom changes', function(done) {
        var selectEventCounter = 0;

        s = fixture('test');

        Polymer.Base.async(function() {
          var firstChild = Polymer.dom(s).querySelector(':first-child');
          var lastChild = Polymer.dom(s).querySelector(':last-child');

          MockInteractions.tap(firstChild);
          MockInteractions.tap(lastChild);

          expect(s.selectedItems.length).to.be.equal(2);

          Polymer.dom(s).removeChild(lastChild);

          Polymer.dom.flush();

          expect(s.selectedItems.length).to.be.equal(1);
          expect(s.selectedItems[0]).to.be.equal(firstChild);

          done();
        });

      });

      suite('`select()` and `selectIndex()`', function() {
        var selector;

        setup(function() {
          selector = fixture('valueById');
        });

        test('`select()` selects an item with the given value', function() {
          selector.select('item1');
          assert.equal(selector.selectedValues.length, 1);
          assert.equal(selector.selectedValues.indexOf('item1'), 0);

          selector.select('item3');
          assert.equal(selector.selectedValues.length, 2);
          assert.isTrue(selector.selectedValues.indexOf('item3') >= 0);

          selector.select('item2');
          assert.equal(selector.selectedValues.length, 3);
          assert.isTrue(selector.selectedValues.indexOf('item2') >= 0);
        });

        test('`selectIndex()` selects an item with the given index', function() {
          selector.selectIndex(1);
          assert.equal(selector.selectedValues.length, 1);
          assert.isTrue(selector.selectedValues.indexOf('item1') >= 0);
          assert.equal(selector.selectedItems.length, 1);
          assert.isTrue(selector.selectedItems.indexOf(selector.items[1]) >= 0);

          selector.selectIndex(3);
          assert.equal(selector.selectedValues.length, 2);
          assert.isTrue(selector.selectedValues.indexOf('item3') >= 0);
          assert.equal(selector.selectedItems.length, 2);
          assert.isTrue(selector.selectedItems.indexOf(selector.items[3]) >= 0);

          selector.selectIndex(0);
          assert.equal(selector.selectedValues.length, 3);
          assert.isTrue(selector.selectedValues.indexOf('item0') >= 0);
          assert.equal(selector.selectedItems.length, 3);
          assert.isTrue(selector.selectedItems.indexOf(selector.items[0]) >= 0);
        });
      });

      /* test('toggle multi from true to false', function() {
        // set selected
        s.selected = [0, 2];
        var first = s.selected[0];
        // set mutli to false, so to make it single-selection
        s.multi = false;
        // selected should not be an array
        assert.isNotArray(s.selected);
        // selected should be the first value from the old array
        assert.equal(s.selected, first);
      }); */

    });

  