
    suite('Custom Element upgrade', function() {
      test('upgrade order', function() {
        var order = [];
        class XFoo extends HTMLElement {
          connectedCallback() {
            order.push(this.id);
          }
        }
        window.customElements.define('x-foo', XFoo);
        assert.deepEqual(order, ['import', 'main'], 'elements are upgraded in imports before main document');
      });
    });
  