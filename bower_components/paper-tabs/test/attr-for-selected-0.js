

      suite('set the selected attribute', function() {

        var tabs;

        setup(function () {
          tabs = fixture('basic');
        });

        test('selected value', function() {
          assert.equal(tabs.selected, 'bar');
        });

        test('selected tab has iron-selected class', function() {
          Polymer.dom.flush();
          assert.isTrue(tabs.querySelector('[name=bar]').classList.contains('iron-selected'));
        });

      });

      suite('select tab via click', function() {

        var tabs, tab;

        setup(function () {
          tabs = fixture('basic');
          tab = tabs.querySelector('[name=zot]');
          tab.dispatchEvent(new CustomEvent('click', {bubbles: true}));
        });

        test('selected value', function() {
          assert.equal(tabs.selected, 'zot');
        });

        test('selected tab has iron-selected class', function() {
          Polymer.dom.flush();
          assert.isTrue(tab.classList.contains('iron-selected'));
        });

      });

    