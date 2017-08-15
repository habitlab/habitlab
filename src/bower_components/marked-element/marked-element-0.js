

  'use strict';

  const marked = require('marked');

  Polymer({

    is: 'marked-element',

    properties: {

      /**
       * The markdown source that should be rendered by this element.
       */
      markdown: {
        observer: 'render',
        type: String,
        value: null
      },
      /**
       * Conform to obscure parts of markdown.pl as much as possible. Don't fix any of the original markdown bugs or poor behavior.
       */
      pedantic: {
        observer: 'render',
        type: Boolean,
        value: false
      },
      /**
       * Sanitize the output. Ignore any HTML that has been input.
       */
      sanitize: {
        observer: 'render',
        type: Boolean,
        value: false
      },
      /**
       * Use "smart" typographic punctuation for things like quotes and dashes.
       */
      smartypants: {
        observer: 'render',
        type: Boolean,
        value: false
      },
      /**
       * Callback function invoked by Marked after HTML has been rendered.
       * It must take two arguments: err and text and must return the resulting text.
       */
      callback: {
        observer: 'render',
        type: Function,
        value: null
      }
    },

    ready: function() {
      if (!this.markdown) {
        // Use the Markdown from the first `<script>` descendant whose MIME type starts with
        // "text/markdown". Script elements beyond the first are ignored.
        var markdownElement = Polymer.dom(this).querySelector('[type^="text/markdown"]');
        if (markdownElement != null) {
          this.markdown = this._unindent(markdownElement.textContent);
        }
      }
    },

    /**
     * Renders `markdown` to HTML when the element is attached.
     *
     * This serves a dual purpose:
     *
     *  * Prevents unnecessary work (no need to render when not visible).
     *
     *  * `attached` fires top-down, so we can give ancestors a chance to
     *    register listeners for the `syntax-highlight` event _before_ we render
     *    any markdown.
     *
     */
    attached: function() {
      this._attached = true;
      this._outputElement = this.outputElement;
      this.render();
    },

    detached: function() {
      this._attached = false;
    },

    /**
     * Unindents the markdown source that will be rendered.
     */
    unindent: function(text) {
      return this._unindent(text);
    },

    get outputElement () {
      var child = Polymer.dom(this).queryDistributedElements('.markdown-html')[0];

      if (child)
        return child;

      this.toggleClass('hidden', false, this.$.content);
      return this.$.content;
    },

    /**
     * The `marked-render-complete` event is fired once Markdown to HTML
     * conversion has finished, and the DOM has been populated via the resulting
     * HTML.
     *
     * @event marked-render-complete
     */

    /**
     * Renders `markdown` into this element's DOM.
     *
     * This is automatically called whenever the `markdown` property is changed.
     *
     * The only case where you should be calling this is if you are providing
     * markdown via `<script type="text/markdown">` after this element has been
     * constructed (or updating that markdown).
     */
    render: function() {
      if (!this._attached) return;
      if (!this.markdown) {
        Polymer.dom(this._outputElement).innerHTML = '';
        return;
      }
      var opts = {
        highlight: this._highlight.bind(this),
        sanitize: this.sanitize,
        pedantic: this.pedantic,
        smartypants: this.smartypants
      };
      Polymer.dom(this._outputElement).innerHTML = marked(this.markdown, opts, this.callback);
      this.fire('marked-render-complete');
    },

    _highlight: function(code, lang) {
      var event = this.fire('syntax-highlight', {code: code, lang: lang});
      return event.detail.code || code;
    },

    _unindent: function(text) {
      if (!text) return text;
      var lines  = text.replace(/\t/g, '  ').split('\n');
      var indent = lines.reduce(function(prev, line) {
        if (/^\s*$/.test(line)) return prev;  // Completely ignore blank lines.

        var lineIndent = line.match(/^(\s*)/)[0].length;
        if (prev === null) return lineIndent;
        return lineIndent < prev ? lineIndent : prev;
      }, null);

      return lines.map(function(l) { return l.substr(indent); }).join('\n');
    }

  });

