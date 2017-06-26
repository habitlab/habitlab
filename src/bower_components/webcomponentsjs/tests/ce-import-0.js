
      test('ce-import', function(done) {
        var xfoo = document.querySelector('x-foo');
        assert.isUndefined(xfoo.isCreated);

        var link = document.createElement('link');
        link.rel = 'import';
        link.href = 'imports/element-import.html';
        document.head.appendChild(link);
        link.addEventListener('load', function() {
          assert.isTrue(xfoo.isCreated, 'element in main document, registered in dynamic import is upgraded');
          var ix = link.import.querySelector('x-foo');
          assert.isTrue(ix.isCreated, 'element in import, registered in dynamic import is upgraded');
          done();
        });
      });
    