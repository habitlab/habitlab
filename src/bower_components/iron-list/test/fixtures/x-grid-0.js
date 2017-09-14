
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
        value: 300,
        observer: '_listSizeChanged'
      },

      pre: {
        type: Boolean,
        value: false
      },

      useTabIndex: {
        value: true,
        type: Boolean
      }
    },

    get list() {
      return this.$.list;
    },

    _computeItemSize: function(itemSize, pre) {
      var css = 'overflow: hidden;';
      css += pre ? 'white-space:pre;' : '';
      css += 'height: ' + itemSize + 'px;';
      css += 'width: ' + itemSize + 'px;';
      return css;
    },

    _listSizeChanged: function(listSize) {
      this.$.list.style.width = listSize + 'px';
      this.$.list.style.height = listSize + 'px';
    },

    _computedListSize: function(listHeight) {
      return 'height: ' + (listHeight) + 'px;' + 'width: ' + (listHeight) + 'px;';
    },

    _computedTabIndex: function(tabIndex, useTabIndex) {
      return useTabIndex ? tabIndex : undefined;
    }
  });

