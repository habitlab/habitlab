
  // Kick off shady CSS.
  var template = document.createElement('template');
  template.innerHTML =
    `
      <style>:host {color: blue;} .red-text {color: red;} </style>
      <p class="red-text">Shadow DOM</p>
      <slot id="slot"></slot>
    `;
  if (template) {
    if (window.ShadyCSS) {
      window.ShadyCSS.prepareTemplate(template, 'simple-element');
    }
  }

  class SimpleElement extends HTMLElement {
    constructor() {
      super();
      this.bestName = 'batman';
      if (window.ShadyCSS) {
        window.ShadyCSS.styleElement(this);
      }

      if (template && !this.shadowRoot) {
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(document.importNode(template.content, true));
      }
    }
  }

  window.customElements.define('simple-element', SimpleElement);
