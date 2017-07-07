
    describe('Late upgrade', function() {
      var combobox;

      beforeEach(function() {
        combobox = fixture('combobox');
      });

      it('should have preset value from property', function(done) {
        // Set the value before the element is upgraded.
        combobox.items = ['foo', 'bar'];
        combobox.value = 'bar';

        expect(Polymer.isInstance(combobox)).to.be.false;

        Polymer.Base.importHref('../vaadin-combo-box.html', function() {
          expect(combobox.value).to.equal('bar');
          done();
        });
      });

    });
  