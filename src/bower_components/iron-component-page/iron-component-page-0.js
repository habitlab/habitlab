
    (function() {
      // var hydrolysis = require('hydrolysis');

      /**
       * @param {string} url
       * @return {string} `url` stripped of a file name, if one is present. This
       *     considers URLs like "example.com/foo" to already be a base (no `.` is)
       *     present in the final path part).
       */
      function _baseUrl(url) {
        return url.match(/^(.*?)\/?([^\/]+\.[^\/]+)?$/)[1] + '/';
      }

      Polymer({
        is: 'iron-component-page',

        properties: {
          /**
           * The URL to an import that declares (or transitively imports) the
           * elements that you wish to see documented.
           *
           * If the URL is relative, it will be resolved relative to the master
           * document.
           *
           * If a `src` URL is not specified, it will resolve the name of the
           * directory containing this element, followed by `dirname.html`. For
           * example:
           *
           * `awesome-sauce/index.html`:
           *
           *     <iron-doc-viewer></iron-doc-viewer>
           *
           * Would implicitly have `src="awesome-sauce.html"`.
           */
          src: {
            type:     String,
            observer: '_srcChanged',
          },

          /**
           * The URL to a precompiled JSON descriptor. If you have precompiled
           * and stored a documentation set using Hydrolysis, you can load the
           * analyzer directly via AJAX by specifying this attribute.
           *
           * If a `doc-src` is not specified, it is ignored and the default
           * rules according to the `src` attribute are used.
           */
          docSrc: {
            type: String,
            observer: '_srcChanged',
          },

          /**
           * The relative root for determining paths to demos and default source
           * detection.
           */
          base: {
            type: String,
            value: function() {
              // Don't include URL hash.
              return this.ownerDocument.baseURI.replace(/\#.*$/, '');
            }
          },

          /**
           * The element or behavior that will be displayed on the page. Defaults
           * to the element matching the name of the source file.
           */
          active: {
            type: String,
            notify: true,
            value: ''
          },

          /**
           * The current view. Can be `docs` or `demo`.
           */
          view: {
            type: String,
            value: 'docs',
            notify: true
          },

          /**
           * Whether _all_ dependencies should be loaded and documented.
           *
           * Turning this on will probably slow down the load process dramatically.
           */
          transitive: {
            type: Boolean,
            value: false
          },

          /** The Hydrolysis element descriptors that have been loaded. */
          docElements: {
            type:     Array,
            notify: true,
            readOnly: true,
            value: function() {
              return [];
            }
          },

          /** The Hydrolysis behavior descriptors that have been loaded. */
          docBehaviors: {
            type:     Array,
            notify: true,
            readOnly: true,
            value: function() {
              return [];
            }
          },

          /**
           * Demos for the currently selected element.
           */
          docDemos: {
            type: Array,
            notify: true,
            readOnly: true
          },

          /**
           * The scroll mode for the page. For details about the modes,
           * see the mode property in paper-header-panel.
           */
          scrollMode: {
            type: String,
            value: 'waterfall'
          },

          /**
           * The currently displayed element.
           *
           * @type {!hydrolysis.ElementDescriptor}
           */
          _activeDescriptor: Object,

          _fragmentPrefix: String,

          /**
           * Toggle flag to be used when this element is being displayed in the
           * Polymer Elements catalog.
           */
          catalog: {
            type: Boolean,
            value: false,
            reflectToAttribute: true
          },

          /**
           * An optional version string.
           */
          version: String,

          /**
           * The hydrolysis analyzer.
           *
           * @type {!hydrolysis.Analyzer}
           */
          _analyzer: {
            type: Object,
            observer: '_analyzerChanged',
          },
          _hydroDesc: {
            type: Object,
            observer: '_detectAnalyzer'
          },
          _ajaxDesc: {
            type: Object,
            observer: '_detectAnalyzer'
          },

          /** Whether the analyzer is loading source. */
          _loading: {
            type:     Boolean,
            observer: '_loadingChanged',
          },
          _hydroLoading: {
            type: Boolean,
            observer: '_detectLoading'
          },
          _ajaxLoading: {
            type: Boolean,
            observer: '_detectLoading'
          },

          /** The complete URL to this component's demo. */
          _demoUrl: {
            type: String,
            value: '',
          },

          /** The complete URL to this component's source. */
          _srcUrl: String,
        },

        observers: [
          '_updateFrameSrc(view, base)',
          '_activeChanged(active, _analyzer)'
        ],

        attached: function() {
          // In the catalog, let the catalog do all the routing
          if (!this.catalog) {
            this._setActiveFromHash();
            this.listen(window, 'hashchange', '_setActiveFromHash');
          }
        },

        detached: function() {
          if (!this.catalog) {
            this.unlisten(window, 'hashchange', '_setActiveFromHash');
          }
        },

        ready: function() {
          var elements = this._loadJson();
          if (elements) {
            this.docElements = elements;
            this._loading  = false;
          } else {
            // Make sure our change handlers trigger in all cases.
            if (!this.src && !this.catalog) {
              this._srcChanged();
            }
          }
        },

        /**
         * Loads an array of hydrolysis element descriptors (as JSON) from the text
         * content of this element, if present.
         *
         * @return {Array<hydrolysis.ElementDescriptor>} The descriptors, or `null`.
         */
        _loadJson: function() {
          var textContent = '';
          Array.prototype.forEach.call(Polymer.dom(this).childNodes, function(node) {
            textContent = textContent + node.textContent;
          });
          textContent = textContent.trim();
          if (textContent === '') return null;

          try {
            var json = JSON.parse(textContent);
            if (!Array.isArray(json)) return [];
            return json;
          } catch(error) {
            console.error('Failure when parsing JSON:', textContent, error);
            throw error;
          }
        },

        /**
         * Load the page identified in the fragment identifier.
         */

        _setActiveFromHash: function(hash) {
          // hash is either element-name or element-name:{properties|methods|events} or
          // element-name:{property|method|event}.member-name
          var hash = window.location.hash;
          if (hash) {
            var elementDelimiter = hash.indexOf(':');
            elementDelimiter = (elementDelimiter == -1) ? hash.length : elementDelimiter;
            var el = hash.slice(1, elementDelimiter);
            if (this.active != el) {
              this.active = el;
            }
            this.$.viewer.scrollToAnchor(hash);
          }
        },

        _srcChanged: function() {
          var srcUrl;
          if (this.docSrc) {
            if (!this.$.ajax.lastRequest || (this.docSrc !== this.$.ajax.lastRequest.url && this.docSrc !== this._lastDocSrc)) {
              this._ajaxLoading = true;
              this._ajaxDesc = null;
              this._activeDescriptor = null;
              this.$.ajax.generateRequest();
            }
            this._lastDocSrc = this.docSrc;
            return;
          } else if (this.src) {
            srcUrl = new URL(this.src, this.base).toString();
          } else {
            var base = _baseUrl(this.base);
            srcUrl = new URL(base.match(/([^\/]*)\/$/)[1] + ".html", base).toString();
          }

          // Rewrite gh-pages URLs to https://rawgit.com/
          var match = srcUrl.match(/([^\/\.]+)\.github\.io\/([^\/]+)\/?([^\/]*)$/);
          if (match) {
            srcUrl = "https://cdn.rawgit.com/" + match[1] + "/" + match[2] + "/master/" + match[3];
          }

          this._baseUrl = _baseUrl(srcUrl);
          this._srcUrl  = srcUrl;
          if (!this._hydroLoading) this.$.analyzer.analyze();
        },

        _updateFrameSrc: function(view) {
          if (!view || view.indexOf("demo:") !== 0) return "about:blank";

          var src = view.split(':')[1];
          var demoSrc = new URL(src, this.base).toString();

          // If you use history.pushState with iframe.src = url, you will create 2 history entries,
          // but creating a new iframe dynamically will prevent it.

          if (this._iframe) {
            Polymer.dom(this.$.demo).removeChild(this._iframe);
          }

          this._iframe = document.createElement('iframe');
          this._iframe.src = demoSrc;
          this._iframe.allowFullscreen = true;
          Polymer.dom(this.$.demo).appendChild(this._iframe);
        },

        _getDefaultActive: function() {
          var matchedPage;
          var url = this._srcUrl || this.base;
          var mainFile = url.replace(_baseUrl(this.base), '');

          function findMatch(list) {
            for (var item, i = 0; i < list.length; i++) {
              item = list[i];
              if (item && item.contentHref && item.contentHref.indexOf(mainFile) > 0) {
                return item;
              }
            }
            return null;
          }

          matchedPage = findMatch(this.docElements) || findMatch(this.docBehaviors);

          if (matchedPage) {
            return matchedPage.is;
          } else if (this.docElements.length > 0) {
            return this.docElements[0].is;
          } else if (this.docBehaviors.length > 0) {
            return this.docBehaviors[0].is;
          }
          return null;
        },

        _findDescriptor: function(name) {
          if (!this._analyzer) return null;

          var descriptor = this._analyzer.elementsByTagName[name];
          if (descriptor) return descriptor;

          for (var i = 0; i < this._analyzer.behaviors.length; i++) {
            if (this._analyzer.behaviors[i].is === name) {
              return this._analyzer.behaviors[i];
            }
          }
          return null;
        },

        _activeChanged: function(active, analyzer) {
          if (active === '') {
            this.active = this._getDefaultActive();
            return;
          }
          this.async(function() { this.$.active.value = active; });
          if (analyzer && analyzer.elementsByTagName) {
            this.$.headerPanel.scroller.scrollTop = 0;
            this._activeDescriptor = this._findDescriptor(active);
            if (this._activeDescriptor) {
              var hasDemo;
              var demos = this._activeDescriptor.demos;
              if (this.view && demos && demos.length) {
                var parts = this.view.split(':');
                if (parts[0] == 'demo') {
                  if (parts[1]) {
                    hasDemo = demos.some(function(d, i) {
                      if (d.path == parts[1]) {
                        return true;
                      }
                    });
                  }
                  if (!hasDemo) {
                    this.view = 'demo:' + demos[0].path;
                    hasDemo = true;
                  }
                }
              }
              if (!hasDemo == undefined) {
                this.view = 'docs';
              }
              if (this._activeDescriptor.is && !document.title) {
                document.title = this._activeDescriptor.is + " documentation";
              }
              if (this._activeDescriptor.is && !this.catalog) {
                this._fragmentPrefix = this._activeDescriptor.is + ':';
              } else {
                this._fragmentPrefix = '';
              }
              // On initial load, scroll to the selected anchor (if any).
              // This probably shouldn't be required when we're running
              // in the catalog, but at the moment it is.
              this.$.viewer.scrollToAnchor(window.location.hash);
            }
            this._setDocDemos(this._activeDescriptor ? this._activeDescriptor.demos : []);
          }
        },

        _loadingChanged: function() {
          this.toggleClass('loaded', !this._loading);
        },

        _detectLoading: function() {
          this._loading = this.docSrc ? this._ajaxLoading : this._hydroLoading;
        },

        _analyzerChanged: function() {
          var analyzer = this._analyzer;
          this._setDocElements(analyzer && analyzer.elements ? analyzer.elements : []);
          this._setDocBehaviors(analyzer && analyzer.behaviors ? analyzer.behaviors : []);

          if (!this._findDescriptor(this.active)) {
            this.active = this._getDefaultActive();
          }
        },

        _detectAnalyzer: function() {
          this._analyzer = this.docSrc ? this._ajaxDesc : this._hydroDesc;
        },

        _handleMenuItemSelected: function(e) {
          if (e.target && e.target.value) {
            window.location.hash = '#' + e.target.value;
          }
        },

        _handleAjaxResponse: function(e, req) {
          this._ajaxLoading = false;
          this._ajaxLastUrl = req.url;
          this._ajaxDesc = req.response;
        },

        _handleError: function(e) {
          this.fire('iron-component-page-error', e.detail);
        },

        _handleComponentSelectedEvent: function(ev) {
          var descriptor = this._findDescriptor(ev.detail);
          if (!descriptor) {
            console.warn("Could not navigate to ", ev.detail);
          }
          else {
            this.active = ev.detail;
          }
        },

        /**
         * Renders this element into static HTML for offline use.
         *
         * This is mostly useful for debugging and one-off documentation generation.
         * If you want to integrate doc generation into your build process, you
         * probably want to be calling `hydrolysis.Analyzer.analyze()` directly.
         *
         * @return {string} The HTML for this element with all state baked in.
         */
        marshal: function() {
          var jsonText = JSON.stringify(this.docElements || [], null, '  ');
          return '<' + this.is + '>\n' +
                 jsonText.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '\n' +
                 '</' + this.is + '>';
        },

        _demoView: function(path) {
          return "demo:" + path;
        },

        _viewType: function(view) {
          return view ? view.split(":")[0] : null;
        }
      });
    })();
  