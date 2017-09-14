

  Polymer({

    is: 'test-control',

    behaviors: [
      Polymer.IronControlState
    ]

  });



  Polymer({

    is: 'test-button',

    behaviors: [
      Polymer.IronControlState,
      Polymer.IronButtonState
    ],

    _buttonStateChanged: function() {

    }

  });



  Polymer({

    is: 'nested-focusable',

    behaviors: [
      Polymer.IronControlState
    ]

  });



  Polymer({

    is: 'test-light-dom',

    behaviors: [
      Polymer.IronControlState,
      Polymer.IronButtonState
    ]

  });

