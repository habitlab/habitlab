
    suite('basic', function() {
      var form;

      setup(function() {
        form = fixture('basic');
      });

      test('elements fire an event when attached', function(done) {
        var element = document.createElement('input', 'simple-element');

        var handler = sinon.spy();
        form.addEventListener('iron-form-element-register', handler);

        form.appendChild(element);
        Polymer.Base.async(function() {
          expect(handler.callCount).to.be.equal(1);
          done();
        }, 1);
      });

      test('elements fire an event when detached', function(done) {
        var element = document.createElement('input', 'simple-element');
        form.appendChild(element);
        element._parentForm = form;

        var handler = sinon.spy();
        form.addEventListener('iron-form-element-unregister', handler);

        form.removeChild(element);
        Polymer.Base.async(function() {
          expect(handler.callCount).to.be.equal(1);
          done();
        }, 1);
      });
  });

  