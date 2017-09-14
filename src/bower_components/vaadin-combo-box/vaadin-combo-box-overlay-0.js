
  Polymer({
    is: 'vaadin-combo-box-overlay',

    behaviors: [
      vaadin.elements.combobox.OverlayBehavior
    ],

    properties: {

      /**
       * True if the device supports touch events.
       */
      touchDevice: {
        type: Boolean,
        reflectToAttribute: true,
        value: function() {
          try {
            document.createEvent('TouchEvent');
            return true;
          } catch (e) {
            return false;
          }
        }
      },

      /*
       * `true` when new items are being loaded.
       */
      loading: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        observer: 'notifyResize'
      },

      _selectedItem: {
        type: Object
      },

      _items: {
        type: Object
      },

      _focusedIndex: {
        type: Number,
        notify: true,
        value: -1,
        observer: '_focusedIndexChanged'
      },

      _focusedItem: {
        type: String,
        computed: '_getFocusedItem(_focusedIndex)'
      },

      _itemLabelPath: {
        type: String,
        value: 'label'
      },

      _itemValuePath: {
        type: String,
        value: 'value'
      },

      _notTapping: Boolean,

      _ignoreTaps: Boolean,
    },

    ready: function() {
      this._patchWheelOverScrolling();

      // Fix for #182. Only relevant for iron-list 1.0.X and 1.1.X.
      // 1.2.X works fine without this.
      if (this.$.selector._scroller !== undefined) {
        this.$.selector._scroller = this._getScroller();
      }
    },

    _getFocusedItem: function(focusedIndex) {
      if (focusedIndex >= 0) {
        return this._items[focusedIndex];
      }
    },

    _isItemSelected: function(item, selectedItem) {
      return item === selectedItem;
    },

    _onTap: function(e) {
      if (!this._notTapping && !this._ignoreTaps) {
        this.fire('selection-changed', {item: e.model.item});
      }
    },

    _onTouchStart: function() {
      this._notTapping = false;
      this.async(function() {
        this._notTapping = true;
      }, 300);
    },

    _onScroll: function() {
      this._ignoreTaps = true;
      this.debounce('restore-taps', function() {
        this._ignoreTaps = false;
      }, 300);
    },

    /**
     * Gets the index of the item with the provided label.
     * @return {Number}
     */
    indexOfLabel: function(label) {
      if (this._items && label) {
        for (var i = 0; i < this._items.length; i++) {
          if (this.getItemLabel(this._items[i]).toString().toLowerCase() ===
              label.toString().toLowerCase()) {
            return i;
          }
        }
      }

      return -1;
    },

    /**
     * Gets the label string for the item based on the `_itemLabelPath`.
     * @return {String}
     */
    getItemLabel: function(item) {
      var label = item ? this.get(this._itemLabelPath, item) : undefined;
      if (label === undefined) {
        label = item ? item.toString() : '';
      }
      return label;
    },

    _isItemFocused: function(focusedIndex, itemIndex) {
      return focusedIndex == itemIndex;
    },

    _getAriaSelected: function(focusedIndex, itemIndex) {
      return this._isItemFocused(focusedIndex, itemIndex).toString();
    },

    _getAriaRole: function(itemIndex) {
      return itemIndex !== undefined ? 'option' : false;
    },

    _focusedIndexChanged: function(index) {
      if (index >= 0) {
        this._scrollIntoView(index);
      }
    },

    _scrollIntoView: function(index) {
      var visibleItemsCount = this._visibleItemsCount();
      if (visibleItemsCount === undefined) {
        // Scroller is not visible. Moving is unnecessary.
        return;
      }

      var targetIndex = index;

      if (index > this.$.selector.lastVisibleIndex - 1) {
        // Index is below the bottom, scrolling down. Make the item appear at the bottom.
        targetIndex = index - visibleItemsCount + 1;
      } else if (index > this.$.selector.firstVisibleIndex) {
        // The item is already visible, scrolling is unnecessary per se. But we need to trigger iron-list to set
        // the correct scrollTop on the scrollTarget. Scrolling to firstVisibleIndex.
        targetIndex = this.$.selector.firstVisibleIndex;
      }
      this.$.selector.scrollToIndex(Math.max(0, targetIndex));

      // Sometimes the item is partly below the bottom edge, detect and adjust.
      var item = this._items[index];
      if (item === undefined) return;
      var pidx = this.$.selector._getPhysicalIndex(item),
        physicalItem = this.$.selector._physicalItems[pidx];
      if (!physicalItem) return;
      var physicalItemRect = physicalItem.getBoundingClientRect(),
        scrollerRect = this.$.scroller.getBoundingClientRect(),
        scrollTopAdjust = physicalItemRect.bottom - scrollerRect.bottom + this._viewportTotalPaddingBottom;
      if (scrollTopAdjust > 0) {
        this.$.scroller.scrollTop += scrollTopAdjust;
      }
    },

    ensureItemsRendered: function() {
      this.$.selector.flushDebouncer('_debounceTemplate');
    },

    adjustScrollPosition: function() {
      if (this._items) {
        this._scrollIntoView(this._focusedIndex);
      }
    },

    // Note: this whole scroller thing is done to support iron lists scrollToIndex()
    // and features that use it like keyboard navigation in IE11 for iron-list 1.0.x.
    // Tested that iron-list 1.2.x works nicely even without the external scroller, but
    // left these here for now for backwards compatibility.
    _getScroller: function() {
      return this.$.scroller;
    },

    /**
     * We want to prevent the kinetic scrolling energy from being transferred from the overlay contents over to the parent.
     * Further improvement ideas: after the contents have been scrolled to the top or bottom and scrolling has stopped, it could allow
     * scrolling the parent similarily to touch scrolling.
     */
    _patchWheelOverScrolling: function() {
      var selector = this.$.selector;
      selector.addEventListener('wheel', function(e) {
        var scroller = selector._scroller || selector.scrollTarget;
        var scrolledToTop = scroller.scrollTop === 0;
        var scrolledToBottom = (scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight) <= 1;

        if (scrolledToTop && e.deltaY < 0) {
          e.preventDefault();
        } else if (scrolledToBottom && e.deltaY > 0) {
          e.preventDefault();
        }
      });
    },

    updateViewportBoundaries: function() {
      this._cachedViewportTotalPaddingBottom = undefined;
      this.$.selector.updateViewportBoundaries();
    },

    get _viewportTotalPaddingBottom() {
      if (this._cachedViewportTotalPaddingBottom === undefined) {
        var itemsStyle = window.getComputedStyle(this._unwrapIfNeeded(this.$.selector.$.items));
        this._cachedViewportTotalPaddingBottom = [
          itemsStyle.paddingBottom,
          itemsStyle.borderBottomWidth
        ].map(function(v) {
          return parseInt(v, 10);
        }).reduce(function(sum, v) {
          return sum + v;
        });
      }

      return this._cachedViewportTotalPaddingBottom;
    },

    _visibleItemsCount: function() {
      // Ensure items are rendered
      this.$.selector.flushDebouncer('_debounceTemplate');
      // Ensure items are positioned
      this.$.selector.scrollToIndex(this.$.selector.firstVisibleIndex);
      // Ensure viewport boundaries are up-to-date
      this.updateViewportBoundaries();
      return this.$.selector.lastVisibleIndex - this.$.selector.firstVisibleIndex + 1;
    },

    _selectItem: function(item) {
      item = (typeof item === 'number') ? this._items[item] : item;
      if (this.$.selector.selectedItem !== item) {
        this.$.selector.selectItem(item);
      }
    },

    _preventDefault: function(e) {
      if (e.cancelable) {
        e.preventDefault();
      }
    },

    _stopPropagation: function(e) {
      e.stopPropagation();
    }
  });
