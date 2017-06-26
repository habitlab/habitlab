
      // IE11 needs to wait for Polymer being loaded.
      HTMLImports.whenReady(function() {
        Polymer({
          is: 'value-null',
          properties: {
            value: {
              notify: true
            }
          },
        });
      });
    
  describe('data binding', function() {

    // Chrome demonstrates a loop when setting value to null/undefined and value is
    // bound in other components firing change events like in iron-input#bindValue.
    // In other browsers these tests do not work, and the browser could freeze.
    describeIf(chrome, 'Chrome loops', function() {
      var valueNull, comboBox;

      beforeEach(function() {
        var root = fixture('fixturenull');
        valueNull = Polymer.dom(root).querySelector('value-null');
        comboBox = Polymer.dom(root).querySelector('vaadin-combo-box');
      });

      // Setting value to null/undefined makes the component enter in a loop,
      // for instance iron-localstorage sets it to null when the key does not exist.
      [null, undefined].forEach(function(value) {
        it('should not enter in a loop when setting value to ' + value, function(done) {

          // Not using sinon.spy, so we can break the loop before overflowing the stack.
          var i = 0;
          comboBox.addEventListener('value-changed', function() {
            expect(i++).to.be.below(30);
          });

          Polymer.Base.async(function() {
            expect(i).to.be.at.most(2);
            done();
          }, 1);

          valueNull.value = value;
        });
      });
    });
  });
  