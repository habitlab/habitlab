
    suite('disabled-state', function() {
      var disableTarget;

      suite('a trivial disabled state', function() {
        setup(function() {
          disableTarget = fixture('TrivialDisabledState');
        });

        suite('when disabled is true', function() {
          test('receives a disabled attribute', function() {
            disableTarget.disabled = true;
            expect(disableTarget.hasAttribute('disabled')).to.be.eql(true);
          });

          test('receives an appropriate aria attribute', function() {
            disableTarget.disabled = true;
            expect(disableTarget.getAttribute('aria-disabled')).to.be.eql('true');
          });
        });

        suite('when disabled is false', function() {
          test('loses the disabled attribute', function() {
            disableTarget.disabled = true;
            expect(disableTarget.hasAttribute('disabled')).to.be.eql(true);
            disableTarget.disabled = false;
            expect(disableTarget.hasAttribute('disabled')).to.be.eql(false);
          });
        });
      });

      suite('a state with an initially disabled target', function() {
        setup(function() {
          disableTarget = fixture('InitiallyDisabledState');
        });

        test('preserves the disabled attribute on target', function() {
          expect(disableTarget.hasAttribute('disabled')).to.be.eql(true);
          expect(disableTarget.disabled).to.be.eql(true);
        });

        test('adds `aria-disabled` to the target', function() {
          expect(disableTarget.getAttribute('aria-disabled')).to.be.eql('true');
        });
      });
    });
  