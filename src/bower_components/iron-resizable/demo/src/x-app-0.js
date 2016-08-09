

  Polymer({

    is: 'x-puck',

    behaviors: [
      Polymer.IronResizableBehavior
    ],

    properties: {
      x: {
        type: Number,
        value: 0
      },

      y: {
        type: Number,
        value: 0
      }
    },

    listeners: {
      'iron-resize': '_onIronResize'
    },

    attached: function() {
      this.async(this.notifyResize, 1);
    },

    get parent() {
      if (this.parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        return this.parentNode.host;
      }

      return this.parentNode;
    },

    _onIronResize: function() {
      var x = this.x = Math.floor(this.parent.offsetWidth / 3);
      var y = this.y = Math.floor(this.parent.offsetHeight / 3);

      this.translate3d(x + 'px', y + 'px', 0);
    }
  });



  Polymer({

    is: 'x-app',

    behaviors: [
      Polymer.IronResizableBehavior
    ]
  });

