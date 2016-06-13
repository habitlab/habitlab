
(function() {

  'use strict';

  var HIGHLIGHT_EVENT = 'syntax-highlight';

  Polymer({

    is: 'prism-highlighter',

    ready: function() {
      this._handler = this._highlight.bind(this);
    },

    attached: function() {
      (this.parentElement || this.parentNode.host).addEventListener(HIGHLIGHT_EVENT, this._handler);
    },

    detached: function() {
      (this.parentElement || this.parentNode.host).removeEventListener(HIGHLIGHT_EVENT, this._handler);
    },

    /**
     * Handle the highlighting event, if we can.
     *
     * @param {!CustomEvent} event
     */
    _highlight: function(event) {
      if (!event.detail || !event.detail.code) {
        Polymer.Base._warn('Malformed', HIGHLIGHT_EVENT, 'event:', event.detail);
        return;
      }

      event.stopPropagation();

      var detail = event.detail;
      detail.code = Prism.highlight(detail.code, this._detectLang(detail.code, detail.lang));
    },

    /**
     * Picks a Prism formatter based on the `lang` hint and `code`.
     *
     * @param {string} code The source being highlighted.
     * @param {string=} lang A language hint (e.g. ````LANG`).
     * @return {!prism.Lang}
     */
    _detectLang: function(code, lang) {
      if (!lang) {
        // Stupid simple detection if we have no lang, courtesy of:
        // https://github.com/robdodson/mark-down/blob/ac2eaa/mark-down.html#L93-101
        return code.match(/^\s*</) ? Prism.languages.markup : Prism.languages.javascript;
      }

      if (Prism.languages[lang]) {
        return Prism.languages[lang];
      }
      switch (lang.substr(0, 2)) {
        case 'js':
        case 'es':
          return Prism.languages.javascript;
        case 'c':
          return Prism.languages.clike;
        default:
          // The assumption is that you're mostly documenting HTML when in HTML.
          return Prism.languages.markup;
      }
    },

  });

})();
