
  HTMLImports.whenReady(function() {
    Polymer({ is: 'x-selecting-element' });
    Polymer({ is: 'test-element' });
    Polymer({
      is: 'test-animation',
      behaviors: [
        Polymer.NeonAnimationBehavior
      ],
      configure: function(config) {
        config.node.animated = true;
      }
    });
  });

suite('descendant selection', function() {
  test('descendents of other selectors are not animated', function() {
    var animatedPages = fixture('descendant-selection');
    var selector = Polymer.dom(animatedPages).querySelector('#selector');
    var target = Polymer.dom(animatedPages).querySelector('#target');
    Polymer.dom(selector).setAttribute('selected', '1');
    assert(!target.animated);
  });
  test('elements distributed as children are animated', function() {
    var testElement = fixture('distributed-children');
    var target = Polymer.dom(testElement).querySelector('#target');
    var animatedPages = Polymer.dom(testElement.root).querySelector("neon-animated-pages");
    Polymer.dom(animatedPages).setAttribute('selected', '1');
    assert(target.animated);
  });
  test('ignores selection from shadow descendants of its items', function() {
    var pages = fixture('selecting-item');
    var target = Polymer.dom(pages).querySelector('#target');
    var selecting = Polymer.dom(pages).querySelector('x-selecting-element');
    selecting.$.selector.selected = 1;
    assert(!target.animated);
  });
});
