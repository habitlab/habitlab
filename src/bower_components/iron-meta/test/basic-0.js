

    suite('basic', function() {

      test('byKey', function() {
        var meta = document.createElement('iron-meta');
        assert.equal(meta.byKey('info'), 'foo/bar');
      });

      test('list', function() {
        var meta = document.createElement('iron-meta');
        assert.equal(meta.list.length, 1);
      });

    });

  