
    suite('getTabbableNodes', function() {

      test('returns tabbable nodes', function() {
        var node = fixture('basic');
        var focusableNodes = Polymer.IronFocusablesHelper.getTabbableNodes(node);
        assert.equal(focusableNodes.length, 3, '3 nodes are focusable');
        assert.equal(focusableNodes[0], Polymer.dom(node).querySelector('.focusable1'));
        assert.equal(focusableNodes[1], Polymer.dom(node).querySelector('.focusable2'));
        assert.equal(focusableNodes[2], Polymer.dom(node).querySelector('.focusable3'));
      });

      test('includes the root if it has a valid tabindex', function() {
        var node = fixture('basic');
        node.setAttribute('tabindex', '0');
        var focusableNodes = Polymer.IronFocusablesHelper.getTabbableNodes(node);
        assert.equal(focusableNodes.length, 4, '4 focusable nodes');
        assert.notEqual(focusableNodes.indexOf(node), -1, 'root is included');
      });

      test('excludes visibility: hidden elements', function() {
        var node = fixture('basic');
        var focusable = Polymer.dom(node).querySelector('.focusable1');
        focusable.classList.add('hidden');
        var focusableNodes = Polymer.IronFocusablesHelper.getTabbableNodes(node);
        assert.equal(focusableNodes.length, 2, '2 focusable nodes');
        assert.equal(focusableNodes.indexOf(focusable), -1, 'hidden element is not included');
      });

      test('excludes display: none elements', function() {
        var node = fixture('basic');
        var focusable = Polymer.dom(node).querySelector('.focusable1');
        focusable.classList.add('no-display');
        var focusableNodes = Polymer.IronFocusablesHelper.getTabbableNodes(node);
        assert.equal(focusableNodes.length, 2, '2 focusable nodes');
        assert.equal(focusableNodes.indexOf(focusable), -1, 'hidden element is not included');
      });

      test('respects the tabindex order', function() {
        var node = fixture('tabindex');
        var focusableNodes = Polymer.IronFocusablesHelper.getTabbableNodes(node);
        assert.equal(focusableNodes.length, 12, '12 nodes are focusable');
        for (var i = 0; i < 12; i++) {
          assert.equal(focusableNodes[i], Polymer.dom(node).querySelector('.focusable' + (i + 1)));
        }
      });

      test('includes tabbable elements in the shadow dom', function() {
        var node = fixture('shadow');
        var focusableNodes = Polymer.IronFocusablesHelper.getTabbableNodes(node);
        assert.equal(focusableNodes.length, 4, '4 nodes are focusable');
        assert.equal(focusableNodes[0], node.$.button0);
        assert.equal(focusableNodes[1], node.$.button1);
        assert.equal(focusableNodes[2], Polymer.dom(node).querySelector('input'));
        assert.equal(focusableNodes[3], node.$.button2);
      });

      test('handles composition', function() {
        var node = fixture('composed');
        var focusableNodes = Polymer.IronFocusablesHelper.getTabbableNodes(node);
        assert.equal(focusableNodes.length, 6, '6 nodes are focusable');
        assert.equal(focusableNodes[0], node.$.select);
        assert.equal(focusableNodes[1], node.$.wrapped.$.button0);
        assert.equal(focusableNodes[2], node.$.wrapped.$.button1);
        assert.equal(focusableNodes[3], Polymer.dom(node).querySelector('input'));
        assert.equal(focusableNodes[4], node.$.wrapped.$.button2);
        assert.equal(focusableNodes[5], node.$.focusableDiv);
      });

      test('handles distributed nodes', function() {
        var node = fixture('composed');
        var wrapped = node.$.wrapped;
        var focusableNodes = Polymer.IronFocusablesHelper.getTabbableNodes(wrapped);
        assert.equal(focusableNodes.length, 4, '4 nodes are focusable');
        assert.equal(focusableNodes[0], wrapped.$.button0);
        assert.equal(focusableNodes[1], wrapped.$.button1);
        assert.equal(focusableNodes[2], Polymer.dom(node).querySelector('input'));
        assert.equal(focusableNodes[3], wrapped.$.button2);
      });
    });
  