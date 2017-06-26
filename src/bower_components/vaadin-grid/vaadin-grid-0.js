
  Polymer({
    is: 'vaadin-grid',

    properties: {

      _columnTree: {
        type: Array,
        notify: true
      },


      /**
       * Estimated size of the grid data (number of items).
       * When using function data providers, it always needs to be set manually.
       */
      size: Number,

      _rowDetailsTemplate: Object,

      _bindData: {
        type: Object,
        value: function() {
          return this._getItem.bind(this);
        }
      }
    },

    behaviors: [
      Polymer.IronA11yKeysBehavior,
      Polymer.IronResizableBehavior,
      vaadin.elements.grid.ActiveItemBehavior,
      vaadin.elements.grid.RowDetailsBehavior,
      vaadin.elements.grid.DataProviderBehavior,
      vaadin.elements.grid.DynamicColumnsBehavior,
      vaadin.elements.grid.ArrayDataProviderBehavior,
      vaadin.elements.grid.SelectionBehavior,
      vaadin.elements.grid.SortBehavior,
      vaadin.elements.grid.FilterBehavior,
      vaadin.elements.grid.KeyboardNavigationBehavior,
      vaadin.elements.grid.ColumnReorderingBehavior
    ],

    listeners: {
      'property-changed': '_columnPropChanged',
      'iron-resize': '_gridResizeHandler'
    },

    _updateItem: function(row, item) {
      row.style.minHeight = item ? '' : this.$.scroller._physicalAverage + 'px';
      row.item = item;
      row.selected = this._isSelected(item);
      row.expanded = this._isExpanded(item);
      row.active = item !== null && item == this.activeItem;
      row.focused = row.index === this.$.scroller.$.items._focusedRowIndex;
    },

    _getContentTarget: function() {
      return this;
    },

    ready: function() {
      this._updateColumnTree();
      this._rowDetailsTemplate = Polymer.dom(this).querySelector('template.row-details') || undefined;
      this.$.scroller.target = this;

      if (document.doctype === null) {
        console.warn('<vaadin-grid> requires the "standards mode" declaration. Please add <!DOCTYPE html> to the HTML document.');
      }
    },

    _columnPropChanged: function(e) {
      if (e.detail.path === '_childColumns') {
        this._updateColumnTree();
      }

      e.stopPropagation();
    },

    _gridResizeHandler: function() {
      this.$.scroller._gridResizeHandler();
    }
  });
