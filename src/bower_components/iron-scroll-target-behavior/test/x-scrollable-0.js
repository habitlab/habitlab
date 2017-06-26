
  Polymer({

    is: 'x-scrollable',

    properties: {

      itemCount: {
        type: Number,
        value: 200
      }

    },

    behaviors: [
      Polymer.IronScrollTargetBehavior
    ],

    _defaultScrollTarget: null,

    _getItems: function(itemCount) {
      var items = new Array(itemCount);
      while (itemCount > 0) {
        items[--itemCount] = true;
      }
      return items;
    }
  });
