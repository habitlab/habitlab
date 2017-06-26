
      window.addEventListener('HTMLImportsLoaded', function() {
        window.importsOk = true;
      });
      window.webComponentsReadyCount = 0;
      document.addEventListener('WebComponentsReady', function() {
        window.webComponentsReadyCount++;
      });
    
      window.addEventListener('WebComponentsReady', () => {
        class MyElement extends HTMLElement {
          connectedCallback(){
            this.textContent = 'upgraded!';
          }
        }
        customElements.define('my-element', MyElement);
      });
      suite('Loader', function() {
        test('expected boot', function() {
          assert.equal(window.webComponentsReadyCount, 1, 'failed to fire WebComponentsReady');
          if (window.HTMLImports) {
            assert.ok(window.importsOk, 'WebComponentsReady without HTMLImportsLoaded');
          }
          assert.ok(window.importTest, 'import failed to set global value');
        });
        test('WebComponentsReady was fired on document and bubbled', function() {
          assert.equal(document.querySelector('my-element').textContent, 'upgraded!');
        })
      });
    