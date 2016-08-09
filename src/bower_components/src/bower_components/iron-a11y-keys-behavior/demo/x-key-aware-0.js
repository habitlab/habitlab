
  Polymer({
    is: 'x-key-aware',

    behaviors: [
      Polymer.IronA11yKeysBehavior
    ],

    properties: {
      pressed: {
        type: String,
        readOnly: true,
        value: ''
      },

      boundKeys: {
        type: Array,
        value: function() {
          return Object.keys(this.keyBindings).join(' ').split(' ');
        }
      },

      preventDefault: {
        type: Boolean,
        value: true,
        notify: true
      },

      keyEventTarget: {
        type: Object,
        value: function() {
          return document.body;
        }
      }
    },

    keyBindings: {
      '* pageup pagedown left right down up home end space enter @ ~ " $ ? ! \\ + : # backspace': '_updatePressed',
      'a': '_updatePressed',
      'shift+a alt+a': '_updatePressed',
      'shift+tab shift+space': '_updatePressed'
    },

    _updatePressed: function(event) {
      console.log(event.detail);

      if (this.preventDefault) {
        event.preventDefault();
      }
      this._setPressed(
        this.pressed + event.detail.combo + ' pressed!\n'
      );
    }
  });
