
    suite('basic', function() {
    });
    suite('notify-resize', function() {
      test('only a destination page recieves a resize event', function(done) {
        var animatedPages = fixture('notify-resize');
        var resizables = Polymer.dom(animatedPages).children;
        var recieves = {};
        resizables.forEach(function(page) {
          page.addEventListener('iron-resize', function(event) {
            var pageName = event.currentTarget.tagName;
            recieves[pageName] = pageName in recieves ? recieves[pageName] + 1 : 1;
          });
        });
        animatedPages.selected = 2;
        setTimeout(function() {
          assert.deepEqual(recieves, {
            'C-RESIZABLE-PAGE': 1
          });
          done();
        }, 50);
      });
    });
    suite('animate-initial-selection', function() {
      test('\'neon-animation-finish\' event fired after animating initial selection', function(done) {
        var animatedPages = fixture('animate-initial-selection');
        assert.isUndefined(animatedPages.selected);
        var pages = Polymer.dom(animatedPages).children;
        animatedPages.addEventListener('neon-animation-finish', function(event) {
          assert.strictEqual(animatedPages.selected, 0);
          assert.isFalse(event.detail.fromPage);
          assert.deepEqual(event.detail.toPage, pages[0]);
          done();
        });
        animatedPages.selected = 0;
      });
    });
  