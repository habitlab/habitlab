
  Polymer({

    is: 'x-scrollable',

    properties: {

      xScrollTop: {
        type: Number,
        readOnly: true,
        value: 0
      },

      xScrollLeft: {
        type: Number,
        readOnly: true,
        value: 0
      },

      itemCount: {
        type: Number,
        value: 200
      }

    },

    behaviors: [
      Polymer.IronScrollTargetBehavior
    ],

    attached: function() {
      this._scrollHandler();
    },

    _scrollHandler: function() {
      this._setXScrollTop(this._scrollTop);
      this._setXScrollLeft(this._scrollLeft);
    },

    _getItems: function(itemCount) {
      var items = new Array(itemCount);
      while (itemCount > 0) {
        items[--itemCount] = true;
      }
      return items;
    }
  });
