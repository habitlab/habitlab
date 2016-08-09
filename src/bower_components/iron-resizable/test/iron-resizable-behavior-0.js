

  suite('iron-resizable-behavior', function() {
    var resizable;

    suite('events across shadow boundaries', function() {
      setup(function() {
        resizable = fixture('ResizableAndShadowBoundaries');
      });

      suite('ancestor\'s iron-resize', function() {
        test('only fires once for a notifying shadow descendent', function() {
          resizable.$.childResizable1.notifyResize();

          expect(resizable.ironResizeCount).to.be.equal(2);
        });

        test('only fires once when notifying descendent observables', function() {
          resizable.notifyResize();

          expect(resizable.ironResizeCount).to.be.equal(2);
        });
      });

      suite('descendant\'s iron-resize', function() {
        test('only fires once for a notifying shadow root', function() {
          resizable.notifyResize();

          expect(resizable.$.childResizable1.ironResizeCount).to.be.equal(2);
          expect(resizable.$.childResizable2.ironResizeCount).to.be.equal(2);
        });

        test('only fires once for a notifying descendent observable', function() {
          resizable.$.childResizable1.notifyResize();

          expect(resizable.$.childResizable1.ironResizeCount).to.be.equal(2);
        });
      });

      suite('window\'s resize', function() {
        test('causes all iron-resize events to fire once', function() {
          window.dispatchEvent(new CustomEvent('resize'));
          Polymer.dom.flush();
          expect(resizable.ironResizeCount).to.be.equal(2);
          expect(resizable.$.childResizable1.ironResizeCount).to.be.equal(2);
          expect(resizable.$.childResizable2.ironResizeCount).to.be.equal(2);
        });
      });
    });

  });
  