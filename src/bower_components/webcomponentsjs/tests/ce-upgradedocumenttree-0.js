
      WCT = {
        waitFor: function(cb) {
          cb();
        }
      }
    
      var created = 0;
      function register() {
        class XTest extends HTMLElement {
          connectedCallback() {
            created++;
          }
        }
        window.customElements.define('x-test', XTest);
      }

      test('upgraded document tree', function(done) {
        if (CustomElements.useNative || !window.HTMLImports) {
          return done();
        } else {
          window.addEventListener('WebComponentsReady', function() {
            CustomElements.ready = false;
            register();
            assert.equal(created, 0, 'no elements created when ready explicitly set to false');
            CustomElements.upgradeDocumentTree(document);
            assert.equal(created, 3, 'elements in document tree upgraded via CustomElements.upgradeDocumentTree');
            done();
          });
        }
      });
    