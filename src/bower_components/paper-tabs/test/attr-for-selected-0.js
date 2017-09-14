
      function waitForIronItemsChanged(selector, callback) {
        selector.addEventListener('iron-items-changed', function onIronItemsChanged() {
          selector.removeEventListener('iron-items-changed', onIronItemsChanged);
          callback();
        })
      }

      suite('set the selected attribute', function() {

        var tabs;

        setup(function(done) {
          tabs = fixture('basic');
          waitForIronItemsChanged(tabs, done);
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

        setup(function(done) {
          tabs = fixture('basic');
          waitForIronItemsChanged(tabs, function() {
            tab = tabs.querySelector('[name=zot]');
            tab.dispatchEvent(new CustomEvent('click', {bubbles: true}));
            done();
          });
        });

        test('selected value', function() {
          assert.equal(tabs.selected, 'zot');
        });

        test('selected tab has iron-selected class', function() {
          assert.isTrue(tab.classList.contains('iron-selected'));
        });

      });

    