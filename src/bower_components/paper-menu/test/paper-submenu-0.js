

      suite('<paper-submenu>', function() {
        var menu,
            sub1, sub2, sub3,
            collapse1, collapse2, collapse3,
            trigger1, trigger2, trigger3;

        setup(function() {
          menu = fixture('basic');

          sub1 = menu.querySelectorAll('paper-submenu')[0];
          sub2 = menu.querySelectorAll('paper-submenu')[1];
          sub3 = menu.querySelectorAll('paper-submenu')[2];

          collapse1 = Polymer.dom(sub1.root).querySelector('iron-collapse');
          collapse2 = Polymer.dom(sub2.root).querySelector('iron-collapse');
          collapse3 = Polymer.dom(sub3.root).querySelector('iron-collapse');

          trigger1 = sub1.querySelector('.menu-trigger');
          trigger2 = sub2.querySelector('.menu-trigger');
          trigger3 = sub3.querySelector('.menu-trigger');
        });

        test('selecting an item expands the submenu', function() {
          assert.isFalse(collapse1.opened);
          assert.isFalse(collapse2.opened);
          assert.isFalse(collapse3.opened);

          MockInteractions.tap(trigger1);

          assert.isTrue(collapse1.opened);
          assert.isFalse(collapse2.opened);
          assert.isFalse(collapse3.opened);
        });

        test('selecting a different item closes the previously opened submenu', function() {
          assert.isFalse(collapse1.opened);
          assert.isFalse(collapse2.opened);
          assert.isFalse(collapse3.opened);

          MockInteractions.tap(trigger1);

          assert.isTrue(collapse1.opened);
          assert.isFalse(collapse2.opened);
          assert.isFalse(collapse3.opened);

          MockInteractions.tap(trigger2);

          assert.isFalse(collapse1.opened);
          assert.isTrue(collapse2.opened);
          assert.isFalse(collapse3.opened);
        });

        test('cannot open a disabled submenu', function() {
          assert.isFalse(collapse1.opened);
          assert.isFalse(collapse2.opened);
          assert.isFalse(collapse3.opened);

          MockInteractions.tap(trigger3);

          assert.isFalse(collapse1.opened);
          assert.isFalse(collapse2.opened);
          assert.isFalse(collapse3.opened);
        });

        test('selecting an item styles it and the parent', function() {
          var boldDiv = document.createElement('div');
          boldDiv.style.fontWeight = 'bold';
          document.body.appendChild(boldDiv);

          var normalDiv = document.createElement('div');
          normalDiv.style.fontWeight = 'normal';
          document.body.appendChild(normalDiv);

          assert.equal(getComputedStyle(trigger1).fontWeight, getComputedStyle(normalDiv).fontWeight);
          assert.equal(getComputedStyle(trigger2).fontWeight, getComputedStyle(normalDiv).fontWeight);
          assert.equal(getComputedStyle(trigger3).fontWeight, getComputedStyle(normalDiv).fontWeight);

          var item1 = sub1.querySelector('.menu-content').querySelector('paper-item');

          MockInteractions.tap(trigger1);
          // Nothing is initially selected.
          assert.equal(getComputedStyle(item1).fontWeight, getComputedStyle(normalDiv).fontWeight);
          MockInteractions.tap(item1);

          assert.equal(getComputedStyle(item1).fontWeight, getComputedStyle(boldDiv).fontWeight);
          assert.equal(getComputedStyle(trigger1).fontWeight, getComputedStyle(boldDiv).fontWeight);
          assert.equal(getComputedStyle(trigger2).fontWeight, getComputedStyle(normalDiv).fontWeight);
          assert.equal(getComputedStyle(trigger3).fontWeight, getComputedStyle(normalDiv).fontWeight);
        });

        test('selecting a new item de-styles the previous one', function() {
          var boldDiv = document.createElement('div');
          boldDiv.style.fontWeight = 'bold';
          document.body.appendChild(boldDiv);

          var normalDiv = document.createElement('div');
          normalDiv.style.fontWeight = 'normal';
          document.body.appendChild(normalDiv);

          assert.equal(getComputedStyle(trigger1).fontWeight, getComputedStyle(normalDiv).fontWeight);
          assert.equal(getComputedStyle(trigger2).fontWeight, getComputedStyle(normalDiv).fontWeight);
          assert.equal(getComputedStyle(trigger3).fontWeight, getComputedStyle(normalDiv).fontWeight);

          var item1 = sub1.querySelector('.menu-content').querySelector('paper-item');
          var item2 = sub2.querySelector('.menu-content').querySelector('paper-item');

          MockInteractions.tap(trigger1);
          MockInteractions.tap(item1);
          MockInteractions.tap(trigger2);
          MockInteractions.tap(item2);

          // Both children are still selected even though the first one is hidden.
          assert.equal(getComputedStyle(item1).fontWeight, getComputedStyle(boldDiv).fontWeight);
          assert.equal(getComputedStyle(item2).fontWeight, getComputedStyle(boldDiv).fontWeight);

          assert.equal(getComputedStyle(trigger1).fontWeight, getComputedStyle(normalDiv).fontWeight);
          assert.equal(getComputedStyle(trigger2).fontWeight, getComputedStyle(boldDiv).fontWeight);
          assert.equal(getComputedStyle(trigger3).fontWeight, getComputedStyle(normalDiv).fontWeight);
        });

        test('focus a submenu should redirect focus to the trigger', function(done) {
          MockInteractions.focus(sub1);
          flush(function() {
            assert.equal(sub1.shadowRoot ? sub1.shadowRoot.activeElement :
                document.activeElement, sub1.__trigger);
            done();
          });
        });
      });

      suite('<paper-submenu opened>', function() {
        var opened;
        var submenu;
        var collapse;

        var fail = function(msg) {
          return function() {
            throw new Error(msg);
          };
        };

        setup(function() {
          opened = fixture('opened');
          submenu = opened.querySelector('paper-submenu');
          collapse = Polymer.dom(submenu.root).querySelector('iron-collapse');
        });

        test('opened binding + .menu-trigger tap', function() {
          assert.isTrue(submenu.opened);

          var trigger = submenu.querySelector('.menu-trigger');
          MockInteractions.tap(trigger);
          assert.isFalse(submenu.opened);

          MockInteractions.tap(trigger);
          assert.isTrue(submenu.opened);
        });

        test('opened binding + open()/close()', function() {
          assert.isTrue(submenu.opened);

          submenu.close();
          assert.isFalse(submenu.opened);
          assert.isFalse(collapse.opened);

          submenu.open();
          assert.isTrue(submenu.opened);
          assert.isTrue(collapse.opened);
        });

        test('opened binding + toggle()', function() {
          assert.isTrue(submenu.opened);

          submenu.toggle();
          assert.isFalse(submenu.opened);
          assert.isFalse(collapse.opened);

          submenu.toggle();
          assert.isTrue(submenu.opened);
          assert.isTrue(collapse.opened);
        });

        test('opened binding + open() x 2', function() {
          assert.isTrue(submenu.opened);

          opened.addEventListener('paper-submenu-open', fail('duplicate open'));

          submenu.open();  // Opening when already opened should not fire().
        });

        test('opened binding + close() x 2', function() {
          submenu.close();
          assert.isFalse(submenu.opened);

          opened.addEventListener('paper-submenu-close', fail('duplicate close'));

          submenu.close();  // Closing again when !opened should not fire().
        });
      });
    