
    suite('focused-state', function() {
      var focusTarget;

      setup(function() {
        focusTarget = fixture('TrivialFocusedState');
      });

      suite('when is focused', function() {
        test('receives a focused attribute', function() {
          expect(focusTarget.hasAttribute('focused')).to.be.eql(false);
          MockInteractions.focus(focusTarget);
          expect(focusTarget.hasAttribute('focused')).to.be.eql(true);
        });

        test('focused property is true', function() {
          expect(focusTarget.focused).to.not.be.eql(true);
          MockInteractions.focus(focusTarget);
          expect(focusTarget.focused).to.be.eql(true);
        });
      });

      suite('when is blurred', function() {
        test('loses the focused attribute', function() {
          MockInteractions.focus(focusTarget);
          expect(focusTarget.hasAttribute('focused')).to.be.eql(true);
          MockInteractions.blur(focusTarget);
          expect(focusTarget.hasAttribute('focused')).to.be.eql(false);
        });

        test('focused property is false', function() {
          MockInteractions.focus(focusTarget);
          expect(focusTarget.focused).to.be.eql(true);
          MockInteractions.blur(focusTarget);
          expect(focusTarget.focused).to.be.eql(false);
        });
      });

      suite('when the focused state is disabled', function() {
        test('will not be focusable', function() {
          var blurSpy = sinon.spy(focusTarget, 'blur');
          MockInteractions.focus(focusTarget);
          focusTarget.disabled = true;
          expect(focusTarget.getAttribute('tabindex')).to.be.eql('-1');
          expect(blurSpy.called).to.be.eql(true);
        });
      });
    });

    suite('nested focusable', function() {
      var focusable;

      setup(function() {
        focusable = fixture('NestedFocusedState');
      });

      test('focus/blur events fired on host element', function() {
        var nFocusEvents = 0;
        var nBlurEvents = 0;

        focusable.addEventListener('focus', function() {
          nFocusEvents += 1;
          expect(focusable.focused).to.be.equal(true);
          MockInteractions.blur(focusable.$.input);
        });
        focusable.addEventListener('blur', function() {
          expect(focusable.focused).to.be.equal(false);
          nBlurEvents += 1;
        });

        MockInteractions.focus(focusable.$.input);

        expect(nBlurEvents).to.be.greaterThan(0);
        expect(nFocusEvents).to.be.greaterThan(0);
      });

    });


    suite('elements in the light dom', function() {
      var lightDOM, input, lightDescendantShadowInput;

      setup(function() {
        lightDOM = fixture('LightDOM');
        input = document.querySelector('#input');
        lightDescendantShadowInput = Polymer.dom(lightDOM)
            .querySelector('nested-focusable').$.input;
      });

      test('should not fire the focus event', function() {
        var nFocusEvents = 0;

        lightDOM.addEventListener('focus', function() {
          nFocusEvents += 1;
        });

        MockInteractions.focus(input);

        expect(nFocusEvents).to.be.equal(0);
      });

      test('should not fire the focus event from shadow descendants', function() {
        var nFocusEvents = 0;

        lightDOM.addEventListener('focus', function() {
          nFocusEvents += 1;
        });

        MockInteractions.focus(lightDescendantShadowInput);

        expect(nFocusEvents).to.be.equal(0);
      });

    });

  