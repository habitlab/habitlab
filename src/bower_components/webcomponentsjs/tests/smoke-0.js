
      test('smoke', function(done) {
        class XFoo extends HTMLElement {
          connectedCallback() {
            this.textContent = 'x-foo!';
          }
        }
        window.customElements.define('x-foo', XFoo);
        assert.equal(document.querySelector('x-foo').textContent, 'x-foo!',
            'x-foo must have custom text');

        class XZot extends HTMLElement {
          connectedCallback() {
            this.textContent = 'x-zot!';
          }
        }
        window.customElements.define('x-zot', XZot);

        var xfoo = document.querySelector('x-foo');
        var root = xfoo.attachShadow({mode: 'open'});
        var xzot = document.createElement('x-zot');

        var handler = function() {
          assert.equal(xzot.textContent, 'custom!', 'x-zot in shadow root must have custom text');
          done();
        }
        var ob = new MutationObserver(handler);
        ob.observe(root, {childList: true, subtree: true});
        root.appendChild(xzot);
      });
    