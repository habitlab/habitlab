
    describe('Late upgrade', function() {
      var datepicker;

      beforeEach(function() {
        datepicker = fixture('datepicker');
      });

      it('should have preset value from property', function(done) {
        this.timeout(30000);
        // Set the value before the element is upgraded.
        datepicker.value = '2000-01-01';

        expect(Polymer.isInstance(datepicker)).to.be.false;

        Polymer.Base.importHref('../vaadin-date-picker.html', function() {
          expect(datepicker.value).to.equal('2000-01-01');
          done();
        });
      });

    });
  