
    describe('vaadin-combo-box-light', function() {
      var comboBox, ironInput;

      beforeEach(function() {
        comboBox = fixture('combobox-light');
        comboBox.items = ['foo', 'bar', 'baz'];
        ironInput = comboBox.querySelector('input[is="iron-input"]');
      });

      describe('using iron-input', function() {
        it('should find the input element correctly', function() {
          expect(comboBox.inputElement).to.eql(ironInput);
        });

        it('should bind the input value correctly', function() {
          // Empty string by default.
          expect(comboBox._inputElementValue).to.eql('');
          expect(ironInput.value).to.eql('');

          comboBox.value = 'foo';
          expect(comboBox._inputElementValue).to.eql('foo');
          expect(ironInput.value).to.eql('foo');
        });
      });

      it('should prevent default on overlay down', function() {
        var e = new CustomEvent('mousedown', {bubbles: true});
        var spy = sinon.spy(e, 'preventDefault');
        comboBox.$.overlay.dispatchEvent(e);
        expect(spy.called).to.be.true;
      });

      it('should not prevent default on input down', function() {
        var e = new CustomEvent('mousedown', {bubbles: true});
        var spy = sinon.spy(e, 'preventDefault');
        ironInput.dispatchEvent(e);
        expect(spy.called).to.be.false;
      });
    });

    describe('vaadin-combo-box-light-paper-input', function() {
      var comboBox, paperInput;

      beforeEach(function() {
        comboBox = fixture('combobox-light-paper-input');
        comboBox.items = ['foo', 'bar', 'baz'];
      });

      it('should toggle overlay by tapping toggle element', function() {
        MockInteractions.tap(comboBox._toggleElement);
        expect(comboBox.opened).to.be.true;

        MockInteractions.tap(comboBox._toggleElement);
        expect(comboBox.opened).to.be.false;
      });

      it('should prevent default on toggle element down', function() {
        var e = new CustomEvent('down', {bubbles: true});
        var spy = sinon.spy(e, 'preventDefault');
        comboBox._toggleElement.dispatchEvent(e);
        expect(spy.called).to.be.true;
      });
    });
  