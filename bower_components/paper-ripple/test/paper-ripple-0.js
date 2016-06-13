
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

    });
  