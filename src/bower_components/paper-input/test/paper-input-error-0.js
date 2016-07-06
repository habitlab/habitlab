

    suite('basic', function() {

      test('error message only appears when input is invalid', function() {
        var container = fixture('auto-validate-numbers');
        var input = Polymer.dom(container).querySelector('#i');
        var error = Polymer.dom(container).querySelector('#e');
        assert.equal(getComputedStyle(error).visibility, 'hidden', 'error is visibility:hidden');
        input.bindValue = 'foobar';
        assert.notEqual(getComputedStyle(error).visibility, 'hidden', 'error is not visibility:hidden');
      });

      test('error message add on is registered', function() {
        var container = document.getElementById('container');
        assert.isTrue(container._addons && container._addons.length === 1, 'add on is registered');
      });

    });

  