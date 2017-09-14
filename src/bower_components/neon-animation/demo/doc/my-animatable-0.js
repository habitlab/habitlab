

  Polymer({

    is: 'my-animatable',

    behaviors: [
      Polymer.NeonAnimationRunnerBehavior
    ],

    properties: {

      animationConfig: {
        type: Object,
        value: function() {
          return {
            name: 'scale-down-animation',
            node: this
          }
        }
      }

    },

    listeners: {
      'neon-animation-finish': '_onNeonAnimationFinish'
    },

    animate: function() {
      this.playAnimation();
    },

    _onNeonAnimationFinish: function() {
      console.log('animation finish!');
    }

  });

