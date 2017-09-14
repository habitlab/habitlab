
      test('import upgrade async', function(done) {

        function testImports() {
          // import upgraded
          assert.ok(a1);
          assert.isTrue(isA1Upgraded);
          // order expected
          assert.deepEqual(a1DocsList, ['a1-instance.html', 'a1-reference.html']);
          // style applied at upgrade time
          if (window.HTMLImports) {
            assert.isTrue(styleAppliedToDocument);
          }
          done();
        }

        // be async
        setTimeout(function() {
          var l = document.createElement('link');
          l.rel = 'import';
          l.href = 'imports/a1-import.html';
          l.addEventListener('load', testImports);
          document.head.appendChild(l);
        });
      });
    