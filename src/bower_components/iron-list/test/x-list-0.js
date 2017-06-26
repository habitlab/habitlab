
  Polymer({
    is: 'x-list',

    properties: {
      data: {
        type: Array
      },

      itemHeight: {
        type: Number,
        value: 100
      },

      listHeight: {
        type: Number,
        value: 300
      },

      pre: {
        type: Boolean
      },

      primitive: {
        value: false,
        type: Boolean
      },

      useTabIndex: {
        value: true,
        type: Boolean
      }
    },

    get list() {
      return this.$.list;
    },

    _computedItemHeight: function(item) {
      var css = this.pre ? 'white-space:pre;' : '';
      if (item.height) {
        css += this.itemHeight === 0 ? '' : 'height: ' + (item.height) + 'px;';
      } else if (this.itemHeight) {
        css += 'height: ' + (this.itemHeight) + 'px;';
      }
      return css;
    },

    _computedListHeight: function(listHeight) {
      return 'height: ' + (listHeight) + 'px; overflow: auto;';
    },

    _computedTabIndex: function(tabIndex, useTabIndex) {
      return useTabIndex ? tabIndex : undefined;
    }
  });
