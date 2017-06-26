
  Polymer({
    is: 'x-grid',

    properties: {
      data: {
        type: Array
      },

      itemSize: {
        type: Number,
        value: 100
      },

      listSize: {
        type: Number,
        value: 300
      },

      pre: {
        type: Boolean
      },
    },

    get list() {
      return this.$.list;
    },

    _computeItemSize: function(item) {
      var css = this.pre ? 'white-space:pre;' : '';
      css += 'height: ' + (this.itemSize) + 'px;';
      css += 'width: ' + (this.itemSize) + 'px;';
      return css;
    },

    _computedListSize: function(listHeight) {
      return 'height: ' + (listHeight) + 'px;' + 'width: ' + (listHeight) + 'px;';
    }
  });
