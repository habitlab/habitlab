

  Polymer({

    is: 'x-resizer-parent',

    behaviors: [
      Polymer.IronResizableBehavior
    ],

    listeners: {
      'core-resize': 'resizeHandler'
    },

    resizeHandler: function() {
    }

  });



  Polymer({

    is: 'x-resizer-parent-filtered',

    active: null,

    behaviors: [
      Polymer.IronResizableBehavior
    ],

    listeners: {
      'core-resize': 'resizeHandler'
    },

    resizeHandler: function() {
    },

    resizerShouldNotify: function(el) {
      return (el == this.active);
    }

  });



  Polymer({

    is: 'x-resizable',

    behaviors: [
      Polymer.IronResizableBehavior
    ],

    listeners: {
      'core-resize': 'resizeHandler'
    },

    resizeHandler: function() {
    }

  });



  Polymer({

    is: 'x-resizable-in-shadow'

  });



  Polymer({

    is: 'test-element'

  });


  Polymer.ObserveIronResizeBehavior = {
    properties: {
      ironResizeCount: {
        type: Number,
        value: 0
      }
    },

    listeners: {
      'iron-resize': '_incrementIronResizeCount'
    },

    _incrementIronResizeCount: function() {
      this.ironResizeCount++;
    }
  };

  Polymer({
    is: 'x-shadow-resizable',

    behaviors: [
      Polymer.IronResizableBehavior,
      Polymer.ObserveIronResizeBehavior
    ]
  });

  Polymer({
    is: 'x-light-resizable',

    behaviors: [
      Polymer.IronResizableBehavior,
      Polymer.ObserveIronResizeBehavior
    ]
  });
