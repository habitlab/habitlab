
      suite('integration', function() {
        var el;

        setup(function() {
          el = document.querySelector('#basic');
        });

        test('element is imported & upgraded', function() {
          assert.equal(el.bestName, 'batman',
              'doesn\'t have property set in constructor');
        });

        test('element has shadow DOM content', function() {
          var shadowRoot = el.shadowRoot;

          assert.ok(shadowRoot, 'does not have a shadow root');
          assert.equal(shadowRoot.querySelector('p').textContent, 'Shadow DOM',
              'does not have <p> in the shadow dom');
          assert.equal(getComputedStyle(shadowRoot.querySelector('p')).color, 'rgb(255, 0, 0)',
              'does not style <p> in the shadow dom');
        });

        test('element has distributed content', function() {
          var slot = el.shadowRoot.querySelector('slot');
          assert.ok(slot, 'does not have a slot');

          var distributedNodes = slot.assignedNodes()
          assert.equal(distributedNodes.length, 1,
                  'does not have exactly one element distributed');
          assert.equal(distributedNodes[0].textContent, 'Light DOM',
                  'does not have the right content distributed');
          assert.equal(getComputedStyle(distributedNodes[0]).color, 'rgb(0, 0, 255)',
              'does not style light dom');
        });
      });
    