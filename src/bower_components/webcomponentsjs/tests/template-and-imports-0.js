
      // WCT = {
      //   waitFor: function(callback) {
      //     this.HTMLImports.whenReady(callback);
      //   }
      // };
    
      suite('basic', function() {
        var templateOne;
        var templateTwo;

        setup(function() {
          templateOne = document.querySelector('template#one');
          templateTwo = document.querySelector('template#two');
        });

        teardown(function() {
          window.remoteCurrentScriptExecuted = undefined;
          window.externalScriptParsed1 = undefined;
        });

        test('links are not imported before stamping', function() {
          assert.equal(window.remoteCurrentScriptExecuted, undefined);
          assert.equal(window.externalScriptParsed1, undefined);
        });

        test('links are imported when stamped', function(done) {
          document.head.appendChild(document.importNode(templateTwo.content, true));

          var imp = document.querySelector('[href="imports/csp-import-1.html"]');
          imp.addEventListener('load', function() {
            assert.ok(window.externalScriptParsed1);
            done();
          });
        });
      });
    