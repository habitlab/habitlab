
    suite('<paper-ripple>', function () {
      var mouseEvent;
      var rippleContainer;
      var ripple;

      suite('when tapped', function () {
        setup(function () {
          rippleContainer = fixture('TrivialRipple');
          ripple = rippleContainer.firstElementChild;
        });

        test('creates a ripple', function () {
          expect(ripple.ripples.length).to.be.eql(0);
          MockInteractions.down(ripple);
          expect(ripple.ripples.length).to.be.eql(1);
        });

        test('may create multiple ripples that overlap', function () {
          expect(ripple.ripples.length).to.be.eql(0);

          for (var i = 0; i < 3; ++i) {
            MockInteractions.down(ripple);
            expect(ripple.ripples.length).to.be.eql(i + 1);
          }
        });
      });

      suite('when holdDown is togggled', function() {
        setup(function () {
          rippleContainer = fixture('TrivialRipple');
          ripple = rippleContainer.firstElementChild;
        });

        test('generates a ripple', function() {
          ripple.holdDown = true;
          expect(ripple.ripples.length).to.be.eql(1);
        });

        test('generates a ripple when noink', function() {
          ripple.noink = true;
          ripple.holdDown = true;
          expect(ripple.ripples.length).to.be.eql(1);

        });

      });

      suite('when target is noink', function () {
        setup(function () {
          rippleContainer = fixture('NoinkTarget');
          ripple = rippleContainer.firstElementChild;
        });

        test('tapping does not create a ripple', function () {
          expect(ripple.ripples.length).to.be.eql(0);
          MockInteractions.down(ripple);
          expect(ripple.ripples.length).to.be.eql(0);
        });

        test('ripples can be manually created', function () {
          expect(ripple.ripples.length).to.be.eql(0);
          ripple.simulatedRipple()
          expect(ripple.ripples.length).to.be.eql(1);
        });
      });

      suite('with the `center` attribute set to true', function () {
        setup(function () {
          rippleContainer = fixture('CenteringRipple');
          ripple = rippleContainer.firstElementChild;
        });

        test('ripples will center', function (done) {
          var waveContainerElement;
          // let's ask the browser what `translate3d(0px, 0px, 0)` will actually look like
          var div = document.createElement('div');
          div.style.webkitTransform = 'translate3d(0px, 0px, 0px)';
          div.style.transform = 'translate3d(0px, 0px, 0)';

          MockInteractions.down(ripple);

          waveContainerElement = ripple.ripples[0].waveContainer;

          MockInteractions.up(ripple);

          window.requestAnimationFrame(function () {
            var currentTransform = waveContainerElement.style.transform;
            try {
              expect(div.style.transform).to.be.ok;
              expect(currentTransform).to.be.ok;
              expect(currentTransform).to.be.eql(div.style.transform);

              done();
            } catch (e) {
              done(e);
            }
          });
        });
      });

      suite('with the `recenters` attribute set to true', function () {
        setup(function () {
          rippleContainer = fixture('RecenteringRipple');
          ripple = rippleContainer.firstElementChild;
        });
        test('ripples will gravitate towards the center', function (done) {
          var waveContainerElement;
          var waveTranslateString;
          MockInteractions.down(ripple, {x: 10, y: 10});
          waveContainerElement = ripple.ripples[0].waveContainer;
          waveTranslateString = waveContainerElement.style.transform;
          MockInteractions.up(ripple);
          window.requestAnimationFrame(function () {
            try {
              expect(waveTranslateString).to.be.ok;
              expect(waveContainerElement.style.transform).to.be.ok;
              expect(waveContainerElement.style.transform).to.not.be.eql(waveTranslateString);
              done();
            } catch (e) {
              done(e);
            }
          });
        });
      });

      suite('remove a paper ripple', function () {
        setup(function () {
          rippleContainer = fixture('NoRipple');
        });
        test('add and remove a paper-ripple', function (done) {
          var ripple = document.createElement('paper-ripple');
          ripple.addEventListener('transitionend', function() {
            expect(ripple.parentNode).to.be.ok;
            Polymer.dom(rippleContainer).removeChild(ripple);
            done();
          });
          Polymer.dom(rippleContainer).appendChild(ripple);
          // NOTE: shadydom applies distribution asynchronously
          // for performance reasons webcomponents/shadydom#120
          // Flush to force distribution.
          window.ShadyDOM && window.ShadyDOM.flush();
          ripple.downAction();
          ripple.upAction();
        });
        test('reuse a paper-ripple', function (done) {
          var ripple = document.createElement('paper-ripple');
          Polymer.dom(rippleContainer).appendChild(ripple);
          Polymer.dom(rippleContainer).removeChild(ripple);

          ripple.addEventListener('transitionend', function() {
            expect(ripple.parentNode).to.be.ok;
            Polymer.dom(document.body).removeChild(ripple);
            done();
          });
          Polymer.dom(document.body).appendChild(ripple);
          // NOTE: shadydom applies distribution asynchronously
          // for performance reasons webcomponents/shadydom#120
          // Flush to force distribution.
          window.ShadyDOM && window.ShadyDOM.flush();
          ripple.downAction();
          ripple.upAction();
        });
      });

      suite('avoid double transitionend event', function () {
        setup(function () {
          rippleContainer = fixture('NoRipple');
        });
        test('the transitionend event should only fire once', function (done) {
          var ripple = document.createElement('paper-ripple');
          var transitionedEventCount = 0;
          ripple.addEventListener('transitionend', function() {
            ++transitionedEventCount;
            expect(transitionedEventCount).to.be.eql(1);
            Polymer.dom(rippleContainer).removeChild(ripple);
            setTimeout(function() { done(); });
          });
          Polymer.dom(rippleContainer).appendChild(ripple);
          // NOTE: shadydom applies distribution asynchronously
          // for performance reasons webcomponents/shadydom#120
          // Flush to force distribution.
          window.ShadyDOM && window.ShadyDOM.flush();
          ripple.downAction();
          ripple.upAction();
        });
      });

    });
  