

    suite('basic', function() {

      test('error message only appears when input is invalid', function(done) {
        var container = Polymer.Element ?
            fixture('auto-validate-numbers-2') :
            fixture('auto-validate-numbers-1');
        var input = Polymer.dom(container).querySelector('#i');
        var error = Polymer.dom(container).querySelector('#e');

        // Need to wait a tick to stamp the error message.
        Polymer.Base.async(function() {
          assert.equal(getComputedStyle(error).visibility, 'hidden', 'error is visibility:hidden');
          input.bindValue = 'foobar';
          assert.equal(getComputedStyle(error).visibility, 'visible', 'error is visibility:visible');
          done();
        }, 1);
      });

      test('error message add on is registered', function() {
        var container = document.getElementById('container');
        assert.isTrue(container._addons && container._addons.length === 1, 'add on is registered');
      });

    });

  