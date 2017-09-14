

  Polymer({

    is: 'vaadin-grid-table',

    behaviors: [
      vaadin.elements.grid.IronListBehavior,
      vaadin.elements.grid.TableScrollBehavior,
      vaadin.elements.grid.TableKeyboardBehavior,
      vaadin.elements.grid.TableColumnReorderingBehavior,
      Polymer.Templatizer
    ],

    properties: {
      size: Number,

      columnTree: Array,

      bindData: Function,

      rowDetailsTemplate: Object,

      columnReorderingAllowed: {
        type: Boolean,
        reflectToAttribute: true
      },

      safari: {
        type: Boolean,
        value: /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
      },

      scrollbarWidth: {
        type: Number,
        value: function() {
          // Create the measurement node
          var scrollDiv = document.createElement('div');
          scrollDiv.style.width = '100px';
          scrollDiv.style.height = '100px';
          scrollDiv.style.overflow = 'scroll';
          scrollDiv.style.position = 'absolute';
          scrollDiv.style.top = '-9999px';
          document.body.appendChild(scrollDiv);
          // Get the scrollbar width
          var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

          // Delete the DIV
          document.body.removeChild(scrollDiv);
          return scrollbarWidth;
        }
      },

      target: Object,

      hasData: Boolean
    },

    observers: [
      '_columnTreeChanged(columnTree, _physicalItems, _physicalCountVal)',
      '_sizeChanged(size, bindData, hasData)',
      '_rowDetailsTemplateChanged(rowDetailsTemplate, _physicalItems, _physicalCountVal)'
    ],

    listeners: {
      'property-changed': '_columnPropChanged',
      'copy': '_onCopy',
      'animationend': '_onAnimationEnd',
      'header.column-resizing': '_onColumnResize'
    },

    _onColumnResize: function() {
      this.toggleAttribute('column-resizing', this.$.header.querySelector('[column-resizing]'));
      this._gridResizeHandler();
    },

    _onAnimationEnd: function(e) {
      if (/appear/.test(e.animationName)) {
        this._render();
        this._updateHeaderFooterMetrics();
        e.stopPropagation();
      }
    },

    _columnPropChanged: function(e) {
      if (e.detail.path === 'headerTemplate') {
        this.toggleAttribute('has-templates', true, this.$.header);
      }

      if (e.detail.path === 'footerTemplate') {
        this.toggleAttribute('has-templates', true, this.$.footer);
      }

      if (/frozen|hidden/.test(e.detail.path)) {
        this._frozenCellsChanged();
      }

      if (e.detail.path === 'hidden') {
        this._gridResizeHandler();
      }
    },

    _onCopy: function() {
      if (this.safari) {
        this.toggleAttribute('copying', true);
        this.async(function() {
          this.toggleAttribute('copying', false);
        }, 1);
      }
    },

    // The following values aim at avoiding having 2 overlapping semi-invisible
    // scrollbars visible at the same time when scrollbar width is 0
    // (OSX's "show scrollbars: when scrolling").
    // 1. hide the outerscroller altogether when scrollbar width is 0
    _hideOuterScroller: function(scrollbarWidth, safari) {
      return scrollbarWidth === 0 && !safari;
    },
    // 2. Safari (on desktop and IOS) requires outer scroller to work properly
    // so in that case we hide the table's scrollbar instead.
    _hideTableOverflow: function(scrollbarWidth, safari) {
      return scrollbarWidth === 0 && safari;
    },

    _rowDetailsTemplateChanged: function(rowDetailsTemplate, physicalItems) {
      physicalItems.forEach(function(row) {
        row.rowDetailsTemplate = rowDetailsTemplate;
      });
    },

    _columnTreeChanged: function(columnTree, physicalItems, count) {
      this._frozenCellsChanged();
      this._hasTemplatesChanged(columnTree);

      physicalItems.forEach(function(row) {
        row.columns = columnTree[columnTree.length - 1];
      });

      this._gridResizeHandler();
      this._updateLastColumn();
    },

    _updateLastColumn: function() {
      Polymer.dom(this.$.table).querySelectorAll('tr').forEach(function(row) {
        row.updateLastColumn();
      });
    },

    _updateHeaderFooterMetrics: function() {
      if (this._physicalSizes) {
        Polymer.dom.flush();
      }
      this._updateHeaderFooterMetricsSync();

      Polymer.RenderStatus.afterNextRender(this.$.header, function() {
        this._updateHeaderFooterMetricsSync();
        if (this._pendingScrollToScaledIndex) {
          this.scrollToScaledIndex(this._pendingScrollToScaledIndex);
        }
      }.bind(this));
    },

    _updateHeaderFooterMetricsSync: function() {
      var headerHeight = this.$.header.clientHeight + 'px';
      var footerHeight = this.$.footer.clientHeight + 'px';

      [this.$.outersizer, this.$.fixedsizer, this.$.items].forEach(function(element) {
        element.style.borderTopWidth = headerHeight;
        element.style.borderBottomWidth = footerHeight;
      });
    },

    _hasTemplatesChanged: function(columnTree) {
      var hasHeaders = false;
      var hasFooters = false;
      columnTree.forEach(function(row) {
        return row.forEach(function(col) {
          hasHeaders = hasHeaders || col.headerTemplate;
          hasFooters = hasFooters || col.footerTemplate;
        });
      });

      this.toggleAttribute('has-templates', hasHeaders, this.$.header);
      this.toggleAttribute('has-templates', hasFooters, this.$.footer);
    },

    /**
     * Creates a pool of DOM elements and attaches them to the local dom.
     */
    _createPool: function(size) {
      var physicalItems = new Array(size);

      for (var i = 0; i < size; i++) {
        var row = document.createElement('tr', 'vaadin-grid-table-row');
        row.target = this.domHost;
        physicalItems[i] = row;
        row.setAttribute('hidden', ''); // hidden by default, removed when data is bound.
        Polymer.dom(this.$.items).appendChild(row);
      }

      return physicalItems;
    },

    _sizeChanged: function(size, bindData, hasData) {
      var scrollTop = this._scrollTop;
      var firstVisibleIndex = this.firstVisibleIndex + this._vidxOffset;

      /* TODO: virtual count of 500k will make the sizer.top too large for Firefox */
      this._virtualCount = Math.min(size, 100000);
      this._physicalIndexForKey = {};
      this._firstVisibleIndexVal = null;
      this._lastVisibleIndexVal = null;

      this._vidxOffset = 0;

      if (!this._physicalItems) {
        var DEFAULT_PHYSICAL_COUNT = 25;

        this._physicalCount = Math.max(1, Math.min(DEFAULT_PHYSICAL_COUNT, this._virtualCount));
        this._physicalItems = this._createPool(this._physicalCount);
        this._physicalSizes = new Array(this._physicalCount);
      }

      this._itemsRendered = false;

      this._debounceTemplate(function() {
        this._render();

        if (!this._viewportHeight) {
          return;
          // Don't run the following before init or pool size for non-Chrome browsers grows too large
        }

        // The size may have decreased so need to scroll to appropriate index first
        this.scrollToScaledIndex(Math.min(firstVisibleIndex, this.size));
        // Scroll to the original scroll position (if possible)
        this._scrollTop = scrollTop;
        this._scrollHandler();

        this.flushDebouncer('vaadin-grid-scrolling');

      });
    },

    /**
     * Assigns the data models to a given set of items.
     * @param {!Array<number>=} itemSet
     */
    _assignModels: function(itemSet) {
      this._virtualIndexToItem = this._virtualIndexToItem || {};
      this._iterateItems(function(pidx, vidx) {
        var el = this._physicalItems[pidx];
        if (el.index) {
          delete this._virtualIndexToItem[el.index];
        }
        el.index = vidx + this._vidxOffset;
        this._virtualIndexToItem[el.index] = el;
        el.toggleAttribute('odd', el.index % 2);
        el.toggleAttribute('lastrow', el.index === this.size - 1);
        el.toggleAttribute('hidden', el.index >= this.size);
        this.bindData(el.index, el);
      }, itemSet);
    },

    _gridResizeHandler: function() {
      this._updateHeaderFooterMetrics();

      if (this._physicalSizes) {
        this._physicalItems.forEach(function(row) {
          row.updateRowDetailsCellMetrics();
        });
        this.debounce('vaadin-grid-resizing', function() {
          this._update();
        }.bind(this), 1);
      }
    },


  });

