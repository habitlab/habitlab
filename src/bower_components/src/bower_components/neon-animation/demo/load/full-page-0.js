

Polymer({

  is: 'full-page',

  behaviors: [
    Polymer.NeonAnimatableBehavior,
    Polymer.NeonAnimationRunnerBehavior
  ],

  properties: {

    animationConfig: {
      type: Object,
      value: function() {
        return {
          'entry': [{
            name: 'slide-from-top-animation',
            node: this.$.toolbar
          }, {
            animatable: this.$.grid,
            type: 'entry'
          }]
        };
      }
    }

  },

  show: function() {
    this.style.visibility = 'visible';
    this.playAnimation('entry');
  }

});

