
    'use strict';

    Polymer({
      is: 'demo-snippet',

      properties: {
        _markdown: {
          type: String,
          value: ''
        }
      },

      attached: function() {
        var template = Polymer.dom(this).queryDistributedElements('template')[0];

        // If there's no template, render empty code.
        if (!template) {
          this._markdown = '```\n```';
          return;
        }

        var snippet = this.$.marked.unindent(template.innerHTML);

        // Boolean properties are displayed as checked="", so remove the ="" bit.
        snippet = snippet.replace(/=""/g, '');

        this._markdown = '```\n' + snippet + '\n' + '```';

        // Stamp the template.
        Polymer.dom(this).appendChild(document.importNode(template.content, true));
      },

      _copyToClipboard: function() {
        // From https://github.com/google/material-design-lite/blob/master/docs/_assets/snippets.js
        var snipRange = document.createRange();
        snipRange.selectNodeContents(this.$.code);
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(snipRange);
        var result = false;
        try {
          result = document.execCommand('copy');
          this.$.copyButton.icon = 'done';
        } catch (err) {
          // Copy command is not available
          console.error(err);
          this.$.copyButton.icon = 'error';
        }

        // Return to the copy button after a second.
        setTimeout(this._resetCopyButtonState.bind(this), 1000);

        selection.removeAllRanges();
        return result;
      },

      _resetCopyButtonState: function() {
        this.$.copyButton.icon = 'content-copy';
      }
    });
  