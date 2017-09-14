
    Polymer({
      is: 'vaadin-grid-sorter',

      properties: {

        /**
         * JS Path of the property in the item used for sorting the data.
         */
        path: String,

        /**
         * How to sort the data.
         * Possible values are `asc` to use an ascending algorithm, `desc` to sort the data in
         * descending direction, or `null` for not sorting the data.
         */
        direction: {
          type: String,
          reflectToAttribute: true,
          notify: true,
          value: null
        },

        _order: {
          type: Number,
          value: null
        },

        _cellHasFocus: {
          type: Boolean,
          value: false
        },

        _boundOnCellContentFocusin: {
          type: Function,
          value: function() {
            return this._onCellContentFocusin.bind(this);
          }
        },

        _boundOnCellContentFocusout: {
          type: Function,
          value: function() {
            return this._onCellContentFocusout.bind(this);
          }
        },

      },

      observers: [
        '_propertiesChanged(path, direction, isAttached)',
        '_directionOrOrderChanged(direction, _order)',
        '_cellHasFocusChanged(_cellHasFocus)'
      ],

      behaviors: [
        vaadin.elements.grid.CellClickBehavior
      ],

      attached: function() {
        this._cellContent = this._getClosestCellContent();
        if (this._cellContent) {
          this._cellContent.addEventListener('cell-focusin', this._boundOnCellContentFocusin);
          this._cellContent.addEventListener('cell-focusout', this._boundOnCellContentFocusout);
        }
      },

      detached: function() {
        if (this._cellContent) {
          this._cellContent.removeEventListener('cell-focusin', this._boundOnCellContentFocusin);
          this._cellContent.removeEventListener('cell-focusout', this._boundOnCellContentFocusout);
          this._cellContent = undefined;
        }
      },

      _onContentFocus: function(e) {
        /* Need to move the focus to the correct trap. This is only required for IE11. */
        var grid = this;
        while (grid.localName !== 'vaadin-grid') {
          grid = Polymer.dom(grid).parentNode;
        }

        var thisCell = grid.$.scroller._getCellByCellContent(this);
        if (thisCell.is === 'vaadin-grid-table-footer-cell') {
          grid.$.scroller._virtualFocus = grid.$.scroller.$.footer;
        } else {
          grid.$.scroller._virtualFocus = grid.$.scroller.$.header;
        }
        grid.$.scroller.interacting = false;
        grid.focus();
      },

      _getClosestCellContent: function() {
        var el = this;
        while (el = Polymer.dom(el).parentNode) {
          if (el.is === 'vaadin-grid' || el === document.body) {
            // not found
            return null;
          }
          if (el.localName === 'vaadin-grid-cell-content') {
            // found
            return el;
          }
        }
      },

      _onCellContentFocusin: function() {
        this._cellHasFocus = true;
      },

      _onCellContentFocusout: function() {
        this._cellHasFocus = false;
      },

      _propertiesChanged: function(path, direction, isAttached) {
        if (isAttached) {
          this.fire('sorter-changed');
        }
      },

      _getDisplayOrder: function(order) {
        return order === null ? '' : order + 1;
      },

      _cellClick: function(e) {
        e.preventDefault();
        if (this.direction === 'asc') {
          this.direction = 'desc';
        } else if (this.direction === 'desc') {
          this.direction = null;
        } else {
          this.direction = 'asc';
        }
      },

      _getAriaLabel: function(direction, order) {
        if (direction) {
          var label = 'Sorted ';
          label += direction === 'asc' ? 'ascending' : 'descending';
          label += order === null ? '. ' : (', Order ' + (order + 1) + '.');
          return label;
        } else {
          return 'Unsorted.';
        }
      },

      _directionOrOrderChanged: function(direction, order) {
        this.debounce('direction-announce', function() {
          this.fire('iron-announce', {text: this._getAriaLabel(direction, order)});
        }, 1);
      },

      _cellHasFocusChanged: function(cellHasFocus) {
        // Let us hide the a11y announces when the cell content parent
        // of the sorter does not have virtual focus. This is needed to prevent
        // the sorter announcement on every body cell of the sortable column.
        if (cellHasFocus) {
          this.$.announcer.setAttribute('aria-hidden', 'false');
        } else {
          // Wait before hiding the label to prevent readers like NVDA from reacting
          // to changes for the unfocused cell.
          this.async(function() {
            this.$.announcer.setAttribute('aria-hidden', 'true');
          }, 1);
        }
      }

    });
  