
    Polymer({
      is: 'vaadin-grid-sizer',

      extends: 'div',

      properties: {
        columnTree: Array,

        top: Number,

        _columns: Array
      },

      observers: [
        '_columnTreeChanged(columnTree)',
        '_topChanged(top)'
      ],

      _columnTreeChanged: function(columnTree) {
        this._columns = columnTree[columnTree.length - 1];
      },

      _topChanged: function(top) {
        this.style.top = top + 'px';
      }
    });
  