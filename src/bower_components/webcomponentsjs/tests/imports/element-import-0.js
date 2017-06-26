
(function() {
  class XFoo extends HTMLElement {
    connectedCallback() {
      this.isCreated = true;
    }
  }
  window.customElements.define('x-foo', XFoo);
})();
