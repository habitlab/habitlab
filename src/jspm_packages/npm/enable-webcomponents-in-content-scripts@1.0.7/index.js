if (document.registerElement && /\{\s*\[native code\]\s*\}/.test(document.registerElement)) {
  document.registerElement = null; // disable native implementation of v0
}
if (document.registerElement == null) {
  require('webcomponentsjs-custom-element-v0');
}
