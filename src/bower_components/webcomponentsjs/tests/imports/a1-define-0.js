
(function() {

  window.a1DocsList = [];

  class A1 extends HTMLElement {
    connectedCallback() {
      a1DocsList.push(this.ownerDocument.baseURI.split('/').pop());
      this.isA1 = true;
    }
  }
  window.customElements.define('a-1', A1);


  class SpecialStyle extends HTMLStyleElement {
    connectedCallback() {
      window.styleAppliedToDocument = Boolean(this.__appliedElement);
    }
  }
  window.customElements.define('special-style', SpecialStyle);

})();
