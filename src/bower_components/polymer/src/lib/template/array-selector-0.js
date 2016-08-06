

  Polymer({
    is: 'array-selector',
    _template: null,

    properties: {

      /**
       * An array containing items from which selection will be made.
       */
      items: {
        type: Array,
        observer: 'clearSelection'
      },

      /**
       * When `true`, multiple items may be selected at once (in this case,
       * `selected` is an array of currently selected items).  When `false`,
       * only one item may be selected at a time.
       */
      multi: {
        type: Boolean,
        value: false,
        observer: 'clearSelection'
      },

      /**
       * When `multi` is true, this is an array that contains any selected.
       * When `multi` is false, this is the currently selected item, or `null`
       * if no item is selected.
       */
      selected: {
        type: Object,
        notify: true
      },

      /**
       * When `multi` is false, this is the currently selected item, or `null`
       * if no item is selected.
       */
      selectedItem: {
        type: Object,
        notify: true
      },

      /**
       * When `true`, calling `select` on an item that is already selected
       * will deselect the item.
       */
      toggle: {
        type: Boolean,
        value: false
      }
    },

    /**
     * Clears the selection state.
     *
     * @method clearSelection
     */
    clearSelection: function() {
      // Unbind previous selection
      if (Array.isArray(this.selected)) {
        for (var i=0; i<this.selected.length; i++) {
          this.unlinkPaths('selected.' + i);
        }
      } else {
        this.unlinkPaths('selected');
        this.unlinkPaths('selectedItem');
      }
      // Initialize selection
      if (this.multi) {
        if (!this.selected || this.selected.length) {
          this.selected = [];
          this._selectedColl = Polymer.Collection.get(this.selected);
        }
      } else {
        this.selected = null;
        this._selectedColl = null;
      }
      this.selectedItem = null;
    },

    /**
     * Returns whether the item is currently selected.
     *
     * @method isSelected
     * @param {*} item Item from `items` array to test
     * @return {boolean} Whether the item is selected
     */
    isSelected: function(item) {
      if (this.multi) {
        return this._selectedColl.getKey(item) !== undefined;
      } else {
        return this.selected == item;
      }
    },

    /**
     * Deselects the given item if it is already selected.
     *
     * @method isSelected
     * @param {*} item Item from `items` array to deselect
     */
    deselect: function(item) {
      if (this.multi) {
        if (this.isSelected(item)) {
          var skey = this._selectedColl.getKey(item);
          this.arrayDelete('selected', item);
          this.unlinkPaths('selected.' + skey);
        }
      } else {
        this.selected = null;
        this.selectedItem = null;
        this.unlinkPaths('selected');
        this.unlinkPaths('selectedItem');
      }
    },

    /**
     * Selects the given item.  When `toggle` is true, this will automatically
     * deselect the item if already selected.
     *
     * @method isSelected
     * @param {*} item Item from `items` array to select
     */
    select: function(item) {
      var icol = Polymer.Collection.get(this.items);
      var key = icol.getKey(item);
      if (this.multi) {
        if (this.isSelected(item)) {
          if (this.toggle) {
            this.deselect(item);
          }
        } else {
          this.push('selected', item);
          var skey = this._selectedColl.getKey(item);
          this.linkPaths('selected.' + skey, 'items.' + key);
        }
      } else {
        if (this.toggle && item == this.selected) {
          this.deselect();
        } else {
          this.selected = item;
          this.selectedItem = item;
          this.linkPaths('selected', 'items.' + key);
          this.linkPaths('selectedItem', 'items.' + key);
        }
      }
    }

  });

