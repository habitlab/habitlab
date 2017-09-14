Polymer = {lazyRegister: true}
    suite('animations found when `lazRegister` setting is true', function() {
      test('animations are registered', function(done) {
        var animatedPages = fixture('animate-initial-selection');
        animatedPages._complete = sinon.spy(animatedPages._complete);
        assert.isUndefined(animatedPages.selected);
        var pages = Polymer.dom(animatedPages).children;
        animatedPages.addEventListener('neon-animation-finish', function(event) {
          if (animatedPages.selected === 0) {
            animatedPages.selected = 1;
            return;
          }
          assert.strictEqual(animatedPages.selected, 1);
          assert.equal(event.detail.fromPage, pages[0]);
          assert.equal(event.detail.toPage, pages[1]);
          assert.isTrue(animatedPages._complete.calledTwice);
          var a$ = animatedPages._complete.getCall(1).args[0];
          assert.isTrue(a$[0].neonAnimation.isNeonAnimation, 'entry animation is not a registered animation');
          assert.isTrue(a$[1].neonAnimation.isNeonAnimation, 'exit animation is not a registered animation');
          done();
        });
        animatedPages.selected = 0;
      });
    });
  