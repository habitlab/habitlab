
(function() {
  Polymer({
    is: 'x-cards-list',

    behaviors: [
      Polymer.NeonSharedElementAnimatableBehavior
    ],

    properties: {
      animationConfig: {
        value: function() {
          return {
            'entry': [{
              name: 'reverse-ripple-animation',
              id: 'reverse-ripple',
              toPage: this
            }],

            'exit': [{
              name: 'fade-out-animation',
              node: this.$.container,
              timing: {
                delay: 150,
                duration: 0
              }
            }, {
              name: 'ripple-animation',
              id: 'ripple',
              fromPage: this
            }]
          };
        }
      }
    }
  });
})();
